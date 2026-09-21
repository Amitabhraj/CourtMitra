from rest_framework import generics, permissions
from AppConsultant.models import Appointment
from django.db import IntegrityError, transaction
from AppConsultant.use_cases.consultation_serializer import (
    AppointmentSerializer,
    AppointmentStatusSerializer,
    AppointmentUpdateSerializer,
)
from AppClient.models import ClientProfile
from rest_framework.exceptions import PermissionDenied
from AppLawyer.models import LawyerProfile
from rest_framework.exceptions import ValidationError


class CreateAppointmentView(generics.CreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        try:
            client = ClientProfile.objects.get(user=self.request.user)
        except ClientProfile.DoesNotExist:
            if getattr(self.request.user, 'role', '') == "CLIENT":
                client = ClientProfile.objects.create(
                    user=self.request.user,
                    full_name=self.request.user.get_full_name() or self.request.user.username,
                    phone_number=""
                )
            else:
                raise PermissionDenied("Only clients can book appointments")

        try:
            with transaction.atomic():
                serializer.save(client=client)
        except IntegrityError:
            raise ValidationError("This time slot is already booked.")




class ClientAppointmentListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            client = ClientProfile.objects.get(user=self.request.user)
            return Appointment.objects.filter(client=client)
        except ClientProfile.DoesNotExist:
            return Appointment.objects.none()
    




class LawyerAppointmentListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            lawyer = LawyerProfile.objects.get(user=self.request.user)
            return Appointment.objects.filter(lawyer=lawyer)
        except LawyerProfile.DoesNotExist:
            return Appointment.objects.none()
    




class UpdateAppointmentView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        user = self.request.user

        try:
            client = ClientProfile.objects.get(user=user)
        except ClientProfile.DoesNotExist:
            raise PermissionDenied("Only clients can update appointments")

        appointment = self.get_object()

        # Ownership check
        if appointment.client != client:
            raise PermissionDenied("You can only edit your own appointments")

        # Prevent double booking
        if Appointment.objects.filter(
            lawyer=appointment.lawyer,
            date=serializer.validated_data.get('date', appointment.date),
            time_slot=serializer.validated_data.get('time_slot', appointment.time_slot)
        ).exclude(id=appointment.id).exists():
            raise PermissionDenied("This slot is already booked")

        try:
            with transaction.atomic():
                serializer.save()
        except IntegrityError:
            raise ValidationError("This slot is already booked")





class DeleteAppointmentView(generics.DestroyAPIView):
    queryset = Appointment.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        user = self.request.user

        try:
            client = ClientProfile.objects.get(user=user)
        except ClientProfile.DoesNotExist:
            raise PermissionDenied("Only clients who made this appointment can only delete appointments")

        if instance.client != client:
            raise PermissionDenied("You can only delete your own appointments")

        instance.delete()






class UpdateAppointmentStatusView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentStatusSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        user = self.request.user

        try:
            lawyer = LawyerProfile.objects.get(user=user)
        except LawyerProfile.DoesNotExist:
            raise PermissionDenied("Only lawyers can update status")

        appointment = self.get_object()

        # Ownership check
        if appointment.lawyer != lawyer:
            raise PermissionDenied("You can update only your appointments")

        serializer.save()



class AppointmentDetailView(generics.RetrieveAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        appointment = super().get_object()
        user = self.request.user

        is_client = False
        is_lawyer = False

        # Check if client
        try:
            client = ClientProfile.objects.get(user=user)
            if appointment.client == client:
                is_client = True
        except ClientProfile.DoesNotExist:
            pass

        # Check if lawyer
        try:
            lawyer = LawyerProfile.objects.get(user=user)
            if appointment.lawyer == lawyer:
                is_lawyer = True
        except LawyerProfile.DoesNotExist:
            pass

        # If neither -> block
        if not (is_client or is_lawyer):
            raise PermissionDenied("You are not allowed to view this appointment")

        return appointment
