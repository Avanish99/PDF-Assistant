from pydantic import BaseModel, Field


class DocumentResponse(BaseModel):
    document_id: str
    filename: str
    status: str = "ready"


class SummaryRequest(BaseModel):
    document_id: str = Field(min_length=1)


class QuestionRequest(BaseModel):
    document_id: str = Field(min_length=1)
    question: str = Field(min_length=1, max_length=4000)


class AnswerResponse(BaseModel):
    answer: str


class HealthResponse(BaseModel):
    status: str
    model: str
