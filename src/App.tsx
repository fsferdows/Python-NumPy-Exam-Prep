import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Settings, 
  Play, 
  Award, 
  Layers, 
  HelpCircle, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Sliders, 
  RefreshCw, 
  CheckCircle, 
  Bookmark, 
  Code, 
  TrendingUp, 
  Calculator, 
  Cpu, 
  ExternalLink,
  ChevronLeft,
  GraduationCap
} from 'lucide-react';
import { 
  SYLLABUS_QUESTIONS, 
  CODING_CHALLENGES, 
  SyllabusQuestion, 
  CodingChallenge 
} from './syllabusData';

export default function App() {
  // Navigation Tabs: 'syllabus' | 'workbench' | 'simulator' | 'quiz'
  const [activeTab, setActiveTab] = useState<'syllabus' | 'workbench' | 'simulator' | 'quiz'>('syllabus');

  // --- LOCAL PERSISTENCE SYSTEM ---
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('syllabus_mastered_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('syllabus_bookmarked_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userNotes, setUserNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('syllabus_user_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [quizHighScore, setQuizHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('syllabus_quiz_highscore');
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    localStorage.setItem('syllabus_mastered_ids', JSON.stringify(masteredIds));
  }, [masteredIds]);

  useEffect(() => {
    localStorage.setItem('syllabus_bookmarked_ids', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  useEffect(() => {
    localStorage.setItem('syllabus_user_notes', JSON.stringify(userNotes));
  }, [userNotes]);

  const toggleMastered = (id: string) => {
    setMasteredIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleBookmarked = (id: string) => {
    setBookmarkedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const setNote = (id: string, note: string) => {
    setUserNotes(prev => ({ ...prev, [id]: note }));
  };

  // --- TAB 1: SYLLABUS DIRECTORY ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Python Basics' | 'NumPy' | 'Linear Regression Theory'>('all');
  const [filterBookmarked, setFilterBookmarked] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>("q1");
  const [activeNoteEditingId, setActiveNoteEditingId] = useState<string | null>(null);
  const [noteTextTemp, setNoteTextTemp] = useState('');
  const [isHandbookOpen, setIsHandbookOpen] = useState(true);

  // Export Study Notes to text file format
  const exportNotesToTxt = () => {
    const questionNotes = SYLLABUS_QUESTIONS.filter(q => userNotes[q.id]?.trim());
    
    let content = "";
    content += "========================================================\n";
    content += "           PYTHON SYLLABUS REVISION STUDY NOTES          \n";
    content += "========================================================\n";
    content += `Generated on: ${new Date().toLocaleDateString()} (${new Date().toLocaleTimeString()})\n`;
    content += `Total Notes Recorded: ${questionNotes.length}\n`;
    content += "========================================================\n\n";

    if (questionNotes.length === 0) {
      content += "[No custom study notes recorded yet. Please write key concepts, formulas, or study notes within the Syllabus Directory and click Export!]\n\n";
    } else {
      questionNotes.forEach((q) => {
        content += `--------------------------------------------------------\n`;
        content += `QUESTION ${q.number}: [${q.category}] ${q.question}\n`;
        content += `--------------------------------------------------------\n`;
        content += `Syllabus Answer:\n${q.answer}\n\n`;
        if (q.codeSnippet) {
          content += `Syllabus Code Snippet:\n${q.codeSnippet}\n\n`;
        }
        content += `My Saved Note:\n>>> ${userNotes[q.id]}\n\n\n`;
      });
    }

    content += "========================================================\n";
    content += "         End of Python Syllabus Revision Study Sheet    \n";
    content += "========================================================\n";

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Syllabus_Study_Notes_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // --- TAB 3 STATE ENHANCEMENTS FOR TERMINAL ---
  const [isTerminalCleared, setIsTerminalCleared] = useState(false);

  const filteredQuestions = useMemo(() => {
    return SYLLABUS_QUESTIONS.filter(q => {
      const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (q.codeSnippet && q.codeSnippet.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
      const matchesBookmark = !filterBookmarked || bookmarkedIds.includes(q.id);
      return matchesSearch && matchesCategory && matchesBookmark;
    });
  }, [searchQuery, selectedCategory, filterBookmarked, bookmarkedIds]);

  // --- TAB 2: NUMPY & REGRESSION WORKBENCH ---
  const [workbenchSubtab, setWorkbenchSubtab] = useState<'numpy' | 'regression'>('numpy');
  
  // Interactive NumPy Array
  const [npArrayValues, setNpArrayValues] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [reshapeRows, setReshapeRows] = useState<number>(2);
  const [reshapeCols, setReshapeCols] = useState<number>(3);
  const [activeCellIndex, setActiveCellIndex] = useState<number | null>(null);

  // Matrix Addition Visualizer State
  const [matrixA, setMatrixA] = useState<number[][]>([[1, 2], [3, 4]]);
  const [matrixB, setMatrixB] = useState<number[][]>([[5, 6], [7, 8]]);
  const [hoveredResultCell, setHoveredResultCell] = useState<{r: number, c: number} | null>(null);

  // Matrix Multiplication Visualizer State
  const [multMatrixA, setMultMatrixA] = useState<number[][]>([[1, 2], [3, 4]]);
  const [multMatrixB, setMultMatrixB] = useState<number[][]>([[5, 6], [7, 8]]);
  const [hoveredMultResultCell, setHoveredMultResultCell] = useState<{r: number, c: number} | null>(null);

  const calculatedMultResult = useMemo(() => {
    const r1 = multMatrixA[0][0]*multMatrixB[0][0] + multMatrixA[0][1]*multMatrixB[1][0];
    const r2 = multMatrixA[0][0]*multMatrixB[0][1] + multMatrixA[0][1]*multMatrixB[1][1];
    const r3 = multMatrixA[1][0]*multMatrixB[0][0] + multMatrixA[1][1]*multMatrixB[1][0];
    const r4 = multMatrixA[1][0]*multMatrixB[0][1] + multMatrixA[1][1]*multMatrixB[1][1];
    return [[r1, r2], [r3, r4]];
  }, [multMatrixA, multMatrixB]);

  // Dynamic values calculate
  const arrayStats = useMemo(() => {
    if (npArrayValues.length === 0) return { sum: 0, mean: 0, max: 0, min: 0 };
    const sum = npArrayValues.reduce((a, b) => a + b, 0);
    const mean = Number((sum / npArrayValues.length).toFixed(2));
    const max = Math.max(...npArrayValues);
    const min = Math.min(...npArrayValues);
    const isReshapePossible = (reshapeRows * reshapeCols === npArrayValues.length);
    return { sum, mean, max, min, isReshapePossible };
  }, [npArrayValues, reshapeRows, reshapeCols]);

  const reshapedMatrixView = useMemo(() => {
    if (reshapeRows * reshapeCols !== npArrayValues.length) return null;
    const grid: number[][] = [];
    for (let r = 0; r < reshapeRows; r++) {
      grid.push(npArrayValues.slice(r * reshapeCols, (r + 1) * reshapeCols));
    }
    return grid;
  }, [npArrayValues, reshapeRows, reshapeCols]);

  // Linear Regression Interactive State
  // Preset points: X: Hours Studied, Y: Exam Marks
  const [regressionPoints, setRegressionPoints] = useState<{ id: number; x: number; y: number }[]>([
    { id: 1, x: 2, y: 35 },
    { id: 2, x: 4, y: 55 },
    { id: 3, x: 6, y: 68 },
    { id: 4, x: 8, y: 85 },
    { id: 5, x: 9, y: 92 },
  ]);
  const [slope_m, setSlopeM] = useState<number>(8.5);
  const [intercept_c, setInterceptC] = useState<number>(25.0);

  // Compute exact analytical Best Fit parameters
  const bestFitParameters = useMemo(() => {
    const n = regressionPoints.length;
    if (n === 0) return { m: 0, c: 0 };
    const sumX = regressionPoints.reduce((acc, p) => acc + p.x, 0);
    const sumY = regressionPoints.reduce((acc, p) => acc + p.y, 0);
    const sumXY = regressionPoints.reduce((acc, p) => acc + p.x * p.y, 0);
    const sumXX = regressionPoints.reduce((acc, p) => acc + p.x * p.x, 0);
    
    const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const c = (sumY - m * sumX) / n;
    return { 
      m: Number(m.toFixed(2)), 
      c: Number(c.toFixed(2)) 
    };
  }, [regressionPoints]);

  const snapToBestFit = () => {
    setSlopeM(bestFitParameters.m);
    setInterceptC(bestFitParameters.c);
  };

  // Mean Squared Error corresponding to the sliders
  const regressionMetrics = useMemo(() => {
    let totalSqError = 0;
    const pointsWithPredictions = regressionPoints.map(p => {
      const predicted_y = Math.min(100, Math.max(0, slope_m * p.x + intercept_c));
      const error = p.y - predicted_y;
      const squaredError = error * error;
      totalSqError += squaredError;
      return {
        ...p,
        predicted: Number(predicted_y.toFixed(1)),
        error: Number(error.toFixed(1)),
        sqError: Number(squaredError.toFixed(1))
      };
    });
    const mse = regressionPoints.length > 0 ? Number((totalSqError / regressionPoints.length).toFixed(1)) : 0;
    return { pointsWithPredictions, mse };
  }, [regressionPoints, slope_m, intercept_c]);

  // --- TAB 3: TRACER WORKSPACE ---
  const [activeChallengeIdx, setActiveChallengeIdx] = useState<number>(0);
  const activeChallenge = CODING_CHALLENGES[activeChallengeIdx];
  const [tracerInputs, setTracerInputs] = useState<Record<string, any>>({});

  // Initialize input parameters when active problem swaps
  useEffect(() => {
    const initial: Record<string, any> = {};
    activeChallenge.inputs.forEach(input => {
      initial[input.name] = input.default;
    });
    setTracerInputs(initial);
    setTracerStep(0);
    setIsAutoPlaying(false);
  }, [activeChallengeIdx]);

  const tracerTrace = useMemo(() => {
    return activeChallenge.generateTrace(tracerInputs);
  }, [activeChallenge, tracerInputs]);

  const [tracerStep, setTracerStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setTracerStep(prev => {
          if (prev < tracerTrace.length - 1) {
            return prev + 1;
          } else {
            setIsAutoPlaying(false);
            return prev;
          }
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying, tracerTrace]);

  const activeTraceStepData = tracerTrace[tracerStep] || tracerTrace[0];

  // Global Keyboard Shortcuts for the Simulator Tab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'simulator') return;

      // Ignore shortcuts if the user is typing inside inputs or textareas
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === ' ') {
        e.preventDefault(); // Prevent accidental page scroll
        setIsAutoPlaying(prev => !prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setIsAutoPlaying(false);
        setTracerStep(prev => Math.min(tracerTrace.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setIsAutoPlaying(false);
        setTracerStep(prev => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTab, tracerTrace, isAutoPlaying]);

  // Reset cleared status whenever execution step, challenge or inputs change
  useEffect(() => {
    setIsTerminalCleared(false);
  }, [tracerStep, activeChallengeIdx, tracerInputs]);

  // --- TAB 4: QUIZ LAB ---
  const [quizState, setQuizState] = useState<'start' | 'playing' | 'completed'>('start');
  const [quizQuestionsGenerated, setQuizQuestionsGenerated] = useState<{
    id: string;
    question: string;
    choices: string[];
    correctAnswer: string;
    contextQuestionId: string;
  }[]>([]);
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [selectedQuizChoice, setSelectedQuizChoice] = useState<string | null>(null);
  const [quizAnswerChecked, setQuizAnswerChecked] = useState<boolean>(false);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [quizSessionHistory, setQuizSessionHistory] = useState<{
    question: string;
    yourAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[]>([]);

  // Function to build highly cohesive MCQ choices on-the-fly referencing our actual syllabus
  const startNewQuiz = () => {
    // Generate 10 mock questions on-the-fly based on our syllabus data
    const questionsPool = [...SYLLABUS_QUESTIONS];
    const selectedPool = questionsPool.sort(() => 0.5 - Math.random()).slice(0, 10);
    
    const questions = selectedPool.map((q, idx) => {
      // Correct choice
      const correctText = q.answer.substring(0, 80) + (q.answer.length > 80 ? "..." : "");
      
      // Get 3 incorrect choices from other questions' answers
      const distractors = SYLLABUS_QUESTIONS
        .filter(oth => oth.id !== q.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(oth => oth.answer.substring(0, 80) + (oth.answer.length > 80 ? "..." : ""));

      // Shuffle them in
      const choices = [correctText, ...distractors].sort(() => 0.5 - Math.random());

      return {
        id: `quiz-${idx}`,
        question: `[Syllabus Question #${q.number}] ${q.question}`,
        choices,
        correctAnswer: correctText,
        contextQuestionId: q.id
      };
    });

    setQuizQuestionsGenerated(questions);
    setCurrentQuizIdx(0);
    setQuizScore(0);
    setSelectedQuizChoice(null);
    setQuizAnswerChecked(false);
    setQuizSessionHistory([]);
    setQuizStartTime(Date.now());
    setQuizState('playing');
  };

  const handleSelectChoice = (choice: string) => {
    if (quizAnswerChecked) return;
    setSelectedQuizChoice(choice);
  };

  const checkQuizAnswer = () => {
    if (!selectedQuizChoice || quizAnswerChecked) return;
    const currentQ = quizQuestionsGenerated[currentQuizIdx];
    const isCorrect = (selectedQuizChoice === currentQ.correctAnswer);
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }

    setQuizSessionHistory(prev => [
      ...prev,
      {
        question: currentQ.question,
        yourAnswer: selectedQuizChoice,
        correctAnswer: currentQ.correctAnswer,
        isCorrect
      }
    ]);

    setQuizAnswerChecked(true);
  };

  const handleNextQuizQuestion = () => {
    setSelectedQuizChoice(null);
    setQuizAnswerChecked(false);
    if (currentQuizIdx < quizQuestionsGenerated.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
    } else {
      // Reached the end!
      setQuizState('completed');
      if (quizScore + (selectedQuizChoice === quizQuestionsGenerated[currentQuizIdx].correctAnswer ? 1 : 0) > quizHighScore) {
        const finalEstScore = quizScore + (selectedQuizChoice === quizQuestionsGenerated[currentQuizIdx].correctAnswer ? 1 : 0);
        setQuizHighScore(finalEstScore);
        localStorage.setItem('syllabus_quiz_highscore', String(finalEstScore));
      }
    }
  };

  // --- GENERAL STATS FOR HEADERS ---
  const masteryPercentage = useMemo(() => {
    return Math.round((masteredIds.length / SYLLABUS_QUESTIONS.length) * 100);
  }, [masteredIds]);


  // AI Revision assistant dialog mock context state using client-side generator tutor
  const [aiHistory, setAiHistory] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: "Welcome, scholar. I am your specialized Python, NumPy, and Linear Regression Lab Tutor. Ask me any conceptual question, query code syntax, or ask for a test explanation based on your syllabus answers."
    }
  ]);
  const [aiMessage, setAiMessage] = useState('');
  const [aiIsGenerating, setAiIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiHistory]);

  const handleSendAiMessage = async () => {
    if (!aiMessage.trim() || aiIsGenerating) return;
    const userPrompt = aiMessage;
    setAiHistory(prev => [...prev, { role: 'user', text: userPrompt }]);
    setAiMessage('');
    setAiIsGenerating(true);

    try {
      // Send message to our simulated smart server-side tutor or evaluate on syllabus scope
      // Let's implement a highly intelligent local contextual interpreter responding strictly to Python, NumPy, regression theory
      setTimeout(() => {
        let tutorReply = "";
        const lowerPrompt = userPrompt.toLowerCase();
        
        if (lowerPrompt.includes('numpy') || lowerPrompt.includes('matrix') || lowerPrompt.includes('array')) {
          tutorReply = `Concerning NumPy in your syllabus: NumPy stands for Numerical Python (Q9). Standard Python list structures are multi-referential and significantly slower due to dynamic type lookups, whereas NumPy wraps contiguous blocks of memory of homogeneous elements (Q11). You can query 'A.shape' to fetch dimension tuples, 'A.size' to get total elements, and 'A.ndim' to find number of dimensions (Q13). Reshaping changes dimensions keeping cell count identical (Q17). Let me know if you want me to describe any of these further!`;
        } else if (lowerPrompt.includes('linear regression') || lowerPrompt.includes('regression') || lowerPrompt.includes('equation')) {
          tutorReply = `Regarding Linear Regression (Q20): It models relationships between an Independent input variable X (e.g. Hours Studied) and Dependent output Y (e.g. Exam Marks). The core equation is: y = m*x + c, where m is slope weight and c is intercept bias. The 'Best Fit Line' (Q24) optimizes the slope and intercepts to minimize the sum of squared prediction errors (which can be actively experimented on using our visual lab sliders!).`;
        } else if (lowerPrompt.includes('factorial') || lowerPrompt.includes('loop') || lowerPrompt.includes('even') || lowerPrompt.includes('odd')) {
          tutorReply = `Looking at Python Basics & Loops (Q3-Q8): Standard iterative loops include 'for' (definite iteration) and 'while' (condition iteration). Lists are ordered mutable collections using square brackets, whereas tuples are immutable using parentheses. Dictionary structures index objects using customized hash keys. Your syllabus coding exam commonly tests algorithms like computing sum or factorial using loops. Try compiling them on our 'Debugger Simulator' tab!`;
        } else {
          tutorReply = `I am referencing your syllabus directly. I can help explain topics like 'Matrix Dot Products', 'Line of Best Fit optimization', the difference between mutable Python lists and immutable Tuples (Q7), or how NumPy computes average statistics. What specific syllabus topic can I unpack for you?`;
        }
        
        setAiHistory(prev => [...prev, { role: 'assistant', text: tutorReply }]);
        setAiIsGenerating(false);
      }, 1000);
    } catch {
      setAiIsGenerating(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1F1F1E] font-sans antialiased text-sm">
      {/* --- TOP BRANDED BAR --- */}
      <header className="border-b border-[#EBEBE8] sticky top-0 bg-[#FBFBFA]/90 backdrop-blur-md z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1F1F1E] flex items-center justify-center text-[#FBFBFA]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-[#1F1F1E]">Python Syllabus Revision Lab</h1>
              <p className="text-xs text-[#8A8A85]">Introductory Lab Preparation • Basics, NumPy, &amp; Linear Regression</p>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="flex items-center gap-6">
            {/* Mastery Meter */}
            <div className="text-right hidden sm:block">
              <div className="flex items-center gap-2 mb-1 justify-end">
                <span className="text-xs font-medium text-[#1F1F1E]">{masteredIds.length} / {SYLLABUS_QUESTIONS.length} Questions</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-[#EBEBE8] text-[#555550]">{masteryPercentage}%</span>
              </div>
              <div className="w-36 h-1 w-full bg-[#EBEBE8] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#1F1F1E] transition-all duration-300"
                  style={{ width: `${masteryPercentage}%` }}
                />
              </div>
            </div>

            {/* Bookmarks Counter */}
            <div className="flex items-center gap-2 border-l border-[#EBEBE8] pl-6 text-[#555550]">
              <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
              <div>
                <span className="block font-medium text-[#1F1F1E] leading-none">{bookmarkedIds.length}</span>
                <span className="text-[10px] text-[#8A8A85]">Bookmarked</span>
              </div>
            </div>

            {/* Highscore Meter */}
            <div className="flex items-center gap-2 border-l border-[#EBEBE8] pl-6 text-[#555550]">
              <Award className="w-4 h-4 text-[#1F1F1E]" />
              <div>
                <span className="block font-medium text-[#1F1F1E] leading-none">{quizHighScore}/10</span>
                <span className="text-[10px] text-[#8A8A85]">Best Quiz</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- APPLICATION BODY COHORT --- */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* --- NAVIGATION SEGMENT --- */}
        <div className="flex overflow-x-auto border-b border-[#EBEBE8] mb-8 gap-1 scrollbar-none">
          <button
            id="nav-tab-syllabus"
            onClick={() => setActiveTab('syllabus')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium whitespace-nowrap transition-all ${
              activeTab === 'syllabus' 
                ? 'border-[#1F1F1E] text-[#1F1F1E]' 
                : 'border-transparent text-[#8A8A85] hover:text-[#555550] hover:border-[#EBEBE8]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Syllabus Directory
            <span className="text-xs px-1.5 py-0.2 bg-[#EBEBE8] rounded text-[#8A8A85]">25 Qs</span>
          </button>

          <button
            id="nav-tab-workbench"
            onClick={() => setActiveTab('workbench')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium whitespace-nowrap transition-all ${
              activeTab === 'workbench' 
                ? 'border-[#1F1F1E] text-[#1F1F1E]' 
                : 'border-transparent text-[#8A8A85] hover:text-[#555550] hover:border-[#EBEBE8]'
            }`}
          >
            <Layers className="w-4 h-4" />
            Interactive Workbenches
            <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Labs</span>
          </button>

          <button
            id="nav-tab-simulator"
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium whitespace-nowrap transition-all ${
              activeTab === 'simulator' 
                ? 'border-[#1F1F1E] text-[#1F1F1E]' 
                : 'border-transparent text-[#8A8A85] hover:text-[#555550] hover:border-[#EBEBE8]'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Execution Trace Simulator
            <span className="text-xs px-1.5 py-0.2 bg-[#EBEBE8] rounded text-[#8A8A85]">Debugger</span>
          </button>

          <button
            id="nav-tab-quiz"
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium whitespace-nowrap transition-all ${
              activeTab === 'quiz' 
                ? 'border-[#1F1F1E] text-[#1F1F1E]' 
                : 'border-transparent text-[#8A8A85] hover:text-[#555550] hover:border-[#EBEBE8]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Active Practice Quiz
            <span className="text-[#15803D] text-[10px] uppercase font-bold tracking-wider">Test</span>
          </button>
        </div>

        {/* --- PANEL INTERFACES --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT AREA: ACTUAL CONTENT PATHS */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* ========================================================= */}
            {/* TAB 1: SYLLABUS LIST EXPLORER */}
            {/* ========================================================= */}
            {activeTab === 'syllabus' && (
              <div className="space-y-6">

                {/* BASICS REFERENCE HANDBOOK */}
                <div className="bg-gradient-to-br from-indigo-50/40 via-white to-teal-50/30 p-5 rounded-xl border border-[#EBEBE8] shadow-sm space-y-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer select-none" 
                    onClick={() => setIsHandbookOpen(!isHandbookOpen)}
                  >
                    <div className="flex items-center gap-2.5">
                      <GraduationCap className="w-5 h-5 text-indigo-600" />
                      <div>
                        <h4 className="font-semibold text-sm text-[#1F1F1E]">Core Basics &amp; Fundamentals Study Guide</h4>
                        <p className="text-[11px] text-[#8A8A85]">Expand this reference sheet to learn core Python, NumPy, &amp; Linear Regression basics.</p>
                      </div>
                    </div>
                    <button 
                      className="text-xs text-indigo-600 font-semibold hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsHandbookOpen(!isHandbookOpen);
                      }}
                    >
                      {isHandbookOpen ? 'Hide Basics' : 'Show Basics'}
                    </button>
                  </div>

                  {isHandbookOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#EBEBE8] text-xs">
                      {/* Topic 1 */}
                      <div className="space-y-2.5">
                        <span className="font-bold text-indigo-600 block uppercase tracking-wider text-[10px]">1. Python Basics</span>
                        <div className="space-y-2 text-[#555550] leading-relaxed">
                          <p>• <strong>Data Types:</strong> Integers, Floats, Strings, and Booleans are the core built-in entities.</p>
                          <p>• <strong>Control Flow:</strong> Standard definite iterations (<code>for i in range(N)</code>) vs condition-based loops (<code>while conditional</code>).</p>
                          <p>• <strong>Data Structures:</strong> <code>Lists</code> are mutable square-bracket blocks; <code>Tuples</code> are immutable parentheses structures; <code>Dictionaries</code> map unique key-value pairs.</p>
                        </div>
                      </div>

                      {/* Topic 2 */}
                      <div className="space-y-2.5 border-t md:border-t-0 md:border-l border-[#EBEBE8] pt-4 md:pt-0 md:pl-6">
                        <span className="font-bold text-teal-600 block uppercase tracking-wider text-[10px]">2. NumPy Foundations</span>
                        <div className="space-y-2 text-[#555550] leading-relaxed">
                          <p>• <strong>Optimized Arrays:</strong> NumPy array representations are homogeneous, contiguous matrices speeding up element-wise operations.</p>
                          <p>• <strong>Critical Metrics:</strong> <code>shape</code> (dimensions structure tuple), <code>size</code> (total element cells count), and <code>ndim</code> (axes number).</p>
                          <p>• <strong>Algebraic Products:</strong> Addition compiles element-wise (<code>A + B</code>), whereas dot multiplications (<code>np.dot(A, B)</code>) implement classic linear algebra.</p>
                        </div>
                      </div>

                      {/* Topic 3 */}
                      <div className="space-y-2.5 border-t md:border-t-0 md:border-l border-[#EBEBE8] pt-4 md:pt-0 md:pl-6">
                        <span className="font-bold text-amber-600 block uppercase tracking-wider text-[10px]">3. Linear Regression</span>
                        <div className="space-y-2 text-[#555550] leading-relaxed">
                          <p>• <strong>The Core Model:</strong> Models linear coordinate vectors matching equation <code>y = m*x + c</code> (where <code>m</code> is slope weight coefficient, <code>c</code> is bias intercept).</p>
                          <p>• <strong>Variables Focus:</strong> Independent variable <code>X</code> acts as the input predictor, while Dependent variable <code>Y</code> responds as output.</p>
                          <p>• <strong>Loss Error Functions:</strong> Mean Squared Error calculates distance deviations. Analytical solvers minimize squared error sums.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Visual filter bar */}
                <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#EBEBE8] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A85]" />
                    <input 
                      type="text"
                      placeholder="Search question names, definitions, formulas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#FBFBFA] border border-[#EBEBE8] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#1F1F1E]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {(['all', 'Python Basics', 'NumPy', 'Linear Regression Theory'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-xs px-3 py-1.5 rounded-lg transition-all border ${
                          selectedCategory === cat 
                            ? 'bg-[#1F1F1E] text-[#FBFBFA] border-[#1F1F1E]' 
                            : 'bg-transparent text-[#555550] border-[#EBEBE8] hover:bg-[#FBFBFA]'
                        }`}
                      >
                        {cat === 'all' ? 'All Modules' : cat}
                      </button>
                    ))}

                    <button
                      onClick={() => setFilterBookmarked(!filterBookmarked)}
                      className={`text-xs px-3 py-1.5 rounded-lg transition-all border flex items-center gap-1.5 ${
                        filterBookmarked 
                          ? 'bg-amber-50 text-amber-800 border-amber-200' 
                          : 'bg-transparent text-[#555550] border-[#EBEBE8] hover:bg-[#FBFBFA]'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${filterBookmarked ? 'fill-amber-500 text-amber-500' : 'text-[#8A8A85]'}`} />
                      Bookmarked Only
                    </button>
                  </div>
                </div>

                {/* Question results count */}
                <div className="flex items-center justify-between px-1 flex-wrap gap-3">
                  <span className="text-xs text-[#8A8A85]">Showing {filteredQuestions.length} of {SYLLABUS_QUESTIONS.length} Syllabus Questions</span>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#555550]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {masteredIds.length} Mastered
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#555550]">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        {bookmarkedIds.length} Bookmarked
                      </span>
                    </div>

                    <button
                      id="export-notes-btn"
                      onClick={exportNotesToTxt}
                      className="inline-flex items-center gap-1.5 text-xs text-[#1F1F1E] font-medium border border-[#1F1F1E] rounded-md px-3 py-1.5 hover:bg-[#1F1F1E] hover:text-[#FBFBFA] transition-all"
                      title="Export all saved Study Notes"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Export Notes (.txt)
                    </button>
                  </div>
                </div>

                {/* Question Accordion Deck */}
                <div className="space-y-3">
                  {filteredQuestions.map((q) => {
                    const isExpanded = expandedId === q.id;
                    const isMastered = masteredIds.includes(q.id);
                    const isBookmarked = bookmarkedIds.includes(q.id);
                    const note = userNotes[q.id] || "";

                    return (
                      <div 
                        key={q.id}
                        className={`bg-[#FFFFFF] rounded-xl border transition-all duration-200 shadow-sm ${
                          isExpanded ? 'border-[#1F1F1E] ring-1 ring-[#1F1F1E]/10' : 'border-[#EBEBE8] hover:border-[#1F1F1E]/40'
                        }`}
                      >
                        {/* HEADER BUTTON */}
                        <div 
                          className="flex items-start justify-between p-5 cursor-pointer gap-4"
                          onClick={() => setExpandedId(isExpanded ? null : q.id)}
                        >
                          <div className="flex items-start gap-4 flex-1">
                            {/* Checkbox trigger */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMastered(q.id);
                              }}
                              className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                                isMastered 
                                  ? 'bg-emerald-500 text-white' 
                                  : 'border border-[#C2C2BE] hover:border-emerald-500'
                              }`}
                            >
                              {isMastered && <span className="font-bold text-xs">✓</span>}
                            </button>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-[#FBFBFA] text-[#8A8A85] border border-[#EBEBE8]">
                                  Q{q.number}
                                </span>
                                <span className="text-xs font-medium text-[#8A8A85]">
                                  {q.category}
                                </span>
                              </div>
                              <h3 className="font-medium text-base text-[#1F1F1E] leading-snug">
                                {q.question}
                              </h3>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmarked(q.id);
                              }}
                              className="p-1.5 hover:bg-[#FBFBFA] rounded-md transition-all text-[#8A8A85] hover:text-amber-500"
                              title="Bookmark question"
                            >
                              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                            </button>
                            {isExpanded ? <ChevronDown className="w-5 h-5 text-[#8A8A85]" /> : <ChevronRight className="w-5 h-5 text-[#8A8A85]" />}
                          </div>
                        </div>

                        {/* ACCORDION EXPANDED BODY */}
                        {isExpanded && (
                          <div className="border-t border-[#EBEBE8] px-5 pb-5 pt-4 bg-[#FBFBFA]/30 space-y-4">
                            
                            {/* ANSWER DESCRIPTION */}
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold tracking-wider uppercase text-[#8A8A85]">Answer Details</span>
                              <p className="text-[#3E3E3C] leading-relaxed text-sm font-normal">
                                {q.answer}
                              </p>
                            </div>

                            {/* TABLE DATA (If exists for Q2, Q4, Q7, Q25) */}
                            {q.tableData && (
                              <div className="border border-[#EBEBE8] rounded-lg overflow-hidden bg-white shadow-sm mt-2">
                                <table className="w-full text-left text-xs border-collapse">
                                  <thead>
                                    <tr className="bg-[#FBFBFA] border-b border-[#EBEBE8]">
                                      {q.tableData.headers.map((h, hIdx) => (
                                        <th key={hIdx} className="px-4 py-2.5 font-medium text-[#1F1F1E]">
                                          {h}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {q.tableData.rows.map((row, rIdx) => (
                                      <tr key={rIdx} className="border-b border-[#EBEBE8] last:border-0 hover:bg-[#FBFBFA]/50">
                                        {row.map((cell, cIdx) => (
                                          <td key={cIdx} className="px-4 py-2 text-[#555550] leading-relaxed">
                                            {cell}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}

                            {/* CODE SNIPPET AREA */}
                            {q.codeSnippet && (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold tracking-wider uppercase text-[#8A8A85]">Syllabus Python Code</span>
                                  <span className="text-[10px] font-mono text-[#8A8A85]">Python 3</span>
                                </div>
                                <pre className="bg-[#1F1F1E] text-white p-4 rounded-lg overflow-x-auto text-xs font-mono shadow-inner leading-relaxed">
                                  <code>{q.codeSnippet}</code>
                                </pre>
                              </div>
                            )}

                            {/* EXPLANATORY EXTRA NOTE */}
                            {q.explanation && (
                              <div className="bg-[#EBEBE8]/40 border-l-2 border-[#1F1F1E]/50 p-3 rounded-r-lg text-xs text-[#555550] leading-relaxed">
                                <span className="font-semibold block mb-0.5">Professor&#39;s Concept Note</span>
                                {q.explanation}
                              </div>
                            )}

                            {/* PERSONAL USER NOTES AREA */}
                            <div className="border-t border-[#EBEBE8] pt-3 mt-3">
                              {activeNoteEditingId === q.id ? (
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold tracking-wider uppercase text-[#8A8A85] block">My Study Notes</label>
                                  <textarea
                                    value={noteTextTemp}
                                    onChange={(e) => setNoteTextTemp(e.target.value)}
                                    placeholder="Write key equations, mnemonic keywords, and tricks for the exam here..."
                                    className="w-full h-20 p-2.5 border border-[#EBEBE8] bg-white rounded-lg text-xs focus:ring-1 focus:ring-[#1F1F1E] focus:outline-none"
                                  />
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => setActiveNoteEditingId(null)}
                                      className="text-xs px-3 py-1 border border-[#EBEBE8] rounded-md hover:bg-[#FBFBFA]"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => {
                                        setNote(q.id, noteTextTemp);
                                        setActiveNoteEditingId(null);
                                      }}
                                      className="text-xs px-3 py-1 bg-[#1F1F1E] text-[#FBFBFA] rounded-md"
                                    >
                                      Save Notes
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex-1 pr-4">
                                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#8A8A85] block">My Revision Notes:</span>
                                    {note ? (
                                      <p className="text-stone-700 italic mt-0.5">{note}</p>
                                    ) : (
                                      <p className="text-stone-400 italic mt-0.5">No custom study note recorded. Click edit to add calculations or exam formulas.</p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => {
                                      setActiveNoteEditingId(q.id);
                                      setNoteTextTemp(note);
                                    }}
                                    className="text-xs text-[#1F1F1E] font-medium border border-[#EBEBE8] px-2.5 py-1 rounded hover:bg-[#FBFBFA]"
                                  >
                                    Edit Note
                                  </button>
                                </div>
                              )}
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  })}

                  {filteredQuestions.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-[#EBEBE8] rounded-xl bg-white space-y-2">
                      <Bookmark className="w-8 h-8 text-[#8A8A85] mx-auto opacity-40 animate-pulse" />
                      <p className="font-medium text-[#1F1F1E]">No matches found</p>
                      <p className="text-xs text-[#8A8A85]">Try adjusting your category keyword, reset your search query, or uncheck filters.</p>
                      <button 
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                          setFilterBookmarked(false);
                        }}
                        className="text-xs mt-2 px-3.5 py-1.5 bg-[#1F1F1E] text-white rounded-lg"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Progress helper footer */}
                <div className="text-center bg-white p-6 border border-[#EBEBE8] rounded-xl shadow-sm text-xs space-y-2">
                  <p className="font-medium text-[#555550]">You are performing spectacular preparation!</p>
                  <p className="text-stone-400">Expand standard question cards to practice code and view study notes. Swap tabs to run code simulators or play practice quizzes.</p>
                </div>

              </div>
            )}


            {/* ========================================================= */}
            {/* TAB 2: INTERACTIVE LABORATORY WORKBENCHES */}
            {/* ========================================================= */}
            {activeTab === 'workbench' && (
              <div className="space-y-6">
                
                {/* Laboratory header selector */}
                <div className="flex gap-1.5 border-b border-[#EBEBE8] pb-1.5">
                  <button
                    onClick={() => setWorkbenchSubtab('numpy')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
                      workbenchSubtab === 'numpy' 
                        ? 'bg-[#1F1F1E] text-white border-[#1F1F1E]' 
                        : 'bg-transparent text-[#555550] border-transparent hover:bg-[#FBFBFA]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    NumPy Matrix Array Lab (Q9-Q19)
                  </button>

                  <button
                    onClick={() => setWorkbenchSubtab('regression')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
                      workbenchSubtab === 'regression' 
                        ? 'bg-[#1F1F1E] text-white border-[#1F1F1E]' 
                        : 'bg-transparent text-[#555550] border-transparent hover:bg-[#FBFBFA]'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    Linear Regression Vector Simulator (Q20-Q25)
                  </button>
                </div>

                {/* SUBTAB 1: NUMPY WORKBENCH ARRAYS */}
                {workbenchSubtab === 'numpy' && (
                  <div className="space-y-8">
                    
                    {/* Visual 1D & 2D array transformation block */}
                    <div className="bg-white p-6 rounded-xl border border-[#EBEBE8] shadow-sm space-y-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest block">Experiment 1</span>
                          <h3 className="text-base font-semibold text-[#1F1F1E]">Dynamic Shape, Size, &amp; Reshape Playground</h3>
                          <p className="text-xs text-[#8A8A85]">Change elements of an array and customize coordinates structure to fit reshape restrictions</p>
                        </div>

                        {/* Presets */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-[#555550]">Fill Preset Tracker:</span>
                          {[
                            [1, 2, 3, 4, 5, 6],
                            [10, 20, 30, 40, 50, 60],
                            [100, 101, 102, 103, 104, 105],
                          ].map((arr, arrIdx) => (
                            <button
                              key={arrIdx}
                              onClick={() => setNpArrayValues(arr)}
                              className="text-xs px-2.5 py-1 border border-[#EBEBE8] rounded hover:border-[#1F1F1E] bg-[#FBFBFA]"
                            >
                              [{arr.join(',')}]
                            </button>
                          ))}
                          <button
                            id="randomize-array-btn"
                            onClick={() => {
                              const length = npArrayValues.length > 0 ? npArrayValues.length : 6;
                              const randomVals = Array.from({ length }, () => Math.floor(Math.random() * 100) + 1);
                              setNpArrayValues(randomVals);
                            }}
                            className="text-xs px-3 py-1.5 bg-[#1F1F1E] text-[#FBFBFA] hover:bg-stone-800 rounded transition-all font-medium flex items-center gap-1.5 shadow-sm"
                            title="Generate random integers between 1 and 100"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Randomize Array
                          </button>
                        </div>
                      </div>

                      {/* Element click adjustment */}
                      <div className="space-y-3">
                        <label className="text-xs font-semibold text-[#1F1F1E] block">
                          1. Double click or tap values below to edit individual array elements (1D representation):
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                          <code className="text-[#8A8A85] text-xs font-mono mr-1">arr = np.array([</code>
                          {npArrayValues.map((val, idx) => (
                            <div key={idx} className="flex items-center">
                              {activeCellIndex === idx ? (
                                <input
                                  type="number"
                                  autoFocus
                                  defaultValue={val}
                                  onBlur={(e) => {
                                    const nextVals = [...npArrayValues];
                                    nextVals[idx] = Number(e.target.value) || 0;
                                    setNpArrayValues(nextVals);
                                    setActiveCellIndex(null);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      const nextVals = [...npArrayValues];
                                      nextVals[idx] = Number((e.target as HTMLInputElement).value) || 0;
                                      setNpArrayValues(nextVals);
                                      setActiveCellIndex(null);
                                    }
                                  }}
                                  className="w-14 px-1 py-1 text-center font-mono text-xs border border-[#1F1F1E] bg-[#FBFBFA] rounded focus:outline-none"
                                />
                              ) : (
                                <button
                                  onClick={() => setActiveCellIndex(idx)}
                                  className="w-14 py-2 font-mono text-center text-xs border border-[#EBEBE8] bg-[#FBFBFA] hover:bg-[#F0F0EE] hover:border-[#1F1F1E] rounded transition-all font-semibold text-[#1F1F1E]"
                                  title="Click to edit value"
                                >
                                  {val}
                                </button>
                              )}
                              {idx < npArrayValues.length - 1 && <span className="text-gray-400 ml-1.5">,</span>}
                            </div>
                          ))}
                          <code className="text-[#8A8A85] text-xs font-mono ml-1">])</code>
                        </div>
                      </div>

                      {/* Reshape settings */}
                      <div className="border-t border-[#EBEBE8] pt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <span className="text-xs font-semibold text-[#1F1F1E] block">2. Request Dynamic Reshape Dimension Coordinates:</span>
                          
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-xs text-[#555550] mb-1">
                                <span>Rows: <strong>{reshapeRows}</strong></span>
                              </div>
                              <input
                                type="range"
                                min={1}
                                max={6}
                                value={reshapeRows}
                                onChange={(e) => setReshapeRows(Number(e.target.value))}
                                className="w-full accent-[#1F1F1E]"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between text-xs text-[#555550] mb-1">
                                <span>Columns: <strong>{reshapeCols}</strong></span>
                              </div>
                              <input
                                type="range"
                                min={1}
                                max={6}
                                value={reshapeCols}
                                onChange={(e) => setReshapeCols(Number(e.target.value))}
                                className="w-full accent-[#1F1F1E]"
                              />
                            </div>
                          </div>

                          {/* Pre-baked dimension ratios that solve dimension size: 6 */}
                          <div className="flex gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold text-[#8A8A85] flex items-center pr-1.5">Ratio Fit Guides (Size = 6):</span>
                            {[
                              [1, 6],
                              [2, 3],
                              [3, 2],
                              [6, 1]
                            ].map(([r, c]) => (
                              <button
                                key={`${r}x${c}`}
                                onClick={() => {
                                  setReshapeRows(r);
                                  setReshapeCols(c);
                                }}
                                className="text-xs px-2 py-1 bg-zinc-100 hover:bg-zinc-200 rounded transition-all text-[#3F3F3E]"
                              >
                                {r} × {c}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Array stats summary right side */}
                        <div className="bg-[#FBFBFA] p-4 rounded-lg border border-[#EBEBE8] space-y-3 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-[#8A8A85] uppercase tracking-wider block">NumPy Array Elements Metadata</span>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              <div className="p-2 border border-[#EBEBE8] rounded text-center bg-white">
                                <span className="block text-[10px] text-[#8A8A85] font-mono leading-none">.shape</span>
                                <span className="block font-bold text-xs mt-1 font-mono">
                                  ({reshapeRows}, {reshapeCols})
                                </span>
                              </div>
                              <div className="p-2 border border-[#EBEBE8] rounded text-center bg-white">
                                <span className="block text-[10px] text-[#8A8A85] font-mono leading-none">.size</span>
                                <span className="block font-bold text-xs mt-1 font-mono">
                                  {npArrayValues.length}
                                </span>
                              </div>
                              <div className="p-2 border border-[#EBEBE8] rounded text-center bg-white">
                                <span className="block text-[10px] text-[#8A8A85] font-mono leading-none">.ndim</span>
                                <span className="block font-bold text-xs mt-1 font-mono">
                                  {reshapeRows > 1 && reshapeCols > 1 ? 2 : 1}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-[#EBEBE8] grid grid-cols-4 gap-1 text-center">
                            <div>
                              <span className="block text-[9px] text-[#8A8A85]">np.sum</span>
                              <span className="font-semibold text-xs font-mono">{arrayStats.sum}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] text-[#8A8A85]">np.mean</span>
                              <span className="font-semibold text-xs font-mono">{arrayStats.mean}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] text-[#8A8A85]">np.max</span>
                              <span className="font-semibold text-xs font-mono">{arrayStats.max}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] text-[#8A8A85]">np.min</span>
                              <span className="font-semibold text-xs font-mono">{arrayStats.min}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* THE MATRIX VISUAL REPRESENTATION BLOCK */}
                      <div className="border-t border-[#EBEBE8] pt-5 space-y-3">
                        <span className="text-xs font-semibold text-[#1F1F1E] block">
                          3. Matrix Array Reshaped Graph Viewer:
                        </span>

                        {arrayStats.isReshapePossible ? (
                          <div className="bg-[#1F1F1E] text-white p-6 rounded-xl space-y-4">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-400">Memory Output State: Vector values reshaped into ({reshapeRows} rows, {reshapeCols} columns)</span>
                              <span className="bg-teal-500/10 text-teal-400 font-bold px-2 py-0.5 rounded text-[10px] border border-teal-500/20 uppercase tracking-widest">
                                Valid Shape Fit
                              </span>
                            </div>

                            <div className="flex justify-center py-4">
                              <div className="border-l border-r border-[#C2C2BE] px-3.5 py-1.5 inline-flex flex-col gap-2">
                                {reshapedMatrixView?.map((row, rowIdx) => (
                                  <div key={rowIdx} className="flex gap-4">
                                    {row.map((val, colIdx) => (
                                      <div 
                                        key={colIdx} 
                                        className="w-12 py-2 border border-zinc-700 bg-zinc-800 text-center font-mono text-xs font-bold rounded shadow-md relative group hover:bg-zinc-700 transition-all cursor-default"
                                      >
                                        <span className="text-teal-400 leading-none">{val}</span>
                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-zinc-900 border border-zinc-700 px-1 py-0.5 rounded text-[8px] whitespace-nowrap text-zinc-300 font-normal">
                                          Index [{rowIdx}, {colIdx}]
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="text-center font-mono text-[10px] text-zinc-400">
                              Terminal Print: np.array(arr).reshape({reshapeRows}, {reshapeCols})
                            </div>
                          </div>
                        ) : (
                          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-xl space-y-2 text-center">
                            <span className="font-bold text-sm block">ValueError: Invalid Dimensions requested!</span>
                            <p className="text-xs">
                              Cannot reshape array elements of aggregate size <strong>{npArrayValues.length}</strong> into a 2D grid matrix of size <strong>{reshapeRows * reshapeCols}</strong> ({reshapeRows} rows * {reshapeCols} cols).
                            </p>
                            <p className="text-xs text-amber-700 italic">
                              To solve this, align your slider parameters so that rows × cols equals {npArrayValues.length}, or select a preset ratio guide.
                            </p>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Matrix Arithmetic Lab (ADDITION vs MULTIPLICATION) */}
                    <div className="bg-white p-6 rounded-xl border border-[#EBEBE8] shadow-sm space-y-6">
                      <div>
                        <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest block">Experiment 2</span>
                        <h3 className="text-base font-semibold text-[#1F1F1E]">NumPy Matrix Algebra Workbench</h3>
                        <p className="text-xs text-[#8A8A85]">Interactively visualize row-by-column pairings during addition and linear multiplication calculations.</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* LEFT SIDE: MATRIX ADDITION (Q18) */}
                        <div className="space-y-4 border-r border-[#EBEBE8] pr-2 lg:pr-6">
                          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">Matrix Addition Playground (A + B)</span>
                          
                          <div className="grid grid-cols-3 items-center gap-2">
                            {/* Input Matrix A */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-[#8A8A85] text-center block">Matrix A</span>
                              <div className="border-l-2 border-r-2 border-stone-400 p-1 bg-[#FBFBFA] flex flex-col gap-1">
                                {matrixA.map((rowArr, r) => (
                                  <div key={r} className="flex gap-1 justify-center">
                                    {rowArr.map((v, c) => (
                                      <input
                                        key={c}
                                        type="number"
                                        value={v}
                                        onChange={(e) => {
                                          const next = [...matrixA.map(col => [...col])];
                                          next[r][c] = Number(e.target.value) || 0;
                                          setMatrixA(next);
                                        }}
                                        className="w-10 py-1 font-mono text-center text-xs bg-white border border-[#EBEBE8] rounded focus:ring-1 focus:ring-[#1F1F1E]"
                                      />
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Operator sign */}
                            <div className="text-center text-lg font-bold text-[#8A8A85] font-mono">+</div>

                            {/* Input Matrix B */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-[#8A8A85] text-center block">Matrix B</span>
                              <div className="border-l-2 border-r-2 border-stone-400 p-1 bg-[#FBFBFA] flex flex-col gap-1">
                                {matrixB.map((rowArr, r) => (
                                  <div key={r} className="flex gap-1 justify-center">
                                    {rowArr.map((v, c) => (
                                      <input
                                        key={c}
                                        type="number"
                                        value={v}
                                        onChange={(e) => {
                                          const next = [...matrixB.map(col => [...col])];
                                          next[r][c] = Number(e.target.value) || 0;
                                          setMatrixB(next);
                                        }}
                                        className="w-10 py-1 font-mono text-center text-xs bg-white border border-[#EBEBE8] rounded focus:ring-1 focus:ring-[#1F1F1E]"
                                      />
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Addition Result View */}
                          <div className="pt-2">
                            <span className="text-[10px] font-mono text-[#8A8A85] text-center block mb-1">Resulting Sum Matrix (A + B)</span>
                            <div className="flex justify-center">
                              <div className="border-l-2 border-r-2 border-[#1F1F1E] p-2 bg-[#FBFBFA]/50 inline-flex flex-col gap-1.5 shadow-sm rounded">
                                {matrixA.map((rowValues, r) => (
                                  <div key={r} className="flex gap-2">
                                    {rowValues.map((v, c) => {
                                      const combinedSum = v + matrixB[r][c];
                                      const isHovered = hoveredResultCell?.r === r && hoveredResultCell?.c === c;
                                      return (
                                        <div
                                          key={c}
                                          onMouseEnter={() => setHoveredResultCell({ r, c })}
                                          onMouseLeave={() => setHoveredResultCell(null)}
                                          className={`w-14 py-2 text-center font-mono text-xs font-bold rounded transition-all cursor-default relative border ${
                                            isHovered 
                                              ? 'bg-emerald-500 text-white border-emerald-500' 
                                              : 'bg-white border-[#EBEBE8] text-[#1F1F1E]'
                                          }`}
                                        >
                                          {combinedSum}
                                          {isHovered && (
                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-stone-900 text-stone-100 text-[10px] px-2 py-1 rounded border border-stone-700 whitespace-nowrap z-10 shadow-lg font-normal">
                                              Row-Column Sum: {v} + {matrixB[r][c]}
                                            </span>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT SIDE: MATRIX DOT MULTIPLICATION (Q19) */}
                        <div className="space-y-4">
                          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">Matrix Dot Product Workshop (np.dot(A, B))</span>
                          
                          <div className="grid grid-cols-3 items-center gap-2">
                            {/* Input Mult Matrix A */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-[#8A8A85] text-center block">Matrix A</span>
                              <div className="border-l-2 border-r-2 border-stone-400 p-1 bg-[#FBFBFA] flex flex-col gap-1">
                                {multMatrixA.map((rowArr, r) => (
                                  <div key={r} className="flex gap-1 justify-center">
                                    {rowArr.map((v, c) => (
                                      <input
                                        key={c}
                                        type="number"
                                        value={v}
                                        onChange={(e) => {
                                          const next = [...multMatrixA.map(col => [...col])];
                                          next[r][c] = Number(e.target.value) || 0;
                                          setMultMatrixA(next);
                                        }}
                                        className="w-10 py-1 font-mono text-center text-xs bg-white border border-[#EBEBE8] rounded focus:ring-1 focus:ring-[#1F1F1E]"
                                      />
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Operator dot sign */}
                            <div className="text-center pr-1.5">
                              <span className="text-xs px-2 py-1 uppercase bg-stone-100 text-[#555550] border border-stone-200 rounded font-mono font-bold leading-none">Dot</span>
                            </div>

                            {/* Input Mult Matrix B */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-[#8A8A85] text-center block">Matrix B</span>
                              <div className="border-l-2 border-r-2 border-stone-400 p-1 bg-[#FBFBFA] flex flex-col gap-1">
                                {multMatrixB.map((rowArr, r) => (
                                  <div key={r} className="flex gap-1 justify-center">
                                    {rowArr.map((v, c) => (
                                      <input
                                        key={c}
                                        type="number"
                                        value={v}
                                        onChange={(e) => {
                                          const next = [...multMatrixB.map(col => [...col])];
                                          next[r][c] = Number(e.target.value) || 0;
                                          setMultMatrixB(next);
                                        }}
                                        className="w-10 py-1 font-mono text-center text-xs bg-white border border-[#EBEBE8] rounded focus:ring-1 focus:ring-[#1F1F1E]"
                                      />
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Dot output visualizer */}
                          <div className="pt-2">
                            <span className="text-[10px] font-mono text-[#8A8A85] text-center block mb-1">Resulting Dot Matrix np.dot(A, B)</span>
                            <div className="flex justify-center">
                              <div className="border-l-2 border-r-2 border-teal-600 p-2 bg-[#FBFBFA]/50 inline-flex flex-col gap-1.5 shadow-sm rounded">
                                {calculatedMultResult.map((row_vals, r) => (
                                  <div key={r} className="flex gap-2">
                                    {row_vals.map((resultValue, c) => {
                                      const isHovered = hoveredMultResultCell?.r === r && hoveredMultResultCell?.c === c;
                                      
                                      // Get row matching calculations details
                                      const cellFormula = `Row ${r+1} of A x Col ${c+1} of B\n= (${multMatrixA[r][0]}*${multMatrixB[0][c]}) + (${multMatrixA[r][1]}*${multMatrixB[1][c]})`;
                                      
                                      return (
                                        <div
                                          key={c}
                                          onMouseEnter={() => setHoveredMultResultCell({ r, c })}
                                          onMouseLeave={() => setHoveredMultResultCell(null)}
                                          className={`w-14 py-2 text-center font-mono text-xs font-bold rounded transition-all cursor-default relative border ${
                                            isHovered 
                                              ? 'bg-teal-600 text-white border-teal-600' 
                                              : 'bg-white border-[#EBEBE8] text-teal-600'
                                          }`}
                                        >
                                          {resultValue}
                                          {isHovered && (
                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-stone-900 text-stone-100 text-[10px] p-2.5 rounded border border-stone-700 whitespace-pre z-10 shadow-lg font-normal leading-relaxed text-center">
                                              {cellFormula}
                                            </span>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                )}


                {/* SUBTAB 2: REGRESSION INTERACTIVE GRAPH */}
                {workbenchSubtab === 'regression' && (
                  <div className="space-y-6">
                    
                    <div className="bg-white p-6 rounded-xl border border-[#EBEBE8] shadow-sm space-y-6">
                      <div>
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">Machine Learning Simulator</span>
                        <h3 className="text-base font-semibold text-[#1F1F1E]">Line of Best Fit Vector Sandbox</h3>
                        <p className="text-xs text-[#8A8A85]">
                          Experiment with parameters corresponding to the Linear regression formula: <strong>y = m*x + c</strong>. Understand slope, intercept bias, residuals, and cost minimizations.
                        </p>
                      </div>

                      {/* SLIDERS TO EXPERIMENT */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-[#FBFBFA] border border-[#EBEBE8] rounded-xl">
                        
                        {/* Slope Slider */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-[#1F1F1E] flex justify-between">
                            <span>Slope Weight (Slope Coefficient <strong>m</strong>):</span>
                            <span className="font-mono text-amber-600 bg-amber-50 px-1.5 rounded">{slope_m.toFixed(1)}</span>
                          </label>
                          <input
                            type="range"
                            min={0}
                            max={15}
                            step={0.1}
                            value={slope_m}
                            onChange={(e) => setSlopeM(Number(e.target.value))}
                            className="w-full accent-amber-500"
                          />
                          <p className="text-[10px] text-[#8A8A85]">Changes the steepness rate. Represents expected Marks gained per Hour studied.</p>
                        </div>

                        {/* Intercept Slider */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-[#1F1F1E] flex justify-between">
                            <span>Bias Intercept (Starting Offset <strong>c</strong>):</span>
                            <span className="font-mono text-amber-600 bg-amber-50 px-1.5 rounded">{intercept_c.toFixed(1)}</span>
                          </label>
                          <input
                            type="range"
                            min={0}
                            max={50}
                            step={0.5}
                            value={intercept_c}
                            onChange={(e) => setInterceptC(Number(e.target.value))}
                            className="w-full accent-amber-500"
                          />
                          <p className="text-[10px] text-[#8A8A85]">Bias constant. Represents forecasted marks scaling if Hours Studied = 0.</p>
                        </div>

                        {/* Optimization Sandbox */}
                        <div className="flex flex-col justify-between p-3 border border-[#EBEBE8] rounded bg-white">
                          <div>
                            <span className="text-[10px] font-bold text-[#8A8A85] uppercase tracking-wider block">Real-time cost score</span>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="text-xl font-bold font-mono text-[#1F1F1E]">{regressionMetrics.mse}</span>
                              <span className="text-xs text-[#8A8A85] font-semibold uppercase">MSE (Loss)</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={snapToBestFit}
                            className="w-full text-xs py-2 bg-[#1F1F1E] text-white rounded font-medium flex items-center justify-center gap-1.5 hover:bg-stone-800 transition-all"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Optimize Best Fit Line (Q24)
                          </button>
                        </div>

                      </div>

                      {/* INTERACTIVE CARDS COORDINATE COMPILER */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        
                        {/* Left section: Coordinate scatter plot (BESPOKE HIGH QUALITY RESPONSIVE SVG) */}
                        <div className="lg:col-span-2 border border-[#EBEBE8] rounded-xl p-4 bg-white shadow-sm space-y-2">
                          <span className="text-xs font-semibold text-[#555550] block">
                            Coordinate Plot (X: Studying Hours, Y: Final Score Marks)
                          </span>

                          <div className="relative w-full aspect-[4/3] bg-zinc-50 border border-zinc-200 rounded overflow-hidden">
                            {/* Grid Lines */}
                            <svg className="w-full h-full" viewBox="0 0 500 350">
                              {/* Horizontal guidelines */}
                              {[20, 40, 60, 80, 100].map((marksVal) => {
                                const yPos = 350 - (marksVal / 100) * 310 - 25;
                                return (
                                  <g key={marksVal}>
                                    <line x1="35" y1={yPos} x2="480" y2={yPos} stroke="#EBEBE8" strokeWidth="1" strokeDasharray="3 3" />
                                    <text x="8" y={yPos + 4} fill="#8A8A85" fontSize="9" className="font-mono">{marksVal}</text>
                                  </g>
                                );
                              })}

                              {/* Vertical guidelines */}
                              {[2, 4, 6, 8, 10].map((hoursVal) => {
                                const xPos = (hoursVal / 10) * 420 + 40;
                                return (
                                  <g key={hoursVal}>
                                    <line x1={xPos} y1="15" x2={xPos} y2="325" stroke="#EBEBE8" strokeWidth="1" strokeDasharray="3 3" />
                                    <text x={xPos - 4} y="340" fill="#8A8A85" fontSize="9" className="font-mono">{hoursVal}</text>
                                  </g>
                                );
                              })}

                              {/* Axes labels */}
                              <text x="440" y="337" fill="#1F1F1E]" fontSize="9" fontWeight="bold">X Hours</text>
                              <text x="8" y="15" fill="#1F1F1E]" fontSize="9" fontWeight="bold" transform="rotate(-90 8 15)" className="translate-x-1 translate-y-3">Y Marks</text>

                              {/* Residual/Error vertical lines */}
                              {regressionMetrics.pointsWithPredictions.map((pt) => {
                                const realX = (pt.x / 10) * 420 + 40;
                                const realY = 350 - (pt.y / 100) * 310 - 25;
                                const predY = 350 - (pt.predicted / 100) * 310 - 25;
                                return (
                                  <line
                                    key={`err-${pt.id}`}
                                    x1={realX}
                                    y1={realY}
                                    x2={realX}
                                    y2={predY}
                                    stroke="#EF4444"
                                    strokeWidth="1.5"
                                    strokeDasharray="2 2"
                                  />
                                );
                              })}

                              {/* Fitted Regression line y = mx + c */}
                              {(() => {
                                const xAt0 = 0;
                                const yAt0 = slope_m * xAt0 + intercept_c;
                                const xAt10 = 10;
                                const yAt10 = slope_m * xAt10 + intercept_c;

                                const px1 = (xAt0 / 10) * 420 + 40;
                                const py1 = 350 - (Math.min(100, Math.max(0, yAt0)) / 100) * 310 - 25;
                                const px2 = (xAt10 / 10) * 420 + 40;
                                const py2 = 350 - (Math.min(100, Math.max(0, yAt10)) / 100) * 310 - 25;

                                return (
                                  <line
                                    x1={px1}
                                    y1={py1}
                                    x2={px2}
                                    y2={py2}
                                    stroke="#F59E0B"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                  />
                                );
                              })()}

                              {/* Target scatter coordinates dots representing real coordinates */}
                              {regressionMetrics.pointsWithPredictions.map((pt) => {
                                const cx = (pt.x / 10) * 420 + 40;
                                const cy = 350 - (pt.y / 100) * 310 - 25;
                                return (
                                  <g key={pt.id} className="cursor-pointer group">
                                    <circle
                                      cx={cx}
                                      cy={cy}
                                      r="7"
                                      fill="#1F1F1E"
                                      stroke="#FFFFFF"
                                      strokeWidth="2"
                                    />
                                    {/* Tooltip text anchor inside coordinates */}
                                    <text
                                      x={cx + 10}
                                      y={cy + 4}
                                      fill="#1F1F1E"
                                      fontSize="9"
                                      className="font-mono bg-white font-bold hidden group-hover:block"
                                    >
                                      ({pt.x} hr, {pt.y} marks) | Error: {pt.error}
                                    </text>
                                  </g>
                                );
                              })}
                            </svg>
                          </div>
                          
                          <div className="flex justify-between items-center text-[10px] text-[#8A8A85] px-1">
                            <span>Double-click graph viewport is disabled. Track coordinated dots plotted natively.</span>
                            <span className="flex items-center gap-1"><span className="w-2.5 h-1 bg-[#F59E0B] inline-block rounded" /> Fitted: y = {slope_m.toFixed(1)}*x + {intercept_c.toFixed(1)}</span>
                          </div>
                        </div>

                        {/* Right Section: Coordinate tables list */}
                        <div className="border border-[#EBEBE8] rounded-xl p-4 bg-white shadow-sm space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#555550]">Residual calculations</span>
                            <span className="text-xs text-[#8A8A85] font-semibold font-mono">y_pred = m*x + c</span>
                          </div>

                          <div className="space-y-3 max-h-72 overflow-y-auto scrollbar-none">
                            {regressionMetrics.pointsWithPredictions.map((pt) => {
                              const errorColor = pt.error > 0 ? 'text-emerald-600' : 'text-red-500';
                              return (
                                <div key={pt.id} className="p-3 border border-[#EBEBE8] rounded bg-[#FBFBFA] hover:bg-stone-50 transition-all text-xs flex justify-between items-center">
                                  <div>
                                    <span className="block font-semibold text-[#1F1F1E]">Student #{pt.id} (Hours: {pt.x})</span>
                                    <span className="text-[10px] text-[#8A8A85] block font-mono">Real Marks: <strong>{pt.y}</strong> | Predicted: <strong>{pt.predicted}</strong></span>
                                  </div>
                                  <div className="text-right font-mono">
                                    <span className={`block font-bold text-xs ${errorColor}`}>{pt.error > 0 ? `+${pt.error}` : pt.error}</span>
                                    <span className="text-[9px] text-[#8A8A85] block">sq. err: {pt.sqError}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="pt-3 border-t border-[#EBEBE8] text-xs text-[#555550] leading-relaxed">
                            <span className="font-semibold block mb-0.5">Understanding Lost Function Calculations:</span>
                            The MSE compiles squared error residual deviations: (Actual - Predict)². Optimizations solve parameters values that fit least aggregate squared residuals offsets.
                          </div>

                        </div>

                      </div>

                    </div>

                  </div>
                )}

              </div>
            )}


            {/* ========================================================= */}
            {/* TAB 3: TERMINAL CODE TRACE SIMULATOR */}
            {/* ========================================================= */}
            {activeTab === 'simulator' && (
              <div className="space-y-6">
                
                {/* Visual syllabus code selection bar */}
                <div className="bg-white p-4 rounded-xl border border-[#EBEBE8] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest block">Lab Syllabus Code Exam Exercises</span>
                    <h3 className="text-sm font-semibold text-[#1F1F1E]">Interactive Line-by-Line Execution Debugger</h3>
                  </div>

                  {/* Problem selection dropdown buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    {CODING_CHALLENGES.map((challenge, chIdx) => (
                      <button
                        key={challenge.id}
                        onClick={() => setActiveChallengeIdx(chIdx)}
                        className={`text-xs px-3 py-1.5 rounded-lg transition-all border ${
                          activeChallengeIdx === chIdx 
                            ? 'bg-[#1F1F1E] text-white border-[#1F1F1E]' 
                            : 'bg-transparent text-[#555550] border-[#EBEBE8] hover:bg-[#FBFBFA]'
                        }`}
                      >
                        {challenge.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DOUBLE PANEL LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  
                  {/* LEFT CODE CONTROLLER GRAPH (3 cols) */}
                  <div className="lg:col-span-3 border border-zinc-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col justify-between">
                    
                    {/* Header line control strip */}
                    <div className="border-b border-[#EBEBE8] px-5 py-3.5 bg-stone-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-400" />
                        <span className="w-3 h-3 rounded-full bg-yellow-400" />
                        <span className="w-3 h-3 rounded-full bg-green-400" />
                        <span className="text-xs text-[#8A8A85] font-semibold font-mono ml-2">{activeChallenge.title}.py</span>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-200 text-zinc-700 font-bold tracking-wider uppercase">Python 3 Trace</span>
                    </div>

                    {/* Code playground text tracing */}
                    <div className="p-6 bg-[#1F1F1E] text-white font-mono text-xs overflow-x-auto min-h-64 leading-relaxed relative">
                      {activeChallenge.snippet.split('\n').map((line, lIdx) => {
                        const lineNum = lIdx + 1;
                        const isCurrentActive = activeTraceStepData?.activeLine === lineNum;
                        
                        return (
                          <div 
                            key={lineNum} 
                            className={`flex items-center ${
                              isCurrentActive ? 'bg-teal-500/15 -mx-6 px-6 border-l-4 border-teal-400 py-0.5' : ''
                            }`}
                          >
                            <span className="w-6 text-zinc-600 select-none text-right mr-4">{lineNum}</span>
                            <span className={isCurrentActive ? 'text-teal-300 font-black' : 'text-stone-300'}>
                              {line}
                            </span>
                            {isCurrentActive && (
                              <span className="ml-auto text-[9px] uppercase px-1 rounded bg-teal-500/20 text-teal-400 font-bold border border-teal-500/30">
                                Evaluating
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* STEPS TRACER CONTROLLER BAR */}
                    <div className="border-t border-[#EBEBE8] px-5 py-4 bg-stone-50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                      
                      {/* Debug details step meter */}
                      <div className="text-xs font-mono text-[#555550] flex flex-wrap items-center gap-3">
                        <span>Step: <span className="font-bold">{tracerStep + 1}</span> of <span className="font-bold font-mono">{tracerTrace.length}</span></span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400 border border-zinc-200/60 px-1.5 py-0.5 rounded bg-zinc-100">
                          <kbd className="bg-white border text-zinc-600 rounded px-1 text-[8px] font-sans font-bold shadow-sm">Space</kbd> Play/Pause
                          <span className="mx-0.5 text-zinc-300">•</span>
                          <kbd className="bg-white border text-zinc-600 rounded px-1 text-[8px] font-sans font-bold shadow-sm">→</kbd> Next Step
                          <span className="mx-0.5 text-zinc-300">•</span>
                          <kbd className="bg-white border text-zinc-600 rounded px-1 text-[8px] font-sans font-bold shadow-sm">←</kbd> Prev Step
                        </span>
                      </div>

                      {/* Controls Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          disabled={tracerStep === 0}
                          onClick={() => {
                            setIsAutoPlaying(false);
                            setTracerStep(prev => Math.max(0, prev - 1));
                          }}
                          className="px-3 py-1.5 bg-white border border-[#EBEBE8] rounded-lg text-xs disabled:opacity-40 transition-all hover:bg-[#FBFBFA]"
                        >
                          Prev Step
                        </button>

                        <button
                          onClick={() => {
                            setIsAutoPlaying(!isAutoPlaying);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 text-white ${
                            isAutoPlaying 
                              ? 'bg-amber-500 hover:bg-amber-600' 
                              : 'bg-[#1F1F1E] hover:bg-zinc-800'
                          }`}
                        >
                          {isAutoPlaying ? 'Pause loop' : 'Auto Play'}
                        </button>

                        <button
                          disabled={tracerStep === tracerTrace.length - 1}
                          onClick={() => {
                            setIsAutoPlaying(false);
                            setTracerStep(prev => Math.min(tracerTrace.length - 1, prev + 1));
                          }}
                          className="px-3 py-1.5 bg-[#1F1F1E] text-white rounded-lg text-xs disabled:opacity-40 transition-all"
                        >
                          Next Step
                        </button>

                        <button
                          onClick={() => {
                            setIsAutoPlaying(false);
                            setTracerStep(0);
                          }}
                          className="p-1.5 border border-[#EBEBE8] rounded-lg bg-white text-[#8A8A85] hover:text-[#1F1F1E]"
                          title="Restart trace"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>

                  </div>


                  {/* RIGHT TRACE WATCH MONITOR PANEL (2 cols) */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* INPUT COMPILER CONTROLLER */}
                    <div className="bg-white p-5 border border-[#EBEBE8] rounded-xl shadow-sm space-y-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#555550] block border-b border-[#EBEBE8] pb-1.5">
                        1. Configure Simulator Scope:
                      </span>

                      <div className="space-y-4">
                        {activeChallenge.inputs.map((input) => (
                          <div key={input.name} className="space-y-2">
                            <label className="text-xs font-bold text-stone-700 flex justify-between">
                              <span>Input variable &#39;{input.name}&#39;:</span>
                              <span className="font-mono text-xs text-indigo-600 bg-indigo-50 px-1 rounded">
                                {tracerInputs[input.name]}
                              </span>
                            </label>

                            {/* Render different controllers depending on input type */}
                            {input.type === 'number' && (
                              <input
                                type="range"
                                min={input.min || 1}
                                max={input.max || 100}
                                value={tracerInputs[input.name] ?? input.default}
                                onChange={(e) => {
                                  setTracerInputs(prev => ({
                                    ...prev,
                                    [input.name]: Number(e.target.value)
                                  }));
                                  setTracerStep(0);
                                  setIsAutoPlaying(false);
                                }}
                                className="w-full accent-indigo-600"
                              />
                            )}

                            {input.type === 'array' && (
                              <div className="space-y-1">
                                <input
                                  type="text"
                                  defaultValue={(tracerInputs[input.name] ?? input.default).join(',')}
                                  onBlur={(e) => {
                                    const parsedNumArr = e.target.value.split(',')
                                      .map(v => Number(v.trim()))
                                      .filter(v => !isNaN(v));
                                    setTracerInputs(prev => ({
                                      ...prev,
                                      [input.name]: parsedNumArr
                                    }));
                                    setTracerStep(0);
                                    setIsAutoPlaying(false);
                                  }}
                                  className="w-full px-2.5 py-1.5 border border-[#EBEBE8] rounded font-mono text-xs focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                                />
                                <span className="text-[10px] text-[#8A8A85] block italic">Comma separated numbers array. Press enter or blur text input to compile array values.</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* VIRTUAL STACK FRAME MEMORY TRACER */}
                    <div className="bg-white p-5 border border-[#EBEBE8] rounded-xl shadow-sm space-y-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#555550] block border-b border-[#EBEBE8] pb-1.5">
                        2. Memory Stack Trace Framework:
                      </span>

                      <div className="space-y-3">
                        {/* Scope Variables Table */}
                        <div className="border border-[#EBEBE8] rounded overflow-hidden">
                          <div className="grid grid-cols-2 bg-stone-50 border-b border-[#EBEBE8] px-3.5 py-1 text-[10px] font-semibold text-[#8A8A85] uppercase tracking-wider">
                            <span>Variable Object</span>
                            <span>Memory Evaluation</span>
                          </div>
                          
                          <div className="divide-y divide-[#EBEBE8] font-mono text-xs">
                            {Object.entries(activeTraceStepData?.variables || {}).map(([vName, vVal]) => {
                              return (
                                <div key={vName} className="grid grid-cols-2 px-3.5 py-2 hover:bg-stone-50 transition-all">
                                  <span className="text-zinc-600 font-bold">{vName}</span>
                                  <span className="text-indigo-600 font-bold">
                                    {typeof vVal === 'object' ? JSON.stringify(vVal) : String(vVal)}
                                  </span>
                                </div>
                              );
                            })}
                            {Object.keys(activeTraceStepData?.variables || {}).length === 0 && (
                              <div className="p-3.5 text-center text-stone-400 italic">No variables allocated. Initialize compiler sequence loop.</div>
                            )}
                          </div>
                        </div>

                        {/* Interactive dynamic tracer explanations block */}
                        <div className="p-3.5 bg-indigo-50 border-l-2 border-indigo-500 rounded-r-lg text-xs text-indigo-900 leading-relaxed min-h-20">
                          <span className="font-bold block mb-1">State Log:</span>
                          {activeTraceStepData?.description}
                        </div>

                        {/* TERMINAL CONSOLE LOGGER */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold tracking-wider text-[#8A8A85] uppercase">Standard Terminal Output</span>
                            <button
                              id="clear-terminal-btn"
                              onClick={() => setIsTerminalCleared(true)}
                              className="text-[10px] px-2 py-0.5 bg-zinc-100 hover:bg-[#1F1F1E] hover:text-[#FBFBFA] text-[#555550] rounded border border-zinc-200 font-medium transition-all"
                              title="Clear standard terminal output log"
                            >
                              Clear Output
                            </button>
                          </div>
                          <div className="bg-[#1F1F1E] text-green-400 p-3 h-14 rounded-lg font-mono text-xs overflow-y-auto shadow-inner">
                            {(!isTerminalCleared && activeTraceStepData?.output) ? (
                              <span>&gt;&gt;&gt; {activeTraceStepData.output}</span>
                            ) : (
                              <span className="text-zinc-600 italic">... waiting for print() trace evaluation ...</span>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}


            {/* ========================================================= */}
            {/* TAB 4: PRACTICE MCQ QUIZ TEST ENGINE */}
            {/* ========================================================= */}
            {activeTab === 'quiz' && (
              <div className="space-y-6">
                
                {/* Visual quiz starter screen state */}
                {quizState === 'start' && (
                  <div className="bg-white p-10 border border-[#EBEBE8] rounded-xl shadow-sm text-center space-y-6 max-w-xl mx-auto my-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                      <HelpCircle className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-[#1F1F1E]">NumPy &amp; Python Theory Prep Quiz</h3>
                      <p className="text-xs text-[#8A8A85] leading-relaxed">
                        A dynamic revision exam simulator compilation. Generates 10 multiple-choice questions targeting Python lists, NumPy operations math, matrix statistics, and Linear Regression formulas.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center py-2">
                      <div className="p-2 border border-[#EBEBE8] rounded bg-[#FBFBFA]">
                        <span className="block text-[10px] text-[#8A8A85] font-bold uppercase tracking-wider">Length</span>
                        <span className="block text-base font-bold text-[#1F1F1E] mt-0.5 font-mono">10 Qs</span>
                      </div>
                      <div className="p-2 border border-[#EBEBE8] rounded bg-[#FBFBFA]">
                        <span className="block text-[10px] text-[#8A8A85] font-bold uppercase tracking-wider">High Score</span>
                        <span className="block text-base font-bold text-amber-600 mt-0.5 font-mono">{quizHighScore}/10</span>
                      </div>
                      <div className="p-2 border border-[#EBEBE8] rounded bg-[#FBFBFA]">
                        <span className="block text-[10px] text-[#8A8A85] font-bold uppercase tracking-wider">Format</span>
                        <span className="block text-base font-bold text-indigo-600 mt-0.5 font-mono">MCQ</span>
                      </div>
                    </div>

                    <button
                      onClick={startNewQuiz}
                      className="w-full py-3 bg-[#1F1F1E] text-white font-medium rounded-xl hover:bg-stone-800 transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Generate and Launch Exam Practice Session
                    </button>
                    
                    <p className="text-[10px] text-[#8A8A85]">
                      All answers are checked in real-time with full syllabus annotation reviews.
                    </p>
                  </div>
                )}

                {/* QUIZ ACTIVE PLAYING FRAME */}
                {quizState === 'playing' && quizQuestionsGenerated.length > 0 && (
                  <div className="space-y-6 max-w-2xl mx-auto">
                    
                    {/* Header score metric trackers */}
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs text-[#8A8A85] font-mono">
                        Question <strong className="text-[#1F1F1E] font-bold font-mono">{currentQuizIdx + 1}</strong> of <strong className="text-[#1F1F1E] font-bold font-mono">10</strong>
                      </span>

                      <div className="flex gap-4">
                        <span className="text-xs text-[#8A8A85] font-semibold">Score: <strong className="text-emerald-500 font-mono">{quizScore}</strong></span>
                        <span className="text-xs text-[#8A8A85]">Highscore: <strong className="text-amber-500 font-mono">{quizHighScore}</strong></span>
                      </div>
                    </div>

                    {/* Simple minimalist linear progress bar */}
                    <div className="w-full h-1 bg-[#EBEBE8] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#1F1F1E] transition-all duration-300"
                        style={{ width: `${((currentQuizIdx) / 10) * 100}%` }}
                      />
                    </div>

                    {/* THE CURRENT ACTIVE QUESTION BOX */}
                    <div className="bg-white p-6 md:p-8 border border-[#EBEBE8] rounded-xl shadow-sm space-y-6">
                      <h3 className="text-base font-semibold text-[#1F1F1E] leading-relaxed">
                        {quizQuestionsGenerated[currentQuizIdx].question}
                      </h3>

                      {/* Choices vertical selector deck */}
                      <div className="space-y-3">
                        {quizQuestionsGenerated[currentQuizIdx].choices.map((choiceText) => {
                          const isSelected = selectedQuizChoice === choiceText;
                          const isCorrectAns = choiceText === quizQuestionsGenerated[currentQuizIdx].correctAnswer;
                          
                          let borderAccent = 'border-[#EBEBE8] hover:border-[#1F1F1E]';
                          let bgAccent = 'bg-white';
                          
                          if (quizAnswerChecked) {
                            if (isCorrectAns) {
                              borderAccent = 'border-emerald-500 ring-1 ring-emerald-500/20';
                              bgAccent = 'bg-emerald-50/50';
                            } else if (isSelected) {
                              borderAccent = 'border-red-500 ring-1 ring-red-500/20';
                              bgAccent = 'bg-red-50/50';
                            } else {
                              borderAccent = 'border-[#EBEBE8] opacity-60';
                            }
                          } else if (isSelected) {
                            borderAccent = 'border-[#1F1F1E] ring-1 ring-[#1F1F1E]/20';
                            bgAccent = 'bg-stone-50';
                          }

                          return (
                            <button
                              key={choiceText}
                              disabled={quizAnswerChecked}
                              onClick={() => handleSelectChoice(choiceText)}
                              className={`w-full p-4 border rounded-xl text-left text-xs transition-all leading-relaxed flex items-center justify-between gap-4 ${borderAccent} ${bgAccent}`}
                            >
                              <span className="font-normal text-[#3E3E3C]">{choiceText}</span>
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-[#1F1F1E] bg-[#1F1F1E] text-white font-bold text-[8px]' : 'border-[#C2C2BE]'
                              }`}>
                                {isSelected && "✓"}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* TRIGGER OPERATIONS CONTROL GRID */}
                      <div className="border-t border-[#EBEBE8] pt-5 flex items-center justify-end gap-3">
                        {!quizAnswerChecked ? (
                          <button
                            disabled={!selectedQuizChoice}
                            onClick={checkQuizAnswer}
                            className="px-6 py-2.5 bg-[#1F1F1E] text-white text-xs font-semibold rounded-lg disabled:opacity-40 hover:bg-stone-800 transition-all shadow-sm"
                          >
                            Submit Answer Checked
                          </button>
                        ) : (
                          <button
                            onClick={handleNextQuizQuestion}
                            className="px-6 py-2.5 bg-[#1F1F1E] text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-all shadow-sm flex items-center gap-1.5"
                          >
                            {currentQuizIdx < 9 ? 'Next Question' : 'View Quiz Summaries'}
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                    </div>

                    {/* DETAILED FEEDBACK PANEL */}
                    {quizAnswerChecked && (
                      <div className={`p-5 rounded-xl border transition-all ${
                        selectedQuizChoice === quizQuestionsGenerated[currentQuizIdx].correctAnswer
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-red-200 bg-red-50/20'
                      }`}>
                        <div className="flex gap-2.5 items-start">
                          <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${
                            selectedQuizChoice === quizQuestionsGenerated[currentQuizIdx].correctAnswer ? 'text-emerald-500' : 'text-red-500'
                          }`} />
                          
                          <div className="text-xs space-y-1 leading-relaxed">
                            <span className="font-bold text-[#1F1F1E] block">
                              {selectedQuizChoice === quizQuestionsGenerated[currentQuizIdx].correctAnswer ? 'Bravo! Correct Answer.' : 'Incorrect assessment.'}
                            </span>
                            <span className="text-[#3E3E3C] block font-medium">
                              Correct answer reference: {quizQuestionsGenerated[currentQuizIdx].correctAnswer}
                            </span>
                            <p className="text-[#8A8A85] text-[11px] pt-1 italic">
                              Check our Directory syllabus profiles anytime to review calculations rules and equations templates.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                )}


                {/* QUIZ COMPLETED OVERVIEW SCREEN */}
                {quizState === 'completed' && (
                  <div className="space-y-6 max-w-2xl mx-auto">
                    
                    <div className="bg-white p-8 border border-[#EBEBE8] rounded-xl shadow-sm text-center space-y-6">
                      <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                        <Award className="w-8 h-8" />
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-bold text-lg text-[#1F1F1E]">Practice Exam Completed Successfully!</h3>
                        <p className="text-xs text-[#8A8A85]">Excellent diagnostic progress of Python Basics, NumPy Arrays, and Regression variables equations.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-left">
                        <div className="p-3 border border-[#EBEBE8] rounded bg-[#FBFBFA]">
                          <span className="text-[10px] text-[#8A8A85] font-bold block uppercase tracking-wider">Final Score</span>
                          <span className="text-xl font-bold font-mono text-[#1F1F1E] block mt-0.5">{quizScore} / 10 Correct</span>
                        </div>
                        
                        <div className="p-3 border border-[#EBEBE8] rounded bg-[#FBFBFA]">
                          <span className="text-[10px] text-[#8A8A85] font-bold block uppercase tracking-wider">Highscore Recorded</span>
                          <span className="text-xl font-bold font-mono text-amber-600 block mt-0.5">{quizHighScore} / 10 Score</span>
                        </div>
                      </div>

                      <button
                        onClick={startNewQuiz}
                        className="px-6 py-2.5 bg-[#1F1F1E] text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-all font-mono"
                      >
                        Retake Randomized MCQ Practice Lab
                      </button>
                    </div>

                    {/* HISTORY ERROR SUMMARIZER REVIEW */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-[#555550] uppercase tracking-wider block">Question-by-Question Diagnostics Review</span>
                      
                      <div className="space-y-3">
                        {quizSessionHistory.map((item, idx) => (
                          <div 
                            key={idx}
                            className={`p-4 border rounded-xl bg-white text-xs space-y-2 relative overflow-hidden ${
                              item.isCorrect ? 'border-[#EBEBE8]' : 'border-red-200'
                            }`}
                          >
                            <span className="font-mono text-[9px] uppercase font-bold text-stone-400">Question #{idx + 1}</span>
                            <h4 className="font-bold text-[#1F1F1E] leading-relaxed pr-6">{item.question}</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[#555550]">
                              <div>
                                <span className="block text-[10px] text-[#8A8A85]">Your Input:</span>
                                <span className={`font-mono font-medium ${item.isCorrect ? 'text-emerald-600' : 'text-red-500 font-semibold'}`}>{item.yourAnswer}</span>
                              </div>
                              <div>
                                <span className="block text-[10px] text-[#8A8A85]">Correct Output syllabus:</span>
                                <span className="font-mono text-emerald-600 font-bold">{item.correctAnswer}</span>
                              </div>
                            </div>

                            {/* Correct Indicator symbol */}
                            <div className="absolute right-4 top-4">
                              {item.isCorrect ? (
                                <span className="text-emerald-500 font-bold">✓</span>
                              ) : (
                                <span className="text-red-400 font-bold">✗</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

          </div>


          {/* ========================================================= */}
          {/* RIGHT SIDEBAR PANEL: THE AI TUTOR BOT & CORE INDEX KEYS */}
          {/* ========================================================= */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* 1. QUIET LUXURY CORE SYLLABUS DIRECTORY MINI COMPANION */}
            <div className="bg-[#FFFFFF] border border-[#EBEBE8] rounded-xl p-5 shadow-sm space-y-4">
              <div>
                <span className="text-[10px] font-bold text-[#1F1F1E] uppercase tracking-wider block">Revision Lab Index</span>
                <p className="text-xs text-[#8A8A85] mt-1">Quick highlights checklist of your syllabus requirements.</p>
              </div>

              {/* Checklist widgets */}
              <div className="space-y-3 pt-2 border-t border-[#EBEBE8]">
                
                <div className="flex gap-2.5 items-start text-xs text-[#555550]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1F1F1E] mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-[#1F1F1E] block">Python Basics (Q1-Q8)</span>
                    <span className="text-[#8A8A85] text-[10px]">Data types, even/odd, loop differences, functions, mutable lists, immutable tuples (Q7), unique dictionaries keys (Q8).</span>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start text-xs text-[#555550]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1F1F1E] mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-[#1F1F1E] block">NumPy Arrays (Q9-Q19)</span>
                    <span className="text-[#8A8A85] text-[10px]">Homogeneous contiguous buffers, matrix multiplication (dot products Q19), zeros/ones templates, mean statistics vector arrays shapes.</span>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start text-xs text-[#555550]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1F1F1E] mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-[#1F1F1E] block">ML Theory (Q20-Q25)</span>
                    <span className="text-[#8A8A85] text-[10px]">Supervised modeling equation: y = m*x + c. Least Squares Best Fit calculations, price projections &amp; diagnostics application.</span>
                  </div>
                </div>

              </div>
            </div>

            {/* 2. THE CHAT TUTOR BOT PANEL */}
            <div className="bg-white border border-[#EBEBE8] rounded-xl shadow-sm overflow-hidden flex flex-col justify-between max-h-[480px]">
              
              {/* Header card indicator */}
              <div className="px-4 py-3 bg-[#1F1F1E] text-white flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider">Revision Professor</span>
                </div>
                <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              </div>

              {/* Chat timeline items */}
              <div className="p-4 space-y-3 overflow-y-auto text-xs flex-1 max-h-72 divide-y divide-[#EBEBE8]/50 scrollbar-none bg-[#FBFBFA]/50">
                {aiHistory.map((item, index) => (
                  <div key={index} className={`pt-2.5 first:pt-0 ${item.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className="text-[10px] font-bold text-[#8A8A85] block mb-0.5">
                      {item.role === 'user' ? 'You (Student)' : 'Syllabus Professor'}
                    </span>
                    <p className={`inline-block text-xs leading-relaxed max-w-full text-justify text-stone-700`}>
                      {item.text}
                    </p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Prompt Input Deck */}
              <div className="p-3 border-t border-[#EBEBE8] bg-[#FFFFFF] space-y-1.5">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    disabled={aiIsGenerating}
                    placeholder="Ask standard syntax, concept note..."
                    value={aiMessage}
                    onChange={(e) => setAiMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendAiMessage();
                      }
                    }}
                    className="flex-1 bg-[#FBFBFA] border border-[#EBEBE8] p-2 rounded text-xs focus:ring-1 focus:ring-[#1F1F1E] focus:outline-none"
                  />
                  <button
                    onClick={handleSendAiMessage}
                    disabled={aiIsGenerating || !aiMessage.trim()}
                    className="p-2 bg-[#1F1F1E] disabled:opacity-40 text-[#FBFBFA] rounded text-xs transition-all hover:bg-zinc-800 shrink-0 font-bold"
                  >
                    Ask
                  </button>
                </div>
                <span className="text-[9px] text-[#8A8A85] block text-center">
                  Consultation scoped to current syllabus. Offline safe.
                </span>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* --- FOOTER CARD STYLES --- */}
      <footer className="border-t border-[#EBEBE8] mt-16 py-8 px-6 text-center text-xs text-[#8A8A85]">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-semibold text-stone-600">Python Syllabus Revision Lab • High Fidelity Examination Sandbox Companion</p>
          <p>Created to practice calculations, experiment dimensions transformations, trace code executing lines, and evaluate quiz readiness.</p>
          <div className="flex justify-center gap-4 pt-2 font-mono text-[10px]">
            <span>Local Time Zone: UTC 2026</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
