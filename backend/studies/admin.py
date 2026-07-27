from django.contrib import admin
from .models import Etude, Section, Question, Patient, PatientEtude


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 0


class SectionInline(admin.StackedInline):
    model = Section
    extra = 0


@admin.register(Etude)
class EtudeAdmin(admin.ModelAdmin):
    list_display = ["nom", "statut", "created_by", "created_at"]
    list_filter = ["statut"]
    search_fields = ["nom"]
    inlines = [SectionInline]


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ["etude", "code", "title_fr", "order"]
    list_filter = ["etude"]
    inlines = [QuestionInline]


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ["name", "section", "type", "label_fr", "required"]
    list_filter = ["section__etude", "type"]


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ["numero_id", "genre", "date_naissance", "created_at"]
    search_fields = ["numero_id"]


@admin.register(PatientEtude)
class PatientEtudeAdmin(admin.ModelAdmin):
    list_display = ["patient", "etude", "numero_etude"]
    list_filter = ["etude"]
