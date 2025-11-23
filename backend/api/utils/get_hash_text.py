import hashlib

import pymupdf

### function to extract the text content of the pdf so we can check it###
def extract_text_from_file(file):
    try:
        doc = pymupdf.open(stream=file.read(), filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text() + "\n"
        return text.strip()
    except:
        return None


def hash_text(text):
    ### hashing the text using hashlib library
    return hashlib.sha256(text.encode('utf-8')).hexdigest()