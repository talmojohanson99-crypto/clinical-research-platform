from django.contrib import admin
from .models import Reponse, AuditLog


@admin.register(Reponse)
class ReponseAdmin(admin.ModelAdmin):
    list_display = ["patient", "etude", "periode", "filled_by", "created_at"]
    list_filter = ["etude", "periode"]
    readonly_fields = ["scores"]


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ["user", "action", "model_name", "created_at"]
    list_filter = ["action", "model_name"]
    readonly_fields = ["user", "action", "model_name", "object_id", "details", "ip_address", "created_at"]
