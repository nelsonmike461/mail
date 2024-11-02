from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .models import Email
from .serializers import (
    UserSerializer,
    EmailSerializer,
    LogoutSerializer,
    LoginSerializer,
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
import json

User = get_user_model()


class EmailDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, email_id):
        email = Email.objects.filter(
            Q(sender=request.user) | Q(recipients=request.user), pk=email_id
        ).first()
        if email:
            serializer = EmailSerializer(email)
            return Response(serializer.data)
        return Response({"error": "Email not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, email_id):
        email = Email.objects.filter(
            Q(sender=request.user) | Q(recipients=request.user), pk=email_id
        ).first()
        if email:
            if request.user in email.recipients.all():
                email.read = True
            archived = request.data.get("archived")
            if archived is not None:
                email.archived = archived
            email.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "Email not found."}, status=status.HTTP_404_NOT_FOUND)


class ComposeEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = json.loads(request.body)
        emails = [email.strip() for email in data.get("recipients", "").split(",")]

        if not emails:
            return Response(
                {"error": "At least one recipient required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        recipients = []
        for email in emails:
            try:
                user = User.objects.get(email=email)
                recipients.append(user)
            except User.DoesNotExist:
                return Response(
                    {"error": f"User with email {email} does not exist."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        subject = data.get("subject", "")
        body = data.get("body", "")

        email = Email(
            user=request.user,
            sender=request.user,
            subject=subject,
            body=body,
            read=False,
        )
        email.save()

        for recipient in recipients:
            email.recipients.add(recipient)
        email.save()

        serializer = EmailSerializer(email)
        return Response(
            {"message": "Email sent successfully.", "emails": serializer.data},
            status=status.HTTP_201_CREATED,
        )


class MailBoxView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, mailbox):
        if mailbox == "inbox":
            emails = Email.objects.filter(recipients=request.user, archived=False)
        elif mailbox == "sent":
            emails = Email.objects.filter(user=request.user, sender=request.user)
        elif mailbox == "archive":
            emails = Email.objects.filter(recipients=request.user, archived=True)
        else:
            return Response({"error": "Invalid route"}, status=400)

        serializer = EmailSerializer(emails, many=True)
        return Response(serializer.data)


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer


class LogoutView(APIView):
    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data["refresh"]
            RefreshToken(token).blacklist()  # Blacklist the token
            return Response(
                {"message": "Logout successful."}, status=status.HTTP_200_OK
            )
        return Response(
            {"error": "Refresh token required."}, status=status.HTTP_400_BAD_REQUEST
        )


class RegisterView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        confirmation = request.data.get("confirmation")

        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email address already taken."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if password != confirmation:
            return Response(
                {"error": "Passwords must match."}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"message": "User registered successfully."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
