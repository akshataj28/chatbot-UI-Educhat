// app/api/updateSurvey/route.ts
import { NextResponse } from 'next/server';
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { handleUpdateSurvey } from '@/lib/handleUpdateSurvey';

export async function POST(request: Request) {
    try {
        const data = await request.json(); // Parse JSON body
        console.log("Received data:", data); // Log received data

        // Validate incoming data (this could also be moved to serverActions if needed)
        // const requiredFields = ["year", "city", "state", "zipcode", "country", "school", "gpa", "gpa_out_of"];
        // const missingFields = requiredFields.filter(field => !(field in data));
        // if (missingFields.length) {
        //     console.error("Missing required fields:", missingFields);
        //     return NextResponse.json({ message: `Missing required fields: ${missingFields.join(", ")}` }, { status: 400 });
        // }

        // Update survey in the database
        const updatedData = await handleUpdateSurvey(data);

        return NextResponse.json({ message: "Survey updated successfully", data: updatedData }, { status: 200 });
    } 
    catch (error) {
        // Type assertion to access error properties safely
        if (error) {
            console.error("Error in POST /api/updateSurvey:", error); // Log the specific error message
            return NextResponse.json({ message: "Internal Server Error", error: error }, { status: 500 });
        } else {
            // Handle unexpected error types
            console.error("Unexpected error:", error);
            return NextResponse.json({ message: "Internal Server Error", error: "An unexpected error occurred" }, { status: 500 });
        }
    }
}
