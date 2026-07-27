import uuid
from django.db import models
from django.conf import settings


class Reponse(models.Model):
    """Réponse d'un patient à un formulaire pour une période donnée."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey("studies.Patient", on_delete=models.CASCADE, related_name="reponses")
    etude = models.ForeignKey("studies.Etude", on_delete=models.CASCADE, related_name="reponses")
    periode = models.CharField(max_length=10, verbose_name="Période (T1, T2, T3...)")

    # Données brutes (JSON)
    data = models.JSONField(default=dict, verbose_name="Réponses brutes")

    # Scores pré-calculés
    scores = models.JSONField(default=dict, blank=True, verbose_name="Scores calculés")

    # Métadonnées
    filled_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="reponses"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Réponse"
        verbose_name_plural = "Réponses"
        unique_together = ["patient", "etude", "periode"]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.patient.numero_id} — {self.etude.nom} — {self.periode}"


class AuditLog(models.Model):
    """Journal d'audit pour traçabilité."""

    ACTION_CHOICES = [
        ("create", "Création"),
        ("update", "Modification"),
        ("delete", "Suppression"),
        ("export", "Export"),
        ("login", "Connexion"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    model_name = models.CharField(max_length=100, blank=True)
    object_id = models.CharField(max_length=100, blank=True)
    details = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Journal d'audit"
        verbose_name_plural = "Journal d'audit"
        ordering = ["-created_at"]
