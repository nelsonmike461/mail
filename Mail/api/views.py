from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserRegistrationSerializer, UserLoginSerializer,UserLogoutSerializer ,EmailSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Email
from django.contrib.auth.models import User
import json


class EmailDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, email_id):
        try:
            email = Email.objects.get(user=request.user, pk=email_id)
            serializer = EmailSerializer(email)
            return Response(serializer.data)
        except Email.DoesNotExist:
            return Response({'error': 'Email not found'}, status=status.Http_404)

    def put(self, request, email_id):
        try:
            email = Email.objects.get(user=request.user, pk=email_id)
        except Email.DoesNotExist:
            return Response({'error': 'Email not found.'}, status=status.HTTP_404_NOT_FOUND)

        data = json.loads(request.body)
        if data.get('read') is not None:
            email.read = data['read']
        if data.get('archived') is not None:
            email.archived = data['archived']
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
        elif mailbox == 'archive':  # Corrected typo from 'arichive' to 'archive'
            emails = Email.objects.filter(recipients=request.user, archived=True)
        else:
            return Response({'error': 'Invalid route'}, status=400)

        serializer = EmailSerializer(emails, many=True)
        return Response(serializer.data)




class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserLogoutSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # This will blacklist the token
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)