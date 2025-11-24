import json
from decouple import config
from groq import Groq


### api Configuration for groq, api_key from .env file 
client = Groq(
    api_key=config('GROCK_API_KEY'),
)



### a prompt template that we will pass to the llm model
prompt_template = """
You are an expert CV analyst and technical recruiter with over 15 years of experience evaluating resumes for software engineering roles.

Your task is to analyze the CV content provided below and return STRICT, VALID JSON.  
Your output MUST NOT contain explanations, markdown, code blocks, or any text outside the JSON.

A real CV typically contains: skills, experience, education, projects, contact information, dates, job titles, technologies, achievements.

IF the text does NOT resemble a CV (for example: it is an essay, random text, a story, blank content, corrupted extraction, or anything that clearly is not a resume):
    - Return a JSON object in the format below, where:
        "skills" is an empty list
        "experience_summary" is an empty string
        "match_score" is 0
        "suggestions" includes a SINGLE clear message explaining that the document is not a valid resume

Example for NON-CV input:
{{
  "skills": [],
  "experience_summary": "",
  "match_score": 0,
  "suggestions": [
      "The uploaded file does not appear to be a valid resume. Please upload a CV that includes sections such as skills, work experience, education, and projects."
  ]
}}


IF the text *does resemble a real CV*, continue normally and extract:
Follow these rules carefully:

1️ **Skills Extraction**
- Extract ONLY concrete technical skills mentioned in the CV.  
- Do NOT include vague ability words like “communication”, “leadership”, “teamwork”, unless explicitly listed as skills.  
- Normalize skills (e.g., “Javascript”, “JS”, “javascript” → “JavaScript”).  
- Include frameworks, languages, tools, technologies, and libraries.

2️ **Experience Summary**
- Write a 4–6 sentence professional summary of the candidate’s experience.  
- The summary must be based ONLY on the CV content.  
- Do NOT invent experience that is not mentioned.  
- Use a formal, recruiter-style tone.

3️ **Match Score (0–100)**
Give a realistic score representing the candidate’s overall strength as a software engineer or technical professional.  
Use this scoring logic:
- 0–20 → no relevant experience, missing skills  
- 21–40 → weak technical background or mostly academic  
- 41–60 → junior-level, some projects or internships  
- 61–80 → mid-level, solid skills, real experience or strong projects  
- 81–100 → senior-level, strong experience, advanced stack

4️ **Suggestions**
Generate 4–5 highly actionable, specific, and detailed suggestions on how to improve the CV.  
Each suggestion must be a full sentence.  
Avoid generic tips like “improve formatting”.  
Examples of good suggestions:
- “Add measurable impact to project descriptions (e.g., performance improvements, user metrics).”
- “Include a dedicated section for technical projects with bullet points describing your contributions.”

5️ **Output Format (STRICT JSON ONLY)**

Return ONLY:

{{
  "skills": [],
  "experience_summary": "",
  "match_score": 0,
  "suggestions": []
}}

NO other text.  
NO markdown.  
NO comments.  
NO explanations.

--------------------------------------

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