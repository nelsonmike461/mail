from django.contrib import admin
from .models import Email, User

class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_staff', 'is_active')
    search_fields = ('email',)




admin.site.register(User, UserAdmin)
admin.site.register(Email)
