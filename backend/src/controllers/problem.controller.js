import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";

// Create a new problem
export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;
  const normalizedConstraints = Array.isArray(constraints)
  ? constraints.join('\n')
  : constraints;
  // Ensure each reference solution passes all testcases via Judge0
  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language); // Map language to Judge0 language ID
      console.log(language);
      if (!languageId) {
        return res.status(400).json({ error: `Language ${language} is not supported` });
      }
      // console.log(1);
      // Prepare submissions for each testcase
      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));
      // console.log(2);
      // Submit to Judge0 and get submission tokens
      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((res) => res.token);
      // console.log(3);
      // Poll results from Judge0 until all submissions are processed
      console.log(" now we have token and now we will poll");
      const results = await pollBatchResults(tokens);
      // console.log(4);
      // Check if each test case passed
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) { // Status ID 3 means "Accepted"
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }
    console.log("all reference solution processed of this problem");
    // If all testcases passed for all languages, save problem to DB
    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints: normalizedConstraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id, // Save creator ID
      },
    });
    console.log(5);
    return res.status(201).json({
      sucess: true,
      message: "Problem Created Successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Creating Problem",
    });
  }
};

// Fetch all problems from the database, and include whether the current user has solved each problem
export const getAllProblems = async (req, res) => {
  try {
    // Fetch all problems and include solvedBy relation filtered to current user
    const problems = await db.problem.findMany();

    // If no problems found
    if (!problems) {
      return res.status(404).json({ error: "No problems Found" });
    }

    // Return all problems with info about user's solved status
    res.status(200).json({
      sucess: true,
      message: "Problems Fetched Successfully",
      problems,
    });
  } catch (error) {
    console.log(error);
    // Handle internal server error
    return res.status(500).json({
      error: "Error While Fetching Problems",
    });
  }
};

// Fetch a specific problem by its ID
export const getProblemById = async (req, res) => {
  const { id } = req.params; // Extract problem ID from URL parameters

  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    // If no problem is found with the given ID
    if (!problem) {
      return res.status(404).json({ error: "Problem not found." });
    }

    // Return the found problem
    return res.status(200).json({
      sucess: true,
      message: "Problem fetched successfully",
      problem,
    });
  } catch (error) {
    console.log(error);
    // Handle internal server error
    return res.status(500).json({
      error: "Error While Fetching Problem by ID",
    });
  }
};

// TODO: Implement logic to update a problem by its ID
export const updateProblem = async (req, res) => {
  // Logic to find problem by id and update with new values
  // This would be similar to createProblem but using update instead of create
};

// Delete a problem by its ID
export const deleteProblem = async (req, res) => {
  const { id } = req.params; // Extract problem ID from URL parameters

  try {
    // Check if the problem exists
    const problem = await db.problem.findUnique({ where: { id } });

    if (!problem) {
      return res.status(404).json({ error: "Problem Not found" });
    }

    // Delete the problem from the database
    await db.problem.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Problem deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    // Handle internal server error
    return res.status(500).json({
      error: "Error While deleting the problem",
    });
  }
};

// Get all problems that the current logged-in user has solved
export const getAllProblemsSolvedByUser = async (req, res) => {
  try {
    // Fetch problems where the current user is in the solvedBy relation
    const problems = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId: req.user.id
          }
        }
      },
      include: {
        solvedBy: {
          where: {
            userId: req.user.id
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    // Handle internal server error
    res.status(500).json({ error: "Failed to fetch problems" });
  }
};

