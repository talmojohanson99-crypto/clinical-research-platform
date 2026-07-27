import uuid
from django.db import models
from django.conf import settings


class Reponse(models.Model):
    """Réponse d'un patient à un formulaire pour une période donnée."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey("studies.Patient", on_delete=models.CASCADE, related_name="reponses")
    etude = models.ForeignKey("studies.Etude", on_delete=models.CASCADE, related_name="reponses")
    periode = models.CharField(max_length=10, verbose_name="Période (T1, T2, T3...)")

    # Données brutes (JSON flexible)
    data = models.JSONField(default=dict, verbose_name="Réponses brutes")

    # Scores pré-calculés
    scores = models.JSONField(default=dict, blank=True, verbose_name="Scores calculés")

    # Calculs automatiques
    auto_calculs = models.JSONField(default=dict, blank=True, verbose_name="Calculs auto")

    # Métadonnées de collecte
    filled_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="reponses"
    )
    device_id = models.CharField(max_length=100, blank=True)
    gps_lat = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    gps_lon = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)

    # Statut
    STATUT_CHOICES = [
        ("draft", "Brouillon"),
        ("submitted", "Soumis"),
        ("verified", "Vérifié"),
        ("rejected", "Rejeté"),
    ]
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default="submitted")

    # Horodatage
    submitted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Réponse"
        verbose_name_plural = "Réponses"
        unique_together = ["patient", "etude", "periode"]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.patient.numero_id} — {self.etude.nom} — {self.periode}"


class Media(models.Model):
    """Fichier média attaché à une réponse."""

    TYPE_CHOICES = [
        ("photo", "Photo"),
        ("audio", "Audio"),
        ("video", "Vidéo"),
        ("signature", "Signature"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reponse = models.ForeignKey(Reponse, on_delete=models.CASCADE, related_name="media")
    question_name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    fichier = models.FileField(upload_to="media/%Y/%m/%d/")
    taille = models.IntegerField(default=0, verbose_name="Taille en bytes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Média"
        verbose_name_plural = "Médias"

    def __str__(self):
        return f"{self.question_name} — {self.type}"


class AuditLog(models.Model):
    """Journal d'audit pour traçabilité."""

    ACTION_CHOICES = [
        ("create", "Création"),
        ("update", "Modification"),
        ("delete", "Suppression"),
        ("export", "Export"),
        ("login", "Connexion"),
        ("sync", "Synchronisation"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    model_name = models.CharField(max_length=100, blank=True)
    object_id = models.CharField(max_length=100, blank=True)
    details = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    device_id = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Journal d'audit"
        verbose_name_plural = "Journal d'audit"
        ordering = ["-created_at"]
