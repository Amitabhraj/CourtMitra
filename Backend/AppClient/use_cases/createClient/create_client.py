from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from AppClient.models import ClientProfile
from .client_serializer import ClientProfileSerializer

class CreateClientProfileView(generics.CreateAPIView):
    serializer_class = ClientProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def perform_create(self, serializer):
        user = self.request.user

        # 🔥 Prevent duplicate profile
        if ClientProfile.objects.filter(user=user).exists():
            raise ValidationError("Client profile already exists")

        serializer.save(user=user)


class GetClientProfileView(generics.RetrieveAPIView):
    serializer_class = ClientProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_object_or_404(ClientProfile, user=self.request.user)


class UpdateClientProfileView(generics.UpdateAPIView):
    serializer_class = ClientProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_queryset(self):
        return ClientProfile.objects.filter(user=self.request.user)

    def put(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)