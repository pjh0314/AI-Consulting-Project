from fastapi import FastAPI
import os
from dotenv import load_dotenv
from openai import OpenAI

# **** OpenAI Testing Step 1: Edit this from prompt -> from fitness_scheme.py ****
from prompt import PlanResponse

# OpenAI API key check
load_dotenv()
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-5-nano")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# **** OpenAI Testing Step 2: Edit this SYSTEM_MSG (this engineers the model system) ****
SYSTEM_MSG = (
    "You are CoachGPT, a careful and pragmatic planning assistant. "
    "Return STRICT JSON only, no extra text. "
    "Safety rules: no medical advice or supplements. "
    "Respect time budgets and include recovery and nutrition checklists."
)

# Pydantic Structured Input only
response = client.responses.parse(
    model=OPENAI_MODEL,
    input=[
        {
            "role": "system", 
            "content": SYSTEM_MSG
        },
        {
            "role": "user",
            "content": "Beginner hypertrophy & weight gain; new to working out; 8 hours of workout per week; help me plan my workout schedule"
        }
    ],
    # **** OpenAI Testing Step 3: Edit this Structured Output format ****
    text_format=PlanResponse,
)

print(response.output_parsed)


