from rest_framework import serializers
from AppClient.models import ClientProfile

class ClientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientProfile
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']