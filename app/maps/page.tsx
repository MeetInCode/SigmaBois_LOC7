import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RocketIcon, Globe, Search } from "lucide-react";
import Image from "next/image";

const startups = [
  {
    id: 1,
    name: "Intervue",
    logo: "https://images.unsplash.com/photo-1496200186974-4293800e2c20?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Intervue is a SaaS-based platform that streamlines the hiring process by offering real-time collaborative interview tools.",
    category: "Tech",
    date: "Jan 7, 2025"
  },
  {
    id: 2,
    name: "Zerodha",
    logo: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Zerodha is an Indian financial services company founded in 2020 that provides investment and trading solutions.",
    category: "Finance/Fintech",
    date: "Jan 7, 2025"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-[#E91E63] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center gap-4 mb-8">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              PITCH YOUR STARTUP IDEA <RocketIcon className="h-8 w-8" />
            </h1>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              BUILD YOUR NETWORK <Globe className="h-7 w-7" />
            </h2>
          </div>
          <p className="text-lg mb-8">
            submit ideas, vote on pitches and get noticed in virtual competitions
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Input 
              type="search"
              placeholder="Search Startups" 
              className="pl-4 pr-10 py-6 w-full rounded-full bg-white text-black"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Startups Grid */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">All startups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((startup) => (
            <Card key={startup.id} className="overflow-hidden border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{startup.date}</span>
                    <Globe className="h-4 w-4 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-500 mb-2">must watch</p>
                  <h3 className="text-xl font-bold mb-4">{startup.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{startup.description}</p>
                  <div className="relative w-full h-48 mb-4">
                    <img
                      src={startup.logo}
                      alt={startup.name}
                      className="rounded-md object-cover"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium bg-secondary px-3 py-1 rounded-full">
                      {startup.category}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4">
                <Button 
                  className="w-full" 
                  variant="outline"
                  size="lg"
                >
                  Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}