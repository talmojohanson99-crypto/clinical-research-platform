from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReponseViewSet, AuditLogViewSet, save_reponse

router = DefaultRouter()
router.register(r"reponses", ReponseViewSet)
router.register(r"audit-logs", AuditLogViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("save-reponse/", save_reponse, name="save-reponse"),
]
