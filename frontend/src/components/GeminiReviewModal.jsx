import React, { useState, useEffect } from "react";
import {
  X,
  Bot,
  Star,
  Clock,
  Bug,
  Zap,
  FileText,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Target,
  Code,
  Brain,
  TestTube,
} from "lucide-react";

const GeminiReviewModal = ({ isOpen, onClose, code, language, problem }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BACKEND_BASE_URL || "http://localhost:8080/api/v1";
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState(
    "Analyze this solution for correctness, efficiency, and best practices with focus on the given problem requirements"
  );
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-populate description when modal opens with problem context
  useEffect(() => {
    if (isOpen && problem) {
      const problemContext = `Problem: ${problem.title}

Description: ${problem.description}

${problem.constraints ? `Constraints: ${problem.constraints}` : ""}

${
  problem.examples
    ? `Examples:
${problem.examples
  .map(
    (example, idx) =>
      `Example ${idx + 1}:
  Input: ${example.input}
  Output: ${example.output}
  ${example.explanation ? `Explanation: ${example.explanation}` : ""}`
  )
  .join("\n\n")}`
    : ""
}

${
  problem.testcases
    ? `Test Cases:
${problem.testcases
  .map(
    (tc, idx) =>
      `Test Case ${idx + 1}: Input: ${tc.input} | Expected Output: ${tc.output}`
  )
  .join("\n")}`
    : ""
}`;

      setDescription(problemContext);
    }
  }, [isOpen, problem]);

  // Move useEffect to the top level and make it conditional
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      @media (max-width: 1024px) {
        .responsive-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []); // Empty dependency array - only run once

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setError("");

    try {
      console.log("Making enhanced request to:", `${API_BASE_URL}/ai/generate`);

      const requestBody = {
        code,
        description: description || `${language} code solution`,
        prompt,
        language,
        // Enhanced problem context
        problemTitle: problem?.title,
        problemDescription: problem?.description,
        problemConstraints: problem?.constraints,
        problemExamples: problem?.examples,
        testCases: problem?.testcases,
      };

      console.log("Enhanced request body:", {
        ...requestBody,
        codeLength: code?.length,
        hasTestCases: !!problem?.testcases?.length,
        hasExamples: !!problem?.examples,
      });

      const res = await fetch(`${API_BASE_URL}/ai/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", res.status);

      // Check if response is actually JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await res.text();
        console.log("Non-JSON response:", textResponse);
        throw new Error(
          `Server returned ${
            contentType || "unknown"
          } instead of JSON. Check if backend is running correctly.`
        );
      }

      const data = await res.json();
      console.log("Enhanced response data:", data);

      if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}: ${res.statusText}`);
      }

      setResult(data.response);
    } catch (err) {
      console.error("Request failed:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const parseEnhancedReviewResult = (text) => {
    const parsed = {};

    // Extract various sections with more flexible matching
    const sections = {
      rating: /\*\*Code Rating\*\*\s*\n?\s*(\d+)\/100/i,
      algorithmCorrectness:
        /\*\*Algorithm Correctness\*\*\s*\n?\s*([\s\S]*?)(?=\*\*|$)/i,
      edgeCases: /\*\*Edge Case Handling\*\*\s*\n?\s*([\s\S]*?)(?=\*\*|$)/i,
      timeComplexity: /\*\*Time Complexity\*\*\s*\n?\s*([\s\S]*?)(?=\*\*|$)/i,
      spaceComplexity: /\*\*Space Complexity\*\*\s*\n?\s*([\s\S]*?)(?=\*\*|$)/i,
      codeQuality: /\*\*Code Quality\*\*\s*\n?\s*([\s\S]*?)(?=\*\*|$)/i,
      bugs: /\*\*Bug Detection\*\*\s*\n?\s*([\s\S]*?)(?=\*\*|$)/i,
      testCaseAnalysis:
        /\*\*Test Case Analysis\*\*\s*\n?\s*([\s\S]*?)(?=\*\*|$)/i,
      optimization:
        /\*\*Optimization Opportunities\*\*\s*\n?\s*([\s\S]*?)(?=\*\*|$)/i,
      bestPractices:
        /\*\*Best Practices Adherence\*\*\s*\n?\s*([\s\S]*?)(?=\*\*|$)/i,
      improvements:
        /\*\*Improvement Suggestions\*\*\s*\n?\s*([\s\S]*?)(?=\*\*|$)/i,
      alternatives:
        /\*\*Alternative Approaches\*\*\s*\n?\s*([\s\S]*?)(?=\*\*|$)/i,
    };

    Object.entries(sections).forEach(([key, regex]) => {
      const match = text.match(regex);
      if (match) {
        parsed[key] = key === "rating" ? match[1] : match[1].trim();
      }
    });

    console.log("Enhanced parsed result:", parsed);
    return parsed;
  };

  // Get language-specific styling and display name
  const getLanguageInfo = (lang) => {
    const languageMap = {
      javascript: { name: "JavaScript", color: "#f7df1e", bgColor: "#332d00" },
      typescript: { name: "TypeScript", color: "#3178c6", bgColor: "#001122" },
      python: { name: "Python", color: "#3776ab", bgColor: "#001a2e" },
      java: { name: "Java", color: "#ed8b00", bgColor: "#2d1b00" },
      cpp: { name: "C++", color: "#00599c", bgColor: "#001122" },
      "c++": { name: "C++", color: "#00599c", bgColor: "#001122" },
      c: { name: "C", color: "#a8b9cc", bgColor: "#1a1a1a" },
      csharp: { name: "C#", color: "#239120", bgColor: "#001a0d" },
      php: { name: "PHP", color: "#777bb4", bgColor: "#1a1a2e" },
      ruby: { name: "Ruby", color: "#cc342d", bgColor: "#2d0a09" },
      go: { name: "Go", color: "#00add8", bgColor: "#001a2e" },
      rust: { name: "Rust", color: "#dea584", bgColor: "#2d1f17" },
      swift: { name: "Swift", color: "#fa7343", bgColor: "#2d1309" },
      kotlin: { name: "Kotlin", color: "#7f52ff", bgColor: "#1a0d33" },
    };

    return (
      languageMap[lang?.toLowerCase()] || {
        name: lang || "Unknown",
        color: "#6b7280",
        bgColor: "#1f2937",
      }
    );
  };

  const langInfo = getLanguageInfo(language);
  const parsedResult = result ? parseEnhancedReviewResult(result) : null;

  if (!isOpen) return null;

  const modalStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      overflow: "auto",
    },
    modal: {
      backgroundColor: "#1f2937",
      borderRadius: "12px",
      width: "95%",
      maxWidth: "1400px",
      maxHeight: "90vh",
      padding: "24px",
      position: "relative",
      overflow: "auto",
      margin: "20px",
      border: "1px solid #374151",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "24px",
      paddingBottom: "16px",
      borderBottom: "2px solid #374151",
    },
    title: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    closeButton: {
      background: "none",
      border: "none",
      padding: "8px",
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#9ca3af",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 2fr",
      gap: "24px",
      "@media (max-width: 1024px)": {
        gridTemplateColumns: "1fr",
      },
    },
    card: {
      backgroundColor: "#111827",
      borderRadius: "8px",
      padding: "20px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
      border: "1px solid #374151",
    },
    input: {
      width: "100%",
      padding: "8px 12px",
      border: "1px solid #4b5563",
      borderRadius: "6px",
      fontSize: "14px",
      outline: "none",
      backgroundColor: "#1f2937",
      color: "#e5e7eb",
    },
    textarea: {
      width: "100%",
      padding: "8px 12px",
      border: "1px solid #4b5563",
      borderRadius: "6px",
      fontSize: "14px",
      outline: "none",
      minHeight: "120px",
      resize: "vertical",
      backgroundColor: "#1f2937",
      color: "#e5e7eb",
    },
    button: {
      width: "100%",
      padding: "12px 16px",
      backgroundColor: "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    buttonDisabled: {
      backgroundColor: "#4b5563",
      cursor: "not-allowed",
    },
    codePreview: {
      backgroundColor: "#0d1117",
      borderRadius: "8px",
      padding: "16px",
      maxHeight: "240px",
      overflow: "auto",
      border: "1px solid #21262d",
    },
    errorAlert: {
      backgroundColor: "#431317",
      border: "1px solid #991b1b",
      borderRadius: "6px",
      padding: "12px",
      marginTop: "16px",
      color: "#fca5a5",
    },
    ratingCard: {
      background: "linear-gradient(to right, #1e3a8a, #581c87)",
      border: "1px solid #3b82f6",
      borderRadius: "8px",
      padding: "20px",
    },
    sectionCard: {
      backgroundColor: "#111827",
      border: "1px solid #374151",
      borderRadius: "8px",
      padding: "20px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
    },
    sectionHeader: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "12px",
      color: "#e5e7eb",
    },
    codeBlock: {
      backgroundColor: "#0d1117",
      borderRadius: "6px",
      padding: "16px",
      overflow: "auto",
      fontSize: "13px",
      fontFamily: "monospace",
      whiteSpace: "pre-wrap",
      color: "#e6edf3",
      border: "1px solid #21262d",
    },
    spinner: {
      width: "48px",
      height: "48px",
      border: "4px solid #374151",
      borderTop: "4px solid #3b82f6",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "0 auto",
    },
    pulseText: {
      animation: "pulse 2s ease-in-out infinite",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "40px 20px",
    },
    languageTag: {
      backgroundColor: langInfo.bgColor,
      color: langInfo.color,
      padding: "4px 12px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "600",
      border: `1px solid ${langInfo.color}40`,
    },
    problemBadge: {
      backgroundColor: "#065f46",
      color: "#10b981",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "600",
      marginLeft: "8px",
    },
    resultsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "16px",
    },
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={modalStyles.header}>
          <div style={modalStyles.title}>
            <Brain size={32} color="#3b82f6" />
            <div>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  margin: 0,
                  color: "#e5e7eb",
                }}
              >
                Enhanced AI Code Review
                {problem && (
                  <span style={modalStyles.problemBadge}>
                    Problem-Aware Analysis
                  </span>
                )}
              </h3>
              <p style={{ fontSize: "14px", color: "#9ca3af", margin: 0 }}>
                Powered by Gemini AI • Algorithm Analysis • Test Case Validation
                {problem && ` • ${problem.title}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={modalStyles.closeButton}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#374151")}
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            <X size={24} />
          </button>
        </div>

        <div style={modalStyles.grid} className="responsive-grid">
          {/* Left Panel - Input Form */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <div style={modalStyles.card}>
              <h4
                style={{ ...modalStyles.sectionHeader, marginBottom: "16px" }}
              >
                <FileText size={20} />
                Analysis Configuration
              </h4>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      marginBottom: "8px",
                      color: "#e5e7eb",
                    }}
                  >
                    Problem Context & Description
                    {problem && (
                      <span
                        style={{
                          color: "#10b981",
                          fontSize: "12px",
                          marginLeft: "8px",
                        }}
                      >
                        (Auto-loaded from problem)
                      </span>
                    )}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={modalStyles.textarea}
                    placeholder={
                      problem
                        ? "Problem context has been automatically loaded..."
                        : `Describe your ${langInfo.name} solution...`
                    }
                    rows={6}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      marginBottom: "8px",
                      color: "#e5e7eb",
                    }}
                  >
                    Analysis Focus
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    style={{ ...modalStyles.textarea, minHeight: "80px" }}
                    placeholder="Focus areas: algorithm correctness, efficiency, edge cases..."
                    required
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading || !code.trim() || !language}
                  style={{
                    ...modalStyles.button,
                    ...(loading || !code.trim() || !language
                      ? modalStyles.buttonDisabled
                      : {}),
                  }}
                >
                  {loading ? (
                    <div
                      style={{
                        ...modalStyles.spinner,
                        width: "16px",
                        height: "16px",
                        border: "2px solid #ffffff40",
                        borderTop: "2px solid #ffffff",
                      }}
                    ></div>
                  ) : (
                    <Brain size={16} />
                  )}
                  {loading ? "Analyzing Solution..." : "Start Enhanced Review"}
                </button>
              </div>

              {error && (
                <div style={modalStyles.errorAlert}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <X size={16} />
                    <span style={{ fontSize: "14px" }}>{error}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Code Preview */}
            <div style={modalStyles.card}>
              <h4
                style={{ ...modalStyles.sectionHeader, marginBottom: "16px" }}
              >
                Solution to Analyze
              </h4>
              <div style={modalStyles.codePreview}>
                <pre
                  style={{
                    color: "#10b981",
                    fontSize: "13px",
                    fontFamily: "monospace",
                    margin: 0,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {code || "No code provided"}
                </pre>
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#9ca3af",
                  marginTop: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>Language:</span>
                <span style={modalStyles.languageTag}>{langInfo.name}</span>
                {problem?.testcases && (
                  <>
                    <span style={{ marginLeft: "8px" }}>Test Cases:</span>
                    <span style={{ color: "#10b981", fontWeight: "600" }}>
                      {problem.testcases.length}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {loading && (
              <div style={modalStyles.loadingContainer}>
                <div style={modalStyles.spinner}></div>
                <p
                  style={{
                    marginTop: "16px",
                    color: "#9ca3af",
                    ...modalStyles.pulseText,
                  }}
                >
                  AI is performing comprehensive analysis of your{" "}
                  {langInfo.name} solution...
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    Top: "12px",
                    margin: "0",
                  }}
                >
                  Analyzing algorithm correctness, edge cases, complexity, and
                  optimization opportunities...
                </p>
              </div>
            )}

            {result && parsedResult && (
              <>
                {/* Rating Overview */}
                {parsedResult.rating && (
                  <div style={modalStyles.ratingCard}>
                    <div
                      style={{
                        ...modalStyles.sectionHeader,
                        color: "#ffffff",
                        marginBottom: "16px",
                      }}
                    >
                      <Star size={24} color="#fbbf24" />
                      Code Rating
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: "48px",
                          fontWeight: "bold",
                          color: "#fbbf24",
                          marginBottom: "8px",
                        }}
                      >
                        {parsedResult.rating}/100
                      </div>
                      <div style={{ fontSize: "16px", color: "#e5e7eb" }}>
                        {parsedResult.rating >= 90
                          ? "Excellent"
                          : parsedResult.rating >= 80
                          ? "Very Good"
                          : parsedResult.rating >= 70
                          ? "Good"
                          : parsedResult.rating >= 60
                          ? "Fair"
                          : "Needs Improvement"}
                      </div>
                    </div>
                  </div>
                )}

                {/* Analysis Results Grid */}
                <div style={modalStyles.resultsGrid}>
                  {/* Algorithm Correctness */}
                  {parsedResult.algorithmCorrectness && (
                    <div style={modalStyles.sectionCard}>
                      <div style={modalStyles.sectionHeader}>
                        <CheckCircle size={20} color="#10b981" />
                        Algorithm Correctness
                      </div>
                      <div
                        style={{
                          color: "#e5e7eb",
                          lineHeight: "1.6",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {parsedResult.algorithmCorrectness}
                      </div>
                    </div>
                  )}

                  {/* Edge Case Handling */}
                  {parsedResult.edgeCases && (
                    <div style={modalStyles.sectionCard}>
                      <div style={modalStyles.sectionHeader}>
                        <AlertTriangle size={20} color="#f59e0b" />
                        Edge Case Handling
                      </div>
                      <div
                        style={{
                          color: "#e5e7eb",
                          lineHeight: "1.6",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {parsedResult.edgeCases}
                      </div>
                    </div>
                  )}

                  {/* Time Complexity */}
                  {parsedResult.timeComplexity && (
                    <div style={modalStyles.sectionCard}>
                      <div style={modalStyles.sectionHeader}>
                        <Clock size={20} color="#8b5cf6" />
                        Time Complexity
                      </div>
                      <div
                        style={{
                          color: "#e5e7eb",
                          lineHeight: "1.6",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {parsedResult.timeComplexity}
                      </div>
                    </div>
                  )}

                  {/* Space Complexity */}
                  {parsedResult.spaceComplexity && (
                    <div style={modalStyles.sectionCard}>
                      <div style={modalStyles.sectionHeader}>
                        <TrendingUp size={20} color="#06b6d4" />
                        Space Complexity
                      </div>
                      <div
                        style={{
                          color: "#e5e7eb",
                          lineHeight: "1.6",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {parsedResult.spaceComplexity}
                      </div>
                    </div>
                  )}

                  {/* Code Quality */}
                  {parsedResult.codeQuality && (
                    <div style={modalStyles.sectionCard}>
                      <div style={modalStyles.sectionHeader}>
                        <Code size={20} color="#3b82f6" />
                        Code Quality
                      </div>
                      <div
                        style={{
                          color: "#e5e7eb",
                          lineHeight: "1.6",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {parsedResult.codeQuality}
                      </div>
                    </div>
                  )}

                  {/* Bug Detection */}
                  {parsedResult.bugs && (
                    <div style={modalStyles.sectionCard}>
                      <div style={modalStyles.sectionHeader}>
                        <Bug size={20} color="#ef4444" />
                        Bug Detection
                      </div>
                      <div
                        style={{
                          color: "#e5e7eb",
                          lineHeight: "1.6",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {parsedResult.bugs}
                      </div>
                    </div>
                  )}

                  {/* Test Case Analysis */}
                  {parsedResult.testCaseAnalysis && (
                    <div style={modalStyles.sectionCard}>
                      <div style={modalStyles.sectionHeader}>
                        <TestTube size={20} color="#10b981" />
                        Test Case Analysis
                      </div>
                      <div
                        style={{
                          color: "#e5e7eb",
                          lineHeight: "1.6",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {parsedResult.testCaseAnalysis}
                      </div>
                    </div>
                  )}

                  {/* Optimization Opportunities */}
                  {parsedResult.optimization && (
                    <div style={modalStyles.sectionCard}>
                      <div style={modalStyles.sectionHeader}>
                        <Zap size={20} color="#f59e0b" />
                        Optimization Opportunities
                      </div>
                      <div
                        style={{
                          color: "#e5e7eb",
                          lineHeight: "1.6",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {parsedResult.optimization}
                      </div>
                    </div>
                  )}

                  {/* Best Practices */}
                  {parsedResult.bestPractices && (
                    <div style={modalStyles.sectionCard}>
                      <div style={modalStyles.sectionHeader}>
                        <Target size={20} color="#06b6d4" />
                        Best Practices Adherence
                      </div>
                      <div
                        style={{
                          color: "#e5e7eb",
                          lineHeight: "1.6",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {parsedResult.bestPractices}
                      </div>
                    </div>
                  )}

                  {/* Improvement Suggestions */}
                  {parsedResult.improvements && (
                    <div style={modalStyles.sectionCard}>
                      <div style={modalStyles.sectionHeader}>
                        <TrendingUp size={20} color="#10b981" />
                        Improvement Suggestions
                      </div>
                      <div
                        style={{
                          color: "#e5e7eb",
                          lineHeight: "1.6",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {parsedResult.improvements}
                      </div>
                    </div>
                  )}

                  {/* Alternative Approaches */}
                  {parsedResult.alternatives && (
                    <div style={modalStyles.sectionCard}>
                      <div style={modalStyles.sectionHeader}>
                        <Brain size={20} color="#8b5cf6" />
                        Alternative Approaches
                      </div>
                      <div
                        style={{
                          color: "#e5e7eb",
                          lineHeight: "1.6",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {parsedResult.alternatives}
                      </div>
                    </div>
                  )}
                </div>

                {/* Full Response Fallback */}
                {!parsedResult.rating && !parsedResult.algorithmCorrectness && (
                  <div style={modalStyles.sectionCard}>
                    <div style={modalStyles.sectionHeader}>
                      <FileText size={20} color="#6b7280" />
                      Full Analysis
                    </div>
                    <div style={modalStyles.codeBlock}>{result}</div>
                  </div>
                )}

                {/* Analysis Metadata */}
                <div
                  style={{
                    ...modalStyles.sectionCard,
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                  }}
                >
                  <div
                    style={{ ...modalStyles.sectionHeader, fontSize: "16px" }}
                  >
                    <Bot size={18} color="#64748b" />
                    Analysis Details
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "12px",
                      fontSize: "14px",
                    }}
                  >
                    <div style={{ color: "#94a3b8" }}>
                      <span style={{ color: "#64748b" }}>Language:</span>{" "}
                      {langInfo.name}
                    </div>
                    <div style={{ color: "#94a3b8" }}>
                      <span style={{ color: "#64748b" }}>Code Lines:</span>{" "}
                      {code.split("\n").length}
                    </div>
                    {problem?.testcases && (
                      <div style={{ color: "#94a3b8" }}>
                        <span style={{ color: "#64748b" }}>Test Cases:</span>{" "}
                        {problem.testcases.length}
                      </div>
                    )}
                    <div style={{ color: "#94a3b8" }}>
                      <span style={{ color: "#64748b" }}>Analysis Type:</span>{" "}
                      Comprehensive
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Empty State */}
            {!loading && !result && !error && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "#6b7280",
                }}
              >
                <Brain
                  size={48}
                  color="#374151"
                  style={{ marginBottom: "16px" }}
                />
                <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>
                  Ready for Analysis
                </h3>
                <p style={{ fontSize: "14px" }}>
                  Configure your analysis settings and click "Start Enhanced
                  Review" to begin.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiReviewModal;
