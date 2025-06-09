import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

export const useSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axiosInstance.get("/submission/get-all-submissions");

        setSubmissions(response.data.submissions);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return { submissions, loading, error };
};
