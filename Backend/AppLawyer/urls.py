from django.urls import path
from AppLawyer.use_cases.internApplication.updateApplication import UpdateApplicationView
from .views import *

urlpatterns = [

    # LAWYERS
    path('lawyers/', GetAllLawyers.as_view()),
    path('lawyer/create/', CreateLawyerProfile.as_view()),
    path('lawyer/<int:id>/', GetLawyerDetail.as_view()),
    path('lawyer/update/<int:pk>/', UpdateLawyerProfile.as_view()),
    path('lawyer/delete/<int:pk>/', DeleteLawyerProfile.as_view()),

    # INTERNSHIP
    path('internships/', GetAllInternships.as_view()),
    path('internship/create/', CreateInternship.as_view()),
    path('internship/<int:id>/', GetInternshipDetail.as_view()),
    path('internship/update/<int:pk>/', UpdateInternship.as_view()),
    path('internship/delete/<int:pk>/', DeleteInternship.as_view()),

    # APPLICATION
    path('apply/', ApplyInternship.as_view()),
    path('student/applications/', GetStudentApplications.as_view()),
    path('lawyer/applications/', GetLawyerApplications.as_view()),
    path('application/update/<int:pk>/', UpdateApplicationView.as_view()),


    # REVIEW
    path('review/create/', CreateReview.as_view()),
    path('reviews/<int:lawyer_id>/', GetLawyerReviews.as_view()),

    # BOOKMARK
    path('bookmark/add/', AddBookmark.as_view()),
    path('bookmark/', GetBookmarks.as_view()),
    path('bookmark/remove/<int:pk>/', RemoveBookmark.as_view()),
]
