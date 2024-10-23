from django.urls import path
from .views import LoginView, LogoutView, RegisterView, TokenRefreshView,MailBoxView, ComposeEmailView, EmailDetailView

urlpatterns = [
    path('emails/<int:email_id>/', EmailDetailView.as_view(), name='email'),
    path('compose/', ComposeEmailView.as_view(), name='compose'),
    path('emails/<str:mailbox>', MailBoxView.as_view(), name='mailbox'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
