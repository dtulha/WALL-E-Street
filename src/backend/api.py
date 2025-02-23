import sys
from pathlib import Path
import logging
import traceback
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add the src directory to Python path
src_path = str(Path(__file__).parent.parent)
if src_path not in sys.path:
    sys.path.append(src_path)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from main import run_hedge_fund

app = FastAPI()

# Get allowed origins from environment or use default
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",  # In case 3000 is taken
    os.getenv("VERCEL_URL", ""),  # Vercel deployment URL
]
if vercel_url := os.getenv("NEXT_PUBLIC_URL"):
    allowed_origins.append(f"https://{vercel_url}")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PortfolioPosition(BaseModel):
    long: int = 0
    short: int = 0
    long_cost_basis: float = 0.0
    short_cost_basis: float = 0.0

class RealizedGains(BaseModel):
    long: float = 0.0
    short: float = 0.0

class Portfolio(BaseModel):
    cash: float
    margin_requirement: float
    positions: Dict[str, PortfolioPosition]
    realized_gains: Dict[str, RealizedGains]

class HedgeFundRequest(BaseModel):
    tickers: List[str]
    selected_analysts: List[str] = []
    model_name: str = "gpt-4-turbo"
    model_provider: str = "OpenAI"

@app.post("/api/analyze")
async def analyze_stocks(request: HedgeFundRequest):
    try:
        logger.info(f"Received analysis request for tickers: {request.tickers}")
        
        # Set default dates (last 3 months)
        end_date = datetime.now().strftime("%Y-%m-%d")
        start_date = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")
        
        logger.info(f"Analysis period: {start_date} to {end_date}")

        # Initialize portfolio with default values
        portfolio = {
            "cash": 100000.0,  # Default initial cash
            "margin_requirement": 0.0,
            "positions": {
                ticker: {
                    "long": 0,
                    "short": 0,
                    "long_cost_basis": 0.0,
                    "short_cost_basis": 0.0,
                } for ticker in request.tickers
            },
            "realized_gains": {
                ticker: {
                    "long": 0.0,
                    "short": 0.0,
                } for ticker in request.tickers
            }
        }

        logger.info("Initialized portfolio structure")
        logger.info(f"Selected analysts: {request.selected_analysts}")
        logger.info(f"Using model: {request.model_name} from {request.model_provider}")

        # Run hedge fund analysis
        try:
            result = run_hedge_fund(
                tickers=request.tickers,
                start_date=start_date,
                end_date=end_date,
                portfolio=portfolio,
                show_reasoning=True,  # Always show reasoning
                selected_analysts=request.selected_analysts,
                model_name=request.model_name,
                model_provider=request.model_provider,
            )
            logger.info("Analysis completed successfully")
            return result

        except Exception as e:
            logger.error(f"Error in run_hedge_fund: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            raise HTTPException(
                status_code=500,
                detail={
                    "message": "Error running analysis",
                    "error": str(e),
                    "traceback": traceback.format_exc()
                }
            )

    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail={
                "message": "An unexpected error occurred",
                "error": str(e),
                "traceback": traceback.format_exc()
            }
        )

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"} 