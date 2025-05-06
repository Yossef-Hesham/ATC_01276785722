from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from .serializers import (
    UserRegistrationSerializer,
    AdminRegistrationSerializer,
    LoginSerializer
)



class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

class AdminRegistrationView(generics.CreateAPIView):
    serializer_class = AdminRegistrationSerializer
    permission_classes = [permissions.IsAdminUser]



class CustomLoginView(ObtainAuthToken):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, 
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'email': user.email,
            'user_type': user.user_type
        })