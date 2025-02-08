"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Plus, Trash2, Clock, MapPin } from "lucide-react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// Itinerary Data
const itineraryData = {
    "title": "4-Day Bangalore Itinerary",
    "duration": "4 days",
    "schedule": [
      {
        "id": "day-1",
        "date": "3rd January",
        "activities": [
          {
            "id": "1-1",
            "time": "8:00 AM",
            "name": "Arrival and Breakfast at MTR",
            "location": "Lalbagh Road, Bangalore",
            "until": "9:30 AM",
            "description": "Start your day with a traditional South Indian breakfast at the iconic MTR restaurant. Try their famous masala dosa, idli, and filter coffee.",
            "cost": "₹300 per person",
            "tips": "Arrive early to avoid long queues"
          },
          {
            "id": "1-2",
            "time": "10:00 AM",
            "name": "Visit Lalbagh Botanical Garden",
            "location": "Lalbagh, Bangalore",
            "until": "12:30 PM",
            "description": "Explore one of India's largest botanical gardens, featuring rare plants, a glass house, and a historic tower. Don't miss the famous rock formation dating back to 3000 million years.",
            "cost": "₹100 entry fee",
            "tips": "Best to visit early morning for photography"
          },
          {
            "id": "1-3",
            "time": "1:00 PM",
            "name": "Lunch at Vidyarthi Bhavan",
            "location": "Gandhi Bazaar, Basavanagudi",
            "until": "2:30 PM",
            "description": "Experience authentic Karnataka cuisine at this historic restaurant known for its butter masala dosa and coffee.",
            "cost": "₹250 per person",
            "tips": "Cash only; weekends are very crowded"
          },
          {
            "id": "1-4",
            "time": "3:00 PM",
            "name": "Visit Bull Temple",
            "location": "Bull Temple Road, Basavanagudi",
            "until": "4:30 PM",
            "description": "Explore the historic 16th-century temple featuring a massive monolithic bull statue.",
            "cost": "Free entry",
            "tips": "Remove shoes before entering; dress modestly"
          },
          {
            "id": "1-5",
            "time": "5:00 PM",
            "name": "Shopping at Commercial Street",
            "location": "Commercial Street, Bangalore",
            "until": "8:00 PM",
            "description": "Shop at Bangalore's famous shopping district for clothes, accessories, and souvenirs.",
            "cost": "Variable",
            "tips": "Practice bargaining; watch for pickpockets"
          }
        ]
      },
      {
        "id": "day-2",
        "date": "4th January",
        "activities": [
          {
            "id": "2-1",
            "time": "7:00 AM",
            "name": "Drive to Nandi Hills",
            "location": "Nandi Hills",
            "until": "8:30 AM",
            "description": "Early morning drive to the historic Nandi Hills for sunrise viewing.",
            "cost": "₹500 for taxi",
            "tips": "Carry warm clothes; roads are winding"
          },
          {
            "id": "2-2",
            "time": "8:30 AM",
            "name": "Sunrise and Breakfast at Nandi Hills",
            "location": "Nandi Hills Summit",
            "until": "10:30 AM",
            "description": "Watch the sunrise and enjoy packed breakfast with panoramic views.",
            "cost": "₹20 entry fee",
            "tips": "Carry your own food and water"
          },
          {
            "id": "2-3",
            "time": "11:00 AM",
            "name": "Visit Tipu's Drop",
            "location": "Nandi Hills",
            "until": "12:00 PM",
            "description": "Visit the historic cliff point and learn about its significance during Tipu Sultan's reign.",
            "cost": "Included in entry fee",
            "tips": "Stay behind safety barriers"
          },
          {
            "id": "2-4",
            "time": "2:00 PM",
            "name": "Lunch at Maiyas",
            "location": "Jayanagar, Bangalore",
            "until": "3:30 PM",
            "description": "Return to city and enjoy authentic South Indian thali.",
            "cost": "₹400 per person",
            "tips": "Try their special desserts"
          },
          {
            "id": "2-5",
            "time": "4:00 PM",
            "name": "Visit ISKCON Temple",
            "location": "Rajajinagar, Bangalore",
            "until": "6:30 PM",
            "description": "Experience the spiritual atmosphere and architecture of this modern temple complex.",
            "cost": "Free entry",
            "tips": "Evening aarti at 6:00 PM is spectacular"
          }
        ]
      },
      {
        "id": "day-3",
        "date": "5th January",
        "activities": [
          {
            "id": "3-1",
            "time": "9:00 AM",
            "name": "Visit Bangalore Palace",
            "location": "Palace Road",
            "until": "11:30 AM",
            "description": "Explore the Tudor-style architecture and royal artifacts in this historic palace.",
            "cost": "₹450 entry fee",
            "tips": "Audio guide available for ₹100"
          },
          {
            "id": "3-2",
            "time": "12:00 PM",
            "name": "Lunch at Church Street Social",
            "location": "Church Street",
            "until": "1:30 PM",
            "description": "Modern fusion cuisine in Bangalore's hip café district.",
            "cost": "₹800 per person",
            "tips": "Try their signature cocktails"
          },
          {
            "id": "3-3",
            "time": "2:00 PM",
            "name": "Cubbon Park Visit",
            "location": "Central Bangalore",
            "until": "4:00 PM",
            "description": "Explore Bangalore's central park with historic buildings and green spaces.",
            "cost": "Free entry",
            "tips": "Great for photography"
          },
          {
            "id": "3-4",
            "time": "4:30 PM",
            "name": "Visit National Gallery of Modern Art",
            "location": "Palace Road",
            "until": "6:30 PM",
            "description": "Explore Indian modern art in a colonial mansion setting.",
            "cost": "₹150 entry fee",
            "tips": "Last entry at 5:30 PM"
          }
        ]
      },
      {
        "id": "day-4",
        "date": "6th January",
        "activities": [
          {
            "id": "4-1",
            "time": "9:00 AM",
            "name": "Visit HAL Aerospace Museum",
            "location": "HAL Airport Road",
            "until": "11:30 AM",
            "description": "India's first aerospace museum with aircraft displays and flight simulators.",
            "cost": "₹200 entry fee",
            "tips": "Simulator rides extra cost"
          },
          {
            "id": "4-2",
            "time": "12:00 PM",
            "name": "Lunch at Koshy's",
            "location": "St. Marks Road",
            "until": "1:30 PM",
            "description": "Historic café known for its Anglo-Indian cuisine.",
            "cost": "₹500 per person",
            "tips": "Try their fish and chips"
          },
          {
            "id": "4-3",
            "time": "2:00 PM",
            "name": "Shopping at UB City",
            "location": "Vittal Mallya Road",
            "until": "4:00 PM",
            "description": "Luxury shopping at Bangalore's premier mall.",
            "cost": "Variable",
            "tips": "High-end retail stores"
          },
          {
            "id": "4-4",
            "time": "4:30 PM",
            "name": "Sunset at Ulsoor Lake",
            "location": "Ulsoor",
            "until": "6:00 PM",
            "description": "Relaxing evening by the historic lake.",
            "cost": "Free",
            "tips": "Good for evening walks"
          },
          {
            "id": "4-5",
            "time": "7:00 PM",
            "name": "Farewell Dinner at 13th Floor",
            "location": "MG Road",
            "until": "9:00 PM",
            "description": "Rooftop dining with panoramic city views.",
            "cost": "₹2000 per person",
            "tips": "Reservation recommended"
          }
        ]
      }
    ]
  };

