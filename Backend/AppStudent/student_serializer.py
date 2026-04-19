from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from AppStudent.models import *
from AppUser.user_serializer import UserSerializer

User = get_user_model()
    
# =========================
# STUDENT
# =========================
class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = StudentProfile
        fields = '__all__'
        extra_kwargs = {
            'resume': {'required': False},
            'skills': {'required': False},
        }


# =========================
# INTERNSHIP
# =========================
class InternshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Internship
        fields = '__all__'
        read_only_fields = ['lawyer', 'created_at']


# =========================
# APPLICATION
# =========================
class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['student', 'status', 'applied_at']

    def validate(self, attrs):
        internship = attrs.get('internship')
        request = self.context.get('request')

        if internship and internship.deadline and internship.deadline < timezone.now():
            raise serializers.ValidationError(
                {'internship': 'This internship is no longer accepting applications.'}
            )

        if request and request.user and request.user.is_authenticated:
            try:
                student = StudentProfile.objects.get(user=request.user)
            except StudentProfile.DoesNotExist:
                return attrs

            if internship and Application.objects.filter(
                student=student,
                internship=internship
            ).exists():
                raise serializers.ValidationError(
                    {'internship': 'You have already applied to this internship.'}
                )

        return attrs