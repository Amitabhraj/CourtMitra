from django.urls import path
from . import views

urlpatterns = [
    path('create-payment-order/', views.create_payment_order, name='create-payment-order'),
    path('verify-payment-and-book/', views.verify_payment_and_book, name='verify-payment-and-book'),
]