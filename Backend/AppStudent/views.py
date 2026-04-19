from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.exceptions import ValidationError
from AppUser.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from AppUser.user_serializer import UserSerializer
from AppStudent.models import StudentProfile
from AppStudent.student_serializer import StudentProfileSerializer

# Create your views here.
def home(request):
    pass


# =========================
# STUDENT APIs
# =========================
class CreateStudentProfile(generics.CreateAPIView):
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def perform_create(self, serializer):
        if StudentProfile.objects.filter(user=self.request.user).exists():
            raise ValidationError("Student profile already exists")
        serializer.save(user=self.request.user)


class GetStudentProfile(generics.RetrieveAPIView):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    lookup_field = 'id'


class UpdateStudentProfile(generics.UpdateAPIView):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_queryset(self):
        return StudentProfile.objects.filter(user=self.request.user)

    def put(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)