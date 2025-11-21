from django.dispatch import receiver
from django.db.models.signals import post_save

from .models import Resume,ResumeAnalysis
from .services.extract_pdf import extract_text_from_pdf
from .services.llm_analyzer import analyze_resume_with_llm


### made a reciver signal to create a resume_analysis when a resume si uploaded
@receiver(post_save,sender=Resume)
def generate_resume_analysis(sender,instance,created,**kwargs):
    if not created:
        return

    ### extract the text from the pdf
    text = extract_text_from_pdf(instance.file.path)
    instance.text = text
    Resume.objects.filter(id=instance.id).update(text=text)


    ### analyze it with our function
    ai_data = analyze_resume_with_llm(text)


    ### create the analysis ###
    ResumeAnalysis.objects.create(
        resume=instance,
        skills=ai_data.get("skills", []),
        experience_summary=ai_data.get("experience_summary", ""),
        match_score=ai_data.get("match_score", 0),
        suggestions=ai_data.get("suggestions", ""),
        raw_llm_response=ai_data,
    )