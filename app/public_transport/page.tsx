"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Train, 
  Bus, 
  Clock, 
  Calendar, 
  Info, 
  Leaf, 
  TreePine,
  Timer,
  DollarSign,
  Bike,
  Gift,
  Upload,
  Medal
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
 
const getCarbonFootprint = (mode: string, duration: string) => {
  const hours = parseFloat(duration.split('h')[0]) || 
                parseFloat(duration.split('hr')[0]) || 0;
  const emissions = mode === "Train" ? 4.5 : 15.8;
  return (hours * emissions).toFixed(1);
};

const getEcoScore = (mode: string) => {
  return mode === "Train" ? 95 : 75;
};

interface Route {
  vehicle: string;
  number?: string;
  company?: string;
  destination?: string;
}

interface TravelOption {
  option: string;
  duration: string;
  departure_time: string;
  arrival_time: string;
  mode: string;
  route: Route[];
}

interface ApiResponseData {
  travel_options: TravelOption[];
  destination: {
    name: string;
    city: string;
  };
}

interface ApiResponse {
  data: string; // The API returns a stringified JSON
}

export default function TransportSearch() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("Mumbai");
  const [showEcoTip, setShowEcoTip] = useState(true);
  const [selectedTransportMode, setSelectedTransportMode] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [routeOptions, setRouteOptions] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setIsUploading(true);
  //     setTimeout(() => {
  //       setIsUploading(false);
  //       setShowReward(true);
  //     }, 1500);
  //   }
  // };

  const handleSearchRoutes = async () => {
    if (!source || !destination) {
      setError("Please enter both source and destination.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&travelmode=transit`;

  
    try {
      const response = await fetch("http://127.0.0.1:5328/api/searchroutes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: googleMapsUrl }),
      });

      const responseData: ApiResponse = await response.json();
      console.log(responseData);
      // Parse the stringified JSON in the data property
      const parsedData: ApiResponseData = JSON.parse(responseData.data);
      console.log(parsedData);

      if (response.ok) {
        setRouteOptions(parsedData);
      } else {
        setError("Failed to fetch routes. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while fetching routes.");
      console.error("Error sending request:", error);
    } finally {
      setIsLoading(false);
    }
  };




  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      console.error('No file selected!');
      return;
    }
  
    const formData = new FormData();
    formData.append('ticket', file);  // Correctly appending the file to the form data
  
    try {
      const response = await fetch('http://127.0.0.1:5328/api/satva', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      console.log(result.isTicket);
      if (response.ok) {
        if (result.isTicket === 1) {
          // If response is 1, set showReward to true
          setShowReward(true);
        } else if (result.isTicket === 0) {
          // If response is 0, display invalid ticket message
          setErrorMessage("Invalid ticket uploaded");
        } else {
          console.log("Base64 encoded ticket:", result.base64_ticket);
        }
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };
  
  
  return (
    <SidebarProvider>
          <AppSidebar />
          <SidebarInset>


    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-4">Public Transport Search</h1>
        <p className="text-center text-gray-600 mb-8">Choose eco-friendly travel options for a sustainable future</p>

        {showEcoTip && (
          <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-8 rounded-r-lg relative">
            <button 
              onClick={() => setShowEcoTip(false)}
              className="absolute top-2 right-2 text-green-700 hover:text-green-900"
            >
              ×
            </button>
            <div className="flex items-center gap-3">
              <TreePine className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Did you know?</h3>
                <p className="text-green-700">Choosing train over car can reduce your carbon footprint by up to 80%!</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
              <Input
                placeholder="Enter source location"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <Input
                placeholder="Enter destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="flex-1" 
              size="lg" 
              onClick={handleSearchRoutes}
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search Routes"}
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Bike className="h-4 w-4" />
                    <span>Show Eco Routes</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter for most sustainable travel options</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}
        </div>

        <div className="fixed bottom-8 right-8 z-50">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="rounded-full p-4 bg-yellow-500 hover:bg-yellow-600 shadow-lg relative group"
              >
                <Gift className="h-6 w-6 text-white animate-bounce" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  1
                </span>
                <span className="absolute left-0 -top-10 bg-black text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Upload ticket & earn rewards!
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white shadow-lg rounded-lg">
              <DialogHeader>
                <DialogTitle>Upload Your Ticket</DialogTitle>
                <DialogDescription>
                  Share your public transport ticket and earn eco-points!
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Transport Mode</label>
                  <Select 
                    value={selectedTransportMode} 
                    onValueChange={setSelectedTransportMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transport type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="train">Train</SelectItem>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="metro">Metro</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload Ticket</label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="ticket-upload"
                      onChange={handleFileUpload}
                    />
                   
                    <label 
                      htmlFor="ticket-upload" 
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Click to upload or drag and drop
                      </span>
                    </label>
                    {errorMessage && <p>{errorMessage}</p>}

                  </div>
                </div>

                {isUploading && (
                  <div className="text-center text-sm text-blue-600">
                    Uploading ticket...
                  </div>
                )}
                

                {showReward && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Medal className="h-8 w-8 text-yellow-500" />
                      <div>
                        <h4 className="font-semibold text-green-800">
                          Congratulations! 🎉
                        </h4>
                        <p className="text-sm text-green-600">
                          You earned 50 eco-points for using public transport!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
        {routeOptions?.travel_options?.map((option, index) => {
      const carbonFootprint = getCarbonFootprint(option.mode, option.duration);
      const ecoScore = getEcoScore(option.mode);
            
            return (
              <Card 
                key={index}
                className={`${
                  option.mode === "Bus" 
                    ? "bg-blue-50 hover:bg-blue-100" 
                    : "bg-green-50 hover:bg-green-100"
                } transition-colors`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="flex items-center gap-2 mb-2 md:mb-0">
                      {option.mode === "Bus" ? (
                        <Bus className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Train className="h-5 w-5 text-green-600" />
                      )}
                      <h3 className="text-xl font-semibold">{option.option}</h3>
                      
                      {ecoScore > 90 && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Leaf className="h-3 w-3" />
                          Eco-Friendly
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">{option.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {option.departure_time} - {option.arrival_time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Carbon Footprint</p>
                        <p className="text-sm text-gray-600">{carbonFootprint} kg CO2</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Timer className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Time Efficiency</p>
                        <p className="text-sm text-gray-600">Optimal Route</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-sm font-medium">Eco Score</p>
                        <p className="text-sm text-gray-600">{ecoScore}/100</p>
                      </div>
                    </div>
                  </div>

                  <Accordion type="single" collapsible>
                    <AccordionItem value="routes">
                      <AccordionTrigger>View Route Details</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pt-2">
                          {option.route.map((route, idx) => (
                            <div 
                              key={idx}
                              className="flex items-start gap-2 p-2 rounded-md bg-white"
                            >
                              {route.vehicle === "Bus" ? (
                                <Bus className="h-5 w-5 text-blue-600 mt-1" />
                              ) : (
                                <Train className="h-5 w-5 text-green-600 mt-1" />
                              )}
                              <div>
                                <p className="font-medium">
                                  {route.number || route.company}
                                </p>
                                {route.destination && (
                                  <p className="text-sm text-gray-600">
                                    {route.destination}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {routeOptions?.travel_options?.length === 0 && !isLoading && (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No routes found. Try different locations or travel times.</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching for routes...</p>
          </div>
        )}
      </div>
    </main>
    
</SidebarInset>
    </SidebarProvider>
  );
}