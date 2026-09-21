from django.db import models
from AppLawyer.models import LawyerProfile
from AppUser.models import User

class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="client_profile")

    # Basic Info
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    address = models.TextField(blank=True, null=True)

    # Optional Info
    profile_image = models.ImageField(upload_to="client_profiles/", blank=True, null=True)

    # Meta
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name