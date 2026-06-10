export interface SyllabusQuestion {
  id: string; // e.g. Q1, Q2
  number: number;
  category: "Python Basics" | "NumPy" | "Linear Regression Theory";
  question: string;
  answer: string;
  codeSnippet?: string;
  tableData?: { headers: string[]; rows: string[][] };
  explanation?: string;
}

export interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  snippet: string;
  inputs: { name: string; type: "number" | "array"; default: any; min?: number; max?: number }[];
  generateTrace: (inputs: Record<string, any>) => {
    step: number;
    description: string;
    variables: Record<string, any>;
    activeLine?: number;
    output?: string;
  }[];
}

export const SYLLABUS_QUESTIONS: SyllabusQuestion[] = [
  {
    id: "q1",
    number: 1,
    category: "Python Basics",
    question: "What is Python?",
    answer: "Python is a high-level, interpreted, object-oriented programming language that is easy to learn and widely used for web development, data science, machine learning, and automation.",
    explanation: "Its main design philosophy emphasizes code readability with the use of significant indentation."
  },
  {
    id: "q2",
    number: 2,
    category: "Python Basics",
    question: "What are the basic data types in Python?",
    answer: "Python has several built-in basic data types such as Integer, Float, String, and Boolean, which represent numbers, floating-point coordinates, text characters, and conditional truths.",
    tableData: {
      headers: ["Data Type", "Example"],
      rows: [
        ["Integer", "10"],
        ["Float", "3.14"],
        ["String", "\"Hello\""],
        ["Boolean", "True"]
      ]
    },
    codeSnippet: `x = 10\ny = 3.14\nname = "Python"\nstatus = True`
  },
  {
    id: "q3",
    number: 3,
    category: "Python Basics",
    question: "Write a program to check whether a number is even or odd.",
    answer: "The program reads an integer input, performs a modulo operations (%) check with 2. If the remainder is 0, it outputs 'Even', otherwise it outputs 'Odd'.",
    codeSnippet: `num = int(input("Enter Number: "))\n\nif num % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")`
  },
  {
    id: "q4",
    number: 4,
    category: "Python Basics",
    question: "What is the difference between for loop and while loop?",
    answer: "A 'for' loop is used when the number of iterations is known beforehand (definite iteration), whereas a 'while' loop continues iterating as long as a specified condition remains true (indefinite iteration).",
    tableData: {
      headers: ["For Loop", "While Loop"],
      rows: [
        ["Used when number of iterations is known", "Used when condition is known"],
        ["Simpler syntax", "More flexible control state"]
      ]
    },
    codeSnippet: `# For Loop Example\nfor i in range(5):\n    print(i)\n\n# While Loop Example\ni = 0\nwhile i < 5:\n    print(i)\n    i += 1`
  },
  {
    id: "q5",
    number: 5,
    category: "Python Basics",
    question: "What is a function?",
    answer: "A function is a reusable, organized block of structured code that is used to perform a single, related action with high-level encapsulation.",
    codeSnippet: `def add(a, b):\n    return a + b\n\nprint(add(5, 3)) # Output: 8`
  },
  {
    id: "q6",
    number: 6,
    category: "Python Basics",
    question: "What is a list?",
    answer: "A list is an ordered, mutable, and indexing-accessible literal collection of values which can contain elements of mixed data types.",
    codeSnippet: `numbers = [10, 20, 30, 40]\nprint(numbers[0]) # Output: 10`
  },
  {
    id: "q7",
    number: 7,
    category: "Python Basics",
    question: "What is the difference between List and Tuple?",
    answer: "The primary difference is mutability. Lists are mutable (can be changed after creation) and use square brackets []. Tuples are immutable (cannot be modified) and use parentheses ().",
    tableData: {
      headers: ["List", "Tuple"],
      rows: [
        ["Mutable (elements can be added/removed/edited)", "Immutable (elements cannot be changed)"],
        ["Uses Square Brackets: []", "Uses Parentheses: ()"],
        ["Slightly slower performance", "Slower overhead, fast reading speeds"]
      ]
    },
    codeSnippet: `my_list = [1, 2, 3]\nmy_tuple = (1, 2, 3)`
  },
  {
    id: "q8",
    number: 8,
    category: "Python Basics",
    question: "What is a Dictionary?",
    answer: "A dictionary in Python is an unordered (or insertion-ordered in modern Python), mutable collection that stores key-value pairs where keys must be unique and hashable.",
    codeSnippet: `student = {\n    "name": "FS",\n    "age": 22\n}\n\nprint(student["name"]) # Output: FS`
  },
  {
    id: "q9",
    number: 9,
    category: "NumPy",
    question: "What is NumPy?",
    answer: "NumPy stands for Numerical Python. It is an essential open-source library used for highly efficient scientific computing, vectorization, and multidimensional matrix operations in Python.",
    codeSnippet: `import numpy as np`
  },
  {
    id: "q10",
    number: 10,
    category: "NumPy",
    question: "Create a NumPy array.",
    answer: "A NumPy array is created by passing a Python list or tuple to the 'np.array()' method.",
    codeSnippet: `import numpy as np\narr = np.array([1, 2, 3, 4])\nprint(arr) # Output: [1 2 3 4]`
  },
  {
    id: "q11",
    number: 11,
    category: "NumPy",
    question: "What is the difference between Python List and NumPy Array?",
    answer: "NumPy arrays are homogeneous (all elements of the same type) stored in contiguous memory blocks, making them significantly faster and less memory-intensive than standard Python lists.",
    tableData: {
      headers: ["Python List", "NumPy Array"],
      rows: [
        ["Slower execution (dynamic type lookup)", "Faster vectorized arithmetic"],
        ["Consumes more system memory", "Extremely low memory footprint"],
        ["General-purpose data grouping", "High-performance numerical computations"]
      ]
    }
  },
  {
    id: "q12",
    number: 12,
    category: "NumPy",
    question: "Create a 2D Array.",
    answer: "A two-dimensional array (matrix) is created by passing a nested list where each list represents a row of values.",
    codeSnippet: `import numpy as np\narr = np.array([\n    [1, 2],\n    [3, 4]\n])\nprint(arr)`
  },
  {
    id: "q13",
    number: 13,
    category: "NumPy",
    question: "Explain shape, size and ndim attributes.",
    answer: "These attributes provide essential metadata about NumPy arrays. 'shape' returns the dimensions tuple, 'size' returns the total count of elements, and 'ndim' returns the number of dimensional axes.",
    codeSnippet: `arr = np.array([[1, 2], [3, 4]])\n\nprint(arr.shape) # Output: (2, 2)\nprint(arr.size)  # Output: 4\nprint(arr.ndim)  # Output: 2`
  },
  {
    id: "q14",
    number: 14,
    category: "NumPy",
    question: "Create zeros and ones arrays.",
    answer: "NumPy provides 'np.zeros()' and 'np.ones()' methods to create arrays pre-populated with zeros or ones based on a specified shape tuple.",
    codeSnippet: `# 2x3 matrix of floats equal to 0.0\nzero_arr = np.zeros((2, 3))\n\n# 2x3 matrix of floats equal to 1.0\none_arr = np.ones((2, 3))`
  },
  {
    id: "q15",
    number: 15,
    category: "NumPy",
    question: "Perform Array Addition.",
    answer: "Arrays of equal length or shapes are added element-wise using the assignment addition operator (+) or 'np.add()'.",
    codeSnippet: `a = np.array([1, 2, 3])\nb = np.array([4, 5, 6])\nprint(a + b) # Output: [5 7 9]`
  },
  {
    id: "q16",
    number: 16,
    category: "NumPy",
    question: "Find Sum, Mean, Max and Min of an Array.",
    answer: "NumPy offers optimized functions 'np.sum()', 'np.mean()', 'np.max()', and 'np.min()' to solve key statistics across the entire array or specific axes.",
    codeSnippet: `arr = np.array([1, 2, 3, 4, 5])\n\nprint(np.sum(arr))  # 15\nprint(np.mean(arr)) # 3.0\nprint(np.max(arr))  # 5\nprint(np.min(arr))  # 1`
  },
  {
    id: "q17",
    number: 17,
    category: "NumPy",
    question: "Explain Reshape operation.",
    answer: "The 'reshape()' method returns an array containing the same data with a new shape tuple. The total size (number of elements) must remain identical.",
    codeSnippet: `arr = np.array([1, 2, 3, 4, 5, 6])\nprint(arr.reshape(2, 3))\n# Output: \n# [[1 2 3]\n#  [4 5 6]]`
  },
  {
    id: "q18",
    number: 18,
    category: "NumPy",
    question: "Matrix Addition.",
    answer: "Matrices are added element-wise if their shapes match perfectly. Row indices and column indices are added sequentially.",
    codeSnippet: `A = np.array([[1, 2], [3, 4]])\nB = np.array([[5, 6], [7, 8]])\nprint(A + B)\n# Output:\n# [[ 6  8]\n#  [10 12]]`
  },
  {
    id: "q19",
    number: 19,
    category: "NumPy",
    question: "Matrix Multiplication.",
    answer: "Matrix multiplication involves computing dot products. In NumPy, 'np.dot(A, B)' or the @ symbol is used, which implements conventional linear algebra row-column math.",
    codeSnippet: `A = np.array([[1, 2], [3, 4]])\nB = np.array([[5, 6], [7, 8]])\nprint(np.dot(A, B))\n# Output:\n# [[19 22]\n#  [43 50]]`
  },
  {
    id: "q20",
    number: 20,
    category: "Linear Regression Theory",
    question: "What is Linear Regression?",
    answer: "Linear Regression is a fundamental supervised machine learning algorithm used to model the linear relationship between a dependent (scalar) variable and one or more independent (explanatory) variables.",
    explanation: "If there is only one independent variable, it is called Simple Linear Regression. If there are multiple, it is Multiple Linear Regression."
  },
  {
    id: "q21",
    number: 21,
    category: "Linear Regression Theory",
    question: "What is the equation of Linear Regression?",
    answer: "The simple linear regression modeling equation is: y = m*x + c",
    explanation: "Where: y = Dependent Variable (Predicted output), x = Independent Variable (Input features), m = Slope coefficient (Weight), c = Intercept coefficient (Bias offset)."
  },
  {
    id: "q22",
    number: 22,
    category: "Linear Regression Theory",
    question: "What is an Independent Variable?",
    answer: "An independent variable (often denoted as X) is the input variable controlled, measured, or used to predict values of others. It acts as the driver or predictor.",
    explanation: "For example: 'Hours Studied' is the independent variable when predicting exam performance."
  },
  {
    id: "q23",
    number: 23,
    category: "Linear Regression Theory",
    question: "What is a Dependent Variable?",
    answer: "A dependent variable (often denoted as Y) is the output variable whose value changes or is predicted. It responds to variations in the independent variable.",
    explanation: "For example: 'Exam Marks' is the response output (dependent variable) predicted from studying duration."
  },
  {
    id: "q24",
    number: 24,
    category: "Linear Regression Theory",
    question: "What is the Best Fit Line?",
    answer: "The Best Fit Line is the optimal straight line that passes through the data scatter plot while minimizing the aggregate prediction errors (such as Sum of Squared Residuals/Errors).",
    explanation: "The algorithm adjusts 'm' (slope) and 'c' (intercept) until the distance score between real coordinates and fitted coordinates is at its absolute minimum."
  },
  {
    id: "q25",
    number: 25,
    category: "Linear Regression Theory",
    question: "What are common Applications of Linear Regression?",
    answer: "Linear Regression is widely deployed across analytical sectors for price, sales, coordinate forecasts, and trend estimation.",
    tableData: {
      headers: ["Application", "Explanation Model"],
      rows: [
        ["1. Real Estate Valuation", "Predicting average house costs using size or location criteria"],
        ["2. Sales Forecasting", "Estimating incoming monthly revenues based on advertising cost weights"],
        ["3. Weather Analytics", "Forecasting temperature trends based on altitudes or coordinates"],
        ["4. Student Analytics", "Correlating scores from study durations, attendances, and focus levels"],
        ["5. Stock Trend Analysis", "Evaluating market movements alongside index price offsets"]
      ]
    }
  }
];

