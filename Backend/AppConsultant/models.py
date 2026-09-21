from django.db import models
from AppClient.models import ClientProfile
from AppLawyer.models import LawyerProfile

class Appointment(models.Model):

    # Qwertyuiop12@33

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
        ("ON GOING", "ON GOING"),
        ("CANCELLED", "CANCELLED"),
    ]

    lawyer = models.ForeignKey(LawyerProfile, on_delete=models.CASCADE, related_name="lawyer_appointments")
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, related_name="client_user_appointments")
    date = models.DateField()
    time_slot = models.CharField(max_length=20, choices=TIME_SLOTS)

    created_at = models.DateTimeField(auto_now_add=True)

    status = models.CharField(max_length=20, choices=status_choices, default="SCHEDULED")

    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    payment_status = models.CharField(max_length=20, default="PENDING")  # PENDING, SUCCESS, FAILED
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        unique_together = ['lawyer', 'date', 'time_slot']

    def __str__(self):
        return f"{self.lawyer} - {self.date} - {self.time_slot}"


    