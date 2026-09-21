import hmac
import hashlib
import razorpay
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from AppLawyer.models import LawyerProfile  # Adjust imports to match your models
from AppClient.models import ClientProfile
from AppConsultant.models import Appointment  # Adjust imports to match your models

# Initialize Razorpay Client
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_order(request):
    """
    Creates a Razorpay Order before booking an appointment.
    """
    lawyer_id = request.data.get('lawyer')
    date = request.data.get('date')
    time_slot = request.data.get('time_slot')

    if not lawyer_id or not date or not time_slot:
        return Response({'detail': 'Lawyer ID, date, and time slot are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        lawyer = LawyerProfile.objects.get(id=lawyer_id)
        
        # Consultation fee (Assuming integer/float in INR)
        fee = float(lawyer.consultation_fee or 0)

        # Razorpay expects amount in smallest currency unit (paise for INR)
        amount_in_paise = int(fee * 100)

        # If the consultation is free (0 INR), flag it so frontend can skip Razorpay
        if amount_in_paise == 0:
            return Response({'free_appointment': True, 'amount': 0}, status=status.HTTP_200_OK)

        # Create Razorpay Order
        order_data = {
            'amount': amount_in_paise,
            'currency': 'INR',
            'payment_capture': 1  # Auto capture
        }
        order = razorpay_client.order.create(data=order_data)

        return Response({
            'free_appointment': False,
            'order_id': order['id'],
            'amount': amount_in_paise,
            'currency': 'INR',
            'key_id': settings.RAZORPAY_KEY_ID
        }, status=status.HTTP_200_OK)

    except LawyerProfile.DoesNotExist:
        return Response({'detail': 'Lawyer not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment_and_book(request):
    print("Request Data:", request.data)
    lawyer_id = request.data.get('lawyer')
    date = request.data.get('date')
    time_slot = request.data.get('time_slot')
    
    razorpay_order_id = request.data.get('razorpay_order_id')
    razorpay_payment_id = request.data.get('razorpay_payment_id')
    razorpay_signature = request.data.get('razorpay_signature')
    is_free = request.data.get('is_free', False)

    if not is_free:
        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
            return Response({'detail': 'Payment verification details missing.'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify Signature using Official SDK
        try:
            razorpay_client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })
        except razorpay.errors.SignatureVerificationError:
            return Response({'detail': 'Payment verification failed. Invalid signature.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        lawyer = LawyerProfile.objects.get(id=lawyer_id)
        
        # Check double booking
        if Appointment.objects.filter(lawyer=lawyer, date=date, time_slot=time_slot).exists():
            return Response({'detail': 'This slot has already been booked.'}, status=status.HTTP_400_BAD_REQUEST)

        appointment = Appointment.objects.create(
            client=ClientProfile.objects.get(user=request.user),
            lawyer=lawyer,
            date=date,
            time_slot=time_slot,
            payment_status='PAID' if not is_free else 'FREE',
            razorpay_order_id=razorpay_order_id or '',
            razorpay_payment_id=razorpay_payment_id or ''
        )

        return Response({
            'detail': 'Appointment booked successfully.',
            'appointment_id': appointment.id
        }, status=status.HTTP_201_CREATED)

    except LawyerProfile.DoesNotExist:
        return Response({'detail': 'Lawyer profile not found.'}, status=status.HTTP_404_NOT_FOUND)