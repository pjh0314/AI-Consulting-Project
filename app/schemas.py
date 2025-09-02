from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional, List
from datetime import date

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str | None

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str


# Fitness Categories -----------------------------------------------------------------

class ChecklistItem(BaseModel):
    label: str
    targetValue: Optional[float | str] = None
    unit: Optional[str] = None
    done: bool = False

class PlanBlock(BaseModel):
    title: str
    category: Literal["workout", "nutrition", "habit", "recovery"]
    duration_min: int = Field(ge=1)
    details: Optional[str] = None
    checklist: List[ChecklistItem] = []

class DayPlan(BaseModel):
    date: date
    blocks: List[PlanBlock]

class WeekOverview(BaseModel):
    week_number: int
    theme: str
    notes: str

class PlanResponse(BaseModel):
    weekly_overview: List[WeekOverview]
    days: List[DayPlan]
    personalization_rationale: str

# User input to the endpoint
class PlanRequest(BaseModel):
    goalType: str
    experience: str
    hoursPerWeek: int
    constraints: str = ""
    preferences: str = ""
    dietEffort: str = ""
    startDate: date

# ------------------------------------------------------------------------------------