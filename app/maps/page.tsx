"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RocketIcon, Globe, Search, Filter } from "lucide-react";
import RestaurantCard from './restaurantcard';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5328/api/maps?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log(data);
      setRestaurants(data);
    } catch (error) {
      console.error("Failed to fetch restaurants:", error);
      // You might want to add error state handling here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#e9801e] to-[#f5f5f1] text-white py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col items-center gap-4 mb-8">
           
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            Discover & Explore – Hotels,Toursists places,Cinemas, and More <Globe className="h-5 md:h-7 w-5 md:w-7" />
            </h2>
          </div>
          <p className="text-base md:text-lg mb-8 text-center max-w-2xl mx-auto">
          Wherever you go, find what matters most.
          One search, endless possibilities.
          </p>
          
          {/* Search Section */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1 relative">
                <Input 
                  type="search"
                  placeholder="Search Places" 
                  className="pl-4 pr-10 py-6 w-full rounded-full bg-white/90 backdrop-blur-sm text-black shadow-lg focus:ring-2 focus:ring-pink-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
  type="submit"
  className="rounded-full bg-white/90 p-8 transition-all pt-5 pb-5 shadow-lg hover:shadow-xl mb-4"
  size="icon"
  disabled={isLoading}
  aria-label="Search"
>
  <Search className="h-6 w-6 text-pink-500" />
</Button>

            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant, index) => (
            <div key={index} className="w-full h-max-content">
              <RestaurantCard {...restaurant} />
            </div>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 bg mx-auto"></div>
          </div>
        )}

       
      </div>
    </main>
    </SidebarInset>
    </SidebarProvider>
  );
}