import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Code,
  BarChart3,
  FileText,
  Zap,
  Users,
  Trophy,
  Target,
  Terminal,
  GitBranch,
  Database,
  Cpu,
  Bug,
  CheckCircle,
  XCircle,
  Clock,
  Hash,
  Settings,
  Activity,
  ChevronRight,
  Sparkles,
  Layers,
  BookOpen,
  Award,
} from "lucide-react";

const LandingPage = () => {
  const [terminalText, setTerminalText] = useState("");
  const [currentCommand, setCurrentCommand] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    problems: 0,
    success: 0,
    runtime: 0,
  });
  const [activeTab, setActiveTab] = useState("arrays");
  const [activeLanguage, setActiveLanguage] = useState("javascript");
  const [testResults, setTestResults] = useState([]);
  const [floatingParticles, setFloatingParticles] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(0);

  const commands = [
    "codedrill solve two-sum --lang python",
    "codedrill test binary-search --all",
    "codedrill optimize merge-sort --complexity",
    "codedrill submit graph-traversal --best",
    "codedrill analyze fibonacci-dp --benchmark",
  ];

  const problemTitles = [
    "Two Sum - Hash Map Approach",
    "Binary Search - Divide & Conquer",
    "Merge Sort - Optimal Implementation",
    "Graph DFS - Recursive Solution",
    "Fibonacci DP - Memoization",
  ];

  const dsaProblems = {
    arrays: {
      javascript: [
        "// Two Sum - Optimized Hash Map Solution",
        "function twoSum(nums, target) {",
        "  const hashMap = new Map();",
        "  ",
        "  for (let i = 0; i < nums.length; i++) {",
        "    const complement = target - nums[i];",
        "    ",
        "    if (hashMap.has(complement)) {",
        "      return [hashMap.get(complement), i];",
        "    }",
        "    ",
        "    hashMap.set(nums[i], i);",
        "  }",
        "  ",
        "  return [];",
        "}",
        "",
        "// Time: O(n) | Space: O(n)",
        "console.log(twoSum([2,7,11,15], 9)); // [0,1]",
      ],
      python: [
        "# Maximum Subarray - Kadane's Algorithm",
        "def max_subarray_sum(nums):",
        '    """',
        "    Find maximum sum of contiguous subarray",
        "    Time: O(n), Space: O(1)",
        '    """',
        "    max_ending_here = max_so_far = nums[0]",
        "    ",
        "    for i in range(1, len(nums)):",
        "        max_ending_here = max(nums[i], ",
        "                             max_ending_here + nums[i])",
        "        max_so_far = max(max_so_far, max_ending_here)",
        "    ",
        "    return max_so_far",
        "",
        "# Test case",
        "print(max_subarray_sum([-2,1,-3,4,-1,2,1,-5,4]))",
      ],
      java: [
        "// Product of Array Except Self",
        "public class Solution {",
        "    public int[] productExceptSelf(int[] nums) {",
        "        int n = nums.length;",
        "        int[] result = new int[n];",
        "        ",
        "        // Forward pass - left products",
        "        result[0] = 1;",
        "        for (int i = 1; i < n; i++) {",
        "            result[i] = result[i - 1] * nums[i - 1];",
        "        }",
        "        ",
        "        // Backward pass - right products",
        "        int rightProduct = 1;",
        "        for (int i = n - 1; i >= 0; i--) {",
        "            result[i] *= rightProduct;",
        "            rightProduct *= nums[i];",
        "        }",
        "        ",
        "        return result;",
        "    }",
        "}",
      ],
      cpp: [
        "// Container With Most Water",
        "#include <vector>",
        "#include <algorithm>",
        "using namespace std;",
        "",
        "class Solution {",
        "public:",
        "    int maxArea(vector<int>& height) {",
        "        int left = 0, right = height.size() - 1;",
        "        int maxWater = 0;",
        "        ",
        "        while (left < right) {",
        "            int currentWater = min(height[left], height[right]) * (right - left);",
        "            maxWater = max(maxWater, currentWater);",
        "            ",
        "            if (height[left] < height[right]) {",
        "                left++;",
        "            } else {",
        "                right--;",
        "            }",
        "        }",
        "        ",
        "        return maxWater;",
        "    }",
        "};",
      ],
    },
    trees: {
      javascript: [
        "// Binary Tree Level Order Traversal",
        "function levelOrder(root) {",
        "  if (!root) return [];",
        "  ",
        "  const result = [];",
        "  const queue = [root];",
        "  ",
        "  while (queue.length > 0) {",
        "    const levelSize = queue.length;",
        "    const currentLevel = [];",
        "    ",
        "    for (let i = 0; i < levelSize; i++) {",
        "      const node = queue.shift();",
        "      currentLevel.push(node.val);",
        "      ",
        "      if (node.left) queue.push(node.left);",
        "      if (node.right) queue.push(node.right);",
        "    }",
        "    ",
        "    result.push(currentLevel);",
        "  }",
        "  ",
        "  return result;",
        "}",
      ],
      python: [
        "# Maximum Depth of Binary Tree",
        "class TreeNode:",
        "    def __init__(self, val=0, left=None, right=None):",
        "        self.val = val",
        "        self.left = left",
        "        self.right = right",
        "",
        "def maxDepth(root):",
        '    """',
        "    Find maximum depth using DFS",
        "    Time: O(n), Space: O(h) where h is height",
        '    """',
        "    if not root:",
        "        return 0",
        "    ",
        "    left_depth = maxDepth(root.left)",
        "    right_depth = maxDepth(root.right)",
        "    ",
        "    return 1 + max(left_depth, right_depth)",
      ],
      java: [
        "// Validate Binary Search Tree",
        "public class TreeNode {",
        "    int val;",
        "    TreeNode left;",
        "    TreeNode right;",
        "    TreeNode() {}",
        "    TreeNode(int val) { this.val = val; }",
        "}",
        "",
        "public class Solution {",
        "    public boolean isValidBST(TreeNode root) {",
        "        return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);",
        "    }",
        "    ",
        "    private boolean validate(TreeNode node, long min, long max) {",
        "        if (node == null) return true;",
        "        ",
        "        if (node.val <= min || node.val >= max) {",
        "            return false;",
        "        }",
        "        ",
        "        return validate(node.left, min, node.val) &&",
        "               validate(node.right, node.val, max);",
        "    }",
        "}",
      ],
      cpp: [
        "// Binary Tree Right Side View",
        "#include <vector>",
        "#include <queue>",
        "using namespace std;",
        "",
        "struct TreeNode {",
        "    int val;",
        "    TreeNode *left;",
        "    TreeNode *right;",
        "    TreeNode() : val(0), left(nullptr), right(nullptr) {}",
        "};",
        "",
        "class Solution {",
        "public:",
        "    vector<int> rightSideView(TreeNode* root) {",
        "        vector<int> result;",
        "        if (!root) return result;",
        "        ",
        "        queue<TreeNode*> q;",
        "        q.push(root);",
        "        ",
        "        while (!q.empty()) {",
        "            int size = q.size();",
        "            for (int i = 0; i < size; i++) {",
        "                TreeNode* node = q.front();",
        "                q.pop();",
        "                ",
        "                if (i == size - 1) {",
        "                    result.push_back(node->val);",
        "                }",
        "                ",
        "                if (node->left) q.push(node->left);",
        "                if (node->right) q.push(node->right);",
        "            }",
        "        }",
        "        ",
        "        return result;",
        "    }",
        "};",
      ],
    },
    graphs: {
      javascript: [
        "// Number of Islands - DFS Solution",
        "function numIslands(grid) {",
        "  if (!grid || grid.length === 0) return 0;",
        "  ",
        "  const rows = grid.length;",
        "  const cols = grid[0].length;",
        "  let count = 0;",
        "  ",
        "  function dfs(i, j) {",
        '    if (i < 0 || i >= rows || j < 0 || j >= cols || grid[i][j] === "0") {',
        "      return;",
        "    }",
        "    ",
        '    grid[i][j] = "0"; // Mark as visited',
        "    ",
        "    // Explore all 4 directions",
        "    dfs(i + 1, j);",
        "    dfs(i - 1, j);",
        "    dfs(i, j + 1);",
        "    dfs(i, j - 1);",
        "  }",
        "  ",
        "  for (let i = 0; i < rows; i++) {",
        "    for (let j = 0; j < cols; j++) {",
        '      if (grid[i][j] === "1") {',
        "        count++;",
        "        dfs(i, j);",
        "      }",
        "    }",
        "  }",
        "  ",
        "  return count;",
        "}",
      ],
      python: [
        "# Graph DFS - Adjacency List Implementation",
        "def dfs_iterative(graph, start):",
        '    """',
        "    Depth-First Search using iterative approach",
        "    Time: O(V + E), Space: O(V)",
        '    """',
        "    visited = set()",
        "    stack = [start]",
        "    result = []",
        "    ",
        "    while stack:",
        "        vertex = stack.pop()",
        "        ",
        "        if vertex not in visited:",
        "            visited.add(vertex)",
        "            result.append(vertex)",
        "            ",
        "            # Add neighbors in reverse order",
        "            for neighbor in reversed(graph[vertex]):",
        "                if neighbor not in visited:",
        "                    stack.append(neighbor)",
        "    ",
        "    return result",
      ],
      java: [
        "// Course Schedule - Topological Sort",
        "import java.util.*;",
        "",
        "public class Solution {",
        "    public boolean canFinish(int numCourses, int[][] prerequisites) {",
        "        // Build adjacency list",
        "        List<List<Integer>> graph = new ArrayList<>();",
        "        int[] indegree = new int[numCourses];",
        "        ",
        "        for (int i = 0; i < numCourses; i++) {",
        "            graph.add(new ArrayList<>());",
        "        }",
        "        ",
        "        for (int[] prereq : prerequisites) {",
        "            graph.get(prereq[1]).add(prereq[0]);",
        "            indegree[prereq[0]]++;",
        "        }",
        "        ",
        "        Queue<Integer> queue = new LinkedList<>();",
        "        for (int i = 0; i < numCourses; i++) {",
        "            if (indegree[i] == 0) {",
        "                queue.offer(i);",
        "            }",
        "        }",
        "        ",
        "        int count = 0;",
        "        while (!queue.isEmpty()) {",
        "            int course = queue.poll();",
        "            count++;",
        "            ",
        "            for (int neighbor : graph.get(course)) {",
        "                indegree[neighbor]--;",
        "                if (indegree[neighbor] == 0) {",
        "                    queue.offer(neighbor);",
        "                }",
        "            }",
        "        }",
        "        ",
        "        return count == numCourses;",
        "    }",
        "}",
      ],
      cpp: [
        "// Clone Graph - DFS with HashMap",
        "#include <unordered_map>",
        "#include <vector>",
        "using namespace std;",
        "",
        "class Node {",
        "public:",
        "    int val;",
        "    vector<Node*> neighbors;",
        "    Node() {",
        "        val = 0;",
        "        neighbors = vector<Node*>();",
        "    }",
        "    Node(int _val) {",
        "        val = _val;",
        "        neighbors = vector<Node*>();",
        "    }",
        "};",
        "",
        "class Solution {",
        "private:",
        "    unordered_map<Node*, Node*> visited;",
        "    ",
        "public:",
        "    Node* cloneGraph(Node* node) {",
        "        if (!node) return nullptr;",
        "        ",
        "        if (visited.find(node) != visited.end()) {",
        "            return visited[node];",
        "        }",
        "        ",
        "        Node* cloneNode = new Node(node->val);",
        "        visited[node] = cloneNode;",
        "        ",
        "        for (Node* neighbor : node->neighbors) {",
        "            cloneNode->neighbors.push_back(cloneGraph(neighbor));",
        "        }",
        "        ",
        "        return cloneNode;",
        "    }",
        "};",
      ],
    },
    dp: {
      javascript: [
        "// Climbing Stairs - Dynamic Programming",
        "function climbStairs(n) {",
        "  if (n <= 2) return n;",
        "  ",
        "  let prev2 = 1; // dp[i-2]",
        "  let prev1 = 2; // dp[i-1]",
        "  ",
        "  for (let i = 3; i <= n; i++) {",
        "    const current = prev1 + prev2;",
        "    prev2 = prev1;",
        "    prev1 = current;",
        "  }",
        "  ",
        "  return prev1;",
        "}",
        "",
        "// Space-optimized: O(1) space, O(n) time",
        "console.log(climbStairs(5)); // 8",
        "",
        "// Memoization approach",
        "function climbStairsMemo(n, memo = {}) {",
        "  if (n in memo) return memo[n];",
        "  if (n <= 2) return n;",
        "  ",
        "  memo[n] = climbStairsMemo(n-1, memo) + climbStairsMemo(n-2, memo);",
        "  return memo[n];",
        "}",
      ],
      python: [
        "# Longest Common Subsequence - 2D DP",
        "def longestCommonSubsequence(text1, text2):",
        '    """',
        "    Find LCS using bottom-up DP",
        "    Time: O(m*n), Space: O(m*n)",
        '    """',
        "    m, n = len(text1), len(text2)",
        "    dp = [[0] * (n + 1) for _ in range(m + 1)]",
        "    ",
        "    for i in range(1, m + 1):",
        "        for j in range(1, n + 1):",
        "            if text1[i-1] == text2[j-1]:",
        "                dp[i][j] = dp[i-1][j-1] + 1",
        "            else:",
        "                dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
        "    ",
        "    return dp[m][n]",
        "",
        "# Test case",
        'print(longestCommonSubsequence("abcde", "ace"))  # 3',
      ],
      java: [
        "// House Robber - Linear DP",
        "public class Solution {",
        "    public int rob(int[] nums) {",
        "        if (nums.length == 0) return 0;",
        "        if (nums.length == 1) return nums[0];",
        "        ",
        "        int prev2 = nums[0];",
        "        int prev1 = Math.max(nums[0], nums[1]);",
        "        ",
        "        for (int i = 2; i < nums.length; i++) {",
        "            int current = Math.max(prev1, prev2 + nums[i]);",
        "            prev2 = prev1;",
        "            prev1 = current;",
        "        }",
        "        ",
        "        return prev1;",
        "    }",
        "    ",
        "    // Alternative: Standard DP approach",
        "    public int robDP(int[] nums) {",
        "        int n = nums.length;",
        "        if (n == 0) return 0;",
        "        if (n == 1) return nums[0];",
        "        ",
        "        int[] dp = new int[n];",
        "        dp[0] = nums[0];",
        "        dp[1] = Math.max(nums[0], nums[1]);",
        "        ",
        "        for (int i = 2; i < n; i++) {",
        "            dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);",
        "        }",
        "        ",
        "        return dp[n-1];",
        "    }",
        "}",
      ],
      cpp: [
        "// Coin Change - Unbounded Knapsack DP",
        "#include <vector>",
        "#include <algorithm>",
        "#include <climits>",
        "using namespace std;",
        "",
        "class Solution {",
        "public:",
        "    int coinChange(vector<int>& coins, int amount) {",
        "        vector<int> dp(amount + 1, INT_MAX);",
        "        dp[0] = 0;",
        "        ",
        "        for (int i = 1; i <= amount; i++) {",
        "            for (int coin : coins) {",
        "                if (coin <= i && dp[i - coin] != INT_MAX) {",
        "                    dp[i] = min(dp[i], dp[i - coin] + 1);",
        "                }",
        "            }",
        "        }",
        "        ",
        "        return dp[amount] == INT_MAX ? -1 : dp[amount];",
        "    }",
        "    ",
        "    // Space-optimized version for large amounts",
        "    int coinChangeOptimized(vector<int>& coins, int amount) {",
        "        vector<int> dp(amount + 1, amount + 1);",
        "        dp[0] = 0;",
        "        ",
        "        for (int i = 1; i <= amount; i++) {",
        "            for (int coin : coins) {",
        "                if (coin <= i) {",
        "                    dp[i] = min(dp[i], dp[i - coin] + 1);",
        "                }",
        "            }",
        "        }",
        "        ",
        "        return dp[amount] > amount ? -1 : dp[amount];",
        "    }",
        "};",
      ],
    },
  };

  const targetStats = {
    users: 125000,
    problems: 750000,
    success: 98,
    runtime: 45,
  };

  // Floating particles for visual appeal
  useEffect(() => {
    const particles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    setFloatingParticles(particles);

    const interval = setInterval(() => {
      setFloatingParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          y: (particle.y + particle.speed) % 105,
          opacity: 0.2 + Math.sin(Date.now() * 0.001 + particle.id) * 0.3,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Terminal animation
  useEffect(() => {
    const command = commands[currentCommand];
    if (terminalText.length < command.length) {
      const timeout = setTimeout(() => {
        setTerminalText(command.slice(0, terminalText.length + 1));
      }, 50 + Math.random() * 40);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setTerminalText("");
        setCurrentCommand((prev) => (prev + 1) % commands.length);
        setCurrentProblem((prev) => (prev + 1) % problemTitles.length);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [terminalText, currentCommand]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Stats animation
  useEffect(() => {
    const duration = 2500;
    const startTime = Date.now();

    const animateStats = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setAnimatedStats({
        users: Math.floor(targetStats.users * easeOutQuart),
        problems: Math.floor(targetStats.problems * easeOutQuart),
        success: Math.floor(targetStats.success * easeOutQuart),
        runtime: Math.floor(targetStats.runtime * easeOutQuart),
      });

      if (progress < 1) {
        requestAnimationFrame(animateStats);
      }
    };

    setTimeout(() => animateStats(), 800);
  }, []);

  // Test results simulation
  useEffect(() => {
    const testSuites = [
      { test: "Edge cases", status: "passed", time: "2ms" },
      { test: "Large input (10⁴)", status: "passed", time: "38ms" },
      { test: "Stress test", status: "passed", time: "156ms" },
      { test: "Memory check", status: "passed", time: "5ms" },
    ];
    setTestResults(testSuites);
  }, []);

  return (
    <div className="min-h-screen w-12/12 mx-auto bg-gradient-to-br from-slate-950 via-slate-900 px-10 to-slate-800 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>

        {/* Floating Particles */}
        {floatingParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              transform: `scale(${particle.size})`,
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Hash className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                CodeDrill
              </span>
              <div className="text-xs text-slate-400 font-mono">
                DSA Platform
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/login"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 text-white"
            >
              Signup
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Content */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">AI-Powered Learning</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-none">
                <span className="block text-white">Master</span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
                  Algorithms
                </span>
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed max-w-md">
                Solve data structures and algorithms problems with real-time
                feedback, complexity analysis, and performance insights.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/login"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Start Solving</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/"
                className="border border-slate-600 px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Browse Problems</span>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/30 backdrop-blur-sm p-5 rounded-xl border border-slate-700/50">
                <div className="text-3xl font-bold text-white mb-1">
                  {animatedStats.users.toLocaleString()}+
                </div>
                <div className="text-sm text-slate-400 flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>Active Learners</span>
                </div>
              </div>
              <div className="bg-slate-800/30 backdrop-blur-sm p-5 rounded-xl border border-slate-700/50">
                <div className="text-3xl font-bold text-white mb-1">
                  {animatedStats.problems.toLocaleString()}+
                </div>
                <div className="text-sm text-slate-400 flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>Problems Solved</span>
                </div>
              </div>
            </div>

            {/* Language Support */}
            <div className="space-y-3">
              <div className="text-sm text-slate-400">Supported Languages</div>
              <div className="flex flex-wrap gap-2">
                {["Python", "JavaScript", "Java", "C++", "Go"].map((lang) => (
                  <div
                    key={lang}
                    className="bg-slate-800 px-3 py-1.5 rounded-lg text-sm border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    {lang}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Code Editor */}
          <div className="lg:col-span-7 space-y-6">
            {/* Terminal */}
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-slate-700/50">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-mono text-slate-400">
                    Terminal
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {problemTitles[currentProblem]}
                </div>
              </div>
              <div className="p-6 font-mono text-sm">
                <div className="text-slate-400 mb-3">
                  <span className="text-emerald-400">user@codedrill</span>
                  <span className="text-slate-500">:</span>
                  <span className="text-blue-400">~/problems</span>
                  <span className="text-slate-500">$</span>
                </div>
                <div className="text-white flex items-center">
                  {terminalText}
                  <span
                    className={`ml-1 ${
                      showCursor ? "opacity-100" : "opacity-0"
                    } transition-opacity`}
                  >
                    █
                  </span>
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-slate-700/50">
                <div className="flex space-x-1">
                  {Object.keys(dsaProblems).map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setActiveTab(topic)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        activeTab === topic
                          ? "bg-blue-600 text-white"
                          : "text-slate-400 hover:text-white hover:bg-slate-700"
                      }`}
                    >
                      {topic.charAt(0).toUpperCase() + topic.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="flex space-x-1">
                  {Object.keys(dsaProblems[activeTab] || {}).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLanguage(lang)}
                      className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-300 ${
                        activeLanguage === lang
                          ? "bg-purple-600 text-white"
                          : "text-slate-400 hover:text-white hover:bg-slate-700"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 font-mono text-sm bg-slate-950/50 min-h-80">
                {(dsaProblems[activeTab]?.[activeLanguage] || []).map(
                  (line, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-slate-500 mr-6 select-none w-8 text-right">
                        {line.trim() ? index + 1 : ""}
                      </span>
                      <div className="flex-1">
                        {line
                          .split(
                            /(\b(?:function|def|class|const|let|var|if|else|for|while|return|import|from|public|private|protected|static|int|String|boolean|vector|include|using|namespace)\b|\/\/.*|#.*|"[^"]*"|'[^']*'|\d+)/g
                          )
                          .map((part, i) => {
                            if (
                              [
                                "function",
                                "def",
                                "class",
                                "const",
                                "let",
                                "var",
                                "if",
                                "else",
                                "for",
                                "while",
                                "return",
                                "import",
                                "from",
                                "public",
                                "private",
                                "protected",
                                "static",
                                "int",
                                "String",
                                "boolean",
                                "vector",
                                "include",
                                "using",
                                "namespace",
                              ].includes(part)
                            ) {
                              return (
                                <span
                                  key={i}
                                  className="text-purple-400 font-semibold"
                                >
                                  {part}
                                </span>
                              );
                            } else if (
                              part.startsWith("//") ||
                              part.startsWith("#")
                            ) {
                              return (
                                <span key={i} className="text-slate-500 italic">
                                  {part}
                                </span>
                              );
                            } else if (
                              part.startsWith('"') ||
                              part.startsWith("'")
                            ) {
                              return (
                                <span key={i} className="text-emerald-400">
                                  {part}
                                </span>
                              );
                            } else if (/^\d+$/.test(part)) {
                              return (
                                <span key={i} className="text-blue-400">
                                  {part}
                                </span>
                              );
                            }
                            return (
                              <span key={i} className="text-slate-300">
                                {part}
                              </span>
                            );
                          })}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Test Results */}
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-slate-700/50">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="font-medium">Test Results</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <span>Runtime: O(n)</span>
                  <span>Memory: {animatedStats.runtime}MB</span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-300">{result.test}</span>
                    </div>
                    <span className="text-sm text-slate-400 font-mono">
                      {result.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: Database,
              title: "Problem Bank",
              desc: "1000+ curated problems",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              icon: BarChart3,
              title: "Real-time Analysis",
              desc: "Complexity & performance metrics",
              gradient: "from-purple-500 to-pink-500",
            },
            {
              icon: Trophy,
              title: "Competitions",
              desc: "Weekly coding contests",
              gradient: "from-emerald-500 to-teal-500",
            },
            {
              icon: Award,
              title: "Certification",
              desc: "Earn verified certificates",
              gradient: "from-orange-500 to-red-500",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:scale-105"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Success Rate Banner */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm px-8 py-4 rounded-full border border-emerald-500/30">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 font-semibold">
                {animatedStats.success}% Success Rate
              </span>
            </div>
            <div className="w-px h-6 bg-slate-600"></div>
            <span className="text-slate-300">Join thousands mastering DSA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
