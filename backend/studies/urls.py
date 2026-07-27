from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EtudeViewSet, SectionViewSet, QuestionViewSet,
    PatientViewSet, PatientEtudeViewSet,
)

router = DefaultRouter()
router.register(r"etudes", EtudeViewSet)
router.register(r"sections", SectionViewSet)
router.register(r"questions", QuestionViewSet)
router.register(r"patients", PatientViewSet)
router.register(r"patient-etudes", PatientEtudeViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
