// app/lib/serverActions.ts
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const handleSurveySubmission = async (data: any) => {
  "use server"; // Ensures this is treated as a server action

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const session = (await supabase.auth.getSession()).data.session;

  // Fetch the home workspace
  const { data: homeWorkspace, error: homeWorkspaceError } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", session?.user.id)
    .eq("is_home", true)
    .single();

  if (!homeWorkspace) {
    throw new Error(homeWorkspaceError?.message || "An unexpected error occurred");
  }



  return homeWorkspace.id; // Return the ID for further processing or redirection
};

// export const handleSurveySubmission = async (data: any) => {
//   "use server"; // Ensures this is treated as a server action

//   const cookieStore = cookies();
//   const supabase = createClient(cookieStore);

//   const session = (await supabase.auth.getSession()).data.session;
  
//   const { data: homeWorkspace, error: homeWorkspaceError } = await supabase
//     .from("workspaces")
//     .select("*")
//     .eq("user_id", session?.user.id)
//     .eq("is_home", true)
//     .single();

//   if (!homeWorkspace) {
//     throw new Error(homeWorkspaceError?.message || "An unexpected error occurred");
//   }

//   // Store the survey data if necessary
//   // You may want to implement logic to save the survey data to your database here

//   return homeWorkspace.id; // Return the ID for redirection
// };
// const { error } = await supabase
  //   .from("profiles") // Replace with your actual table name
  //   .insert([
  //     {
  //       year: year,
  //       city: city,
  //       state: state,
  //       gpa: gpa,
  //       // test_score: JSON.stringify(checkedTests), // Store the tests as a JSON string
  //     },
  //   ]);

  // Handle potential insertion errors
  // if (error) {
  //   throw new Error(error.message || "Failed to insert survey data.");
//   const {
//     year,  // Make sure this maps to year_applied
//     city,
//     state,
//     zipcode,
//     country,
//     school, // Make sure this maps to school_name
//     gpa,
//     gpa_out_of,
//     financialSupport, // This should map to financial_support
//     applications,
//     asuProgram,
//     challenges,
//     priorities, // You should gather this data from your form
//     factors, // You should gather this data from your form
//   } = data;

//   // Prepare the object for insertion
//   const surveyData = {
//     user_id: session?.user.id, // Assuming you want to track the user
//     year_applied: year, // Year of application
//     city: city,         // City of applicant
//     state: state,       // State of applicant
//     zipcode: zipcode,   // Zipcode
//     country: country,   // Country
//     school_name: school, // Name of the high school
//     gpa: parseFloat(gpa), // GPA as a numeric type
//     gpa_out_of: parseFloat(gpa_out_of), // GPA scale as numeric
//     test_scores: {},    // Populate if applicable
//     applications: applications, // JSONB array
//     asu_program: asuProgram, // Program and reason for choosing ASU
//     financial_support: financialSupport, // Financial support details
//     priorities: priorities, // JSONB array of ranked priorities
//     challenges: challenges, // JSONB array of challenges
//     factors: factors, // JSONB array of factors influencing outcomes
//   };

//   // Insert the survey data into the surveys table
//   // Insert the survey data into the surveys table
// const { error } = await supabase
// .from("surveys")
// .insert(surveyData);

// if (error) {
// console.error("Error inserting survey data:", error); // Log the error details
// throw new Error(error.message || "An unexpected error occurred while inserting survey data");
// }
