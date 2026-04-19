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



class Appointment(models.Model):

    TIME_SLOTS = [
        ("08:00 AM", "08:00 AM"),
        ("09:00 AM", "09:00 AM"),
        ("10:00 AM", "10:00 AM"),
        ("11:00 AM", "11:00 AM"),
        ("12:00 PM", "12:00 PM"),
        ("01:00 PM", "01:00 PM"),
        ("02:00 PM", "02:00 PM"),
        ("03:00 PM", "03:00 PM"),
        ("04:00 PM", "04:00 PM"),
        ("05:00 PM", "05:00 PM"),
        ("06:00 PM", "06:00 PM"),
        ("07:00 PM", "07:00 PM"),
        ("08:00 PM", "08:00 PM"),
        ("09:00 PM", "09:00 PM"),
    ]

    status_choices = [
        ("SCHEDULED", "SCHEDULED"),
        ("COMPLETED", "COMPLETED"),
        ("CANCELLED", "CANCELLED"),
    ]

    lawyer = models.ForeignKey(LawyerProfile, on_delete=models.CASCADE, related_name="appointments")
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, related_name="appointments")
    date = models.DateField()
    time_slot = models.CharField(max_length=20, choices=TIME_SLOTS)

    created_at = models.DateTimeField(auto_now_add=True)

    status = models.CharField(max_length=20, default="PENDING")  # Scheduled, Completed, Cancelled

    class Meta:
        unique_together = ['lawyer', 'date', 'time_slot']  # ❗ prevent double booking

    def __str__(self):
        return f"{self.lawyer} - {self.date} - {self.time_slot}"