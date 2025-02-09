"use client";

import { useQRCode } from 'next-qrcode'
import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LanguageTranslationComponent from '@/components/language';

export default function Page() {
    const [cid, setCid] = useState(null);
    const [open, setOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [formData, setFormData] = useState({ name: "", email: "", tickets: "1" })
    const { Canvas } = useQRCode()



    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.tickets) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5328/api/confirm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    tickets: parseInt(formData.tickets),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Collection ID:", data.collection_id);
                setCid(data.collection_id);

                // Second API call to send confirmation
                const confirmationResponse = await fetch("http://127.0.0.1:5328/api/send_confirmation", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        location: selectedEvent?.location, // Fetching location from selectedEvent
                        email: formData.email,
                    }),
                });

                const confirmationData = await confirmationResponse.json();

                if (confirmationResponse.ok) {
                    console.log("Confirmation sent:", confirmationData);
                } else {
                    console.error("Confirmation Error:", confirmationData.error);
                    alert("Error sending confirmation: " + confirmationData.error);
                }

                // Reset form
                setFormData({ name: "", email: "", tickets: "1" });
            } else {
                console.error("Error:", data.error);
                alert("Error: " + data.error);
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Network error. Please try again.");
        }
    };

    const events = [
        {
            title: "Taj Mahal",
            location: "Agra",
            timing: "6:00 AM - 7:00 PM",
            description: "One of the Seven Wonders of the World, the Taj Mahal is a symbol of love and Mughal architecture.",
            image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGFqJTIwbWFoYWwlMjBpbmRpYXxlbnwwfHwwfHx8MA%3D%3D"
        },
        {
            title: "Shaniwar Wada",
            location: "Pune",
            timing: "9:00 AM - 5:30 PM",
            description: "A historic fortification in Pune, Maharashtra, built in 1732 as a grand residence for the Peshwas.",
            image: "https://www.savaari.com/blog/wp-content/uploads/2022/11/Shaniwaarwada_Pune_11zon.jpg"
        },
        {
            title: "Pondicherry Lighthouse",
            location: "Pondicherry, India",
            timing: "3:00 PM - 7:00 PM",
            description: "A historic lighthouse offering stunning panoramic views of the city and coastline.",
            image: "https://pondicherrytourism.co.in/images/places-to-visit/header/pondicherry-lighthouse-tourism-entry-fee-timings-holidays-reviews-header.jpg"
        },
        {
            title: "Elephanta Caves",
            location: "Mumbai, India",
            timing: "9:00 AM - 5:30 PM",
            description: "A UNESCO World Heritage Site, known for its ancient rock-cut caves with intricate carvings of Hindu deities.",
            image: "https://s7ap1.scene7.com/is/image/incredibleindia/elephanta-caves-mumbai-maharashtra-10-musthead-hero?qlt=82&ts=1727355551693"
        }
    ]

    const handleBookNow = (event) => {
        setSelectedEvent(event)
        setOpen(true)
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }



    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">Events</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Book Tickets</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        {events.map((event, index) => (
                            <Card key={index} className="overflow-hidden shadow-md rounded-lg">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-48 object-cover"
                                />
                                <CardHeader className="flex ">
                                    <CardTitle className="text-lg font-bold">{event.title}</CardTitle>
                                    <div className="flex gap-2 text-sm text-gray-600">
                                        <MapPin className="h-4 w-4 text-blue-500" />
                                        <span>{event.location}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p className="text-sm text-gray-700">{event.description}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="h-4 w-4 text-blue-500" />
                                        <span>{event.timing}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end p-4">
                                    <Button onClick={() => handleBookNow(event)} className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg">
                                        Book Now
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
                </div>

            </SidebarInset>

            {/* Booking Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md bg-white p-6">
                    <DialogHeader>
                        <DialogTitle>Book Tickets for {selectedEvent?.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Name</Label>
                            <Input name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" required />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
                        </div>
                        <div>
                            <Label>Number of Tickets</Label>
                            <Input name="tickets" type="number" min="1" value={formData.tickets} onChange={handleChange} required />
                        </div>
                    </div>
                    {cid && (
                        <Canvas
                            text={cid}
                            options={{
                                type: 'image/jpeg',
                                quality: 0.3,
                                errorCorrectionLevel: 'M',
                                margin: 3,
                                scale: 4,
                                width: 200,
                                color: {
                                    dark: '#010599FF',
                                    light: '#FFBF60FF',
                                },
                            }}
                        />
                    )}

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button className="bg-primary hover:bg-primary/90 text-white" onClick={handleSubmit}>
                            Confirm Booking
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SidebarProvider>
    )
}
