from typing import List, Optional
from pydantic import BaseModel
from pydantic_ai.models.groq import GroqModel
from pydantic_ai import Agent
import asyncio
import nest_asyncio

# Enable nested event loops
nest_asyncio.apply()

class Activity(BaseModel):
    time: str
    name: str
    location: str
    until: Optional[str] = None

class DaySchedule(BaseModel):
    date: str
    activities: List[Activity]

class TravelPlan(BaseModel):
    title: str
    duration: str
    schedule: List[DaySchedule]

def run_async(coro):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()

def get_itinerary(query: str) -> dict:
    try:
        # Initialize the Groq model and agent
        model = GroqModel(
            'deepseek-r1-distill-llama-70b',
            api_key=''
        )

        agent = Agent(
            model=model,
            system_prompt='''You are an AI assistant which plans a user's detailed itinerary based on their idea of a perfect trip. 
            The itinerary should cover each detail, use until to specify the end time of an activity.
            ''',
            result_type=TravelPlan,
        )
        
        # Run the async operation in a new event loop
        result = run_async(agent.run(query))
        print(result.data.dict())
        return result.data.dict()
    
    except Exception as e:
        return {'error': str(e)}


