from rest_framework import serializers
from .models import Reponse, AuditLog


class ReponseSerializer(serializers.ModelSerializer):
    patient_numero = serializers.CharField(source="patient.numero_id", read_only=True)
    etude_nom = serializers.CharField(source="etude.nom", read_only=True)
    filled_by_name = serializers.CharField(source="filled_by.username", read_only=True)

    class Meta:
        model = Reponse
        fields = "__all__"
        read_only_fields = ["id", "scores", "filled_by", "created_at", "updated_at"]


class ReponseCreateSerializer(serializers.Serializer):
    patient_id = serializers.UUIDField()
    etude_id = serializers.UUIDField()
    periode = serializers.CharField(max_length=10)
    data = serializers.JSONField()

    def validate_data(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("data doit être un dictionnaire.")
        return value


class AuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = AuditLog
        fields = "__all__"
