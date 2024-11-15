"use client"
import { redirect, useRouter } from "next/navigation"; // Import Next.js router for redirection
import { cookies } from "next/headers"
import { handleSurveySubmission } from "@/lib/serverActions"; // Import server function
import Link from "next/link";
import { createClient } from "@/lib/supabase/server"; // Import Supabase client
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, MenuItem, Button, Select, FormControl, InputLabel } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { watch } from "fs";
import { useTheme } from "next-themes";
import "../globals.css"

// import SurveyForm from "./SurveyForm"; // Import your new Server Component

type FormData = {
  year: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  school: string;
  gpa: number;
  gpa_out_of: number;
  tests: Record<string, string>;
  index: number;
  priorities: Record<number, string>;
  asuProgram: string;
  challenges: string[];  // Add this field for the challenges checkboxes
  challengeOtherText?: string; // Optional field for "Other" challenge
  factors: string[];    // Add this field for the factors checkboxes
  factorOtherText?: string;
  financialSupport:string
  applications: {
    college: string;
    major: string;
    offer: string;  // Make sure 'offer' is included here
  }[];
};

const EntrySurvey: React.FC = () => {

  // Step tracking
  const [step, setStep] = useState(1);
  const currentYear = new Date().getFullYear();
  const [addedTests, setAddedTests] = useState<string[]>([]);
  const [testOptions, setTestOptions] = useState<string[]>(["ACT", "SAT", "AP", "IB"]);
  const [newTestInput, setNewTestInput] = useState<string>(""); // Track the new test input value
  const [newTestScoreInput, setNewTestScoreInput] = useState<string>("");
  const [testScores, setTestScores] = useState<Record<string, string>>({}); // To track scores for each test
  const [checkedTests, setCheckedTests] = useState<Record<string, boolean>>({});
  const [financialSupport, setFinancialSupport] = useState('');
  const [priorities, setPriorities] = useState<string[]>([
    'Academic Programs',
    'Campus Culture',
    'Location',
    'Admission Probability',
    'Cost And FinancialAid',
    'Extra-curricular Activities',
    'Career Opportunities',
  ]);
  const [formData, setFormData] = useState<Partial<FormData>>({}); 
  const { theme } = useTheme() 
  const [otherPriority, setOtherPriority] = useState("");
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>(""); // Track the error message
  const [rankedPriorities, setRankedPriorities] = useState<Record<number, string>>({}); // Store ranking map

  const removeHighlightFromAll = () => {
    priorities.forEach((_, index) => {
      const listItem = document.getElementById(`priority-${index}`);
      if (listItem) {
        listItem.classList.remove('bg-blue-100', 'shadow-lg');

      }
    });
  };

  const handleDragStart = (event: React.DragEvent<HTMLLIElement>, index: number) => {
    setDraggingIndex(index);
    event.dataTransfer.setData("text/plain", index.toString());
    event.dataTransfer.effectAllowed = "move"; // Indicate that this is a move operation
  };

  const handleDrop = (event: React.DragEvent<HTMLLIElement>, index: number) => {
    event.preventDefault();
    const draggedIndex = draggingIndex;

    if (draggedIndex !== null && draggedIndex !== index) {
      const newPriorities = [...priorities];
      const [removed] = newPriorities.splice(draggedIndex, 1);
      newPriorities.splice(index, 0, removed);
      setPriorities(newPriorities);
    }
    setDraggingIndex(null);
    removeHighlightFromAll();
  };

  const handleDragOver = (event: React.DragEvent<HTMLLIElement>) => {
    event.preventDefault(); // Prevent default to allow drop
  };

  const handleDragEnter = (index: number) => {
    if (draggingIndex !== null && draggingIndex !== index) {
      // Add visual feedback for the target item
      const listItem = document.getElementById(`priority-${index}`);
      if (listItem) {
        listItem.classList.add('bg-blue-200','shadow-lg'); // Highlight the target item
      }
    }
  };

  const handleDragLeave = (index: number) => {
    const listItem = document.getElementById(`priority-${index}`);
    if (listItem) {
      listItem.classList.remove('bg-blue-200','shadow-lg'); // Remove highlight when leaving
    }
  };
  const handleAddPriority = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    if (otherPriority.trim() && (e instanceof MouseEvent || e.key === 'Enter')) {
      setPriorities([...priorities, otherPriority]);
      setOtherPriority(""); // Clear the input field after adding
    }
  };
  // const [otherPriority, setOtherPriority] = useState('');

  // Handle financial support input
  const handleNextStepPriority = () => {
    // Create the ranking map
    const rankingMap: Record<number, string> = {};
    priorities.forEach((priority, index) => {
      rankingMap[index + 1] = priority; // Ranking starts from 1, not 0
    });
    setRankedPriorities(rankingMap)
    console.log("priority:",rankedPriorities,rankingMap)
    // Save ranking to formData
    setFormData((prevFormData) => ({
      ...prevFormData,
      priorities: rankingMap, // Save the ranking map
    }));

    // Move to the next step
    setStep(step + 1);
  };
  const handleFinancialSupportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFinancialSupport(event.target.value);
  };


  const [applications, setApplications] = useState([
    { college: '', major: '', offer: '' }
  ]);

  // Function to handle adding a new college application record
  const handleAddApplication = () => {
    setApplications([...applications, { college: '', major: '', offer: '' }]);
  };

  // Function to handle removing a college application record
  const handleRemoveApplication = (index: number) => {
    const updatedApplications = applications.filter((_, i) => i !== index);
    setApplications(updatedApplications);
  };

  // Hook form setup
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
    trigger
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      year: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      school: "",
      gpa: undefined,                // GPA
      gpa_out_of: undefined,         // GPA scale
      tests: {},  
      priorities:{},                   // Default to an empty object for test scores
      financialSupport: "",          // Financial support details
      asuProgram: "",                // ASU program (add this field if it's part of FormData)
      challenges: [],                // Default to an empty array
      challengeOtherText: "",        // Optional field for additional challenges
      factors: [],                   // Default to an empty array for factors
      factorOtherText: "",           // Optional field for additional factors
      applications: [{                // Default to one empty application object
        college: '',
        major: '',
        offer: ''
      }],
    },
  });

  const handleNextStep = async () => {
    const valid = await trigger(); // Validate all fields in the current step
    if (valid) {
        // Fetch the current form data for this step
        const currentStepData = getCurrentFormData(); 
        
        // Update the cumulative form data with the current step's data
        setFormData(prev => ({ ...prev, ...currentStepData }));

        // Send the partial data to the server (only the current step's data)
        // await updateDatabase(currentStepData); 
        
        // Proceed to the next step
        setStep(step + 1);
    }
};

