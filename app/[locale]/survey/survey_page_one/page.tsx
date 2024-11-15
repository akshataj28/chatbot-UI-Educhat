// "use client";
// import React, { useState } from "react";
// import EntrySurvey from "../page"
// // Define types for the state
// interface TestScores {
//   act: string;
//   sat: string;
//   satSubject: string;
//   ap: string;
//   ib: string;
//   other: string;
//   none: boolean; // boolean for checkbox
// }

// const TestScoresForm = () => {
//   // Initialize state with correct types
//   const [formData, setTestScores] = useState<TestScores>({
//     act: "",
//     sat: "",
//     satSubject: "",
//     ap: "",
//     ib: "",
//     other: "",
//     none: false, // This will remain boolean
//   });

//   // Handle input changes for text inputs (string values)
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
    
//     // If the input is not for the "none" checkbox, update the corresponding string value
//     if (name !== "none") {
//       setTestScores({
//         ...formData,
//         [name]: value,
//       });
//     }
//   };

//   // Handle checkbox changes for the "none" field (boolean value)
//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { checked } = e.target;

//     setTestScores({
//       ...formData,
//       none: checked, // Update the "none" checkbox value
//     });
//   };

//   const handleSubmit1 = async (e: React.FormEvent) => {
//     e.preventDefault(); // Prevent default form submission
  
//     // Create a FormData object
//     const form = new FormData();
//     // Append survey data
//     Object.entries(formData).forEach(([key, value]) => {
//       form.append(key, value.toString()); // Convert boolean to string
//     });
  
//     // Call the API route
//     const response = await fetch("/api/submitSurvey", {
//       method: "POST",
//       body: form,
//     });
  
//     if (response.ok) {
//       const data = await response.json();
//       window.location.href = data.redirectUrl; // Redirect to the chat page
//     } else {
//       const errorData = await response.json();
//       console.error("Error:", errorData.error);
//       // Handle error (e.g., show a message to the user)
//     }
//   };

//   return (
//     <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg" onSubmit={handleSubmit1}>
//       <h2 className="text-xl font-semibold mb-4">Part One: Entry Survey</h2>

//       {/* Test Scores Section */}
//       <div className="mb-4">
//         <label className="block text-gray-700">5. Did you take any of the following standardized tests?</label>
//         <div className="flex flex-col space-y-2">
//           {["act", "sat", "satSubject", "ap", "ib", "other"].map((test) => (
//             <div key={test} className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 id={test}
//                 name={test}
//                 checked={formData[test as keyof TestScores] !== ""}
//                 onChange={(e) => handleInputChange(e)}
//               />
//               <label htmlFor={test}>{test.toUpperCase()}</label>
//               <input
//                 type="text"
//                 name={test}
//                 placeholder="Score"
//                 value={formData[test as keyof TestScores]}
//                 onChange={handleInputChange}
//                 className="p-2 border rounded-md"
//               />
//             </div>
//           ))}
//           <div className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               id="none"
//               name="none"
//               checked={formData.none} // Use checked for boolean fields
//               onChange={handleCheckboxChange} // Handle boolean field separately
//             />
//             <label htmlFor="none">None</label>
//           </div>
//         </div>
//       </div>

//       {/* Submit Button */}
//       <div className="flex justify-end">
//         <button
//           type="submit"
//           className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
//         >
//           Next
//         </button>
//       </div>
//     </form>
//   );
// };

// const TestScoresPage = () => {
//   return (
//     <EntrySurvey><TestScoresForm /></EntrySurvey>
    
//   );
// };

// export default TestScoresPage;
