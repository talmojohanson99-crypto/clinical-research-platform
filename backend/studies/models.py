import uuid
from django.db import models
from django.conf import settings


class Etude(models.Model):
    """Étude de recherche clinique."""

    STATUT_CHOICES = [
        ("draft", "Brouillon"),
        ("active", "Active"),
        ("paused", "En pause"),
        ("completed", "Terminée"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom = models.CharField(max_length=300, verbose_name="Nom de l'étude")
    description = models.TextField(blank=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default="draft")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="etudes_creees"
    )

    # Périodes de collecte
    periodes = models.JSONField(
        default=list,
        blank=True,
        help_text='[{"key": "T1", "label": "Baseline", "order": 1}, ...]',
    )

    # Règles de scoring
    scoring_rules = models.JSONField(
        default=dict,
        blank=True,
        help_text="Configuration des scores calculés automatiquement",
    )

    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Étude"
        verbose_name_plural = "Études"
        ordering = ["-created_at"]

    def __str__(self):
        return self.nom


class Section(models.Model):
    """Section d'un formulaire d'étude."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    etude = models.ForeignKey(Etude, on_delete=models.CASCADE, related_name="sections")
    code = models.CharField(max_length=50, verbose_name="Code section")
    title_fr = models.CharField(max_length=300, verbose_name="Titre (FR)")
    title_mg = models.CharField(max_length=300, blank=True, verbose_name="Titre (MG)")
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Section"
        verbose_name_plural = "Sections"
        ordering = ["order"]
        unique_together = ["etude", "code"]

    def __str__(self):
        return f"{self.etude.nom} — {self.title_fr}"


class Question(models.Model):
    """Question dynamique dans une section."""

    TYPE_CHOICES = [
        ("text", "Texte libre"),
        ("integer", "Nombre entier"),
        ("decimal", "Nombre décimal"),
        ("date", "Date"),
        ("select_one", "Choix unique"),
        ("select_multiple", "Choix multiple"),
        ("note", "Note / Information"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name="questions")
    name = models.CharField(max_length=100, verbose_name="Clé technique")
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    label_fr = models.CharField(max_length=500, verbose_name="Label (FR)")
    label_mg = models.CharField(max_length=500, blank=True, verbose_name="Label (MG)")
    hint_fr = models.CharField(max_length=300, blank=True)
    hint_mg = models.CharField(max_length=300, blank=True)
    required = models.BooleanField(default=False)
    order = models.IntegerField(default=0)

    # Options pour select_one / select_multiple
    choices = models.JSONField(
        default=list, blank=True,
        help_text='[{"value": "1", "fr": "Oui", "mg": "Eny"}, ...]',
    )

    # Validation
    constraint = models.JSONField(
        default=dict, blank=True,
        help_text='{"min": 0, "max": 100, "regex": "^[0-9]+$"}',
    )

    # Condition d'affichage
    relevant = models.JSONField(
        default=dict, blank=True,
        help_text='{"eq": ["question_name", "value"]}',
    )

    # Métadonnées SPSS
    spss_name = models.CharField(max_length=8, blank=True, verbose_name="Nom SPSS")
    spss_label = models.CharField(max_length=200, blank=True, verbose_name="Label SPSS")

    # Score (pour les questions notées)
    score_key = models.CharField(max_length=50, blank=True, verbose_name="Clé de correction")
    score_value = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Question"
        verbose_name_plural = "Questions"
        ordering = ["order"]
        unique_together = ["section", "name"]

    def __str__(self):
        return f"{self.name}: {self.label_fr[:50]}"


class Patient(models.Model):
    """Patient rattaché à une ou plusieurs études."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    numero_id = models.CharField(max_length=50, unique=True, verbose_name="Numéro patient")
    etudes = models.ManyToManyField(Etude, through="PatientEtude", related_name="patients")

    # Données démographiques de base
    genre = models.CharField(max_length=1, blank=True)
    date_naissance = models.DateField(null=True, blank=True)
    age_grp = models.CharField(max_length=1, blank=True)
    contact = models.CharField(max_length=30, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Patient"
        verbose_name_plural = "Patients"
        ordering = ["-created_at"]

    def __str__(self):
        return self.numero_id


class PatientEtude(models.Model):
    """Lien Patient-Étude avec numéro spécifique."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="patient_etudes")
    etude = models.ForeignKey(Etude, on_delete=models.CASCADE, related_name="patient_etudes")
    numero_etude = models.CharField(max_length=50, blank=True, verbose_name="Numéro dans l'étude")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["patient", "etude"]
        verbose_name = "Patient-Étude"
        verbose_name_plural = "Patients-Études"
