from django.dispatch import receiver
from django.db.models.signals import post_save,post_delete

from .models import Resume,ResumeAnalysis
from .services.extract_pdf import extract_text_from_pdf
from .services.llm_analyzer import analyze_resume_with_llm
from django.core.cache import cache
import os


### made a reciver signal to create a resume_analysis when a resume si uploaded
@receiver(post_save,sender=Resume)
def generate_resume_analysis(sender,instance,created,**kwargs):
    if not created:
        return

    ### extract the text from the pdf
    text = extract_text_from_pdf(instance.doc_file.path)
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
        raw_llm_res=ai_data,
    )




##### Reiver to delete cached analysis from cache if we delete a resume/analysis ####
@receiver(post_delete,sender = ResumeAnalysis)
def delete_cache_analysis(sender,instance,**kwargs):
    try:
        ### we get the id of the current analysis using instance
        cache_key = f"resume analysis:{instance.id}"
        #### Deleteing the current analysis
        cache.delete(cache_key)
        print(f"Deleted analysis{instance.id} from cache!")

    ### Error in case if something goes wrong
    except Exception as e:
        print(f"Could not delete analysis from cache. {e}")

####### Reciver to delete the file from media when we delete it from the db
@receiver(post_delete,sender=Resume)
def delete_file_from_media(sender,instance,**kwargs):
    if instance.doc_file and hasattr(instance.doc_file, 'path'):
        try:
            file_path = instance.doc_file.path
            if os.path.isfile(file_path):
                print(f"Removed file{file_path} from media!")
                os.remove(file_path)
        except Exception as e:
            print(f"Could not delete the resume {e}")