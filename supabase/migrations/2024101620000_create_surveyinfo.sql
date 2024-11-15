CREATE TABLE surveys (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,  -- Assuming each survey is tied to an authenticated user
  year_applied VARCHAR(4) NOT NULL,                          -- Year of application
  city VARCHAR(255) NOT NULL,                                -- City of applicant
  state VARCHAR(255) NOT NULL,                               -- State of applicant
  zipcode VARCHAR(10),                                       -- Zipcode (optional)
  country VARCHAR(100),                                      -- Country if non-US (optional)
  school_name VARCHAR(255) NOT NULL,                         -- Name of high school
  gpa NUMERIC(4, 2) NOT NULL,                                -- GPA
  gpa_out_of NUMERIC(4, 2) NOT NULL,                         -- GPA scale (e.g., out of 4.0)
  test_scores JSONB,                                         -- Test scores stored as JSON (e.g., {"SAT": 1500, "ACT": 32})
  applications JSONB,                                        -- Applications as JSON (e.g., [{"college": "ASU", "major": "CS", "offer": "Accepted"}])
  asu_program TEXT NOT NULL,                                 -- Program and reason for choosing ASU
  financial_support TEXT,                                    -- Financial support details
  priorities JSONB,                                          -- Ranked priorities as JSON (e.g., ["Financial Aid", "Location", "Reputation"])
  challenges JSONB,                                          -- List of challenges (e.g., ["Choosing the right college", "Financial aid"])
  factors JSONB,                                             -- Factors influencing outcomes (e.g., ["GPA", "Standardized test scores"])
  created_at TIMESTAMP DEFAULT NOW()                         -- Timestamp for when the survey was submitted
);
ALTER TABLE surveys DISABLE ROW LEVEL SECURITY;
