'use client'
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useState } from "react";

export default function PlaceholdersAndVanishInputDemo() {
    const placeholders = [
        "What's the first rule of Fight Club?",
        "Who is Tyler Durden?",
        "Where is Andrew Laeddis Hiding?",
        "Write a Javascript method to reverse a string",
        "How to assemble your own PC?",
    ];

    const [inputValue, setInputValue] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    return (
        <div className="flex justify-center items-center h-full">
            <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                value={inputValue}
            />
        </div>
    );
}
