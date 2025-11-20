import json
from decouple import config
from groq import Groq


### api Configuration for groq, api_key from .env file 
client = Groq(
    api_key=config('GROCK_API_KEY'),
)



### a prompt template that we will pass to the llm model
prompt_template = """
You are an expert technical recruiter and CV analyst.

Analyze the following CV content and return STRICT JSON with the fields below.
Be detailed, specific, and accurate.

Return ONLY this JSON structure:

{{
  "skills": ["list", "of", "skills"],
  "experience_summary": "A concise summary (4 to 6 sentences) describing the candidate’s experience.",
  "match_score": The Score should be a real score from 0-100 based on the experience and skills the canditate poseses
  "suggestions": "Actionable recommendations on how to improve the CV. Write 3–5 bullet points."
}}

Now analyze the CV:

CV CONTENT:
{}
"""


#### function to analyze the text in a pdf file using an llm model from groq
def analyze_resume_with_llm(text):
    ### prompt variabile
    prompt = prompt_template.format(text)

    ### the response we get from the llm and the parametrs we pass to tell the llm what we expect from him
    response = client.chat.completions.create(
        messages=[
            {
                "role":"user",
                "content":prompt
            }
        ],
        temperature=0,## for json file
        model="llama-3.1-8b-instant", ### the llm model we chosed
    )

    content = response.choices[0].message.content ### we are returning only the acutal content from the llm response

    try:
        data = json.loads(content)
        #### fallback just in case the llm sends us a wrong json format
    except json.JSONDecodeError:
        data = {
            "skills": [],
            "experience_summary": "",
            "match_score": 0,
            "suggestions": content,
            "raw_error": "Invalid JSON returned by model"
        }

    # returning the actual data we get from the llm response in json format
    return data