# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer
from .serializers import ProfileSerializer
from .models import Profile
from django.contrib.auth.models import User

class RegisterView(APIView):
    # Ensure this view is accessible even if not logged in
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, created = Profile.objects.get_or_create(user=request.user)
        
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        profile, created = Profile.objects.get_or_create(user=request.user)
        username = request.data.get("username")
        profile_picture = request.FILES.get("profile_picture")

        if username:
            username = username.strip()
            if not username:
                return Response({"error": "Username cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

            username_exists = User.objects.filter(username=username).exclude(id=request.user.id).exists()
            if username_exists:
                return Response({"error": "Username is already taken."}, status=status.HTTP_400_BAD_REQUEST)

            request.user.username = username
            request.user.save(update_fields=["username"])

        if profile_picture:
            profile.profile_picture = profile_picture
            profile.save(update_fields=["profile_picture"])

        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            
            token.blacklist()
            
            return Response({"message": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Invalid token or request."}, status=status.HTTP_400_BAD_REQUEST)
