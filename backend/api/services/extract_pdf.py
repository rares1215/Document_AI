import pymupdf

### function to extract the text content of the pdf so we can analyze it
def extract_text_from_pdf(filepath):
    ## open the doc and created a text output
    doc = pymupdf.open(filepath)
    text = ''
    ## itterate over the document pages and add the content to the text output along with spaces between them
    for page in doc:
        text += page.get_text()
        text += '\n'
    return text.strip()