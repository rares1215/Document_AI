from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

# Create your models here.


class CustomUser(AbstractUser):
    pass



#### Created the resume model to store in our database when we upload the pdf ###
class Resume(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    doc_file = models.FileField(upload_to='resumes/')
    text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Resume {self.id}"



#### a separate entity for hte Resume called ResumeAnalysis that is focused more on the llm proccessing and response(it s OneToOne relationship but we are spliting it in two diffrent models to be more flexible) 
class ResumeAnalysis(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    resume = models.OneToOneField(Resume, on_delete=models.CASCADE, related_name='analysis')
    skills = models.JSONField(default=dict)
    experience_summary = models.TextField(blank=True)
    match_score = models.PositiveIntegerField(default=0)
    suggestions = models.TextField(blank=True)
    raw_llm_res = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Resume {self.id}"