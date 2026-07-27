from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Reponse, AuditLog
from .serializers import ReponseSerializer, ReponseCreateSerializer, AuditLogSerializer
from .scoring import compute_scores


class ReponseViewSet(viewsets.ModelViewSet):
    queryset = Reponse.objects.select_related("patient", "etude", "filled_by").all()
    serializer_class = ReponseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["etude", "patient", "periode"]

    def perform_create(self, serializer):
        serializer.save(filled_by=self.request.user)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def save_reponse(request):
    """Sauvegarde une réponse avec calcul automatique des scores."""
    serializer = ReponseCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    data = serializer.validated_data

    from studies.models import Patient, Etude
    try:
        patient = Patient.objects.get(id=data["patient_id"])
        etude = Etude.objects.get(id=data["etude_id"])
    except (Patient.DoesNotExist, Etude.DoesNotExist):
        return Response({"error": "Patient ou étude introuvable"}, status=404)

    # Calcul des scores
    scores = compute_scores(data["data"], etude.scoring_rules)

    reponse, created = Reponse.objects.update_or_create(
        patient=patient,
        etude=etude,
        periode=data["periode"],
        defaults={
            "data": data["data"],
            "scores": scores,
            "filled_by": request.user,
        },
    )

    # Audit log
    AuditLog.objects.create(
        user=request.user,
        action="create" if created else "update",
        model_name="Reponse",
        object_id=str(reponse.id),
        details={"patient": patient.numero_id, "etude": etude.nom, "periode": data["periode"]},
    )

    return Response(
        {
            "id": str(reponse.id),
            "created": created,
            "scores": scores,
        },
        status=201 if created else 200,
    )


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.select_related("user").all()
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields = ["user", "action", "model_name"]
