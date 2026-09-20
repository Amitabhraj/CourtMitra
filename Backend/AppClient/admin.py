from django.contrib import admin
from AppClient.models import Appointment, ClientProfile

# Register your models here.
admin.site.register(ClientProfile)
admin.site.register(Appointment)
admin.site.site_header = "Lawyer Client Management"
