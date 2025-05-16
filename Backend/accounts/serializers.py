from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework import permissions, generics
from .models import CustomUser
from django.contrib.auth import get_user_model


User = get_user_model()
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            # Find user by email (replaces the need for EmailAuthBackend)
            try:
                user = User.objects.get(email__iexact=email)
            except User.DoesNotExist:
                raise serializers.ValidationError(
                    'No account found with this email', 
                    code='authorization'
                )

            # Authenticate using default backend
            auth_user = authenticate(
                request=self.context.get('request'),
                username=user.username,  # Use username for standard auth
                password=password
            )

            if not auth_user:
                raise serializers.ValidationError(
                    'Invalid password', 
                    code='authorization'
                )

            if not auth_user.is_active:
                raise serializers.ValidationError(
                    'User account is disabled', 
                    code='authorization'
                )

            attrs['user'] = auth_user
            return attrs

        raise serializers.ValidationError(
            'Must include "email" and "password"',
            code='authorization'
        )

CustomUser = get_user_model()
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}  # Better for frontend rendering
    )
    email = serializers.EmailField(required=True)  # Explicit email field

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password')

    def validate(self, attrs):
        attrs = super().validate(attrs)
        
        # Case-insensitive username check
        if CustomUser.objects.filter(username__iexact=attrs['username']).exists():
            raise serializers.ValidationError(
                {'username': 'This username is already taken.'}
            )
        
        # Case-insensitive email check (critical addition)
        if CustomUser.objects.filter(email__iexact=attrs['email']).exists():
            raise serializers.ValidationError(
                {'email': 'This email is already registered.'}
            )
        
        # Normalize email to lowercase
        attrs['email'] = attrs['email'].lower().strip()
        return attrs

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
        
