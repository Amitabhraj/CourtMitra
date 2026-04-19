from rest_framework import serializers
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from AppLawyer.models import LawyerProfile
from AppStudent.models import Application

class ApplicationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['status']   # only allow status update



class UpdateApplicationView(generics.UpdateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        user = self.request.user

        try:
            lawyer = LawyerProfile.objects.get(user=user)
        except LawyerProfile.DoesNotExist:
            raise PermissionDenied("Only lawyers can update applications")

        application = self.get_object()

        # 🔥 Check ownership
        if application.internship.lawyer != lawyer:
            raise PermissionDenied("You are not allowed to update this application")

        serializer.save()