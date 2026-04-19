from django.urls import path
from .views import *

urlpatterns = [
    # STUDENT
    path('student/create/', CreateStudentProfile.as_view()),
    path('student/<int:id>/', GetStudentProfile.as_view()),
    path('student/update/<int:pk>/', UpdateStudentProfile.as_view()),
]
