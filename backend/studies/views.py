from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Etude, Section, Question, Patient, PatientEtude
from .serializers import (
    UserSerializer, UserCreateSerializer,
    EtudeSerializer, EtudeListSerializer,
    SectionSerializer, QuestionSerializer,
    PatientSerializer, PatientEtudeSerializer,
)

User = get_user_model()


class IsAdminOrResearcher(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.is_researcher


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_class = permissions.IsAdminUser

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        return UserSerializer


class EtudeViewSet(viewsets.ModelViewSet):
    queryset = Etude.objects.all()
    permission_classes = [IsAdminOrResearcher]

    def get_serializer_class(self):
        if self.action == "list":
            return EtudeListSerializer
        return EtudeSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["get"])
    def form(self, request, pk=None):
        """Retourne le formulaire complet d'une étude."""
        etude = self.get_object()
        sections = etude.sections.prefetch_related("questions").all()
        return Response(SectionSerializer(sections, many=True).data)

    @action(detail=True, methods=["post"])
    def add_patient(self, request, pk=None):
        """Ajoute un patient à l'étude."""
        etude = self.get_object()
        numero_id = request.data.get("numero_id")
        if not numero_id:
            return Response({"error": "numero_id requis"}, status=400)

        patient, _ = Patient.objects.get_or_create(numero_id=numero_id)
        PatientEtude.objects.get_or_create(patient=patient, etude=etude)
        return Response(PatientSerializer(patient).data, status=201)

    @action(detail=True, methods=["get"])
    def patients(self, request, pk=None):
        """Liste les patients d'une étude."""
        etude = self.get_object()
        patients = Patient.objects.filter(patient_etudes__etude=etude)
        return Response(PatientSerializer(patients, many=True).data)

    @action(detail=True, methods=["get"])
    def stats(self, request, pk=None):
        """Statistiques de base d'une étude."""
        etude = self.get_object()
        from surveys.models import Reponse
        reponses = Reponse.objects.filter(etude=etude)

        stats = {
            "total_patients": etude.patient_etudes.count(),
            "total_reponses": reponses.count(),
            "par_periode": {},
        }

        for r in reponses:
            periode = r.periode
            if periode not in stats["par_periode"]:
                stats["par_periode"][periode] = 0
            stats["par_periode"][periode] += 1

        return Response(stats)


class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    permission_classes = [IsAdminOrResearcher]
    filterset_fields = ["etude"]


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAdminOrResearcher]
    filterset_fields = ["section", "section__etude"]


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]
    search_fields = ["numero_id"]
    filterset_fields = ["genre", "age_grp"]


class PatientEtudeViewSet(viewsets.ModelViewSet):
    queryset = PatientEtude.objects.select_related("patient", "etude").all()
    serializer_class = PatientEtudeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["etude", "patient"]
