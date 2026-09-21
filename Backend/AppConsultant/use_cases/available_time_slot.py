from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from AppConsultant.models import Appointment

class AvailableSlotsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, lawyer_id, date):
        all_slots = [slot[0] for slot in Appointment.TIME_SLOTS]

        booked_slots = Appointment.objects.filter(
            lawyer_id=lawyer_id,
            date=date
        ).values_list('time_slot', flat=True)

        available_slots = [slot for slot in all_slots if slot not in booked_slots]

        return Response({
            "available_slots": available_slots
        })
    