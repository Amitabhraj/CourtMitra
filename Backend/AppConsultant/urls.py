from django.urls import path
from AppConsultant.use_cases.consultation import AppointmentDetailView, ClientAppointmentListView, CreateAppointmentView, DeleteAppointmentView, LawyerAppointmentListView, UpdateAppointmentStatusView, UpdateAppointmentView, UpdateAppointmentView
from AppConsultant.use_cases.available_time_slot import AvailableSlotsView
from . import views

urlpatterns = [
    path('create-payment-order/', views.create_payment_order, name='create-payment-order'),
    path('verify-payment-and-book/', views.verify_payment_and_book, name='verify-payment-and-book'),


    path('create-appointment/', CreateAppointmentView.as_view()),
    path('client-appointments/', ClientAppointmentListView.as_view()),
    path('lawyer-appointments/', LawyerAppointmentListView.as_view()),
    path('update/<int:pk>/', UpdateAppointmentView.as_view()),
    path('delete/<int:pk>/', DeleteAppointmentView.as_view()),
    path('update-status/<int:pk>/', UpdateAppointmentStatusView.as_view()),
    path('available-slots/<int:lawyer_id>/<str:date>/', AvailableSlotsView.as_view()),
    path('appointment-detail/<int:pk>/', AppointmentDetailView.as_view()),
]