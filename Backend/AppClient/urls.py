from django.urls import path
from AppClient.use_cases.createClient.create_client import CreateClientProfileView
from AppClient.use_cases.createClient.create_client import GetClientProfileView, UpdateClientProfileView
from .views import *

urlpatterns = [
    path('client/create-profile/', CreateClientProfileView.as_view()),
    path('client/profile/', GetClientProfileView.as_view()),
    path('client/update-profile/<int:pk>/', UpdateClientProfileView.as_view())
]