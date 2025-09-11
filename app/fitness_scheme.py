from pydantic import BaseModel, Field
from typing import Literal, Optional, List
from datetime import date

# Prompt ------------------------------------------

class Physique(BaseModel):
    height: int
    weight: int
    biologicalGender: Literal["Male", "Female"]
    age: int
    notes: str

class FitnessPrompt(BaseModel):
    physique: Physique
    startDate: date
    endDate: date
    experienceLevel: str
    purpose: str
    notes: str

# Response ----------------------------------------

class ChecklistItem(BaseModel):
    label: str
    targetValue: Optional[float | str] = None
    unit: Optional[str] = None
    done: bool = False

class DailyPlanBlock(BaseModel):
    title: str
    category: Literal["workout", "nutrition", "habit", "recovery"]
    duration_min: int = Field(ge=1)
    details: Optional[str] = None
    checklist: List[ChecklistItem] = []

class WeeklyPlanBlock(BaseModel):
    title: str
    category: Literal["workout", "nutrition", "habit", "recovery"]
    duration_min: int = Field(ge=1)
    details: Optional[str] = None
    checklist: List[ChecklistItem] = []

class Daily(BaseModel):
    date: date
    blocks: List[DailyPlanBlock]

class Weekly(BaseModel):
    date: date
    blocks: List[WeeklyPlanBlock]

class FitnessResponse(BaseModel):
    days: List[Daily]
    days: List[Weekly]
