from django.urls import path
from .views import UserRegistrationView, UserLoginView, UserLogoutView, MailBoxView, ComposeEmailView, EmailDetailView

urlpatterns = [
    path('emails/<int:email_id>', EmailDetailView.as_view(), name='email'),
    path('compose/', ComposeEmailView.as_view(), name='compose'),
    path('emails/<str:mailbox>', MailBoxView.as_view(), name='mailbox'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
]