// Board Component
function Board({ board, onDeleteBoard }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: board.id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    background: board.backgroundColor,
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="p-4 rounded-xl shadow-lg w-96 min-h-[12rem] backdrop-blur-sm"
      style={style}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">{board.date}</h3>
        <button
          onClick={() => onDeleteBoard(board.id)}
          className="p-1 text-gray-600 hover:text-gray-700"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {board.activities.map((activity, index) => (
          <AccordionItem
            key={activity.id}
            value={`item-${activity.id}`}
            className="border rounded-md bg-white/50 mb-2"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex justify-between items-center w-full">
                <span className="font-medium text-gray-700">
                  {activity.name}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock size={14} />
                  {activity.time}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={14} />
                  <span>{activity.location}</span>
                </div>
                {activity.until && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={14} />
                    <span>Until: {activity.until}</span>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

// Main Page Component
export default function Page() {
  const [boards, setBoards] = useState(() => {
    // Initialize with the schedule data
    return itineraryData.schedule.map((day) => ({
      id: day.id,
      date: day.date,
      activities: day.activities,
      backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      }, 0.2)`,
    }));
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDeleteBoard = (boardId) => {
    setBoards((prevBoards) => prevBoards.filter((board) => board.id !== boardId));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setBoards((boards) => {
        const oldIndex = boards.findIndex((board) => board.id === active.id);
        const newIndex = boards.findIndex((board) => board.id === over.id);

        const newBoards = [...boards];
        const [removed] = newBoards.splice(oldIndex, 1);
        newBoards.splice(newIndex, 0, removed);

        return newBoards;
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <div className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>{itineraryData.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <main className="flex-1 overflow-auto p-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={boards.map((board) => board.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex gap-6 overflow-x-auto p-4">
                  {boards.map((board) => (
                    <Board
                      key={board.id}
                      board={board}
                      onDeleteBoard={handleDeleteBoard}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}