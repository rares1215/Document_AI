from django.contrib import admin
from .models import CustomUser,Resume,ResumeAnalysis

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(ResumeAnalysis)
admin.site.register(Resume)
