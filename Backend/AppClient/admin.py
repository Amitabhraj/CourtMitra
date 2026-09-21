from django.contrib import admin
from AppClient.models import ClientProfile

# Register your models here.
admin.site.register(ClientProfile)
admin.site.site_header = "Lawyer Client Management"
