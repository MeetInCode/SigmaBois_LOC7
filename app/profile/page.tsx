"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  User,
  Shield,
  Bell,
  Share2,
  CreditCard,
  Leaf,
  Trophy,
  Gift,
  Facebook,
  Twitter,
  Instagram,
  Camera,
  Calendar,
  Plane,
  Train,
  Bus,
  Bike,
  TrendingUp,
  Award,
  Heart,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [isPublic, setIsPublic] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgressValue(75), 500);
    return () => clearTimeout(timer);
  }, []);

  const badges = [
    { 
      name: "Eco-Yoddha", 
      points: 500,
      description: "Completed 50 eco-friendly trips across India",
      image: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=400&auto=format&fit=crop&q=60"
    },
    { 
      name: "Green Warrior", 
      points: 300,
      description: "Used public metro for 30 consecutive days",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&auto=format&fit=crop&q=60"
    },
    { 
      name: "Swachh Volunteer", 
      points: 200,
      description: "Participated in 10 community clean-up events",
      image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400&auto=format&fit=crop&q=60"
    },
  ];

  const recentTrips = [
    {
      location: "Jaipur, Rajasthan",
      date: "2024-03-15",
      transport: "Train",
      carbonSaved: "85kg",
      image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&auto=format&fit=crop&q=60",
      description: "Heritage tour via Indian Railways"
    },
    {
      location: "Munnar, Kerala",
      date: "2024-02-28",
      transport: "Electric Bus",
      carbonSaved: "55kg",
      image: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=400&auto=format&fit=crop&q=60",
      description: "Eco-tourism in God's own country"
    },
    {
      location: "Rishikesh, Uttarakhand",
      date: "2024-02-15",
      transport: "Bicycle",
      carbonSaved: "40kg",
      image: "https://images.unsplash.com/photo-1600697230088-4992c5f9bcc5?w=400&auto=format&fit=crop&q=60",
      description: "Spiritual journey on two wheels"
    }
  ];

  const getTransportIcon = (transport: string) => {
    switch (transport.toLowerCase()) {
      case 'train': return <Train className="w-4 h-4" />;
      case 'electric bus': return <Bus className="w-4 h-4" />;
      case 'bicycle': return <Bike className="w-4 h-4" />;
      default: return <Plane className="w-4 h-4" />;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        
        <div className="flex-1 overflow-auto">
          <div className="container py-6 px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center relative">
                    <div className="mx-auto mb-4 relative group">
                      <Avatar className="w-32 h-32 border-4 border-primary/10">
                        <AvatarImage src="https://lh3.googleusercontent.com/a/ACg8ocJNMYa2DbRvJJIEWqjVlJ20yZxL0EYhkyGkFXQb-EncgtltP70=s288-c-no" />
                        <AvatarFallback>AP</AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Meet Mehta</CardTitle>
                    <Badge className="absolute top-4 right-4 bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors">
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        <span>Elite Member</span>
                      </div>
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <TooltipProvider>
                        {[
                          { icon: <User className="w-4 h-4" />, text: "@mee_meet", tooltip: "Username" },
                          { icon: <Mail className="w-4 h-4" />, text: "mehtameet115@gmail.com", tooltip: "Verified Email" },
                          { icon: <Phone className="w-4 h-4" />, text: "+91 98765 43210", tooltip: "Phone Number" },
                          { icon: <MapPin className="w-4 h-4" />, text: "mumbai, Maharahtra", tooltip: "Location" }
                        ].map((item, index) => (
                          <Tooltip key={index}>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2 p-2 hover:bg-secondary/50 rounded-md transition-colors cursor-pointer">
                                {item.icon}
                                <span className="text-sm text-muted-foreground">{item.text}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{item.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </TooltipProvider>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2">Bio</h4>
                      <p className="text-sm text-muted-foreground">
                        Tech professional by day, eco-warrior always. Exploring India's diverse landscapes 
                        while promoting sustainable travel. Namaste! 🙏
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links */}
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Connected Accounts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { icon: <Facebook className="w-5 h-5" />, name: "Facebook", connected: true },
                      { icon: <Twitter className="w-5 h-5" />, name: "Twitter", connected: false },
                      { icon: <Instagram className="w-5 h-5" />, name: "Instagram", connected: true }
                    ].map((social, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-secondary/50 rounded-md transition-colors">
                        <div className="flex items-center gap-2">
                          {social.icon}
                          <span>{social.name}</span>
                        </div>
                        <Button 
                          variant={social.connected ? "outline" : "default"}
                          size="sm"
                          className="transition-all duration-300 hover:scale-105"
                        >
                          {social.connected ? "Connected" : "Connect"}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Middle Column - Stats & Activities */}
              <div className="space-y-6 md:col-span-2">
                <Tabs defaultValue="trips" className="w-full">
                  <TabsList className="grid w-full  grid-cols-4 h-15">
                    <TabsTrigger value="trips" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                      <div className="flex flex-col items-center gap-1">
                        <Plane className="w-4 h-4" />
                        <span>Trips</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="rewards" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                      <div className="flex flex-col items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        <span>Rewards</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="expenses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                      <div className="flex flex-col items-center gap-1">
                        <CreditCard className="w-4 h-4" />
                        <span>Expenses</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="impact" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                      <div className="flex flex-col items-center gap-1">
                        <Leaf className="w-4 h-4" />
                        <span>Impact</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="trips">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Recent Trips
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                          <div className="space-y-6">
                            {recentTrips.map((trip, index) => (
                              <HoverCard key={index}>
                                <HoverCardTrigger asChild>
                                  <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer group">
                                    <div className="w-24 h-24 rounded-md overflow-hidden">
                                      <img 
                                        src={trip.image} 
                                        alt={trip.location}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-medium text-lg group-hover:text-primary transition-colors">
                                        {trip.location}
                                      </h4>
                                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {trip.date}
                                      </p>
                                      <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                          {getTransportIcon(trip.transport)}
                                          {trip.transport}
                                        </Badge>
                                        <Badge variant="outline" className="text-green-600 flex items-center gap-1">
                                          <Leaf className="w-3 h-3" />
                                          {trip.carbonSaved} CO₂ saved
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                  <div className="space-y-2">
                                    <img 
                                      src={trip.image} 
                                      alt={trip.location}
                                      className="w-full h-40 object-cover rounded-md"
                                    />
                                    <h4 className="font-medium">{trip.location}</h4>
                                    <p className="text-sm text-muted-foreground">{trip.description}</p>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="rewards">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="w-5 h-5" />
                          Eco Points & Badges
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-8">
                          <Label className="text-lg">Total Eco Points</Label>
                          <div className="mt-2 p-4 border rounded-lg bg-secondary/30">
                            <div className="flex items-center gap-4 mb-2">
                              <Progress 
                                value={progressValue} 
                                className="transition-all duration-1000 ease-in-out"
                              />
                              <span className="font-medium min-w-[80px]">750/1000</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              250 more points until your next reward!
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {badges.map((badge, index) => (
                            <HoverCard key={index}>
                              <HoverCardTrigger asChild>
                                <div className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer group">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                      <Trophy className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium group-hover:text-primary transition-colors">
                                        {badge.name}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        {badge.points} points
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <div className="space-y-2">
                                  <img 
                                    src={badge.image} 
                                    alt={badge.name}
                                    className="w-full h-40 object-cover rounded-md"
                                  />
                                  <h4 className="font-medium">{badge.name}</h4>
                                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="expenses">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5" />
                          Travel Expenses
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="p-4 border rounded-lg hover:shadow-md transition-all">
                            <div className="flex justify-between items-center mb-4">
                              <div>
                                <h4 className="font-medium">Monthly Budget</h4>
                                <p className="text-sm text-muted-foreground">March 2024</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">$250/$300</p>
                                <Progress value={83} className="mt-2" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                              {[
                                { label: "Train", amount: "$120", icon: <Train className="w-4 h-4" /> },
                                { label: "Bus", amount: "$80", icon: <Bus className="w-4 h-4" /> },
                                { label: "Bike Share", amount: "$30", icon: <Bike className="w-4 h-4" /> },
                                { label: "Other", amount: "$20", icon: <CreditCard className="w-4 h-4" /> }
                              ].map((item, index) => (
                                <div key={index} className="p-3 bg-secondary/30 rounded-lg">
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                    {item.icon}
                                    <span>{item.label}</span>
                                  </div>
                                  <p className="font-medium">{item.amount}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="impact">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Leaf className="w-5 h-5" />
                          Carbon Footprint
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="p-4 border rounded-lg">
                            <Label className="text-lg">Monthly Carbon Savings</Label>
                            <div className="flex items-center gap-4 mt-2">
                              <Progress 
                                value={progressValue} 
                                className="flex-1 transition-all duration-1000 ease-in-out"
                              />
                              <span className="font-medium">120kg CO₂</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border rounded-lg hover:shadow-md transition-all group">
                              <h4 className="font-medium flex items-center gap-2 group-hover:text-primary transition-colors">
                                <Leaf className="w-5 h-5 text-green-500" />
                                Trees Equivalent
                              </h4>
                              <div className="mt-4 text-center">
                                <span className="text-3xl font-bold text-green-500">5</span>
                                <p className="text-sm text-muted-foreground mt-1">trees saved</p>
                              </div>
                            </div>
                            <div className="p-4 border rounded-lg hover:shadow-md transition-all group">
                              <h4 className="font-medium flex items-center gap-2 group-hover:text-primary transition-colors">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                Impact Rank
                              </h4>
                              <div className="mt-4 text-center">
                                <span className="text-3xl font-bold text-yellow-500">Top 10%</span>
                                <p className="text-sm text-muted-foreground mt-1">of eco travelers</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Settings */}
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 hover:bg-secondary/50 rounded-lg transition-colors">
                      <div className="space-y-0.5">
                        <Label className="text-base">Public Profile</Label>
                        <p className="text-sm text-muted-foreground">
                          Make your profile visible to others
                        </p>
                      </div>
                      <Switch
                        checked={isPublic}
                        onCheckedChange={setIsPublic}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 hover:bg-secondary/50 rounded-lg transition-colors">
                      <div className="space-y-0.5">
                        <Label className="text-base">Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about trips and rewards
                        </p>
                      </div>
                      <Switch
                        checked={notifications}
                        onCheckedChange={setNotifications}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}