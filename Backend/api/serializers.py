from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.contrib.auth import get_user_model
from .models import Email

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"], password=validated_data["password"]
        )
        return user


class LoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        return token


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class EmailSerializer(serializers.ModelSerializer):
    sender = serializers.EmailField(source="sender.email")
    recipients = serializers.SerializerMethodField()
    timestamp = serializers.SerializerMethodField()

    class Meta:
        model = Email
        fields = [
            "id",
            "sender",
            "recipients",
            "subject",
            "body",
            "timestamp",
            "read",
            "archived",
        ]

    def get_recipients(self, obj):
        return [recipient.email for recipient in obj.recipients.all()]

    def get_timestamp(self, obj):
        return obj.timestamp.strftime("%b %d %Y, %I:%M %p")
