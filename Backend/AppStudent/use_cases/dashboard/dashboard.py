from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from AppLawyer.models import Bookmark
from AppStudent.models import Application, StudentProfile

class StudentDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_active:
            return Response({"error": "User is not active"}, status=403)

        try:
            student = StudentProfile.objects.get(user=request.user)
        except StudentProfile.DoesNotExist:
            return Response({"error": "Student profile not found"}, status=404)

        applications = Application.objects.filter(student=student)
        bookmarks = Bookmark.objects.filter(user=request.user)

        return Response({
            "user": request.user.username,
            "role": request.user.role,

            "applications": applications,
            "bookmarks": bookmarks
        })