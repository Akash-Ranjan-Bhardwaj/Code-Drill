import express from "express";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

// Dynamic import of node-fetch for CommonJS environment
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post("/generate", async (req, res) => {
  const {
    code,
    description,
    prompt,
    language,
    problemTitle,
    problemDescription,
    problemConstraints,
    problemExamples,
    testCases,
  } = req.body;

  console.log("Request payload:", {
    codeLength: code?.length || 0,
    language,
    problemTitle,
    hasTestCases: !!testCases?.length,
    hasExamples: !!problemExamples,
  });

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "Gemini API key is not configured." });
  }

  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required." });
  }

  try {
    // Build comprehensive problem context
    const problemContext = buildProblemContext({
      problemTitle,
      problemDescription,
      problemConstraints,
      problemExamples,
      testCases,
    });

    // Build the enhanced prompt with problem context
    const fullPrompt = buildEnhancedPrompt({
      language,
      code,
      description,
      prompt,
      problemContext,
    });

    console.log("Sending request to Gemini API...");

    // Call Gemini API with enhanced configuration
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3, // Lower temperature for more consistent analysis
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096, // Increased for detailed analysis
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return res.status(400).json({
        error: data.error?.message || "Gemini API request failed",
        details: data,
      });
    }

    // Extract generated text from response safely
    const generatedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated";

    console.log("Generated response length:", generatedText.length);

    // Post-process the response to ensure quality
    const processedResponse = postProcessResponse(generatedText);

    res.json({
      response: processedResponse,
      metadata: {
        hasTestCases: !!testCases?.length,
        hasProblemContext: !!(problemTitle && problemDescription),
        language: language,
        analysisType: "comprehensive",
      },
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      error: "Something went wrong while calling Gemini API.",
      details: error.message,
    });
  }
});

/**
 * Build comprehensive problem context from available data
 */
function buildProblemContext({
  problemTitle,
  problemDescription,
  problemConstraints,
  problemExamples,
  testCases,
}) {
  let context = "";

  if (problemTitle) {
    context += `**Problem Title:** ${problemTitle}\n\n`;
  }

  if (problemDescription) {
    context += `**Problem Description:**\n${problemDescription}\n\n`;
  }

  if (problemConstraints) {
    context += `**Constraints:**\n${problemConstraints}\n\n`;
  }

  if (
    problemExamples &&
    Array.isArray(problemExamples) &&
    problemExamples.length > 0
  ) {
    context += `**Examples:**\n`;
    problemExamples.forEach((example, idx) => {
      context += `Example ${idx + 1}:\n`;
      context += `  Input: ${example.input}\n`;
      context += `  Output: ${example.output}\n`;
      if (example.explanation) {
        context += `  Explanation: ${example.explanation}\n`;
      }
      context += `\n`;
    });
  }

  if (testCases && testCases.length > 0) {
    context += `**Test Cases:**\n`;
    testCases.forEach((tc, idx) => {
      context += `Test Case ${idx + 1}:\n`;
      context += `  Input: ${tc.input}\n`;
      context += `  Expected Output: ${tc.output}\n\n`;
    });
  }

  return context;
}

/**
 * Build enhanced prompt with problem context
 */
function buildEnhancedPrompt({
  language,
  code,
  description,
  prompt,
  problemContext,
}) {
  return `You are an expert code review assistant specializing in competitive programming and algorithm analysis. 

${problemContext ? `**PROBLEM CONTEXT:**\n${problemContext}` : ""}

**TASK:** Review the following ${language} code solution and provide a comprehensive analysis in the following structured format:

**Code Rating**
[Rating]/100

**Algorithm Correctness**
[✅ Correct approach / ⚠️ Issues with approach / ❌ Incorrect approach]
[Detailed analysis of whether the algorithm correctly solves the given problem]

**Edge Case Handling**
[Analysis of how well the code handles edge cases mentioned in constraints and examples]

**Time Complexity**
[Big O notation and explanation]

**Space Complexity** 
[Big O notation and explanation]

**Code Quality**
[Assessment of readability, maintainability, and coding standards]

**Bug Detection**
[⚠️ List specific bugs found with line references OR ✅ No bugs detected]

**Test Case Analysis**
${
  problemContext.includes("Test Cases:")
    ? "[Analysis of how the code would perform on the provided test cases]"
    : "[General test case considerations]"
}

**Optimization Opportunities**
[📈 Specific improvements possible OR ✅ Already optimal]

**Best Practices Adherence**
[Assessment of coding best practices for competitive programming]

**Improvement Suggestions**
[Detailed, actionable suggestions with code examples if needed]

**Alternative Approaches**
[Mention other valid approaches to solve this problem, if any]

---

**Programming Language:** ${language}
**Solution Context:** ${
    description || `${language} code solution for the given problem`
  }
**Review Focus:** ${prompt}

**Code to Review:**
\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Please provide a thorough analysis considering both the problem requirements and the code implementation. Focus on correctness, efficiency, and adherence to best practices.`;
}

/**
 * Post-process the AI response to ensure quality
 */
function postProcessResponse(response) {
  // Remove any potential markdown artifacts or formatting issues
  let processed = response.trim();

  // Ensure proper section formatting
  processed = processed.replace(/\*\*([^*]+)\*\*/g, "**$1**");

  // Remove excessive whitespace
  processed = processed.replace(/\n{3,}/g, "\n\n");

  // Ensure sections are properly separated
  processed = processed.replace(/(\*\*[^*]+\*\*)/g, "\n$1\n");

  return processed;
}

/**
 * Health check endpoint for the AI service
 */
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    geminiConfigured: !!GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Get supported languages endpoint
 */
router.get("/languages", (req, res) => {
  const supportedLanguages = [
    "javascript",
    "typescript",
    "python",
    "java",
    "cpp",
    "c++",
    "c",
    "csharp",
    "php",
    "ruby",
    "go",
    "rust",
    "swift",
    "kotlin",
  ];

  res.json({
    languages: supportedLanguages,
    count: supportedLanguages.length,
  });
});

export default router;
