from django.core.cache import cache


#### function to retrive de resume_analysis from cache if it exists in there ###

def get_cached_analysis(resume_id):
    #### set the key to the hash_text value
    key = f"resume analysis:{resume_id}"
    return cache.get(key)



###### function to set the analysis inside the cache for 24 hours #####
 ## 60 second * 60 minutes * 24(1 day)
def set_analysis_in_cache(resume_id:str,data:dict, expire_time = 60 * 60 * 24):
    #### set the key to the hash_text value
    key = f"resume analysis:{resume_id}"
    cache.set(key,data,timeout=expire_time)