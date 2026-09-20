from django.db import models
from AppUser.models import User

# =========================
# SPECIALIZATION MODEL
# =========================
class Specialization(models.Model):
    SPECIALIZATION_CHOICES = [
        ('CRIMINAL LAW', 'CRIMINAL LAW'),
        ('CIVIL LAW', 'CIVIL LAW'),
        ('CORPORATE LAW', 'CORPORATE LAW'),
        ('FAMILY LAW', 'FAMILY LAW'),
        ('INTELLECTUAL PROPERTY LAW', 'INTELLECTUAL PROPERTY LAW'),
        ('LABOR AND EMPLOYMENT LAW', 'LABOR AND EMPLOYMENT LAW'),
        ('TAX LAW', 'TAX LAW'),
        ('ENVIRONMENTAL LAW', 'ENVIRONMENTAL LAW'),
        ('IMMIGRATION LAW', 'IMMIGRATION LAW'),
        ('BANKRUPTCY LAW', 'BANKRUPTCY LAW'),
        ('REAL ESTATE LAW', 'REAL ESTATE LAW'),
        ('CONSTITUTIONAL LAW', 'CONSTITUTIONAL LAW'),
        ('HUMAN RIGHTS LAW', 'HUMAN RIGHTS LAW'),
        ('INTERNATIONAL LAW', 'INTERNATIONAL LAW'),
        ('OTHER', 'OTHER'),
    ]

    name = models.CharField(max_length=100, choices=SPECIALIZATION_CHOICES, unique=True)

    def __str__(self):
        return self.name


# =========================
# LAWYER PROFILE
# =========================
class LawyerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    specialization = models.ManyToManyField(Specialization, blank=True)
    experience_years = models.IntegerField(default=0)

    address = models.CharField(max_length=255, blank=True, null=True)
    mobile = models.CharField(max_length=15)

    STATUS_CHOICES = [
        ('PENDING', 'PENDING'),
        ('ACTIVE', 'ACTIVE'),
        ('INACTIVE', 'INACTIVE'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')

    start_time = models.TimeField()
    end_time = models.TimeField()

    working_days = models.JSONField(default=None,null=True, max_length=255)

    working_place = models.CharField(max_length=255, blank=True, null=True)

    about = models.TextField(blank=True, null=True)
    profile_image = models.ImageField(upload_to='lawyers/')

    chat_free = models.BooleanField(default=False)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00,help_text="Fees (including taxes like GST or coorporate Tax) for a consultation session with the lawyer.")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"{self.user.username} (Lawyer)"




# =========================
# INTERNSHIP MODEL
# =========================
class Internship(models.Model):
    lawyer = models.ForeignKey(LawyerProfile, on_delete=models.CASCADE)

    title = models.CharField(max_length=255)
    description = models.TextField()

    stipend = models.IntegerField(default=0)
    duration = models.CharField(max_length=100)

    location = models.CharField(max_length=255)
    is_remote = models.BooleanField(default=False)

    required_skills = models.TextField()

    deadline = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# =========================
# REVIEW MODEL
# =========================
class Review(models.Model):
    lawyer = models.ForeignKey(LawyerProfile, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    rating = models.IntegerField()
    comment = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.rating} by {self.user.username}"


# =========================
# BOOKMARK MODEL
# =========================
class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lawyer = models.ForeignKey(LawyerProfile, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} bookmarked {self.lawyer.user.username}"
    