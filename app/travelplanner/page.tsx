'use client'
import { useState } from "react";
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
import { Plus, Trash2, Clock, MapPin, Bot, Calendar } from "lucide-react";
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
import { Card } from "@/components/ui/card";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

function Board({ board, onDeleteBoard }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: board.date, // Using date as ID since it's unique
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="p-6 rounded-xl backdrop-blur-lg bg-white/90 hover:bg-white/95 transition-all duration-300 shadow-lg hover:shadow-xl border-t-4 h-full"
      style={{
        ...style,
        borderTopColor: board.backgroundColor,
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800">{board.date}</h3>
        </div>
        <button
          onClick={() => onDeleteBoard(board.date)}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-3">
        {board.activities.map((activity, index) => (
          <AccordionItem
            key={`${board.date}-${index}`}
            value={`${board.date}-${index}`}
            className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline group">
              <div className="flex flex-col w-full gap-2">
                <div className="flex justify-between items-center w-full">
                  <span className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors text-left">
                    {activity.name}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full shrink-0">
                    <Clock size={14} />
                    {activity.time}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 bg-gray-50/50">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin size={16} className="text-blue-500 shrink-0" />
                  <span>{activity.location}</span>
                </div>
                {activity.until && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock size={16} className="text-blue-500 shrink-0" />
                    <span>Until: {activity.until}</span>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}

function SearchInput({ onSearch, isLoading }) {
  const [inputValue, setInputValue] = useState("");
  const placeholders = [
    "Plan a 3-day trip to Paris",
    "Weekend getaway in New York",
    "5-day adventure in Tokyo",
    "Cultural tour of Rome",
    "Beach vacation in Bali",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSearch(inputValue);
    setInputValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center h-full gap-2 p-4">
      <div className="flex-1">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !inputValue.trim()}
        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-yellow-300 disabled:cursor-not-allowed transition-colors"

      >
        {isLoading ? "Generating..." : "Generate Itinerary"}
      </button>
    </form>
  );
}

export default function Page() {
  const [itineraryData, setItineraryData] = useState({
    trip_description: {
      title: "Your Travel Itinerary",
      schedule: []
    }
  });
  
  const [boards, setBoards] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleSearch = async (query) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5328/api/tripplan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setItineraryData(data);
      
      // Update boards based on new itinerary data
      const newBoards = data.trip_description.schedule.map((day) => ({
        date: day.date,
        activities: day.activities,
        backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
      }));
      setBoards(newBoards);
      setShowInput(false);
    } catch (error) {
      console.error('Error fetching itinerary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBoard = (boardDate) => {
    setBoards((prevBoards) => prevBoards.filter((board) => board.date !== boardDate));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setBoards((boards) => {
        const oldIndex = boards.findIndex((board) => board.date === active.id);
        const newIndex = boards.findIndex((board) => board.date === over.id);

        const newBoards = [...boards];
        const [removed] = newBoards.splice(oldIndex, 1);
        newBoards.splice(newIndex, 0, removed);

        return newBoards;
      });
    }
  };

  return (
    <SidebarProvider>
    <AppSidebar />
    <SidebarInset>

    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-indigo-50">
      <header className="flex h-20 shrink-0 items-center gap-4 border-b bg-white/80 backdrop-blur-sm px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Bot size={24} className="text-yellow-600" />
            <h1 className="text-2xl font-semibold text-gray-800">
              AI Travel Companion
            </h1>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-yellow-600">
                  {itineraryData.trip_description.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="max-w-[1600px] mx-auto py-8">
          <div className="mb-8 px-6">
            <div className="bg-yellow-600 text-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-medium mb-2">Welcome to Your AI-Powered Travel Planner</h2>
              <p className="text-blue-100">
                Enter your travel preferences to generate a personalized itinerary. Drag and drop days to reorder your schedule.
              </p>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={boards.map((board) => board.date)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
                {boards.map((board) => (
                  <Board
                    key={board.date}
                    board={board}
                    onDeleteBoard={handleDeleteBoard}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          
          <button
            onClick={() => setShowInput((prev) => !prev)}
            className="fixed bottom-20 right-4 bg-yellow-950 text-white p-4 rounded-full hover:bg-green-600 transition-colors shadow-lg"
          >
            <Plus size={18} />
          </button>

          {showInput && (
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md">
              <SearchInput onSearch={handleSearch} isLoading={isLoading} />
            </div>
          )}
        </div>
      </main>
    </div>
    </SidebarInset>
    </SidebarProvider>
  );
}