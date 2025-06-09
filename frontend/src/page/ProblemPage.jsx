import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  BookOpen,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
  Bot,
  Sparkles,
  Eye,
  EyeOff,
  Loader, // Added this import
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../lib/lang";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import Submission from "../components/Submission";
import SubmissionsList from "../components/SubmissionList";
import GeminiReviewModal from "../components/GeminiReviewModal";

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();
  console.log("problem", problem);
  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("c++");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testcases, setTestcases] = useState([]);
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
  const [showTestCases, setShowTestCases] = useState(true);

  const { executeCode, submission, isExecuting } = useExecutionStore();

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(
        problem.codeSnippets?.[selectedLanguage] || submission?.sourceCode || ""
      );
      setTestcases(
        problem.testcases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
    console.log("submission", submissions);
  }, [activeTab, id]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.[lang] || "");
  };

  const handleRunCode = (e) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);
      executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  const handleAIReview = () => {
    if (!code.trim()) {
      alert("Please write some code before requesting an AI review!");
      return;
    }
    setIsGeminiModalOpen(true);
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center w-12/12 h-screen bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-10 h-10 animate-spin text-blue-500" />
          <p className="text-gray-300 text-lg">Loading problem...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="space-y-6">
            <div className="text-gray-300 leading-relaxed text-sm">
              {problem.description}
            </div>

            {problem.examples && (
              <div>
                <h3 className="text-gray-200 font-medium mb-3 text-sm">
                  Example:
                </h3>
                {Object.entries(problem.examples).map(
                  ([lang, example], idx) => (
                    <div
                      key={lang}
                      className="bg-gray-800/50 border border-gray-800 rounded-lg p-4 space-y-3 text-xs font-mono"
                    >
                      <div>
                        <div className="text-blue-400 mb-1">Input:</div>
                        <div className="text-gray-300">{example.input}</div>
                      </div>
                      <div>
                        <div className="text-green-400 mb-1">Output:</div>
                        <div className="text-gray-300">{example.output}</div>
                      </div>
                      {example.explanation && (
                        <div>
                          <div className="text-yellow-400 mb-1">
                            Explanation:
                          </div>
                          <div className="text-gray-400 text-xs">
                            {example.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            )}

            {problem.constraints && (
              <div>
                <h3 className="text-gray-200 font-medium mb-3 text-sm">
                  Constraints:
                </h3>
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                  <div className="text-gray-300 font-mono text-xs">
                    {problem.constraints}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "submissions":
        return isSubmissionsLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="flex flex-col items-center space-y-4">
              <Loader className="w-6 h-6 animate-spin text-blue-500" />
              <span className="text-gray-300 text-sm">Loading submissions...</span>
            </div>
          </div>
        ) : (
          <SubmissionsList
            submissions={submissions}
            isLoading={isSubmissionsLoading}
          />
        );

      case "discussion":
        return (
          <div className="text-center text-gray-500 py-8 text-sm">
            No discussions yet
          </div>
        );
      case "hints":
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                <div className="text-gray-300 font-mono text-xs">
                  {problem.hints}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8 text-sm">
                No hints available
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const getMonacoLanguage = (lang) => {
    switch (lang.toLowerCase()) {
      case "c++":
        return "cpp";
      case "c":
        return "c";
      case "javascript":
        return "javascript";
      case "python":
        return "python";
      case "java":
        return "java";
      default:
        return lang.toLowerCase();
    }
  };

  return (
    <div className="min-h-screen bg-gray-9800 text-gray-200 w-12/12 px-0 mx-auto overflow-x-hidden">
      {/* Minimal Header */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link
              to={"/home"}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-600" />
            <h1 className="text-gray-200 font-medium text-sm">
              {problem.title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{submissionCount} solved</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>
                  {new Date(problem.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" />
                <span>95% Success</span>
              </div>
            </div>

            <button
              className={`p-2 rounded transition-colors ${
                isBookmarked
                  ? "text-blue-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button className="p-2 rounded text-gray-400 hover:text-gray-200 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>

            <select
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              {Object.keys(problem.codeSnippets || {}).map((lang) => (
                <option key={lang} value={lang} className="bg-gray-800">
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-60px)]">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r border-gray-800 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-800 bg-gray-900/30">
            {[
              { id: "description", label: "Problem", icon: FileText },
              { id: "submissions", label: "Submissions", icon: Code2 },
              { id: "discussion", label: "Discuss", icon: MessageSquare },
              { id: "hints", label: "Hints", icon: Lightbulb },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium transition-colors ${
                  activeTab === id
                    ? "text-blue-400 border-b-2 border-blue-400 bg-gray-900/50"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setActiveTab(id)}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-auto">{renderTabContent()}</div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/30">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-200">Code</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                className={`flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors ${
                  isExecuting ? "opacity-75" : ""
                }`}
                onClick={handleRunCode}
                disabled={isExecuting}
              >
                {isExecuting ? (
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-3 h-3" />
                )}
                Run
              </button>

              <button
                className="relative flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-400 hover:via-cyan-400 hover:to-blue-400 text-white rounded-lg text-xs font-semibold transition-all duration-200 transform hover:scale-102 shadow-md hover:shadow-lg disabled:opacity-50 disabled:transform-none border border-white/20 backdrop-blur-sm"
                style={{
                  boxShadow:
                    "0 0 15px rgba(16, 185, 129, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                }}
                onClick={handleAIReview}
                disabled={!code.trim()}
              >
                <Bot className="w-3 h-3 drop-shadow-sm relative z-10" />
                <span className="relative z-10">✨ AI Review</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              language={getMonacoLanguage(selectedLanguage)}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
                fontFamily: "Fira Code, Monaco, 'Courier New', monospace",
                lineHeight: 1.6,
                padding: { top: 16, bottom: 16 },
                smoothScrolling: true,
                cursorBlinking: "smooth",
                renderLineHighlight: "gutter",
                occurrencesHighlight: false,
                selectionHighlight: false,
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Panel - Test Cases (Collapsible) */}
      {showTestCases && (
        <div className="border-t border-gray-800 bg-gray-900/30">
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
            <h3 className="text-sm font-medium text-gray-200">
              {submission ? "Results" : "Test Cases"}
            </h3>
            <button
              onClick={() => setShowTestCases(false)}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6">
            {submission ? (
              <Submission submission={submission} />
            ) : (
              <div className="space-y-3">
                {testcases.map((testCase, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-6 p-4 bg-gray-900/50 border border-gray-800 rounded-lg"
                  >
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Input</div>
                      <div className="font-mono text-xs text-gray-300">
                        {testCase.input}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">
                        Expected Output
                      </div>
                      <div className="font-mono text-xs text-gray-300">
                        {testCase.output}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Show Test Cases Button */}
      {!showTestCases && (
        <button
          onClick={() => setShowTestCases(true)}
          className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm font-medium transition-colors border border-gray-700"
        >
          <Eye className="w-4 h-4" />
          Show Test Cases
        </button>
      )}

      {/* Gemini Review Modal */}
      <GeminiReviewModal
        isOpen={isGeminiModalOpen}
        onClose={() => setIsGeminiModalOpen(false)}
        code={code}
        language={selectedLanguage}
        problem={problem}
      />
    </div>
  );
};

export default ProblemPage;