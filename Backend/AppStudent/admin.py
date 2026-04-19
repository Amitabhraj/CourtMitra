from django.contrib import admin
from AppStudent.models import Application, StudentProfile

# Register your models here.
admin.site.register(StudentProfile)
admin.site.register(Application)