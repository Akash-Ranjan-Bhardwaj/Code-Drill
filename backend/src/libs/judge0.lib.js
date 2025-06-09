import axios from "axios";

// Maps supported programming language names to Judge0 language IDs
export const getJudge0LanguageId = (language) => {
  const languageMap = {
    "C": 103,
    "C++": 76,
    "JAVA": 91,
    "PYTHON": 71,
  };

  return languageMap[language.toUpperCase()];
};

// Utility function to pause execution for a given number of milliseconds
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Polls Judge0 batch API until all submissions are completed
export const pollBatchResults = async (tokens) => {
  while (true) {
    // Make GET request to Judge0 batch endpoint with token list
    const { data } = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`, {
      params: {
        tokens: tokens.join(","),       // Convert token array to comma-separated string
        base64_encoded: false,          // Don't use base64 encoding
      },
    });

    const results = data.submissions;

    // Check if all submissions are finished (status 1: In Queue, 2: Processing)
    const isAllDone = results.every(
      (r) => r.status.id !== 1 && r.status.id !== 2
    );

    if (isAllDone) {console.log("all test cases passed"); return results;} // Return final results if all are done

    await sleep(1000); // Wait 1 second before checking again
  }
};

// Sends a batch of code submissions to Judge0 for execution
export const submitBatch = async (submissions) => {
  // submissions: array of objects containing source_code, language_id, stdin, expected_output

  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch`,
    {
      submissions,
    }
  );
  console.log(submissions[0].language_Id);
  console.log("Submission Results of a batch of a launguage: ", data); // Logs returned tokens

  return data; // Returns an array of token objects: [{token}, {token}, ...]
};

// Converts a Judge0 language ID back to a human-readable language name
export function getLanguageName(languageId) {
  const LANGUAGE_NAMES = {
    103: "C",
    76: "C++",
    91: "Java",
    71: "Python",
  };
  console.log(LANGUAGE_NAMES[languageId]);
  return LANGUAGE_NAMES[languageId] || "pata nahi kon sa launguage hai";
}