const handleBackStep = async () => {
  const valid = await trigger(); // Validate all fields in the current step
  if (valid) {
      // Fetch the current form data for this step
      const currentStepData = getCurrentFormData(); 
      
      // Update the cumulative form data with the current step's data
      setFormData(prev => ({ ...prev, ...currentStepData }));

      // Send the partial data to the server (only the current step's data)
      // await updateDatabase(currentStepData); 
      
      // Proceed to the next step
      setStep(step -1);
  }
};

// Function to get the current form data based on the current step
const getCurrentFormData = () => {
    const data: Partial<FormData> = {};
    const values = getValues();
    if (step === 1) {
         // Get all current form values
        data.year = values.year;
        data.city = values.city;
        data.state = values.state;
        data.zipcode = values.zipcode;
        data.country = values.country;
        data.school = values.school;
        data.gpa = values.gpa;
        data.gpa_out_of = values.gpa_out_of;
    } else if (step === 2) {
        data.tests = testScores; // Assuming you're tracking test scores in state
        console.log("testscore : ",testScores, data.tests )
    }
    else if (step === 3) {
      data.asuProgram = values.asuProgram; // Capture ASU program on this step
  }
    // Add more steps as necessary...
    console.log("DATaAAA: ", data )
    return data;
};

// Function to update the database
const updateDatabase = async (data: Partial<FormData>) => {
  // Handle optional fields
  const { challengeOtherText, factorOtherText,asuProgram,financialSupport, school, year,tests, ...filteredData } = data;

  const cleanedData = {
      ...filteredData,
      zipcode: data.zipcode || null,
      country: data.country || null,
      asu_program: data.asuProgram || null,  // Ensure required fields are handled
      financial_support:data.financialSupport || null,
      school_name: data.school || null,
      year_applied: data.year || null,
      test_scores :data.tests || null,
  };
  console.log(cleanedData,"hiiiiii", JSON.stringify(cleanedData));
  const response = await fetch("/api/updateSurvey", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanedData),
  });

  if (!response.ok) {
      console.error("Error updating database", await response.text());
  }
};


  const onSubmit: SubmitHandler<FormData> = async (data) => {
    data.tests = testScores; 
    data.priorities=rankedPriorities
    
    // Send to API or handle submission logic
    await updateDatabase(data); 
    console.log(data,"hiiiiii", JSON.stringify(data));
    const response = await fetch("/api/submitSurvey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const result = await response.json();
      window.location.href = result.redirectUrl;
    } else {
      console.error("Error submitting form");
    }
  
  };
  
 
  const handleCheckboxChange = (test: string, checked: boolean) => {
    setCheckedTests((prev) => ({
      ...prev,
      [test]: checked,
    }));
  };

  
  const handleAddTest = () => {
    if (!newTestInput.trim()) {
      setErrorMessage("Test name cannot be empty.");
      return;
    }

    if (!newTestScoreInput.trim()) {
      setErrorMessage("Please add a score before adding the test.");
      return;
    }

    // Clear error message once validation passes
    setErrorMessage("");

    if (newTestInput.trim() && newTestScoreInput.trim()) {
      // Add the new test to the test options
      setTestOptions((prev) => [...prev, newTestInput.trim()]);

      // Mark the checkbox as checked for the new test
      setCheckedTests((prev) => ({
        ...prev,
        [newTestInput.trim()]: true, // Automatically check the checkbox for the new test
      }));

      // Add the new test and its score to the testScores state
      setTestScores((prev) => ({
        ...prev,
        [newTestInput.trim()]: newTestScoreInput.trim(),
      }));

      // Clear the input fields
      setNewTestInput(""); // Clear the test name input
      setNewTestScoreInput(""); // Clear the test score input
    }
  };


  return (
    <div className="flex w-full min-h-full bg-secondary">
      {/* Sidebar for steps */}
      <div className="w-1/3 bg-primary fg-secondary">
        <h3 className="text-xl text-black text-right font-semibold mb-4 p-6 pr-[60px]">Part One: Entry Survey</h3>
        <ul className="space-y-2">
          <li className={`${step === 1 ? "bg-secondary font-bold text-right" : "text-gray-600 text-right"}`}>
            <button type="button" className="pl-6 pr-[60px] ml-7 py-2 " onClick={() => setStep(1)}>
              Your Background
            </button>
          </li>
          <li className={`${step === 2 ? "bg-secondary font-bold text-right" : "text-gray-600 text-right"}`}>
            <button type="button" className="pl-6 pr-[60px] ml-7 py-2 " onClick={() => setStep(2)}>
              Test Scores
            </button>
          </li>
          <li className={`${step === 3 ? "bg-secondary font-bold text-right" : "text-gray-600 text-right"}`}>
            <button type="button" className="pl-6 pr-[60px] ml-7 py-2 " onClick={() => setStep(3)}>
              Application History
            </button>
          </li>
          <li className={`${step === 4 ? "bg-secondary font-bold text-right" : "text-gray-600 text-right"}`}>
            <button type="button" className="pl-6 pr-[60px] ml-7 py-2 " onClick={() => setStep(4)}>
              Impacted factors
            </button>
          </li>
          <li className={`${step === 5 ? "bg-secondary font-bold text-right" : "text-gray-600 text-right"}`}>
            <button type="button" className="pl-6 pr-[60px] ml-7 py-2 " onClick={() => setStep(5)}>
              Challenges
            </button>
          </li>
        </ul>
      </div>

      {/* Form area */}
      <div className="flex justify-center w-full p-6 pr-[90px]">
      <form className="p-6 w-full" onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Background Information */}
        {step === 1 && (
          <>
            {/* Year of application */}
            <div className="mb-4 flex items-center space-x-6 fg-secondary ">
              <label className="block fg-secondary font-semibold">1. Which year did you apply to college?</label>
              <input
                type="text"
                {...register("year", {
                  required: "Year is required",
                  pattern: {
                    value: /^\d{4}$/,
                    message: "Year must be a 4-digit number",
                  },
                  validate: (value) =>
                    parseInt(value) <= currentYear || `Year must not be greater than ${currentYear}`,
                })}
                className="w-1/4 mt-2 p-2 border rounded-md"
                placeholder="YYYY"
              />
              {errors.year && <p className="text-red-600">{errors.year.message}</p>}
            </div>

            {/* City, State, Zip, Country */}
            <div className="mb-4 mt-9">
              <label className="block font-semibold">2. Where did you apply from?</label>
              <div className="flex space-x-4 mt-2 p-4">
              <div className="w-1/3">
              <input
                type="text"
                {...register("city", { required: "City is required" })}
                className="w-full p-2 border rounded-md"
                placeholder="City"
              />
              <div className="h-6">
              {errors.city && <p className="text-red-600">{errors.city.message}</p>} {/* Error message */}
              </div>
            </div>
            <div className="w-1/3">
              <input
                type="text"
                {...register("state", { required: "State/Province is required" })}
                className="w-full p-2 border rounded-md"
                placeholder="State/Province"
              />
              {errors.state && <p className="text-red-600">{errors.state.message}</p>} {/* Error message */}
            </div>
          </div>
          <div className="flex space-x-4 p-4">
            <div className="w-1/3">
              <input
                type="text"
                // {...register("zipcode", { required: "Zipcode is required" })}
                className="w-full p-2 border rounded-md"
                {...register("zipcode")}
                placeholder="Zipcode"
              />
              {/* {errors.zipcode && <p className="text-red-600">{errors.zipcode.message}</p>} Error message */}
            </div>
            <div className="w-1/3">
              <input
                type="text"
                // {...register("country", { required: "Country is required" })}
                className="w-full p-2 border rounded-md"
                {...register("country")}
                placeholder="Country if non-US"
              />
              {/* {errors.country && <p className="text-red-600">{errors.country.message}</p>} Error message */}
            </div>
          </div>
        </div>

            {/* School name */}
            <div className="mb-4 mt-9">
              <label className="block font-semibold">
                3. What is the name of your most recent secondary/high school?
              </label>
              <input
                type="text"
                {...register("school", { required: "School name is required" })}
                className="w-full mt-2 p-2 border rounded-md"
                placeholder="School Name"
              />
              <div className="h-6">
              {errors.school && <p className="text-red-600">{errors.school.message}</p>}
              </div>
            </div>

            {/* GPA */}
            <div className="mb-4 flex items-center space-x-6 font-semibold">
              <label className="block  ">4. What is your secondary/high school GPA?</label>
              <div className="flex space-x-4 mt-7">
              <div className="w-1/3">
              <input
                type="text"
                {...register("gpa", { required: "GPA is required" })}
                className="w-full p-2 border rounded-md"
                placeholder="GPA"
              />
              {errors.gpa && <p className="text-red-600">{errors.gpa.message}</p>} {/* Error message */}
            </div>
            <span className="self-center mb-5">out of</span>
            <div className="w-1/3">
              <input
                type="text"
                {...register("gpa_out_of", { required: "GPA scale is required" })}
                className="w-full p-2 border rounded-md"
                placeholder="4.0"
              />
              <div className="h-6">
              {errors.gpa_out_of && <p className="text-red-600">{errors.gpa_out_of.message}</p>} {/* Error message */}
              </div>
           </div>
          </div>
        </div>

            {/* Next Button */}
            <div className="flex justify-end mt-[90px]">
              <button
                type="button"
                className={`btn-${theme}`}
                  // theme === 'beige' ? 'btn-beige' :
                  // theme === 'light' ? 'btn-light' :
                  // 'btn-dark'} `}
                onClick={handleNextStep}
              >
                Next
              </button>
            </div>
          </>
        )}

          {step === 2 && (
            <>
              {/* Test Scores */}
              <div className="mb-4 w-11/12 max-h-[60vh] overflow-auto">
                <label className="block font-semibold">
                  5. Did you take any of the following standardized tests?
                </label>
                <div className="space-y-5 mt-8 text-s">
                  {testOptions.map((test) => (
                    <div key={test} className="flex items-center space-x-6">
                      {/* Checkbox and Label */}
                      <div className="flex items-center w-1/3 h-1/13">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={checkedTests[test] || false}
                          onChange={(e) => handleCheckboxChange(test, e.target.checked)}
                        />
                        <label className="ml-4">{test}</label>
                      
                      
                      {/* Score input field */}
                      <div className="flex-1 ml-6 w-full h-2 mb-8">
                {checkedTests[test] ? (
                  <input
                    type="text"
                    value={testScores[test] || ""}
                    onChange={(e) =>
                      setTestScores((prev) => ({
                        ...prev,
                        [test]: e.target.value,
                      }))
                    }
                    className="w-full p-2 bg-gray-700 text-white border rounded-md"
                    placeholder="Score"
                  />
                ) : (
                  <div className="w-full p-2"></div>
                        )}
                      </div>
                      </div>

                      {/* Error message */}
                      {errors.tests?.[test] && (
                        <p className="text-red-600">
                          {errors.tests[test]?.message}
                        </p>
                       )}
                       </div>
                   
                 ))}

                  {addedTests.map((test, index) => (
                    <div key={test} className="flex items-center space-x-6">
                      <label className="flex-1">{test}</label>
                      <input
                        type="text"
                        {...register(`tests.${test}`, {
                          required: "Score is required",
                        })}
                        className="w-1/6 p-2 bg-gray-700 border rounded-md ml-6"
                        placeholder="Score"
                      />
                      {errors.tests?.[test] && (
                        <p className="text-red-600">
                          {errors.tests[test]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
               
                </div>
                <div>
              <input
                    type="text"
                    value={newTestInput}
                    onChange={(e) => setNewTestInput(e.target.value)}
                    className="p-2 border rounded-md mr-4 mt-6"
                    placeholder="New test name"
                  />
                   <input
                    type="text"
                    value={newTestScoreInput}
                    onChange={(e) => setNewTestScoreInput(e.target.value)}
                    className="p-2 border rounded-md mr-4 mt-6"
                    placeholder="Score"
                  />
              </div>
                <div>
                <button
                type="button"
                onClick={handleAddTest}
                className="flex items-center px-4 py-2 rounded-md hover:bg-gray-300 mt-6"
              >
                <span className="mr-2">➕</span> Add New Test
              </button>
              </div>
             
              {/* Navigation Buttons */}
              <div className="flex justify-start mt-[110px] gap-x-[700px]">
              <button
                type="button"
                className={`btn-${theme} w-1/6 text-white px-4 py-2 rounded-md`}
               
                onClick={handleBackStep}
              >
                Back
              </button>
              {/* </div>
              <div className="flex justify-end mt-[30px]"> */}
                <button
                  type="button"
                  className={`btn-${theme} w-1/6 text-white px-4 py-2 rounded-md`}
                  onClick={handleNextStep}
                >
                  Next
                </button>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              {/* Your Background and Test Scores sections... */}

              {/* Application History section */}
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-2">
                  6. What colleges and majors have you applied to? Have you received an offer?
                </label>

                {applications.map((application, index) => (
                  <div key={index} className="flex items-center gap-4 mt-4 ml-4">
                    <input
                      type="text"
                      placeholder="College"
                      {...register(`applications[${index}].college`, { required: "College is required" })}
                      className="p-2 border rounded-md w-[400px]"
                    />
                    <input
                      type="text"
                      placeholder="Major"
                      {...register(`applications[${index}].major`, { required: "Major is required" })}
                      className="p-2 border rounded-md w-[250px]"
                    />
                    <select
                      {...register(`applications[${index}].offer`, { required: "Offer status is required" })}
                      className="p-2 border rounded-md w-[150px]"
                    >
                       <option value="">Select offer status</option>
                  <option value="accepted">Accepted</option>
                   <option value="rejected">Rejected</option>
                    </select>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveApplication(index)}
                        className="text-red-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                {/* Add new record */}
                <button
                  type="button"
                  className="mt-4 text-blue-600 flex items-center"
                  onClick={handleAddApplication}
                >
                  <span className="text-lg font-bold mr-2">+</span>
                  Add a new record
                </button>
              </div>

              {/* Program choice section */}
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-2">
                  7. Which program are you currently enrolled in at ASU? Why did you choose ASU over the other options?
                </label>
                <textarea
                  {...register('asuProgram', { required: 'This field is required' })}
                  placeholder="Enter your answer"
                  className="p-2 mt-2 ml-4 border rounded-md w-1/2"
                />
                {errors.asuProgram && <span className="text-red-600">{errors.asuProgram.message}</span>}
              </div>

              {/* Next button */}
              <div className="flex justify-start mt-[110px] gap-x-[700px]">
              <button
                type="button"
                className={`btn-${theme} w-1/6 text-white px-4 py-2 rounded-md`}
               
                onClick={handleBackStep}
              >
                Back
              </button>
              {/* </div>
              <div className="flex justify-end mt-[30px]"> */}
                <button
                  type="button"
                  className={`btn-${theme} w-1/6 text-white px-4 py-2 rounded-md`}
                  onClick={handleNextStep}
                >
                  Next
                </button>
              </div>
            </>
          )}
          { step===4 &&(
                <>
               <label className="block font-semibold">
          8. Among the offers you have received, what kinds of financial support have you been granted?
        </label>
        <div className="flex space-x-4  p-4">
          <div className="w-full">
            <input
              type="text"
              {...register("financialSupport", {
                required: "This field is required",
              })}
              className="w-[600px] p-2 border rounded-md"
              placeholder="For example: scholarship, tuition waiver, financial aid, stipend."
            />
            <div className="h-6">
              {errors.financialSupport && (
                <p className="text-red-600 text-xs">{errors.financialSupport.message}</p>
              )}
            </div>
          </div>
        </div>

                  {/* Card to hold priorities */}
                  <label className="block font-semibold mt-[-20px]">
          9. What are your top priorities when choosing a college? 
        </label>
                  <div className="max-w-full w-11/12 h-[65vh] mx-auto px-5 py-3 bg-white rounded-lg shadow-lg mt-2 overflow-auto">
                    <h3 className="text-black font-bold mb-2 text-l">Top Priorities when Choosing a College</h3>
                    <p className="text-gray-600 mb-4 text-sm">Rank them in order of importance. 1 = most important</p>

                    {/* Priorities Ranking */}
                    <ul className="space-y-3">
                      {priorities.map((priority, index) => (
                        <li
                          key={priority}
                          id={`priority-${index}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDrop={(e) => handleDrop(e, index)}
                          onDragOver={handleDragOver}
                          onDragEnter={() => handleDragEnter(index)}
                          onDragLeave={() => handleDragLeave(index)}
                          className={`border p-2 bg-white text-xs text-black rounded-md shadow-sm flex items-center justify-between transition-transform duration-300 ease-in-out cursor-pointer hover:shadow-lg ${
                            draggingIndex === index ? 'scale-105 shadow-2xl bg-blue-200' : ''
                          }`}
                        >
                          <div className="flex items-center">
                          <span className="text-s font-bold">{index + 1}</span>
                          <span className="ml-4">{priority}</span>
                          </div>
                        </li>
                        
                      ))}
                    </ul>

                    {/* TextField for Other Priority */}
                    <div className="flex space-x-2 mt-4 w-[600px] h-[35px]">
                                          <input
                          type="text"
                          placeholder="Specify other priority"
                          value={otherPriority}
                          onChange={(e) => setOtherPriority(e.target.value)}
                          onKeyDown={handleAddPriority} // Add on 'Enter' key press
                          className="border border-gray-300 rounded-md py-1 px-2 text-xs w-full focus:outline-none focus:ring focus:ring-green-300 transition duration-300"
                        />
                          <button
                            onClick={handleAddPriority} // Add on button click
                            className="bg-gray-300 text-xs text-black px-4 py-2 rounded-md hover:bg-gray-500 hover:text-white transition duration-300"
                          >
                            Add
                          </button>
                        </div>
                  </div>
                {/* Submit Button */}
                <div className="flex justify-start mt-[20px] gap-x-[700px]">
              <button
                type="button"
                className={`btn-${theme} w-1/6 text-white px-4 py-2 rounded-md`}
               
                onClick={handleBackStep}
              >
                Back
              </button>
              {/* </div>
              <div className="flex justify-end mt-[30px]"> */}
                <button
                  type="button"
                  className={`btn-${theme} w-1/6 text-white px-4 py-2 rounded-md`}
                  onClick={handleNextStep}
                >
                  Next
                </button>
              </div>
              </>
          ) }
          {step === 5 && (
  <>
    <div className="mb-4 ">
      <label className="block font-semibold">10. What major challenges did you encounter in your college application process?</label>
      <div className="mt-4 ml-5 space-y-3">
        <div>
          <input type="checkbox" className="w-4 h-4" id="challenge1" {...register("challenges")} value="Understanding the application requirements" />
          <label htmlFor="challenge1" className="ml-4">Understanding the application requirements</label>
        </div>
        <div>
          <input type="checkbox" className="w-4 h-4" id="challenge2" {...register("challenges")} value="Choosing the right college" />
          <label htmlFor="challenge2" className="ml-4">Choosing the right college</label>
        </div>
        <div>
          <input type="checkbox" className="w-4 h-4" id="challenge3" {...register("challenges")} value="Choosing the right major/program" />
          <label htmlFor="challenge3" className="ml-4">Choosing the right major/program</label>
        </div>
        <div>
          <input type="checkbox" className="w-4 h-4" id="challenge4" {...register("challenges")} value="Financial aid and scholarships" />
          <label htmlFor="challenge4" className="ml-4">Financial aid and scholarships</label>
        </div>
        <div>
          <input type="checkbox" className="w-4 h-4" id="challenge5" {...register("challenges")} value="Meeting deadlines" />
          <label htmlFor="challenge5" className="ml-4">Meeting deadlines</label>
        </div>
        <div>
          <input type="checkbox" className="w-4 h-4" id="challenge6" {...register("challenges")} value="Writing personal statements/essays" />
          <label htmlFor="challenge6" className="ml-4">Writing personal statements/essays</label>
        </div>
        <div className="flex items-center">
          <input type="checkbox" className="w-4 h-4" id="challengeOther" {...register("challenges")} value="Other" />
          <label htmlFor="challengeOther" className="ml-4">Other</label>
          <input
            type="text"
            {...register("challengeOtherText")}
            placeholder="  Specify"
            className="ml-4 p-1 border text-white rounded-md w-1/3"
          />
        </div>
      </div>
    </div>

    <div className="mt-6 mb-4 ">
      <label className="block font-semibold">11. In your opinion, what are the most important factors that affect your application outcomes?</label>
      <div className="mt-4 ml-5 space-y-3">
        <div >
          <input type="checkbox" className="w-4 h-4" id="factor1" {...register("factors")} value="Academic performance (GPA)" />
          <label htmlFor="factor1" className="ml-4">Academic performance (GPA)</label>
        </div>
        <div>
          <input type="checkbox" className="w-4 h-4" id="factor2" {...register("factors")} value="Standardized test scores" />
          <label htmlFor="factor2" className="ml-4">Standardized test scores</label>
        </div>
        <div>
          <input type="checkbox" className="w-4 h-4" id="factor3" {...register("factors")} value="Extracurricular activities" />
          <label htmlFor="factor3" className="ml-4">Extracurricular activities</label>
        </div>
        <div>
          <input type="checkbox" className="w-4 h-4" id="factor4" {...register("factors")} value="Personal statements/essays" />
          <label htmlFor="factor4" className="ml-4">Personal statements/essays</label>
        </div>
        <div>
          <input type="checkbox" className="w-4 h-4" id="factor5" {...register("factors")} value="Letters of recommendation" />
          <label htmlFor="factor5" className="ml-4">Letters of recommendation</label>
        </div>
        <div>
          <input type="checkbox" className="w-4 h-4" id="factor6" {...register("factors")} value="Interview performance" />
          <label htmlFor="factor6" className="ml-4">Interview performance</label>
        </div>
        <div className="flex items-center">
          <input type="checkbox" className="w-4 h-4" id="factorOther" {...register("factors")} value="Other" />
          <label htmlFor="factorOther" className="ml-4">Other</label>
          <input
            type="text"
            {...register("factorOtherText")}
            placeholder="  Specify"
            className="ml-4 p-1 border rounded-md w-1/3"
          />
        </div>
      </div>
    </div>

    <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-gray-500 w-1/6 text-white px-4 py-2 rounded-md hover:bg-green-600"
                
                >
                  Submit
                </button>
              </div>
  </>
)}

        </form>
      </div>
    </div>
  );
};

export default EntrySurvey;




