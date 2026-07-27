from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Etude, Section, Question, Patient, PatientEtude

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "role", "phone", "institution"]
        read_only_fields = ["id"]


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "first_name", "last_name", "role"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = "__all__"


class SectionSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Section
        fields = "__all__"


class EtudeSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source="created_by.username", read_only=True)
    nb_patients = serializers.SerializerMethodField()
    nb_reponses = serializers.SerializerMethodField()

    class Meta:
        model = Etude
        fields = "__all__"
        read_only_fields = ["id", "created_by", "created_at"]

    def get_nb_patients(self, obj):
        return obj.patient_etudes.count()

    def get_nb_reponses(self, obj):
        return obj.reponses.count()


class EtudeListSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source="created_by.username", read_only=True)
    nb_patients = serializers.SerializerMethodField()
    nb_reponses = serializers.SerializerMethodField()

    class Meta:
        model = Etude
        fields = [
            "id", "nom", "description", "domaine", "statut",
            "created_by_name", "nb_patients", "nb_reponses", "created_at",
        ]

    def get_nb_patients(self, obj):
        return obj.patient_etudes.count()

    def get_nb_reponses(self, obj):
        return obj.reponses.count()


class PatientSerializer(serializers.ModelSerializer):
    etudes_count = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = "__all__"

    def get_etudes_count(self, obj):
        return obj.patient_etudes.count()


class PatientEtudeSerializer(serializers.ModelSerializer):
    patient_numero = serializers.CharField(source="patient.numero_id", read_only=True)
    etude_nom = serializers.CharField(source="etude.nom", read_only=True)

    class Meta:
        model = PatientEtude
        fields = "__all__"
