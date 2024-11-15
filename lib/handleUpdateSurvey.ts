import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const handleUpdateSurvey = async (data: any) => {
    "use server";
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Validate that required fields are present
    // if (!data.asuProgram) {
    //     throw new Error("asuProgram is required");
    // }

    const upsertData = {
        ...data,
        // asu_program:data.asuProgram||null,
        zipcode: data.zipcode || null,
        country: data.country || null,
        // test_scores: data.test_scores || null,
        applications: data.applications || null,
        priorities: data.priorities || null,
        challenges: data.challenges || null,
        factors: data.factors || null,
    };

    console.log("Data being upserted:", upsertData); // Log data before upserting

    const { data: dbData, error } = await supabase
        .from('surveys')
        .insert(upsertData)
        .select("*")
        

    if (error) {
        console.error("Supabase upsert error:", error, error.message, error.details);
        throw new Error(error.message);
    }
    return dbData;
};
