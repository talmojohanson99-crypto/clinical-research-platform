import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Utilisateur avec rôles pour la plateforme de recherche."""

    ROLE_CHOICES = [
        ("admin", "Administrateur"),
        ("researcher", "Chercheur"),
        ("enumerator", "Enquêteur"),
        ("viewer", "Consultation"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="viewer")
    phone = models.CharField(max_length=30, blank=True)
    institution = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

    @property
    def is_admin(self):
        return self.role == "admin" or self.is_superuser

    @property
    def is_researcher(self):
        return self.role in ("admin", "researcher")


class UserEtude(models.Model):
    """Lien entre un utilisateur et une étude avec un rôle spécifique."""

    ROLE_CHOICES = [
        ("admin", "Admin étude"),
        ("enumerator", "Enquêteur"),
        ("viewer", "Lecteur"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="etude_links")
    etude = models.ForeignKey("studies.Etude", on_delete=models.CASCADE, related_name="user_links")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="enumerator")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user", "etude"]
        verbose_name = "Lien Utilisateur-Étude"
        verbose_name_plural = "Liens Utilisateurs-Études"

    def __str__(self):
        return f"{self.user.username} → {self.etude.nom} ({self.role})"
