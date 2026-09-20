from rest_framework import serializers
from AppClient.models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ['client'] 

    def validate(self, data):
        lawyer = data.get('lawyer')
        date = data.get('date')
        time_slot = data.get('time_slot')

        if Appointment.objects.filter(
            lawyer=lawyer,
            date=date,
            time_slot=time_slot
        ).exists():
            raise serializers.ValidationError("This time slot is already booked.")

        return data
    





class AppointmentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['date', 'time_slot']





class AppointmentStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['status']


