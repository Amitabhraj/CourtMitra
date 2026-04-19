from django.db import models
from django.contrib.auth.models import AbstractUser

# =========================
# CUSTOM USER MODEL
# =========================
class User(AbstractUser):
    ROLE_CHOICES = [
        ('LAWYER', 'LAWYER'),
        ('STUDENT', 'STUDENT'),
        ('CLIENT', 'CLIENT'),
        ('ADMIN', 'ADMIN'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

