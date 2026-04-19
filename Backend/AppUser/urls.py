from django.urls import path
from .views import *

urlpatterns = [
    # AUTH
    path('register/', RegisterUserView.as_view()),
    path('login/', LoginView.as_view()),
    path('user-detail/', UserProfileView.as_view()),
    path('get-all-specializations/', SpecializationListView.as_view()),
]
