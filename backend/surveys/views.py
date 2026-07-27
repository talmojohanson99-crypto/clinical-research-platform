from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from .models import Reponse, Media, AuditLog
from .serializers import ReponseSerializer
from .scoring import process_reponse


class ReponseViewSet(viewsets.ModelViewSet):
    queryset = Reponse.objects.select_related("patient", "etude", "filled_by").all()
    serializer_class = ReponseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["etude", "patient", "periode", "statut"]

    def perform_create(self, serializer):
        serializer.save(filled_by=self.request.user, submitted_at=timezone.now())


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def save_reponse(request):
    """Sauvegarde une réponse avec calcul automatique des scores."""
    data = request.data

    patient_id = data.get("patient_id")
    etude_id = data.get("etude_id")
    periode = data.get("periode")
    reponses_data = data.get("data", {})

    if not patient_id or not etude_id or not periode:
        return Response(
            {"error": "patient_id, etude_id et periode requis"},
            status=400,
        )

    from studies.models import Patient, Etude
    try:
        patient = Patient.objects.get(id=patient_id)
        etude = Etude.objects.get(id=etude_id)
    except (Patient.DoesNotExist, Etude.DoesNotExist):
        return Response({"error": "Patient ou étude introuvable"}, status=404)

    # Préparer la config de l'étude
    etude_config = {
        "auto_calculs": etude.auto_calculs,
        "scoring_rules": etude.scoring_rules,
    }

    # Calculer scores et calculs auto
    result = process_reponse(reponses_data, etude_config)

    # Sauvegarder
    reponse, created = Reponse.objects.update_or_create(
        patient=patient,
        etude=etude,
        periode=periode,
        defaults={
            "data": reponses_data,
            "scores": result["scores"],
            "auto_calculs": result["auto_calculs"],
            "filled_by": request.user,
            "submitted_at": timezone.now(),
            "statut": "submitted",
            "device_id": data.get("device_id", ""),
            "gps_lat": data.get("gps_lat"),
            "gps_lon": data.get("gps_lon"),
        },
    )

    # Audit log
    AuditLog.objects.create(
        user=request.user,
        action="create" if created else "update",
        model_name="Reponse",
        object_id=str(reponse.id),
        details={
            "patient": patient.numero_id,
            "etude": etude.nom,
            "periode": periode,
        },
        device_id=data.get("device_id", ""),
    )

    return Response(
        {
            "id": str(reponse.id),
            "created": created,
            "scores": result["scores"],
            "auto_calculs": result["auto_calculs"],
        },
        status=201 if created else 200,
    )


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.select_related("user").all()
    permission_classes = [permissions.IsAdminUser]
    filterset_fields = ["user", "action", "model_name"]
