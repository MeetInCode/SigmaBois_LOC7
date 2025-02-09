'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Script from 'next/script';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Target, MapPin, Trash2, Sparkles } from 'lucide-react';

// Types remain the same
interface City {
  name: string;
  lat: number;
  lng: number;
}

// Constants remain the same
const INDIAN_CITIES: City[] = [
  { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 }
];

export default function TrashDetectionGame() {
  // State and refs remain the same
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const streetViewContainerRef = useRef<HTMLDivElement>(null);

  // Map functions remain the same
  const loadNewStreetView = useCallback(() => {
    if (!panoramaRef.current) return;

    const randomCity = INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)];
    const lat = randomCity.lat + (Math.random() - 0.5) * 0.1;
    const lng = randomCity.lng + (Math.random() - 0.5) * 0.1;
    const newLocation = { lat, lng };

    const service = new google.maps.StreetViewService();
    service.getPanorama({
      location: newLocation,
      radius: 1000,
      preference: google.maps.StreetViewPreference.NEAREST
    }, (data, status) => {
      if (status === google.maps.StreetViewStatus.OK && data.location) {
        panoramaRef.current?.setPosition(data.location.latLng);
        panoramaRef.current?.setPov({
          heading: Math.random() * 360,
          pitch: 0
        });
      } else {
        loadNewStreetView();
      }
    });
  }, []);

  const handleSpotTrash = () => {
    setScore(prev => prev + 1);
    setStreak(prev => prev + 1);
    loadNewStreetView();
  };

  const handleCleanArea = () => {
    setStreak(0);
    loadNewStreetView();
  };

  const initializeMaps = useCallback(() => {
    if (!mapContainerRef.current || !streetViewContainerRef.current || !window.google) return;

    const defaultLocation = INDIAN_CITIES[0];
    
    const mapInstance = new google.maps.Map(mapContainerRef.current, {
      center: defaultLocation,
      zoom: 15,
      streetViewControl: false,
      mapTypeControl: false,
      styles: [
        {
          elementType: "geometry",
          stylers: [{ color: "#2A2A2A" }]
        },
        {
          elementType: "labels.text.fill",
          stylers: [{ color: "#FFC107" }]
        },
        {
          elementType: "labels.text.stroke",
          stylers: [{ color: "#242424" }]
        }
      ]
    });

    const panoramaInstance = new google.maps.StreetViewPanorama(
      streetViewContainerRef.current,
      {
        position: defaultLocation,
        pov: { heading: 165, pitch: 0 },
        zoom: 1,
        addressControl: false,
        showRoadLabels: false
      }
    );

    mapInstance.setStreetView(panoramaInstance);
    mapRef.current = mapInstance;
    panoramaRef.current = panoramaInstance;
    
    loadNewStreetView();
  }, [loadNewStreetView]);

  const handleMapsLoaded = () => {
    setMapsLoaded(true);
  };

  useEffect(() => {
    if (mapsLoaded) {
      initializeMaps();
    }
    
    return () => {
      mapRef.current = null;
      panoramaRef.current = null;
    };
  }, [mapsLoaded, initializeMaps]);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
        onLoad={handleMapsLoaded}
      />
      
      <div className="min-h-screen bg-zinc-900 text-zinc-100">
        <header className="bg-gradient-to-r from-yellow-500 to-amber-600 p-8 text-center shadow-lg">
          <h1 className="text-5xl font-bold uppercase tracking-wider mb-4 text-white drop-shadow-lg">
            🌍 Trash Detection Adventure
          </h1>
          <p className="text-xl text-yellow-100">Join the quest for cleaner cities! Explore, identify, and level up!</p>
        </header>

        <main className="max-w-6xl mx-auto p-6">
          <Card className="bg-zinc-800/70 border-2 border-yellow-500/20 shadow-2xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle>
                <div className="flex justify-between items-center p-4 bg-zinc-700/50 rounded-xl border border-yellow-500/10">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-yellow-500" />
                    <span className="text-yellow-100">Level 1: Street Scout</span>
                  </div>
                  <div className="w-2/3 h-6 bg-zinc-600 rounded-full overflow-hidden border border-yellow-500/20">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 transition-all duration-500"
                      style={{ width: `${(score / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-yellow-400">{score * 100} XP</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <h2 className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
                <Target className="h-6 w-6" />
                Mission: Clean Streets Operation
              </h2>
              
              <div 
                ref={streetViewContainerRef}
                className="h-[500px] rounded-xl mb-4 shadow-xl border-2 border-yellow-500/20 overflow-hidden"
              />
              
              <div 
                ref={mapContainerRef}
                className="h-48 rounded-xl mb-4 shadow-lg border-2 border-yellow-500/20 overflow-hidden"
              />
              
              <div className="flex justify-center gap-6 my-8">
                <Button
                  onClick={handleSpotTrash}
                  className="bg-yellow-500 hover:bg-yellow-600 text-zinc-900 text-lg px-8 py-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <Trash2 className="h-6 w-6" />
                  Spot Trash
                </Button>
                <Button
                  onClick={handleCleanArea}
                  className="bg-amber-500 hover:bg-amber-600 text-zinc-900 text-lg px-8 py-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <Sparkles className="h-6 w-6" />
                  Clean Area
                </Button>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 p-6 rounded-xl text-center border border-yellow-500/30 backdrop-blur-sm">
                <div className="flex justify-center items-center gap-8 text-2xl font-bold">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    <span className="text-yellow-100">Score: {score}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-8 w-8 text-yellow-500" />
                    <span className="text-yellow-100">Streak: {streak}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="fixed right-6 top-1/2 -translate-y-1/2 bg-zinc-800/90 p-6 rounded-xl border-2 border-yellow-500/20 backdrop-blur-sm shadow-xl">
            <h3 className="font-bold mb-4 text-xl text-yellow-500 flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Achievements
            </h3>
            <div className="space-y-3">
              <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors">
                🔥 First Find
              </div>
              <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors">
                ⭐ Clean Streak: 5
              </div>
              <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors">
                🎯 Accuracy Master
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-gradient-to-r from-amber-600 to-yellow-500 p-6 text-center mt-12">
          <p className="text-lg text-white">
            🌱 Trash Detection Adventure | Making Earth cleaner, one spot at a time!
          </p>
        </footer>
      </div>
    </>
  );
}