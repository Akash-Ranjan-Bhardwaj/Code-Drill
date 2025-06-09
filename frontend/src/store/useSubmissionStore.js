import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { use } from "react";

export const useSubmissionStore = create((set, get) => ({
  isLoading: false,
  submissions: [],
  submission: null,
  submissionCount: null,

  getAllSubmissions: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/submission/get-all-submissions");

      await set({ submissions: res.data.submissions });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error getting all submissions", error);
      toast.error("Error getting all submissions");
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionForProblem: async (problemId) => {
    set({ isLoading: true }); // <-- Set loading to true before fetching
    try {
      const res = await axiosInstance.get(
        `/submission/get-submission/${problemId}`
      );
      set({ submission: res.data.submissions });
    } catch (error) {
      console.log("Error getting submissions for problem", error);
      toast.error("Error getting submissions for problem");
    } finally {
      set({ isLoading: false }); // <-- Set loading to false after done
    }
  },

  getSubmissionCountForProblem: async (problemId) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-submissions-count/${problemId}`
      );

      set({ submissionCount: res.data.count });
    } catch (error) {
      console.log("Error getting submission count for problem", error);
      toast.error("Error getting submission count for problem");
    }
  },
  getUserStats: async () => {
  try {
    set({ isLoading: true });
    const res = await axiosInstance.get("/submission/get-user-stats");
    set({ userStats: res.data.stats });
    console.log("--------------------------------------");
    console.log(get().userStats); // Use get() to access current state
    console.log("--------------------------------------");
  } catch (error) {
    console.log("Error getting user stats", error);
    toast.error("Error getting user stats");
  } finally {
    set({ isLoading: false });
  }
},
}));
