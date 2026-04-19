from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model

from .models import *
from AppLawyer.lawyer_serializer import *
from AppStudent.models import Application, StudentProfile
from AppStudent.student_serializer import ApplicationSerializer, InternshipSerializer, StudentProfileSerializer

User = get_user_model()

# =========================
# LAWYER APIs
# =========================
class CreateLawyerProfile(generics.CreateAPIView):
    queryset = LawyerProfile.objects.all()
    serializer_class = LawyerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def perform_create(self, serializer):
        if LawyerProfile.objects.filter(user=self.request.user).exists():
            raise ValidationError("Lawyer profile already exists")
        serializer.save(user=self.request.user)


class GetAllLawyers(generics.ListAPIView):
    queryset = LawyerProfile.objects.filter(status='ACTIVE')
    serializer_class = LawyerProfileSerializer


class GetLawyerDetail(generics.RetrieveAPIView):
    queryset = LawyerProfile.objects.all()
    serializer_class = LawyerProfileSerializer
    lookup_field = 'id'


class UpdateLawyerProfile(generics.UpdateAPIView):
    queryset = LawyerProfile.objects.all()
    serializer_class = LawyerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_queryset(self):
        return LawyerProfile.objects.filter(user=self.request.user)

    def put(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)


class DeleteLawyerProfile(generics.DestroyAPIView):
    queryset = LawyerProfile.objects.all()
    serializer_class = LawyerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LawyerProfile.objects.filter(user=self.request.user)



# =========================
# INTERNSHIP APIs
# =========================
class CreateInternship(generics.CreateAPIView):
    serializer_class = InternshipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        try:
            lawyer = LawyerProfile.objects.get(user=self.request.user)
        except LawyerProfile.DoesNotExist:
            raise ValidationError("Only lawyers can create internships")
        serializer.save(lawyer=lawyer)


class GetAllInternships(generics.ListAPIView):
    queryset = Internship.objects.all().order_by('-created_at')
    serializer_class = InternshipSerializer


class GetInternshipDetail(generics.RetrieveAPIView):
    queryset = Internship.objects.all()
    serializer_class = InternshipSerializer
    lookup_field = 'id'


class UpdateInternship(generics.UpdateAPIView):
    queryset = Internship.objects.all()
    serializer_class = InternshipSerializer
    permission_classes = [permissions.IsAuthenticated]


class DeleteInternship(generics.DestroyAPIView):
    queryset = Internship.objects.all()
    serializer_class = InternshipSerializer
    permission_classes = [permissions.IsAuthenticated]


# =========================
# APPLICATION APIs
# =========================
class ApplyInternship(generics.CreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        try:
            student = StudentProfile.objects.get(user=self.request.user)
        except StudentProfile.DoesNotExist:
            raise ValidationError("Only students can apply for internships")
        serializer.save(student=student)


class GetStudentApplications(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(student__user=self.request.user)


class GetLawyerApplications(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(internship__lawyer__user=self.request.user)


# =========================
# REVIEW APIs
# =========================
class CreateReview(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]


class GetLawyerReviews(generics.ListAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        lawyer_id = self.kwargs.get('lawyer_id')
        return Review.objects.filter(lawyer_id=lawyer_id)


# =========================
# BOOKMARK APIs
# =========================
class AddBookmark(generics.CreateAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]


class GetBookmarks(generics.ListAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user)


class RemoveBookmark(generics.DestroyAPIView):
    queryset = Bookmark.objects.all()
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]



def home(request):
    pass
