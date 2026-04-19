from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from AppLawyer.models import Consultation, Consultation, Internship, LawyerProfile
from AppStudent.models import Application
from Backend.AppClient.models import Appointment

class LawyerDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            lawyer = LawyerProfile.objects.get(user=request.user,status='ACTIVE')
        except LawyerProfile.DoesNotExist:
            return Response({"error": "Lawyer profile not found"}, status=404)

        internships = Internship.objects.filter(lawyer=lawyer)
        applications = Application.objects.filter(internship__lawyer=lawyer)
        consultations = Appointment.objects.filter(lawyer=lawyer)

        return Response({
            "user": request.user.username,
            "role": request.user.role,
            "experience": lawyer.experience_years,
            "status": lawyer.status,

            "internships": internships,
            "applications": applications,
            "appointment": consultations,
        })