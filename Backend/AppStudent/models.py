from django.db import models
from AppLawyer.models import Internship, Specialization
from AppUser.models import User

# =========================
# STUDENT PROFILE
# =========================
class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    college_name = models.CharField(max_length=255)
    course = models.CharField(max_length=100)
    year = models.IntegerField()

    skills = models.TextField(blank=True)
    resume = models.FileField(upload_to='resumes/')

    interested_fields = models.ManyToManyField(Specialization, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} (Student)"
    




# =========================
# APPLICATION MODEL
# =========================
class Application(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    internship = models.ForeignKey(Internship, on_delete=models.CASCADE)

    cover_letter = models.TextField()

    STATUS_CHOICES = [
        ('PENDING', 'PENDING'),
        ('ACCEPTED', 'ACCEPTED'),
        ('REJECTED', 'REJECTED'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')

    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['student', 'internship'],
                name='unique_student_internship_application'
            )
        ]

    def __str__(self):
        return f"{self.student.user.username} -> {self.internship.title}"
