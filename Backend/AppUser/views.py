from rest_framework import generics, permissions
from AppUser.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from AppUser.user_serializer import UserDetailSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from AppLawyer.models import Specialization
from AppLawyer.lawyer_serializer import SpecializationSerializer
from rest_framework.permissions import AllowAny


class SpecializationListView(generics.ListAPIView):
    queryset = Specialization.objects.all()
    serializer_class = SpecializationSerializer
    permission_classes = [AllowAny]   # anyone can access



# =========================
# AUTH APIs
# =========================

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        user = User.objects.get(username=response.data['username'])
        user.set_password(request.data['password'])
        user.save()
        refresh = RefreshToken.for_user(user)

        return Response({
            "user": response.data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "status":200
        })
    

    
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "role": user.role
                }
            })
        return Response({"error": "Invalid credentials"}, status=400)




class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)