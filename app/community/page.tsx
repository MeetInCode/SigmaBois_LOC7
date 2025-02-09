// pages/index.js
'use client'
import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Plus,
  User2,
  Activity,
  TrendingUp,
  Hash,
  Bookmark,
  Settings,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  MapPin,
  Smile,
  Send
} from 'lucide-react';
import Image from 'next/image'; // Use Next.js Image component for image optimization
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
  } from "@/components/ui/sidebar"
  import { AppSidebar } from "@/components/app-sidebar"

export default function Home() {
  const [postText, setPostText] = useState('');

  return (
    <SidebarProvider>
          <AppSidebar />
          <SidebarInset>


    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-[#dfb93f]">YAATRI</span>
              <div className="relative ml-4 hidden md:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 bg-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#dfb93f]"
                />
                <Search className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
                <User2 className="w-5 h-5 text-gray-600" />
              </div>
              <button className="bg-[#dfb93f] text-white p-2 rounded-full hover:bg-[#dfb93f]">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <User2 className="w-12 h-12 text-gray-600" />
                </div>
                <h2 className="text-xl font-bold mb-2">Aryan Ahuja</h2>
                <p className="text-gray-600 text-sm mb-4">@Aryan • Travel Enthusiast</p>
                <div className="flex justify-between w-full mt-4 text-center">
                  <div className="cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <div className="font-bold">1.2K</div>
                    <div className="text-sm text-gray-600">Following</div>
                  </div>
                  <div className="cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <div className="font-bold">4.5K</div>
                    <div className="text-sm text-gray-600">Followers</div>
                  </div>
                  <div className="cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <div className="font-bold">852</div>
                    <div className="text-sm text-gray-600">Posts</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <Activity className="w-5 h-5 text-gray-600" />
                  <span>Feed</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                  <span>Trending</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <Hash className="w-5 h-5 text-gray-600" />
                  <span>Explore</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <Bookmark className="w-5 h-5 text-gray-600" />
                  <span>Saved</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-6 space-y-6">
            {/* Create Post */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User2 className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="Share your fitness journey..."
                    className="w-full border rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#FC4C02]"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Image className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Smile className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <MapPin className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    <button 
                      className={`bg-[#dfb93f] text-white px-4 py-2 rounded-full flex items-center space-x-2 ${!postText.trim() && 'opacity-50 cursor-not-allowed'}`}
                      disabled={!postText.trim()}
                    >
                      <Send className="w-4 h-4" />
                      <span>Post</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            {[1, 2].map((post) => (
              <div key={post} className="bg-white rounded-lg shadow">
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between border-b">
                  <div className="flex items-center space-x-3">
                    <Image 
                      src={`https://images.unsplash.com/photo-${post === 1 ? '1599566150163-29194dcaad36' : '1539571696357-5a69c17a67c6'}?auto=format&fit=crop&q=80&w=100&h=100`} 
                      alt="Profile" 
                      width={40} 
                      height={40} 
                      className="rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{post === 1 ? 'Aryan Sharma' : 'Vidhi Sharma'}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{post === 1 ? 'Local Pottery Shop, Jaipur' : 'Central Park Running Track'}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600">{post === 1 ? 'Here’s a glimpse into my morning workout routine!' : 'Having a peaceful walk through the park this morning.'}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-xl">Sponsored</h2>
                  <button className="text-sm text-[#dfb93f]">See All</button>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold">Travel Agency</h3>
                    <p className="text-gray-600 text-sm">Amazing discounts on travel packages!</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold">Fitness Gear</h3>
                    <p className="text-gray-600 text-sm">New arrivals! Check out our latest workout equipment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

</SidebarInset>
    </SidebarProvider>  
  );
}
