from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Email(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='emails')
    sender = models.ForeignKey(User, on_delete=models.PROTECT, related_name='emails_sent')
    recipients = models.ManyToManyField(User, related_name='email_recived')
    subject =  models.CharField(max_length=255)
    body = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    archived = models.BooleanField(default=False)

    def __str__(self):
        return f"Email from {self.sender.email} to {', '.join([recipient.email for recipient in self.recipients.all()])} - Subject: {self.subject}"
