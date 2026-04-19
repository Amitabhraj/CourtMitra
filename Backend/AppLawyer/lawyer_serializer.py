from rest_framework import serializers
from django.contrib.auth import get_user_model
import json
from AppLawyer.models import *
from AppUser.user_serializer import UserSerializer

User = get_user_model()


# =========================
# SPECIALIZATION
# =========================
class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = '__all__'


# =========================
# LAWYER
# =========================
class LawyerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    specialization_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = LawyerProfile
        fields = '__all__'
        extra_kwargs = {
            'profile_image': {'required': False},
            'mobile': {'required': False},
            'start_time': {'required': False},
            'end_time': {'required': False},
            'status': {'required': False},
        }

    def validate_working_days(self, value):
        # Accept list, {"day": [...]}, or a JSON string from multipart requests.
        if value in (None, ''):
            return []

        if isinstance(value, str):
            try:
                parsed = json.loads(value)
            except json.JSONDecodeError:
                return []

            if isinstance(parsed, dict):
                return parsed.get('day', [])
            if isinstance(parsed, list):
                return parsed
            return []

        if isinstance(value, dict):
            return value.get('day', [])

        if isinstance(value, list):
            return value

        return []

    def get_specialization_details(self, obj):
        return list(obj.specialization.values_list('name', flat=True))


# =========================
# REVIEW
# =========================
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


# =========================
# BOOKMARK
# =========================
class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = '__all__'