export const CODING_CHALLENGES: CodingChallenge[] = [
  {
    id: "code1",
    title: "Sum of First N Numbers",
    description: "Write a program that takes an integer N as input and prints the sum of all positive integers from 1 up to N.",
    snippet: `n = int(input())\nsum = 0\nfor i in range(1, n + 1):\n    sum += i\nprint(sum)`,
    inputs: [
      { name: "n", type: "number", default: 5, min: 1, max: 20 }
    ],
    generateTrace: (inputs) => {
      const n = Math.floor(inputs.n);
      const trace = [];
      let sum = 0;
      trace.push({
        step: 1,
        description: `Read input values. Initialize 'sum' accumulator variable to 0. Limit constraint is N = ${n}.`,
        variables: { n, sum },
        activeLine: 1,
        output: ""
      });

      for (let i = 1; i <= n; i++) {
        sum += i;
        trace.push({
          step: trace.length + 1,
          description: `Iteration i = ${i} of our range(1, ${n + 1}). Add current index value of ${i} to current sum of ${sum - i}. New dynamic sum accumulates to ${sum}.`,
          variables: { n, sum, i },
          activeLine: 3,
          output: ""
        });
      }

      trace.push({
        step: trace.length + 1,
        description: `Loop completed gracefully. Output the computed sum value to standard terminal.`,
        variables: { n, sum },
        activeLine: 5,
        output: String(sum)
      });

      return trace;
    }
  },
  {
    id: "code2",
    title: "Factorial Calculation",
    description: "Write a program to calculate the factorial of a positive integer N (N!).",
    snippet: `n = int(input())\nfact = 1\nfor i in range(1, n + 1):\n    fact *= i\nprint(fact)`,
    inputs: [
      { name: "n", type: "number", default: 5, min: 1, max: 10 }
    ],
    generateTrace: (inputs) => {
      const n = Math.floor(inputs.n);
      const trace = [];
      let fact = 1;
      trace.push({
        step: 1,
        description: `Read number input. Initialize 'fact' multiplication accumulator to 1. Upper limit constraint N = ${n}.`,
        variables: { n, fact },
        activeLine: 1,
        output: ""
      });

      for (let i = 1; i <= n; i++) {
        const oldFact = fact;
        fact *= i;
        trace.push({
          step: trace.length + 1,
          description: `Iteration i = ${i}. Multiply current factorial value of ${oldFact} by range iteration index ${i}. Accumulated product results in ${fact}.`,
          variables: { n, fact, i },
          activeLine: 3,
          output: ""
        });
      }

      trace.push({
        step: trace.length + 1,
        description: `Iterative bounds ended successfully. Print total calculated factorial result.`,
        variables: { n, fact },
        activeLine: 5,
        output: String(fact)
      });

      return trace;
    }
  },
  {
    id: "code3",
    title: "Largest of Two Numbers",
    description: "Accept two integers independently as input and print whichever is strictly larger.",
    snippet: `a = int(input())\nb = int(input())\n\nif a > b:\n    print(a)\nelse:\n    print(b)`,
    inputs: [
      { name: "a", type: "number", default: 45 },
      { name: "b", type: "number", default: 72 }
    ],
    generateTrace: (inputs) => {
      const a = Number(inputs.a);
      const b = Number(inputs.b);
      const trace = [];
      trace.push({
        step: 1,
        description: `Inputs successfully captured from terminal: value of a = ${a}, and a value of b = ${b}.`,
        variables: { a, b },
        activeLine: 1,
        output: ""
      });

      const conditionAssert = a > b;
      trace.push({
        step: 2,
        description: `Evaluating standard boolean condition 'a > b' (i.e., is ${a} strictly greater than ${b}?) -> Assessment returns: ${conditionAssert ? "TRUE" : "FALSE"}.`,
        variables: { a, b },
        activeLine: 4,
        output: ""
      });

      if (conditionAssert) {
        trace.push({
          step: 3,
          description: `Condition branch evaluated True. Choose the IF-block route and execute print statements returning the value of variable 'a'.`,
          variables: { a, b, outcome: a },
          activeLine: 5,
          output: String(a)
        });
      } else {
        trace.push({
          step: 3,
          description: `Condition evaluated False. Trigger the ELSE block path to query, handle and route print statements returning the value of variable 'b'.`,
          variables: { a, b, outcome: b },
          activeLine: 7,
          output: String(b)
        });
      }

      return trace;
    }
  },
  {
    id: "code4",
    title: "NumPy Mean Computation",
    description: "Define a 1D NumPy array using numbers and compute the average mean value via NumPy's optimized library methods.",
    snippet: `import numpy as np\narr = np.array([10, 20, 30, 40, 50])\nprint(np.mean(arr))`,
    inputs: [
      { name: "elements", type: "array", default: [10, 20, 30, 40, 50] }
    ],
    generateTrace: (inputs) => {
      const elements = Array.isArray(inputs.elements) ? inputs.elements : [10, 20, 30, 40, 50];
      const trace = [];
      trace.push({
        step: 1,
        description: `Import numerical library module 'numpy' alias namespace as 'np'.`,
        variables: {},
        activeLine: 1,
        output: ""
      });

      trace.push({
        step: 2,
        description: `Compile Python values array list: [${elements.join(", ")}] and allocate into standard homogeneous continuous NumPy vector structure 'arr'.`,
        variables: { arr: `np.array([${elements.join(", ")}])` },
        activeLine: 2,
        output: ""
      });

      const sum = elements.reduce((acc, current) => acc + current, 0);
      const mean = elements.length > 0 ? sum / elements.length : 0;

      trace.push({
        step: 3,
        description: `Request mathematical average helper 'np.mean(arr)'. Computation step: sum elements (${sum}) divided by array length (${elements.length}) returns mean: ${mean}.`,
        variables: { arr: `[${elements.join(", ")}]`, length: elements.length, sum, mean },
        activeLine: 3,
        output: String(mean)
      });

      return trace;
    }
  },
  {
    id: "code5",
    title: "Array Dimensions Reshaping",
    description: "Initialize a flat 6-element array, then rearrange elements into a configured 2x3 matrix structure.",
    snippet: `import numpy as np\narr = np.array([1, 2, 3, 4, 5, 6])\nprint(arr.reshape(2, 3))`,
    inputs: [
      { name: "rows", type: "number", default: 2, min: 1, max: 6 },
      { name: "cols", type: "number", default: 3, min: 1, max: 6 }
    ],
    generateTrace: (inputs) => {
      const rows = Math.floor(inputs.rows);
      const cols = Math.floor(inputs.cols);
      const trace = [];
      const totalElements = 6;
      const elements = [1, 2, 3, 4, 5, 6];

      trace.push({
        step: 1,
        description: `Load NumPy computational library standard environment.`,
        variables: {},
        activeLine: 1,
        output: ""
      });

      trace.push({
        step: 2,
        description: `Allocate continuous sequence values list [1, 2, 3, 4, 5, 6] to standard homogeneous vector 'arr'.`,
        variables: { arr: "[1, 2, 3, 4, 5, 6]" },
        activeLine: 2,
        output: ""
      });

      const sizeCorrectVal = (rows * cols === totalElements);
      if (sizeCorrectVal) {
        // Form the rows
        const grid: number[][] = [];
        for (let r = 0; r < rows; r++) {
          grid.push(elements.slice(r * cols, (r + 1) * cols));
        }
        const gridFormatted = JSON.stringify(grid);

        trace.push({
          step: 3,
          description: `Execute dynamic dimension shift request 'reshape(${rows}, ${cols})'. Elements rearranged successfully because requested matrix cells index size (${rows} * ${cols} = ${totalElements}) matches array count (${totalElements}).`,
          variables: { arr: "[1, 2, 3, 4, 5, 6]", target_shape: `(${rows}, ${cols})`, reshaped_grid: gridFormatted },
          activeLine: 3,
          output: gridFormatted
        });
      } else {
        trace.push({
          step: 3,
          description: `ERROR: Cannot reshape 6-element vector into a (${rows}, ${cols}) size matrix because total target coordinates (${rows} * ${cols} = ${rows * cols}) does not equal 6!`,
          variables: { arr: "[1, 2, 3, 4, 5, 6]", target_shape: `(${rows}, ${cols})` },
          activeLine: 3,
          output: `ValueError: cannot reshape array of size 6 into shape (${rows},${cols})`
        });
      }

      return trace;
    }
  }
];
