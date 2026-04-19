from django.urls import path
from AppClient.use_cases.appointment.appointment_views import (
    AppointmentDetailView,
    AvailableSlotsView,
    ClientAppointmentListView,
    CreateAppointmentView,
    DeleteAppointmentView,
    LawyerAppointmentListView,
    UpdateAppointmentStatusView,
    UpdateAppointmentView,
)
from AppClient.use_cases.createClient.create_client import CreateClientProfileView
from AppClient.use_cases.createClient.create_client import GetClientProfileView, UpdateClientProfileView
from .views import *

urlpatterns = [
    path('client/create-profile/', CreateClientProfileView.as_view()),
    path('client/profile/', GetClientProfileView.as_view()),
    path('client/update-profile/<int:pk>/', UpdateClientProfileView.as_view()),

    path('create-appointment/', CreateAppointmentView.as_view()),
    path('client-appointments/', ClientAppointmentListView.as_view()),
    path('lawyer-appointments/', LawyerAppointmentListView.as_view()),
    path('update/<int:pk>/', UpdateAppointmentView.as_view()),
    path('delete/<int:pk>/', DeleteAppointmentView.as_view()),
    path('update-status/<int:pk>/', UpdateAppointmentStatusView.as_view()),
    path('available-slots/<int:lawyer_id>/<str:date>/', AvailableSlotsView.as_view()),
    path('appointment-detail/<int:pk>/', AppointmentDetailView.as_view()),
]