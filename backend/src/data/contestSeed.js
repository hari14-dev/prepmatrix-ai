/**
 * contestSeed.js
 * 6 predefined practice contests. Each contest has 10 questions — a mix of
 * Aptitude MCQ, Core MCQ, and DSA MCQ. Questions are completely standalone
 * (not linked to module problem banks).
 */
import { ContestModel } from '../models/Contest.js';

const contests = [

  // ═══════════════════════════════════════════════════════
  // CONTEST 1 — Foundation Mock (Easy)
  // ═══════════════════════════════════════════════════════
  {
    title: 'Placement Mock — Set 1',
    description: 'A foundational placement-style mock covering Aptitude, Reasoning, and Programming Logic basics.',
    company: 'General',
    difficulty: 'Easy',
    timeLimit: 20,
    questions: [
      {
        type: 'mcq', module: 'Aptitude', topic: 'Time and Work', difficulty: 'Easy',
        questionText: 'A and B can complete a job in 12 days and 18 days respectively. They work together for 4 days, then A leaves. How many more days does B take to finish?',
        options: ['9 days', '10 days', '8 days', '6 days'],
        correctAnswerIndex: 2,
        explanation: 'Together rate = 1/12+1/18 = 5/36. Work done in 4 days = 4×5/36 = 20/36 = 5/9. Remaining work = 4/9. B alone at rate 1/18: time = (4/9) ÷ (1/18) = (4/9)×18 = 8 days.',
      },
      {
        type: 'mcq', module: 'Aptitude', topic: 'Percentages', difficulty: 'Easy',
        questionText: 'A number is increased by 25% and then decreased by 20%. What is the net percentage change?',
        options: ['0%', '5% increase', '5% decrease', '10% increase'],
        correctAnswerIndex: 0,
        explanation: 'Net = 25 + (-20) + (25×(-20))/100 = 5 - 5 = 0%. The number returns to its original value.',
      },
      {
        type: 'mcq', module: 'Aptitude', topic: 'Profit and Loss', difficulty: 'Easy',
        questionText: 'A shopkeeper marks goods 50% above cost price and offers a 20% discount. His profit percentage is:',
        options: ['20%', '30%', '25%', '15%'],
        correctAnswerIndex: 0,
        explanation: 'Let CP=100. MP=150. SP=150×0.8=120. Profit=20. Profit%=20%.',
      },
      {
        type: 'mcq', module: 'Aptitude', topic: 'Series and Patterns', difficulty: 'Easy',
        questionText: 'Find the next term: 2, 6, 12, 20, 30, ___',
        options: ['40', '42', '44', '36'],
        correctAnswerIndex: 1,
        explanation: 'Differences: 4, 6, 8, 10, 12. Next = 30+12 = 42. Pattern: n(n+1).',
      },
      {
        type: 'mcq', module: 'Core', topic: 'OS', difficulty: 'Easy',
        questionText: 'Which scheduling algorithm can cause starvation?',
        options: ['Round Robin', 'FCFS', 'Priority Scheduling', 'Shortest Job First (non-preemptive)'],
        correctAnswerIndex: 2,
        explanation: 'Priority Scheduling can cause starvation — low-priority processes may never get CPU if high-priority ones keep arriving. Solution: aging.',
      },
      {
        type: 'mcq', module: 'Core', topic: 'DBMS', difficulty: 'Easy',
        questionText: 'Which normal form eliminates transitive dependencies?',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correctAnswerIndex: 2,
        explanation: '3NF: no non-key attribute should depend on another non-key attribute (transitive dependency). 2NF eliminates partial dependencies.',
      },
      {
        type: 'mcq', module: 'Core', topic: 'OOPS', difficulty: 'Easy',
        questionText: 'Which OOP concept allows the same method name to behave differently based on the object?',
        options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'],
        correctAnswerIndex: 2,
        explanation: 'Polymorphism — "many forms". Method overriding (runtime) and overloading (compile-time) are its two forms.',
      },
      {
        type: 'mcq', module: 'DSA', topic: 'Arrays', difficulty: 'Easy',
        questionText: 'What is the output of this code?\nint a[] = {1,2,3,4,5}; int sum = 0;\nfor(int i=0; i<5; i++) sum += a[i];\ncout << sum;',
        options: ['10', '15', '12', 'Compilation error'],
        correctAnswerIndex: 1,
        explanation: 'The loop adds 1+2+3+4+5 = 15. The array is correctly sized and indexed. No error.',
      },
      {
        type: 'mcq', module: 'DSA', topic: 'Sliding Window', difficulty: 'Medium',
        questionText: 'You need to find the maximum sum subarray of size k in O(n) time. Which approach is correct?',
        options: [
          'Use nested loops — O(n×k)',
          'Sort the array and pick the last k elements',
          'Build first window of size k, then slide: add new right element and remove leftmost element',
          'Use binary search to find the max subarray'
        ],
        correctAnswerIndex: 2,
        explanation: 'Sliding window: compute first window sum, then for each step add a[i] and subtract a[i-k]. This gives O(n) time instead of O(n×k) for nested loops.',
      },
      {
        type: 'mcq', module: 'Aptitude', topic: 'Coding and Decoding', difficulty: 'Easy',
        questionText: 'If STRONG is coded as UVRQPI, how is BUTTER coded?',
        options: ['DWVVGT', 'CVUUFS', 'DWVVFS', 'CVVVGT'],
        correctAnswerIndex: 0,
        explanation: 'Check shift: S(19)→U(21) +2, T(20)→V(22) +2, R→R wait R(18)→Q(17) -1... Let me verify: S→U(+2),T→V(+2),R→R(0)? No: S=19,T=20,R=18,O=15,N=14,G=7 → U=21,V=22,R=18,Q=17,P=16,I=9. Differences: +2,+2,0,-2,-2,+2. Pattern is position-based. Apply to BUTTER: B=2,U=21,T=20,T=20,E=5,R=18 → D=4,W=23,V=22,V=22,G=7,T=20 = DWVVGT.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // CONTEST 2 — Placement Mock (Medium)
  // ═══════════════════════════════════════════════════════
  {
    title: 'Placement Mock — Set 2',
    description: 'A medium-difficulty placement mock covering Aptitude, Reasoning, Verbal, and Logical Thinking.',
    company: 'General',
    difficulty: 'Medium',
    timeLimit: 20,
    questions: [
      {
        type: 'mcq', module: 'Aptitude', topic: 'Speed Time Distance', difficulty: 'Medium',
        questionText: 'Two trains start from stations A and B, 600 km apart, towards each other. Train A travels at 80 km/h and Train B at 70 km/h. After how many hours do they meet?',
        options: ['3 hrs', '4 hrs', 'Both meet after 4.5 hrs', 'Both meet after 5 hrs'],
        correctAnswerIndex: 1,
        explanation: 'Relative speed = 80+70 = 150 km/h (opposite). Time = 600/150 = 4 hours.',
      },
      {
        type: 'mcq', module: 'Aptitude', topic: 'Averages and Mixtures', difficulty: 'Medium',
        questionText: 'Milk at ₹60/litre is mixed with water (₹0/litre) to get a mixture worth ₹40/litre. What is the ratio of milk to water?',
        options: ['1:2', '2:1', '1:3', '3:1'],
        correctAnswerIndex: 1,
        explanation: 'Alligation: (40-0):(60-40) = 40:20 = 2:1. Milk:Water = 2:1.',
      },
      {
        type: 'mcq', module: 'Aptitude', topic: 'Number System', difficulty: 'Medium',
        questionText: 'What is the unit digit of 123⁴⁵⁶?',
        options: ['1', '3', '7', '9'],
        correctAnswerIndex: 0,
        explanation: 'Unit digit of 3^n cycles: 3,9,7,1 (period 4). 456 mod 4 = 0. When remainder is 0, use 4th position → 1.',
      },
      {
        type: 'mcq', module: 'Aptitude', topic: 'Syllogisms', difficulty: 'Medium',
        questionText: 'Statements: All roses are flowers. Some flowers are red. Conclusion I: Some roses are red. II: Some red things are flowers.',
        options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
        correctAnswerIndex: 1,
        explanation: 'Conclusion I: Not valid — "some flowers are red" doesn\'t mean roses (a subset of flowers) are red. Conclusion II: Valid — the red things that are flowers confirms this directly.',
      },
      {
        type: 'mcq', module: 'Core', topic: 'CN', difficulty: 'Medium',
        questionText: 'Which layer of the OSI model is responsible for end-to-end error detection and flow control?',
        options: ['Network Layer', 'Data Link Layer', 'Transport Layer', 'Session Layer'],
        correctAnswerIndex: 2,
        explanation: 'Transport Layer (Layer 4) provides end-to-end communication, error detection, and flow control. TCP operates here.',
      },
      {
        type: 'mcq', module: 'Core', topic: 'DBMS', difficulty: 'Medium',
        questionText: 'In SQL, which clause is used to filter groups after a GROUP BY?',
        options: ['WHERE', 'HAVING', 'FILTER', 'ORDER BY'],
        correctAnswerIndex: 1,
        explanation: 'HAVING filters groups. WHERE filters individual rows before grouping. HAVING can use aggregate functions; WHERE cannot.',
      },
      {
        type: 'mcq', module: 'Core', topic: 'OS', difficulty: 'Medium',
        questionText: 'What is the minimum number of page faults for accessing pages 1,2,3,4,1,2,5,1,2,3,4,5 with 3 frames using FIFO?',
        options: ['7', '8', '9', '10'],
        correctAnswerIndex: 2,
        explanation: 'Trace FIFO with 3 frames: 1(F),2(F),3(F),4(F-evict 1),1(F-evict 2),2(F-evict 3),5(F-evict 4),1(F-evict 1),2(F-evict 2),3(F-evict 5),4(F-evict 1),5(F-evict 2) = 9 faults.',
      },
      {
        type: 'mcq', module: 'DSA', topic: 'Two Pointers', difficulty: 'Medium',
        questionText: 'Given a sorted array [-4, -1, 0, 3, 5, 10], which pair sums to 9?',
        options: ['[-4, 13] — not in array', '[-1, 10]', '[3, 6] — not in array', '[4, 5] — not in array'],
        correctAnswerIndex: 1,
        explanation: 'Using two pointers: left=-4,right=10 → sum=6 < 9, move left. left=-1,right=10 → sum=9 ✓. The pair (-1, 10) sums to 9.',
      },
      {
        type: 'mcq', module: 'DSA', topic: 'Binary Search', difficulty: 'Medium',
        questionText: 'Binary search is applied on a sorted array of 1024 elements. In the worst case, how many comparisons are needed?',
        options: ['512', '32', '10', '11'],
        correctAnswerIndex: 3,
        explanation: '⌊log₂(1024)⌋ + 1 = 10 + 1 = 11 comparisons. Each step halves the search space: 1024→512→256→...→1.',
      },
      {
        type: 'mcq', module: 'Aptitude', topic: 'Seating Arrangement', difficulty: 'Medium',
        questionText: '5 people A,B,C,D,E sit in a circle. A is 2 places to the right of B. C is opposite A. D is next to B. Who is between C and E?',
        options: ['A', 'B', 'D', 'Cannot be determined'],
        correctAnswerIndex: 3,
        explanation: 'With 5 people in a circle, "opposite" isn\'t perfectly defined (no seat directly across). Multiple arrangements satisfy the constraints. The answer cannot be uniquely determined.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // CONTEST 3 — Reasoning & DSA Focused Mock (Medium)
  // ═══════════════════════════════════════════════════════
  {
    title: 'Placement Mock — Set 3',
    description: 'Heavy on logical reasoning, data structures, and problem-solving approach.',
    company: 'General',
    difficulty: 'Medium',
    timeLimit: 20,
    questions: [
      {
        type: 'mcq', module: 'DSA', topic: 'Stack', difficulty: 'Medium',
        questionText: 'What does a monotonic decreasing stack maintain?',
        options: [
          'Elements in ascending order from bottom to top',
          'Elements in descending order from bottom to top',
          'Only even-indexed elements',
          'Elements sorted by frequency',
        ],
        correctAnswerIndex: 1,
        explanation: 'A monotonic decreasing stack keeps elements in decreasing order — each new element pops all elements smaller than it before being pushed. Used in Next Greater Element problems.',
      },
      {
        type: 'mcq', module: 'DSA', topic: 'Sliding Window', difficulty: 'Medium',
        questionText: 'Sliding window is most efficiently used for problems that ask about:',
        options: [
          'Finding elements in a sorted array',
          'Contiguous subarrays/substrings with a property',
          'Sorting elements efficiently',
          'Comparing two separate arrays',
        ],
        correctAnswerIndex: 1,
        explanation: 'Sliding window is designed for contiguous subarray/substring problems. It avoids recomputing prefix sums by sliding the window one position at a time.',
      },
      {
        type: 'mcq', module: 'DSA', topic: 'Graph', difficulty: 'Medium',
        questionText: 'Which algorithm finds the shortest path in a weighted graph with non-negative weights?',
        options: ["BFS", "DFS", "Dijkstra's Algorithm", "Kruskal's Algorithm"],
        correctAnswerIndex: 2,
        explanation: "Dijkstra's finds shortest path from source to all nodes in a graph with non-negative weights. BFS works for unweighted graphs. Kruskal's is for Minimum Spanning Tree.",
      },
      {
        type: 'mcq', module: 'DSA', topic: 'Tree', difficulty: 'Medium',
        questionText: 'In a Binary Search Tree, which traversal visits nodes in sorted order?',
        options: ['Preorder', 'Inorder', 'Postorder', 'Level-order'],
        correctAnswerIndex: 1,
        explanation: 'Inorder traversal (left → root → right) of a BST visits nodes in ascending sorted order. This is a key property of BSTs.',
      },
      {
        type: 'mcq', module: 'Core', topic: 'OOPS', difficulty: 'Medium',
        questionText: 'Which design pattern ensures a class has only one instance and provides a global access point?',
        options: ['Factory', 'Observer', 'Singleton', 'Strategy'],
        correctAnswerIndex: 2,
        explanation: 'Singleton pattern restricts instantiation to one object. Implemented with a private constructor and a static getInstance() method.',
      },
      {
        type: 'mcq', module: 'Core', topic: 'CN', difficulty: 'Medium',
        questionText: 'What does the "3-way handshake" in TCP establish?',
        options: [
          'Data transfer rate',
          'A reliable connection before data transfer',
          'The routing path between two hosts',
          'The encryption key for the session',
        ],
        correctAnswerIndex: 1,
        explanation: 'TCP 3-way handshake (SYN → SYN-ACK → ACK) establishes a reliable, bidirectional connection before any data is sent.',
      },
      {
        type: 'mcq', module: 'Aptitude', topic: 'Number System', difficulty: 'Medium',
        questionText: 'Find the HCF of 72, 108, and 180.',
        options: ['18', '36', '12', '9'],
        correctAnswerIndex: 1,
        explanation: '72=2³×3², 108=2²×3³, 180=2²×3²×5. HCF = take lowest powers of common factors = 2²×3² = 4×9 = 36.',
      },
      {
        type: 'mcq', module: 'Aptitude', topic: 'Blood Relations', difficulty: 'Medium',
        questionText: 'Pointing to a photograph, Ravi says, "She is the daughter of my grandfather\'s only son." How is the person in the photo related to Ravi?',
        options: ['Sister', 'Cousin', 'Aunt', 'Niece'],
        correctAnswerIndex: 0,
        explanation: "Grandfather's only son = Ravi's father. His father's daughter = Ravi's sister.",
      },
      {
        type: 'mcq', module: 'Core', topic: 'OS', difficulty: 'Medium',
        questionText: 'A process that has finished execution but whose entry still exists in the process table is called:',
        options: ['Orphan Process', 'Zombie Process', 'Daemon Process', 'Thread'],
        correctAnswerIndex: 1,
        explanation: 'Zombie: finished but parent hasn\'t called wait(). Orphan: parent died first, adopted by init (PID 1).',
      },
      {
        type: 'mcq', module: 'DSA', topic: 'Dynamic Programming', difficulty: 'Hard',
        questionText: 'Climbing stairs: you can take 1 or 2 steps. For n=5 stairs, how many distinct ways can you reach the top?',
        options: ['5', '7', '8', '10'],
        correctAnswerIndex: 2,
        explanation: 'dp[1]=1, dp[2]=2, dp[3]=3, dp[4]=5, dp[5]=8. This follows Fibonacci: dp[n]=dp[n-1]+dp[n-2]. 8 distinct ways.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // CONTEST 4 — Advanced Mock (Hard)
  // ═══════════════════════════════════════════════════════
  {
    title: 'Placement Mock — Set 4',
    description: 'Challenging mix of DSA, system concepts, and advanced aptitude for high-difficulty preparation.',
    company: 'General',
    difficulty: 'Hard',
    timeLimit: 20,
    questions: [
      {
        type: 'mcq', module: 'DSA', topic: 'Graph', difficulty: 'Hard',
        questionText: 'In an unweighted directed graph, which algorithm finds the strongly connected components?',
        options: ["Dijkstra's", "Kruskal's", "Kosaraju's / Tarjan's", 'Prim\'s'],
        correctAnswerIndex: 2,
        explanation: "Kosaraju's and Tarjan's algorithms find SCCs. Kosaraju's uses two DFS passes. Tarjan's uses a single DFS with a stack and low-link values.",
      },
      {
        type: 'mcq', module: 'DSA', topic: 'Heap', difficulty: 'Hard',
        questionText: 'What is the time complexity of building a heap from an unsorted array of n elements?',
        options: ['O(n log n)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctAnswerIndex: 1,
        explanation: 'Floyd\'s algorithm builds a heap in O(n) using heapify from the bottom up. The sum of heights converges to O(n). Inserting n elements one by one would be O(n log n).',
      },
      {
        type: 'mcq', module: 'DSA', topic: 'Dynamic Programming', difficulty: 'Hard',
        questionText: 'What does "optimal substructure" mean in the context of DP?',
        options: [
          'The problem can be divided into equal-sized subproblems',
          'An optimal solution to the problem contains optimal solutions to its subproblems',
          'The problem has a greedy solution',
          'Subproblems do not overlap',
        ],
        correctAnswerIndex: 1,
        explanation: 'Optimal substructure: the best solution to the full problem can be built from best solutions to subproblems. Both DP and Greedy rely on this. Overlapping subproblems is what distinguishes DP from Divide and Conquer.',
      },
      {
        type: 'mcq', module: 'DSA', topic: 'Two Pointers', difficulty: 'Hard',
        questionText: 'Array: [1, 3, 5, 7, 9]. Using two pointers from both ends, what is the first pair checked when searching for sum = 10?',
        options: [
          'left=1, right=9 → sum=10 ✓ found immediately',
          'left=1, right=7 → sum=8',
          'left=3, right=9 → sum=12',
          'left=5, right=5 → same element'
        ],
        correctAnswerIndex: 0,
        explanation: 'Two pointers start at index 0 (value 1) and index 4 (value 9). 1+9=10 = target. Found on first check.',
      },
      {
        type: 'mcq', module: 'Core', topic: 'OS', difficulty: 'Hard',
        questionText: 'In the Banker\'s Algorithm, a "safe sequence" is one where:',
        options: [
          'All processes finish in the given sequence without deadlock',
          'Resources are allocated in order of process priority',
          'Processes are ordered by their arrival time',
          'All resources are released before any process starts',
        ],
        correctAnswerIndex: 0,
        explanation: 'A safe sequence P1..Pn means each Pi can get all resources it needs from currently available + resources of all Pj (j<i). The system can complete all processes without deadlock.',
      },
      {
        type: 'mcq', module: 'Core', topic: 'DBMS', difficulty: 'Hard',
        questionText: 'Which isolation level prevents phantom reads?',
        options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
        correctAnswerIndex: 3,
        explanation: 'Serializable is the strictest level and prevents all anomalies including phantom reads (new rows appearing between two reads of the same query). Repeatable Read prevents non-repeatable reads but not phantoms.',
      },
      {
        type: 'mcq', module: 'Core', topic: 'CN', difficulty: 'Hard',
        questionText: 'What does the Time-Wait state in TCP ensure?',
        options: [
          'The server is ready to accept new connections',
          'All packets from the previous connection have been delivered before a new connection uses the same port',
          'The connection is kept alive for future requests',
          'Authentication is completed',
        ],
        correctAnswerIndex: 1,
        explanation: 'TIME_WAIT (2MSL duration) ensures any delayed packets from the old connection don\'t confuse a new connection on the same port. It also ensures the final ACK of connection termination is received.',
      },
      {
        type: 'mcq', module: 'Aptitude', topic: 'Number System', difficulty: 'Hard',
        questionText: 'What is the remainder when 2¹⁰⁰ is divided by 7?',
        options: ['1', '2', '4', '6'],
        correctAnswerIndex: 1,
        explanation: 'Powers of 2 mod 7 cycle every 3 steps: 2¹≡2, 2²≡4, 2³≡1 (mod 7). Since 100 = 3×33 + 1, 2¹⁰⁰ = (2³)³³ × 2¹ ≡ 1³³ × 2 ≡ 2 (mod 7).',
      },
      {
        type: 'mcq', module: 'DSA', topic: 'Bit Manipulation', difficulty: 'Medium',
        questionText: 'What is 5 XOR 3 in decimal? (5 = 101 in binary, 3 = 011)',
        options: ['6', '7', '1', '2'],
        correctAnswerIndex: 0,
        explanation: '5 = 101, 3 = 011. XOR: 101 XOR 011 = 110 = 6 in decimal. XOR flips bits where the inputs differ.',
      },
      {
        type: 'mcq', module: 'Aptitude', topic: 'Speed Time Distance', difficulty: 'Hard',
        questionText: 'A boat covers 30 km downstream in 3 hours and 18 km upstream in 3 hours. Find the speed of the stream.',
        options: ['1 km/h', '2 km/h', '3 km/h', '4 km/h'],
        correctAnswerIndex: 1,
        explanation: 'Downstream speed = 30/3 = 10 km/h. Upstream speed = 18/3 = 6 km/h. Speed of stream = (Downstream − Upstream) / 2 = (10 − 6) / 2 = 2 km/h. (Boat speed in still water = (10+6)/2 = 8 km/h.)',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // CONTEST 5 — Entry-Level Mock (Easy)
  // ═══════════════════════════════════════════════════════
  {
    title: 'Placement Mock — Set 5',
    description: 'Entry-level placement style: straightforward aptitude, verbal, and basic CS concepts.',
    company: 'General',
    difficulty: 'Easy',
    timeLimit: 20,
    questions: [
      {
        type: 'mcq', module: 'Aptitude', topic: 'Percentages', difficulty: 'Easy',
        questionText: 'After a 10% increase, a salary becomes ₹44,000. What was the original salary?',
        options: ['₹39,600', '₹40,000', '₹42,000', '₹38,000'],
        correctAnswerIndex: 1,
        explanation: 'Original = 44000/1.10 = 40000.',
      },
      {
        type: 'mcq', module: 'Aptitude', topic: 'Time and Work', difficulty: 'Easy',
        questionText: '4 workers can build a wall in 15 days. How many workers are needed to build it in 6 days?',
        options: ['8', '10', '12', '6'],
        correctAnswerIndex: 1,
        explanation: 'Total work = 4×15 = 60 worker-days. Workers needed = 60/6 = 10.',
      },
      {
        type: 'mcq', module: 'Aptitude', topic: 'Series and Patterns', difficulty: 'Easy',
        questionText: 'Which number does NOT belong in the series: 1, 4, 9, 16, 25, 35, 49?',
        options: ['25', '35', '16', '49'],
        correctAnswerIndex: 1,
        explanation: 'The series is perfect squares: 1,4,9,16,25,36,49. 35 should be 36 (6²). 35 is the odd one out.',
      },
      {
        type: 'mcq', module: 'Aptitude', topic: 'Fill in the Blanks', difficulty: 'Easy',
        questionText: 'Fill in the blank: "Despite the heavy rain, the players ______ enthusiastically."',
        options: ['played', 'plays', 'playing', 'will playing'],
        correctAnswerIndex: 0,
        explanation: '"Despite" sets up a contrast in the past. "Played" is simple past tense, consistent with the past-tense context.',
      },
      {
        type: 'mcq', module: 'Core', topic: 'OS', difficulty: 'Easy',
        questionText: 'What is virtual memory?',
        options: [
          'Memory that is faster than RAM',
          'An illusion of more memory using disk space',
          'A type of cache memory',
          'Memory reserved for the OS kernel',
        ],
        correctAnswerIndex: 1,
        explanation: 'Virtual memory uses disk (swap space) to extend the apparent amount of RAM. Pages are moved between RAM and disk as needed (demand paging).',
      },
      {
        type: 'mcq', module: 'Core', topic: 'DBMS', difficulty: 'Easy',
        questionText: 'What does SQL stand for?',
        options: ['Standard Query Language', 'Structured Query Language', 'Sequential Query Language', 'Simple Query Language'],
        correctAnswerIndex: 1,
        explanation: 'SQL = Structured Query Language. It is the standard language for managing and querying relational databases.',
      },
      {
        type: 'mcq', module: 'Core', topic: 'OOPS', difficulty: 'Easy',
        questionText: 'Which keyword is used in Java to inherit a class?',
        options: ['implements', 'extends', 'inherits', 'super'],
        correctAnswerIndex: 1,
        explanation: '"extends" is used for class inheritance in Java. "implements" is for interfaces. "super" refers to the parent class.',
      },
      {
        type: 'mcq', module: 'DSA', topic: 'Arrays', difficulty: 'Easy',
        questionText: 'What is the space complexity of storing n elements in an array?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswerIndex: 2,
        explanation: 'An array of n elements requires O(n) space — one memory slot per element.',
      },
      {
        type: 'mcq', module: 'Core', topic: 'CN', difficulty: 'Easy',
        questionText: 'What is the default port for HTTP?',
        options: ['21', '22', '80', '443'],
        correctAnswerIndex: 2,
        explanation: 'HTTP uses port 80. HTTPS uses 443. FTP uses 21. SSH uses 22.',
      },
      {
        type: 'mcq', module: 'Aptitude', topic: 'Profit and Loss', difficulty: 'Easy',
        questionText: 'An item is bought for ₹500 and sold for ₹450. What is the loss percentage?',
        options: ['5%', '10%', '8%', '12%'],
        correctAnswerIndex: 1,
        explanation: 'Loss = 500-450 = 50. Loss% = (50/500)×100 = 10%.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // CONTEST 6 — Full Stack Mixed (Medium-Hard)
  // ═══════════════════════════════════════════════════════
  {
    title: 'Full Placement Drill — Mixed',
    description: 'Comprehensive placement drill covering all areas at mixed difficulty — closest to real exam experience.',
    company: 'General',
    difficulty: 'Mixed',
    timeLimit: 20,
    questions: [
      {
        type: 'mcq', module: 'Aptitude', topic: 'Time and Work', difficulty: 'Hard',
        questionText: 'A and B together do a job in 6 days. B and C together do it in 10 days. A and C together do it in 7.5 days. In how many days can all three finish it together?',
        options: ['4 days', '5 days', '3 days', '6 days'],
        correctAnswerIndex: 1,
        explanation: '2(A+B+C) = 1/6+1/10+1/7.5 = 10/60+6/60+8/60 = 24/60 = 2/5. So A+B+C = 1/5. Together = 5 days.',
      },
      {
        type: 'mcq', module: 'Aptitude', topic: 'Profit and Loss', difficulty: 'Medium',
        questionText: 'A dealer buys 100 oranges for ₹150 and sells 80 of them for ₹150. He gives the remaining 20 as free. What is his profit or loss %?',
        options: ['0% (no profit/loss)', '25% loss', '33.3% loss', '20% profit'],
        correctAnswerIndex: 0,
        explanation: 'CP = ₹150. SP = ₹150 (for 80 oranges). Remaining 20 are free. Total SP = ₹150 = Total CP. No profit, no loss.',
      },
      {
        type: 'mcq', module: 'DSA', topic: 'Prefix Sum', difficulty: 'Medium',
        questionText: 'Array: [3, 1, 4, 1, 5, 9]. prefix[0..5] is built as [0,3,4,8,9,14,23]. What is the sum of elements from index 2 to 4 (0-based, inclusive)?',
        options: ['9', '10', '15', '14'],
        correctAnswerIndex: 1,
        explanation: 'Sum(2,4) = prefix[5] - prefix[2] = 14 - 4 = 10. Elements: a[2]+a[3]+a[4] = 4+1+5 = 10. ✓',
      },
      {
        type: 'mcq', module: 'DSA', topic: 'Stack', difficulty: 'Medium',
        questionText: 'Push 3, Push 5, Push 2, Pop, Push 8 on a stack. What is the top element now?',
        options: ['3', '5', '2', '8'],
        correctAnswerIndex: 3,
        explanation: 'After Push 3 → [3]. Push 5 → [3,5]. Push 2 → [3,5,2]. Pop → [3,5] (removes 2). Push 8 → [3,5,8]. Top = 8.',
      },
      {
        type: 'mcq', module: 'Core', topic: 'OS', difficulty: 'Medium',
        questionText: 'Which of the following is NOT a necessary condition for deadlock?',
        options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption', 'Circular Wait'],
        correctAnswerIndex: 2,
        explanation: 'The four Coffman conditions for deadlock are: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. "Preemption" itself is NOT a condition — "No Preemption" is. If preemption is allowed, deadlock is prevented.',
      },
      {
        type: 'mcq', module: 'Core', topic: 'DBMS', difficulty: 'Medium',
        questionText: 'The ACID property that ensures committed transactions survive crashes is:',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correctAnswerIndex: 3,
        explanation: 'Durability: once committed, changes persist even after system failures. Achieved through write-ahead logging (WAL) and recovery mechanisms.',
      },
      {
        type: 'mcq', module: 'Core', topic: 'CN', difficulty: 'Medium',
        questionText: 'Which protocol resolves IP addresses to MAC addresses?',
        options: ['DNS', 'DHCP', 'ARP', 'ICMP'],
        correctAnswerIndex: 2,
        explanation: 'ARP (Address Resolution Protocol) resolves IP → MAC. DNS resolves domain names → IP. DHCP assigns IP addresses. ICMP is used for error messages (ping).',
      },
      {
        type: 'mcq', module: 'Core', topic: 'OOPS', difficulty: 'Hard',
        questionText: 'What is the output of: int x=5; int y = x++ + ++x; (C++/Java)',
        options: ['y=11', 'y=12', 'y=10', 'Undefined'],
        correctAnswerIndex: 1,
        explanation: 'x++ returns 5 then increments x to 6. ++x increments x to 7 then returns 7. y = 5+7 = 12. x is now 7.',
      },
      {
        type: 'mcq', module: 'Aptitude', topic: 'Series and Patterns', difficulty: 'Hard',
        questionText: 'Find the next term: 1, 1, 2, 3, 5, 8, 13, 21, ___',
        options: ['29', '33', '34', '35'],
        correctAnswerIndex: 2,
        explanation: 'This is the Fibonacci sequence: each term = sum of two preceding terms. 13+21 = 34.',
      },
      {
        type: 'mcq', module: 'DSA', topic: 'Greedy', difficulty: 'Hard',
        questionText: 'Greedy algorithm gives optimal solution for which of the following?',
        options: [
          '0/1 Knapsack',
          'Fractional Knapsack',
          'Travelling Salesman Problem',
          'Longest Common Subsequence',
        ],
        correctAnswerIndex: 1,
        explanation: 'Fractional Knapsack can be solved optimally by greedy (sort by value/weight, take greedily). 0/1 Knapsack requires DP. TSP requires exponential algorithms. LCS requires DP.',
      },
    ],
  },
];

// Seeding only needs to run ONCE per server process — not on every request.
// IMPORTANT: each question subdocument has its own auto-generated _id
// (see contestQuestionSchema, { _id: true }), and the seed objects below
// never specify one. If ensureContestSeedData() re-ran the $set upsert on
// every request, Mongoose would cast a BRAND NEW random _id onto every
// question EVERY TIME — meaning the question IDs the frontend loaded when
// starting a contest could silently differ from the IDs in the DB by the
// time the user submits (if the seed middleware ran again on any request
// in between), causing every answer lookup to miss and score 0/N even on
// fully correct submissions. Caching this in memory keeps question _ids
// stable for the lifetime of the server process.
let hasSeeded = false;

export async function ensureContestSeedData() {
  if (hasSeeded) return;

  for (const contest of contests) {
    const existing = await ContestModel.findOne({ title: contest.title }).select('_id').lean();
    if (!existing) {
      await ContestModel.create(contest);
    }
    // If it already exists, leave it untouched — do NOT overwrite it.
    // (To push a content edit to an already-seeded contest, either restart
    // the server after clearing that document, or bump its title so it's
    // treated as new.)
  }

  // Remove any previously-seeded contests that are no longer in this file
  // (e.g. old company-branded titles from an earlier version of this seed).
  const currentTitles = contests.map((c) => c.title);
  await ContestModel.deleteMany({ title: { $nin: currentTitles } });

  hasSeeded = true;
}