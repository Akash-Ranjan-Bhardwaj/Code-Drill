// Importing the Prisma Client instance from db.js
import { db } from "../libs/db.js";

/**
 * GET all submissions for the authenticated user
 * Route: GET /api/submissions
 */
export const getAllSubmission = async (req, res) => {
    try {
        // Extracting userId from the authenticated user's token
        const userId = req.user.id;

        // Fetching all submissions where userId matches
        const submissions = await db.submission.findMany({
            where: {
                userId: userId
            }
        });
        console.log(submissions);
        res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            submissions
        });

    } catch (error) {
        console.error("Fetch Submissions Error:", error);
        res.status(500).json({ error: "Failed to fetch submissions" });
    }
};

/**
 * GET all submissions for a specific problem by the authenticated user
 * Route: GET /api/submissions/problem/:problemId
 */
export const getSubmissionsForProblem = async (req, res) => {
    try {
        const userId = req.user.id;
        const problemId = req.params.problemId;

        // Fetch submissions matching both userId and problemId
        const submissions = await db.submission.findMany({
            where: {
                userId: userId,
                problemId: problemId
            }
        });
        console.log(`submissions fetched dor prob id: ${problemId}`)
        res.status(200).json({
            success: true,
            message: "Submission fetched successfully",
            submissions
        });

    } catch (error) {
        console.error("Fetch Submissions Error:", error);
        res.status(500).json({ error: "Failed to fetch submissions" });
    }
};

/**
 * GET total count of submissions made for a specific problem (by all users)
 * Route: GET /api/submissions/problem/:problemId/all
 */
export const getAllTheSubmissionsForProblem = async (req, res) => {
    try {
        const problemId = req.params.problemId;

        // Count all submissions for a given problemId
        const submission = await db.submission.count({
            where: {
                problemId: problemId
            }
        });

        res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            count: submission
        });

    } catch (error) {
        console.error("Fetch Submissions Error:", error);
        res.status(500).json({ error: "Failed to fetch submissions" });
    }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all accepted submissions for the user
    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
        status: "Accepted",
      },
      include: {
        problem: {
          select: {
            difficulty: true,
          }
        }
      }
    });

    let totalTime = 0;
    let totalMemory = 0;
    let totalTimeCount = 0;
    let totalMemoryCount = 0;

    const difficultyCount = {
      EASY: 0,
      MEDIUM: 0,
      HARD: 0
    };

    for (const submission of submissions) {
      const timeArray = JSON.parse(submission.time || "[]"); // ["0.001 s", ...]
      const memoryArray = JSON.parse(submission.memory || "[]"); // ["1020 KB", ...]

      for (let t of timeArray) {
        totalTime += parseFloat(t.replace(" s", ""));
        totalTimeCount++;
      }

      for (let m of memoryArray) {
        totalMemory += parseFloat(m.replace(" KB", ""));
        totalMemoryCount++;
      }

      if (submission.problem?.difficulty) {
        difficultyCount[submission.problem.difficulty] += 1;
      }
    }

    const avgTime = totalTimeCount ? (totalTime / totalTimeCount).toFixed(4) + " s" : "0 s";
    const avgMemory = totalMemoryCount ? (totalMemory / totalMemoryCount).toFixed(2) + " KB" : "0 KB";

    res.status(200).json({
      success: true,
      message: "User stats fetched successfully",
      stats: {
        averageTime: avgTime,
        averageMemory: avgMemory,
        acceptedProblemsByDifficulty: difficultyCount
      }
    });

  } catch (error) {
    console.error("Fetch User Stats Error:", error);
    res.status(500).json({ error: "Failed to fetch user stats" });
  }
};

