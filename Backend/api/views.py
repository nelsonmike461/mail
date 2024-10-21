from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, EmailSerializer, LoginSerializer, LogoutSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q
from django.contrib.auth import get_user_model
from .models import Email
import json
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.views import TokenRefreshView
User = get_user_model()


class EmailDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, email_id):
        try:
            email = Email.objects.get(Q(sender=request.user) | Q(recipients=request.user), pk=email_id)
            serializer = EmailSerializer(email)
            return Response(serializer.data)
        except Email.DoesNotExist:
            return Response({'error': 'Email not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, email_id):
        try:
            email = Email.objects.get(Q(sender=request.user) | Q(recipients=request.user), pk=email_id)
        except Email.DoesNotExist:
            return Response({'error': 'Email not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Use request.data instead of manually loading from request.body
        read = request.data.get('read')
        archived = request.data.get('archived')

        if read is not None:
            email.read = read
        if archived is not None:
            email.archived = archived

        email.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ComposeEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Parse the request data
        data = json.loads(request.body)
        emails = [email.strip() for email in data.get('recipients').split(',')]

        if not any(emails):
            return Response({'error': 'At least one recipient required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Convert email addresses to user objects
        recipients = []
        for email in emails:
            try:
                user = User.objects.get(email=email)
                recipients.append(user)
            except User.DoesNotExist:
                return Response({'error': f'User with email {email} does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        # Get contents of email
        subject = data.get('subject', '')
        body = data.get('body', '')

        # Create a single email instance
        email = Email(
            user=request.user,
            sender=request.user,
            subject=subject,
            body=body,
            read=False
        )
        email.save()

        for recipient in recipients:
            email.recipients.add(recipient)
        email.save()

        # Log the recipients for debugging
        print(f"Email sent to: {[user.email for user in recipients]}")

        # Serialize the created email instance
        serializer = EmailSerializer(email)

        return Response({'message': 'Email sent successfully.', 'emails': serializer.data}, status=status.HTTP_201_CREATED)


class MailBoxView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, mailbox):
        if mailbox == 'inbox':
            # Update to filter by recipients
            emails = Email.objects.filter(recipients=request.user, archived=False)
        elif mailbox == 'sent':
            emails = Email.objects.filter(user=request.user, sender=request.user)
        elif mailbox == 'archive':
            emails = Email.objects.filter(recipients=request.user, archived=True)
        else:
            return Response({'error': 'Invalid route'}, status=400)

        serializer = EmailSerializer(emails, many=True)
        return Response(serializer.data)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        # Validate the serializer
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            # Attempt to retrieve the user by email
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"error": "Invalid email and/or password."}, status=status.HTTP_401_UNAUTHORIZED)

            # Manually check the password
            if check_password(password, user.password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_200_OK)

            # If password is incorrect
            return Response({"error": "Invalid email and/or password."}, status=status.HTTP_401_UNAUTHORIZED)

        # If serializer is invalid, return errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['refresh']
            RefreshToken(token).blacklist()  # Blacklist the token
            return Response({"message": "Logout successful."}, status=status.HTTP_200_OK)
        return Response({"error": "Refresh token required."}, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        confirmation = request.data.get("confirmation")

        # Check if the email already exists
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email address already taken."}, status=status.HTTP_400_BAD_REQUEST)

        if password != confirmation:
            return Response({"error": "Passwords must match."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class TokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)