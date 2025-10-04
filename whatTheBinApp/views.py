from django.shortcuts import render
from django.http import HttpResponseBadRequest, JsonResponse
from google import genai
from google.genai import types
import json
from pydantic import BaseModel

class Format(BaseModel):
    isRecyclable: bool
    isCompostable: bool
    isLandfill: bool
    description: str

def home(request):
    return render(request, "whatTheBinApp/home.html")

def api(request):
    if request.method != "POST":
        return HttpResponseBadRequest("Bad request")
    
    image = json.loads(request.body).get('image')
    if not image:
        return HttpResponseBadRequest("No Image Provided")
    image = image[len("data:image/png;base64,"):]

    client = genai.Client()
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[
        types.Part.from_bytes(
            data=image,
            mime_type='image/png',
        ),
        '''The User will be holding something towards the camera. 
        Please identify if it is compostable/recyclable/landfill. If not accepted in standard bins, it is landfill.
        Remember recylable items stained with food contents/liquids are either landfill or compost, and other exceptions.
        If there is a way to maximize the amount composted or recycled, tell the user in the description. If there is nothing else
        the user need to do to maxime the amount that is recyclable or compostable, then the description can simply state "this is a <item>.
        If the user does not seem to be holding anything, then return all false, and "Could Not Identify Item" for the desicription.'''
        ],
        config={
            "response_mime_type": "application/json",
            "response_schema": Format,
        }

    )
    print(response.text)
    return JsonResponse(json.loads(response.text))
    
    