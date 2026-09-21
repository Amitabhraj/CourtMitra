from rest_framework import generics, permissions
from AppUser.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from AppUser.user_serializer import UserDetailSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from AppLawyer.models import Specialization, LawyerProfile
from AppStudent.models import StudentProfile
from AppClient.models import ClientProfile
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
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        print(response.data)
        print(request.data)

        user = User.objects.get(username=response.data['username'])
        user.set_password(request.data['password'])

        full_name = request.data.get("full_name", "").strip()
        if full_name:
            name_parts = full_name.split(" ", 1)
            user.first_name = name_parts[0]
            if len(name_parts) > 1:
                user.last_name = name_parts[1]

        user.save()

        # Initialize role-specific profile so all dashboards function immediately
        role = (user.role or "").upper()
        try:
            if role == "CLIENT":
                ClientProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        "full_name": full_name or user.username,
                        "phone_number": request.data.get("phone_number", "") or request.data.get("mobile", ""),
                        "address": request.data.get("address", "") or request.data.get("city", ""),
                    }
                )
            elif role == "LAWYER":
                profile, _ = LawyerProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        "mobile": request.data.get("phone_number", "0000000000") or request.data.get("mobile", "0000000000"),
                        "experience_years": int(request.data.get("experience_years") or 0),
                        "address": request.data.get("address", "") or request.data.get("city", ""),
                        "start_time": request.data.get("start_time", "") or "09:00:00",
                        "end_time": request.data.get("end_time", "") or "18:00:00",
                        "working_days": str(request.data.get("working_days", "") or "Monday,Tuesday,Wednesday,Thursday,Friday"),
                        "working_place": request.data.get("working_place", "") or request.data.get("city", "High Court / District Court"),
                        "about": request.data.get("about", "") or "Legal advocate practicing across criminal, civil, and corporate litigation.",
                        "consultation_fee": float(request.data.get("consultation_fee") or 500.00),
                        "chat_free": bool(request.data.get("chat_free") or False),
                    }
                )
                spec_val = request.data.get("specialization")
                if spec_val:
                    for spec in spec_val.split(","):
                        specialization, _ = Specialization.objects.get_or_create(id=spec.strip())
                        profile.specialization.add(specialization)
            elif role == "STUDENT":
                StudentProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        "college_name": request.data.get("college_name", "") or "Law School / Faculty of Law",
                        "course": request.data.get("course", "") or "LL.B",
                        "year": int(request.data.get("year") or 1),
                        "mobile_number": request.data.get("phone_number", "0000000000") or request.data.get("mobile", "0000000000"),
                        "skills": request.data.get("skills", "") or "Legal research, case analysis, document drafting",
                    }
                )
        except Exception:
            pass

        refresh = RefreshToken.for_user(user)

        return Response({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role
            },
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "message": f"Successfully registered as {user.role}",
            "status": 200
        }, status=201)
    

    
class LoginView(APIView):
    permission_classes = [AllowAny]

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