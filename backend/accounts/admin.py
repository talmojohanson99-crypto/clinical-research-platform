from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, UserEtude


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ["username", "email", "role", "institution", "is_active"]
    list_filter = ["role", "is_active"]
    fieldsets = UserAdmin.fieldsets + (
        ("Informations supplémentaires", {"fields": ("role", "phone", "institution")}),
    )


@admin.register(UserEtude)
class UserEtudeAdmin(admin.ModelAdmin):
    list_display = ["user", "etude", "role"]
    list_filter = ["role"]
