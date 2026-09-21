from django.contrib import admin
from AppConsultant.models import Appointment

# Register your models here.
admin.site.site_header = "CourtMitra Admin"
admin.site.site_title = "CourtMitra Admin Portal"
admin.site.index_title = "Welcome to CourtMitra Admin Portal"
admin.site.site_url = None
admin.site.register(Appointment) 
