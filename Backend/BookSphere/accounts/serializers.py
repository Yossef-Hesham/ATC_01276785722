from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework import permissions, generics
from .models import CustomUser



class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            # Authenticate using email as username
            user = authenticate(
                request=self.context.get('request'),
                username=email,  # Treat email as username
                password=password
            )

            if not user:
                msg = 'Unable to log in with provided credentials.'
                raise serializers.ValidationError(msg, code='authorization')

            if not user.is_active:
                msg = 'User account is disabled.'
                raise serializers.ValidationError(msg, code='authorization')

        else:
            msg = 'Must include "email" and "password".'
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs
    

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password')
    
    def create(self, validated_data):
        return CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            user_type='user'
        )

class AdminRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    secret_key = serializers.CharField(write_only=True)  # Add this field

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'secret_key')
    
    def validate_secret_key(self, value):
        if value != "YOUR_SECRET_CODE":  # Replace with your secret
            raise serializers.ValidationError("Invalid admin key")
        return value

    def create(self, validated_data):
        validated_data.pop('secret_key')  # Remove before creation
        return CustomUser.objects.create_user(
            user_type='admin',
            is_staff=True,
            **validated_data
        )