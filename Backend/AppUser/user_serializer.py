from rest_framework import serializers
from django.contrib.auth import get_user_model
from AppLawyer.models import *
from AppStudent.models import StudentProfile
from AppClient.models import ClientProfile

User = get_user_model()

# =========================
# USER SERIALIZER
# =========================
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'role']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
    


class UserDetailSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = "__all__" 
    
    def get_profile(self, obj):
        if obj.role == "STUDENT":
            try:
                from AppStudent.student_serializer import StudentProfileSerializer
                profile = StudentProfile.objects.get(user=obj)
                return StudentProfileSerializer(profile).data
            except StudentProfile.DoesNotExist:
                return None

        elif obj.role == "LAWYER":
            try:
                from AppLawyer.lawyer_serializer import LawyerProfileSerializer
                profile = LawyerProfile.objects.get(user=obj)
                return LawyerProfileSerializer(profile).data
            except LawyerProfile.DoesNotExist:
                return None

        elif obj.role == "CLIENT":
            try:
                from AppClient.use_cases.createClient.client_serializer import ClientProfileSerializer
                profile = ClientProfile.objects.get(user=obj)
                return ClientProfileSerializer(profile).data
            except ClientProfile.DoesNotExist:
                return None

        return None
    
    