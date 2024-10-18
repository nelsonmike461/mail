from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import OutstandingToken, BlacklistedToken
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Email


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        user = User.objects.filter(email=email).first()
        if user is None:
            raise serializers.ValidationError("User with this email does not exist.")

        user = authenticate(username=user.username, password=password)
        if user is None:
            raise serializers.ValidationError("Invalid login credentials.")

        # Generate tokens
        refresh = RefreshToken.for_user(user)

        return {
            'email': user.email,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }


class UserLogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, data):
        refresh = data.get('refresh')

        # Check if the refresh token is valid
        try:
            token = OutstandingToken.objects.get(token=refresh)
        except OutstandingToken.DoesNotExist:
            raise ValidationError("This refresh token is invalid or has already been revoked.")

        return data

    def save(self):
        refresh = self.validated_data['refresh']

        # Blacklist the refresh token
        token = OutstandingToken.objects.get(token=refresh)
        BlacklistedToken.objects.create(token=token)


class EmailSerializer(serializers.ModelSerializer):
    sender = serializers.EmailField(source='sender.email')
    recipients = serializers.SerializerMethodField()

    class Meta:
        model = Email
        fields = ['id', 'sender', 'recipients', 'subject', 'body', 'timestamp', 'read', 'archived']

    def get_recipients(self, obj):
        return [user.email for user in obj.recipients.all()]