from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sys
import os

# Add the ai-hedge-fund directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '../../ai-hedge-fund'))

from src.agents.ben_graham import ben_graham_agent
from src.agents.bill_ackman import bill_ackman_agent
from src.agents.warren_buffett import warren_buffett_agent
from src.agents.fundamentals import fundamentals_agent
from src.agents.technicals import technical_analyst_agent
from src.agents.sentiment import sentiment_agent
from src.agents.valuation import valuation_agent
from src.graph.state import AgentState
from langchain_core.messages import HumanMessage

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    ticker: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None

@app.post("/api/analyze/graham")
async def analyze_graham(request: AnalysisRequest):
    try:
        state = AgentState(
            messages=[HumanMessage(content="Make trading decisions based on the provided data.")],
            data={
                "tickers": [request.ticker],
                "portfolio": {},
                "start_date": request.start_date,
                "end_date": request.end_date,
                "analyst_signals": {},
            },
            metadata={"show_reasoning": True}
        )
        result = ben_graham_agent(state)
        return {"result": result.messages[-1].content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze/buffett")
async def analyze_buffett(request: AnalysisRequest):
    try:
        state = AgentState(
            messages=[HumanMessage(content="Make trading decisions based on the provided data.")],
            data={
                "tickers": [request.ticker],
                "portfolio": {},
                "start_date": request.start_date,
                "end_date": request.end_date,
                "analyst_signals": {},
            },
            metadata={"show_reasoning": True}
        )
        result = warren_buffett_agent(state)
        return {"result": result.messages[-1].content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze/ackman")
async def analyze_ackman(request: AnalysisRequest):
    try:
        state = AgentState(
            messages=[HumanMessage(content="Make trading decisions based on the provided data.")],
            data={
                "tickers": [request.ticker],
                "portfolio": {},
                "start_date": request.start_date,
                "end_date": request.end_date,
                "analyst_signals": {},
            },
            metadata={"show_reasoning": True}
        )
        result = bill_ackman_agent(state)
        return {"result": result.messages[-1].content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze/fundamentals")
async def analyze_fundamentals(request: AnalysisRequest):
    try:
        state = AgentState(
            messages=[HumanMessage(content="Make trading decisions based on the provided data.")],
            data={
                "tickers": [request.ticker],
                "portfolio": {},
                "start_date": request.start_date,
                "end_date": request.end_date,
                "analyst_signals": {},
            },
            metadata={"show_reasoning": True}
        )
        result = fundamentals_agent(state)
        return {"result": result.messages[-1].content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze/technicals")
async def analyze_technicals(request: AnalysisRequest):
    try:
        state = AgentState(
            messages=[HumanMessage(content="Make trading decisions based on the provided data.")],
            data={
                "tickers": [request.ticker],
                "portfolio": {},
                "start_date": request.start_date,
                "end_date": request.end_date,
                "analyst_signals": {},
            },
            metadata={"show_reasoning": True}
        )
        result = technical_analyst_agent(state)
        return {"result": result.messages[-1].content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze/sentiment")
async def analyze_sentiment(request: AnalysisRequest):
    try:
        state = AgentState(
            messages=[HumanMessage(content="Make trading decisions based on the provided data.")],
            data={
                "tickers": [request.ticker],
                "portfolio": {},
                "start_date": request.start_date,
                "end_date": request.end_date,
                "analyst_signals": {},
            },
            metadata={"show_reasoning": True}
        )
        result = sentiment_agent(state)
        return {"result": result.messages[-1].content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze/valuation")
async def analyze_valuation(request: AnalysisRequest):
    try:
        state = AgentState(
            messages=[HumanMessage(content="Make trading decisions based on the provided data.")],
            data={
                "tickers": [request.ticker],
                "portfolio": {},
                "start_date": request.start_date,
                "end_date": request.end_date,
                "analyst_signals": {},
            },
            metadata={"show_reasoning": True}
        )
        result = valuation_agent(state)
        return {"result": result.messages[-1].content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 