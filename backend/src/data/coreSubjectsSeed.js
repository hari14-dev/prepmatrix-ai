import { coreArticles } from './coreConceptArticles.js';
/**
 * coreSubjectsSeed.js
 * Rich seed data for OS, DBMS, CN, OOPS.
 * Each subject has:
 *   - Multiple sub-topics (each with their own conceptArticle)
 *   - Pattern-based problem collections per sub-topic
 */
import { ProblemModel } from '../models/Problem.js';
import { TopicModel } from '../models/Topic.js';
import { UserProgressModel } from '../models/UserProgress.js';

const coreSubjectTopicSeed = [

  // ══════════════════════════════════════
  // OPERATING SYSTEMS
  // ══════════════════════════════════════

  {
    title: 'Processes and Threads',
    slug: 'os-processes-threads',
    category: 'OS',
    icon: '⚙️',
    conceptArticle: coreArticles['os-processes-threads'] ?? ''
  },

  {
    title: 'CPU Scheduling',
    slug: 'os-cpu-scheduling',
    category: 'OS',
    icon: '📅',
    conceptArticle: coreArticles['os-cpu-scheduling'] ?? ''
  },

  {
    title: 'Deadlock',
    slug: 'os-deadlock',
    category: 'OS',
    icon: '🔒',
    conceptArticle: coreArticles['os-deadlock'] ?? ''
  },

  {
    title: 'Memory Management',
    slug: 'os-memory-management',
    category: 'OS',
    icon: '🧠',
    conceptArticle: coreArticles['os-memory-management'] ?? ''
  },

  // ══════════════════════════════════════
  // DBMS
  // ══════════════════════════════════════

  {
    title: 'ACID and Transactions',
    slug: 'dbms-acid-transactions',
    category: 'DBMS',
    icon: '🔄',
    conceptArticle: coreArticles['dbms-acid-transactions'] ?? ''
  },

  {
    title: 'Normalization',
    slug: 'dbms-normalization',
    category: 'DBMS',
    icon: '📊',
    conceptArticle: coreArticles['dbms-normalization'] ?? ''
  },

  {
    title: 'Indexing and Query Optimization',
    slug: 'dbms-indexing',
    category: 'DBMS',
    icon: '🔍',
    conceptArticle: coreArticles['dbms-indexing'] ?? ''
  },

  // ══════════════════════════════════════
  // COMPUTER NETWORKS
  // ══════════════════════════════════════

  {
    title: 'OSI and TCP/IP Model',
    slug: 'cn-osi-tcpip',
    category: 'CN',
    icon: '🌐',
    conceptArticle: coreArticles['cn-osi-tcpip'] ?? ''
  },

  {
    title: 'TCP vs UDP',
    slug: 'cn-tcp-udp',
    category: 'CN',
    icon: '📡',
    conceptArticle: coreArticles['cn-tcp-udp'] ?? ''
  },

  {
    title: 'IP Addressing and Subnetting',
    slug: 'cn-ip-subnetting',
    category: 'CN',
    icon: '🔢',
    conceptArticle: coreArticles['cn-ip-subnetting'] ?? ''
  },

  // ══════════════════════════════════════
  // OOPS
  // ══════════════════════════════════════

  {
    title: 'OOP Principles',
    slug: 'oops-principles',
    category: 'OOPS',
    icon: '🧱',
    conceptArticle: coreArticles['oops-principles'] ?? ''
  },

  {
    title: 'Classes, Objects and Constructors',
    slug: 'oops-classes-objects',
    category: 'OOPS',
    icon: '🏗️',
    conceptArticle: coreArticles['oops-classes-objects'] ?? ''
  },

  {
    title: 'Exception Handling and Design Patterns',
    slug: 'oops-exceptions-patterns',
    category: 'OOPS',
    icon: '⚡',
    conceptArticle: coreArticles['oops-exceptions-patterns'] ?? ''
  }
];

// ═══════════════════════════════════════════════════════════
// PROBLEM SEED — Pattern-based MCQ collections per sub-topic
// ═══════════════════════════════════════════════════════════
const coreSubjectProblemSeed = [

  // ── OS: Processes and Threads ──────────────────────────

  {
    topicSlug: 'os-processes-threads', pattern: 'Process Basics',
    title: 'Process vs Thread Memory',
    questionText: 'Which of the following is NOT shared between threads of the same process?',
    options: ['Heap memory', 'Global variables', 'Stack', 'Open file descriptors'],
    correctAnswerIndex: 2, difficulty: 'Easy',
    hintText: 'Threads share memory but each has its own execution stack.',
    detailedSolution: `Step 1: Threads within a process share: code, heap, global variables, file descriptors.
Step 2: Each thread has its own: stack, registers, program counter, thread ID.
Step 3: Stack is NOT shared — each thread has an independent call stack.
Answer: Stack (C).`
  },
  {
    topicSlug: 'os-processes-threads', pattern: 'Process Basics',
    title: 'PCB Content',
    questionText: 'Which information is stored in a Process Control Block (PCB)?',
    options: [
      'Program counter and CPU registers only',
      'Program counter, CPU registers, memory info, I/O status, accounting info',
      'Only the process ID and state',
      'Source code and compiled binary'
    ],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'PCB is the data structure the OS uses to manage a process — it stores everything needed for context switching.',
    detailedSolution: `A PCB stores: Process ID, Process State, Program Counter, CPU Registers,
Memory Management info (page tables), I/O status, Accounting info (CPU time used).
This is needed so the OS can pause and resume any process seamlessly.`
  },
  {
    topicSlug: 'os-processes-threads', pattern: 'Process States',
    title: 'State Transition',
    questionText: 'A running process requests disk I/O. Its state transitions to:',
    options: ['Terminated', 'Ready', 'Waiting/Blocked', 'New'],
    correctAnswerIndex: 2, difficulty: 'Easy',
    hintText: 'When a process waits for an external event (I/O), it moves to Waiting state.',
    detailedSolution: `Running → Waiting: A process moves from Running to Waiting when it:
  - Requests I/O
  - Waits for a signal or lock
  - Calls sleep()
It moves back to Ready when the I/O completes.`
  },
  {
    topicSlug: 'os-processes-threads', pattern: 'Process States',
    title: 'Zombie Process',
    questionText: 'A zombie process is one that:',
    options: [
      'Is waiting for CPU allocation',
      'Has finished execution but its entry remains in the process table',
      'Is consuming excessive CPU',
      'Has been killed by the OS'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'A zombie has finished but its parent hasn\'t read its exit status.',
    detailedSolution: `A zombie process has completed execution (exit() called) but the parent process
hasn't called wait() to read the exit status. The process table entry remains.
It consumes minimal resources — just a process table entry.
Orphan process: parent died before child → adopted by init (PID 1).`
  },

  // ── OS: CPU Scheduling ─────────────────────────────────

  {
    topicSlug: 'os-cpu-scheduling', pattern: 'Scheduling Algorithms',
    title: 'FCFS Average Waiting Time',
    questionText: 'Processes P1(BT=10), P2(BT=5), P3(BT=8) arrive in order at t=0. FCFS average waiting time?',
    options: ['7.67', '8.33', '9', '6'],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'FCFS: P1 starts at 0, P2 waits for P1 to finish, P3 waits for P1+P2.',
    detailedSolution: `Gantt chart: P1(0-10), P2(10-15), P3(15-23).
Waiting time: P1 = 0, P2 = 10, P3 = 15.
Average waiting time = (0 + 10 + 15) / 3 = 25 / 3 ≈ 8.33.
Answer: 8.33 (B).`
  },
  {
    topicSlug: 'os-cpu-scheduling', pattern: 'Scheduling Algorithms',
    title: 'Round Robin Quantum',
    questionText: 'In Round Robin with quantum = 3, which algorithm property does it achieve?',
    options: ['Minimizes average waiting time', 'Best for batch processing', 'Provides good response time for interactive processes', 'Eliminates starvation for all algorithms'],
    correctAnswerIndex: 2, difficulty: 'Easy',
    hintText: 'Round Robin is designed for time-sharing — every process gets the CPU within bounded time.',
    detailedSolution: `Round Robin with time quantum provides:
✓ Good response time for interactive processes (bounded waiting)
✓ Fairness — no process waits longer than (n-1) × Q
✗ Not optimal for avg waiting time (SJF is better for that)
✗ High context switch overhead if quantum is too small
Best use: interactive/time-sharing systems.`
  },
  {
    topicSlug: 'os-cpu-scheduling', pattern: 'Starvation',
    title: 'Aging to Prevent Starvation',
    questionText: 'Which scheduling problem is solved by "aging"?',
    options: ['High average turnaround time', 'Starvation in priority scheduling', 'Deadlock in scheduling', 'High context switch overhead'],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Aging gradually increases the priority of processes that have been waiting too long.',
    detailedSolution: `Starvation occurs in priority scheduling when low-priority processes never get CPU.
Solution: Aging — gradually increment the priority of a waiting process over time.
Eventually, even a low-priority process gets high enough priority to run.`
  },

  // ── OS: Deadlock ──────────────────────────────────────

  {
    topicSlug: 'os-deadlock', pattern: 'Coffman Conditions',
    title: 'Breaking Deadlock',
    questionText: 'Which approach PREVENTS deadlock by breaking the "Hold and Wait" condition?',
    options: [
      'Allow preemption of resources',
      'Impose ordering on resource types',
      'Require processes to request all resources at once before starting',
      'Allow resources to be shared'
    ],
    correctAnswerIndex: 2, difficulty: 'Medium',
    hintText: 'Hold and Wait = process holds some and waits for more. Break it by not allowing partial holds.',
    detailedSolution: `Hold and Wait condition: A process holds at least one resource while waiting for additional resources.
Prevention: Require processes to request all resources before execution begins.
If any resource is unavailable, release all and try again.
This breaks Hold and Wait because the process either has all resources or none.`
  },
  {
    topicSlug: 'os-deadlock', pattern: 'Banker Algorithm',
    title: 'Safe State Check',
    questionText: 'In Banker\'s Algorithm, the system is in a "safe state" when:',
    options: [
      'No process is currently waiting for a resource',
      'There exists at least one safe sequence to complete all processes',
      'All resources are currently available',
      'No deadlock has occurred yet'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Safe state means we can find an order to run all processes to completion.',
    detailedSolution: `A safe state means there exists at least one sequence <P1, P2, ..., Pn> such that:
For each Pi, the resources Pi needs can be satisfied by:
  currently available resources + resources held by all Pj where j < i.
If such a sequence exists → safe. OS grants resources.
If no such sequence → unsafe. OS denies the resource request.`
  },

  // ── OS: Memory Management ─────────────────────────────

  {
    topicSlug: 'os-memory-management', pattern: 'Paging',
    title: 'Internal vs External Fragmentation',
    questionText: 'Paging causes ______ fragmentation; Segmentation causes ______ fragmentation.',
    options: [
      'External; Internal',
      'Internal; External',
      'Both cause External',
      'Neither causes fragmentation'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Paging uses fixed-size pages — last page may be partly unused (internal waste).',
    detailedSolution: `Paging: Fixed-size pages. Last page may not be completely used → wasted space INSIDE allocation → Internal fragmentation.
Segmentation: Variable-size segments. Gaps appear BETWEEN allocations → External fragmentation.
Internal = waste inside allocated block.
External = waste between allocated blocks.`
  },
  {
    topicSlug: 'os-memory-management', pattern: 'Page Replacement',
    title: 'Belady\'s Anomaly',
    questionText: 'Belady\'s Anomaly states that in ______ page replacement, more frames can lead to more page faults.',
    options: ['LRU', 'Optimal', 'FIFO', 'LFU'],
    correctAnswerIndex: 2, difficulty: 'Medium',
    hintText: 'This anomaly is a known problem with one specific algorithm.',
    detailedSolution: `Belady's Anomaly: In FIFO page replacement, increasing the number of frames sometimes INCREASES the number of page faults.
This is counterintuitive — more memory should mean fewer faults.
LRU and Optimal do NOT suffer from Belady's Anomaly (they are "stack algorithms").`
  },

  // ── DBMS: ACID and Transactions ───────────────────────

  {
    topicSlug: 'dbms-acid-transactions', pattern: 'ACID Properties',
    title: 'Which ACID Property',
    questionText: 'A bank transfer: ₹500 deducted from A, but power fails before crediting B. Which property ensures the deduction is also reversed?',
    options: ['Consistency', 'Isolation', 'Atomicity', 'Durability'],
    correctAnswerIndex: 2, difficulty: 'Easy',
    hintText: 'The transaction must fully succeed or fully fail — no partial commits.',
    detailedSolution: `Atomicity: A transaction is treated as a single indivisible unit.
Either ALL operations succeed (debit + credit) and commit,
OR if any step fails, ALL operations are rolled back.
The bank transfer is one transaction — partial completion is not allowed.`
  },
  {
    topicSlug: 'dbms-acid-transactions', pattern: 'Isolation Levels',
    title: 'Dirty Read Problem',
    questionText: 'Transaction T1 reads data modified by T2, but T2 hasn\'t committed yet. T2 then rolls back. T1 read incorrect data. This is called:',
    options: ['Phantom Read', 'Non-Repeatable Read', 'Dirty Read', 'Lost Update'],
    correctAnswerIndex: 2, difficulty: 'Easy',
    hintText: 'Reading uncommitted (potentially rolled-back) data = dirty.',
    detailedSolution: `Dirty Read: Reading uncommitted data that may later be rolled back.
T1 reads T2's uncommitted change → T2 rolls back → T1 has "dirty" data.
Prevented by: Read Committed and higher isolation levels.
Non-Repeatable Read: T1 reads same row twice and gets different values (T2 committed between reads).
Phantom Read: T1 re-executes a query and gets new rows (T2 inserted between reads).`
  },

  // ── DBMS: Normalization ───────────────────────────────

  {
    topicSlug: 'dbms-normalization', pattern: 'Normal Forms',
    title: 'Identify the Normal Form Violation',
    questionText: 'Table: Student(RollNo, Name, CourseID, CourseName, Marks). RollNo+CourseID is PK. CourseName depends only on CourseID. Which NF is violated?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'CourseName depends on only part of the composite PK.',
    detailedSolution: `Composite PK: (RollNo, CourseID).
CourseName depends only on CourseID (a part of PK) — not on the full PK.
This is a PARTIAL DEPENDENCY → violates 2NF.
Fix: Separate Course(CourseID, CourseName) table.
The original table would become: Enrollment(RollNo, CourseID, Marks).`
  },
  {
    topicSlug: 'dbms-normalization', pattern: 'Normal Forms',
    title: 'Transitive Dependency',
    questionText: 'Table: Employee(EmpID, DeptID, DeptName). EmpID is PK. DeptName depends on DeptID (not directly on EmpID). This violates:',
    options: ['1NF', '2NF', '3NF', 'None — it is normalized'],
    correctAnswerIndex: 2, difficulty: 'Easy',
    hintText: 'A non-key attribute depending on another non-key attribute = transitive dependency.',
    detailedSolution: `EmpID → DeptID (direct dependency, OK).
DeptID → DeptName (DeptName depends on DeptID, not directly on EmpID).
EmpID → DeptID → DeptName = Transitive dependency.
Violates 3NF. Fix: Separate Department(DeptID, DeptName) table.`
  },

  // ── DBMS: Indexing ────────────────────────────────────

  {
    topicSlug: 'dbms-indexing', pattern: 'Index Types',
    title: 'Clustered vs Non-Clustered',
    questionText: 'Which statement about clustered indexes is correct?',
    options: [
      'A table can have multiple clustered indexes',
      'Clustered index stores the actual data rows in index order',
      'Clustered indexes are always slower than non-clustered',
      'Non-clustered indexes physically reorder the table'
    ],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Clustered means the physical order of rows matches the index order.',
    detailedSolution: `Clustered Index:
- Determines physical order of data rows in the table
- Only ONE per table (because there's only one physical order)
- Stores actual data in the leaf nodes
- Range queries are very efficient

Non-Clustered Index:
- Separate structure; leaf nodes contain pointers to rows
- Multiple per table allowed
- Requires an extra lookup (row lookup / key lookup) after finding the pointer`
  },

  // ── CN: OSI and TCP/IP ────────────────────────────────

  {
    topicSlug: 'cn-osi-tcpip', pattern: 'Layer Identification',
    title: 'Which OSI Layer',
    questionText: 'Routing decisions (forwarding packets between networks) happen at which OSI layer?',
    options: ['Data Link Layer', 'Network Layer', 'Transport Layer', 'Session Layer'],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Routers operate at this layer. IP is its main protocol.',
    detailedSolution: `Network Layer (Layer 3):
- Handles logical addressing (IP addresses)
- Routing — finding the best path
- Fragmentation and reassembly of packets
- Protocols: IP, ICMP, RIP, OSPF, BGP
- Devices: Routers

Data Link Layer handles MAC addresses and frames (switches, bridges).`
  },
  {
    topicSlug: 'cn-osi-tcpip', pattern: 'Protocol Mapping',
    title: 'HTTP Protocol Layer',
    questionText: 'HTTP operates at which layer of the OSI model?',
    options: ['Transport', 'Session', 'Presentation', 'Application'],
    correctAnswerIndex: 3, difficulty: 'Easy',
    hintText: 'HTTP is what your browser uses to request web pages.',
    detailedSolution: `HTTP (HyperText Transfer Protocol) is an Application Layer (Layer 7) protocol.
Other Application Layer protocols: HTTPS, FTP, SMTP, POP3, DNS, DHCP, SSH.
HTTP uses TCP (Transport Layer) as its transport protocol.
On the Internet (TCP/IP model), this maps to the Application layer.`
  },

  // ── CN: TCP vs UDP ────────────────────────────────────

  {
    topicSlug: 'cn-tcp-udp', pattern: 'TCP Features',
    title: 'Three-Way Handshake Order',
    questionText: 'What is the correct order of the TCP three-way handshake?',
    options: [
      'SYN → ACK → SYN-ACK',
      'SYN-ACK → SYN → ACK',
      'SYN → SYN-ACK → ACK',
      'ACK → SYN → SYN-ACK'
    ],
    correctAnswerIndex: 2, difficulty: 'Easy',
    hintText: 'Client initiates with SYN, server responds with SYN-ACK, client confirms with ACK.',
    detailedSolution: `TCP Three-Way Handshake:
1. Client → Server: SYN (Synchronize — "I want to connect, my seq = x")
2. Server → Client: SYN-ACK (Synchronize-Acknowledge — "OK, my seq = y, ack = x+1")
3. Client → Server: ACK (Acknowledge — "Confirmed, ack = y+1")
After this, the connection is established and data transfer can begin.`
  },
  {
    topicSlug: 'cn-tcp-udp', pattern: 'TCP vs UDP Choice',
    title: 'Protocol Selection',
    questionText: 'Which protocol is most appropriate for a live video streaming application where occasional dropped frames are acceptable?',
    options: ['TCP', 'UDP', 'FTP', 'SMTP'],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Real-time streaming needs speed over reliability.',
    detailedSolution: `UDP is preferred for live video streaming because:
- Lower latency (no connection setup, no ACK waiting)
- Occasional packet loss is acceptable — a dropped frame is better than a delayed frame
- TCP's retransmission would cause visible freezes
- Application-level error correction can handle minor losses

TCP would cause buffering and delay due to retransmission of lost packets.`
  },

  // ── CN: IP Addressing ─────────────────────────────────

  {
    topicSlug: 'cn-ip-subnetting', pattern: 'Subnetting',
    title: 'Hosts in a Subnet',
    questionText: 'How many usable host addresses are available in a /26 subnet?',
    options: ['64', '62', '30', '126'],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Host bits = 32 - 26. Subtract 2 for network and broadcast.',
    detailedSolution: `Step 1: /26 means 26 bits for network, 32-26=6 bits for hosts.
Step 2: Total addresses = 2^6 = 64.
Step 3: Subtract 2: 1 for network address, 1 for broadcast address.
Step 4: Usable hosts = 64 - 2 = 62.`
  },
  {
    topicSlug: 'cn-ip-subnetting', pattern: 'IP Classes',
    title: 'Private IP Address',
    questionText: 'Which IP address is a private (non-routable) address?',
    options: ['8.8.8.8', '172.20.10.1', '54.230.11.5', '13.107.21.200'],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Private ranges: 10.x.x.x, 172.16–31.x.x, 192.168.x.x.',
    detailedSolution: `Private IP ranges (RFC 1918):
  10.0.0.0 – 10.255.255.255 (/8)
  172.16.0.0 – 172.31.255.255 (/12)
  192.168.0.0 – 192.168.255.255 (/16)

172.20.10.1 falls in 172.16.0.0–172.31.255.255 → Private.
8.8.8.8 = Google's DNS (Public). Others are public too.`
  },

  // ── OOPS: Principles ──────────────────────────────────

  {
    topicSlug: 'oops-principles', pattern: 'Polymorphism',
    title: 'Method Overriding — Which Type of Polymorphism',
    questionText: 'Method overriding is an example of:',
    options: [
      'Compile-time polymorphism',
      'Encapsulation',
      'Runtime polymorphism',
      'Abstraction'
    ],
    correctAnswerIndex: 2, difficulty: 'Easy',
    hintText: 'Method overriding is resolved at runtime based on the actual object type.',
    detailedSolution: `Method Overriding = Runtime (Dynamic) Polymorphism.
The method to call is determined at runtime based on the actual object type (not reference type).
Example: Animal ref = new Dog(); ref.speak(); → calls Dog's speak() at runtime.

Method Overloading = Compile-time (Static) Polymorphism.
The method is selected at compile time based on the argument list.`
  },
  {
    topicSlug: 'oops-principles', pattern: 'Inheritance',
    title: 'Multilevel Inheritance',
    questionText: 'Class C extends B, and B extends A. This is an example of:',
    options: ['Multiple inheritance', 'Hierarchical inheritance', 'Multilevel inheritance', 'Hybrid inheritance'],
    correctAnswerIndex: 2, difficulty: 'Easy',
    hintText: 'A → B → C is a chain of inheritance.',
    detailedSolution: `Multilevel Inheritance: A chain — A is parent of B, B is parent of C.
C inherits from B which inherits from A.

Multiple Inheritance: One class inherits from two or more classes (A, B → C).
Java doesn't support multiple class inheritance (but supports via interfaces).

Hierarchical: One parent, multiple children (A → B, A → C).`
  },
  {
    topicSlug: 'oops-principles', pattern: 'Encapsulation',
    title: 'Purpose of Encapsulation',
    questionText: 'Which is the PRIMARY purpose of encapsulation?',
    options: [
      'To allow a class to inherit from multiple parents',
      'To hide internal implementation and protect data from unauthorized access',
      'To allow the same method name with different parameters',
      'To achieve code reuse'
    ],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Encapsulation = data hiding + bundling data and methods.',
    detailedSolution: `Encapsulation's primary purpose:
1. Data Hiding — internal state is private; external code uses controlled getters/setters
2. Bundling — data and behavior that operates on it are in one unit (class)

This prevents unauthorized modification and makes code more maintainable.
Inheritance achieves code reuse. Overloading is polymorphism.`
  },

  // ── OOPS: Classes, Objects ────────────────────────────

  {
    topicSlug: 'oops-classes-objects', pattern: 'Constructors',
    title: 'Copy Constructor',
    questionText: 'A copy constructor in C++ is called when:',
    options: [
      'An object is passed by value to a function',
      'An object is assigned using = operator to an existing object',
      'A static method is called',
      'A destructor is invoked'
    ],
    correctAnswerIndex: 0, difficulty: 'Medium',
    hintText: 'Copy constructor is for creating a NEW object as a copy of an existing one.',
    detailedSolution: `Copy constructor is invoked when:
1. Object is initialized with another object: MyClass b = a;
2. Object is passed by VALUE to a function: foo(a);
3. Object is returned by VALUE from a function (NRVO may optimize this away)

Assignment operator (=) is invoked when an EXISTING object is assigned: b = a; (b already exists).`
  },
  {
    topicSlug: 'oops-classes-objects', pattern: 'Static Members',
    title: 'Static Method Restriction',
    questionText: 'Why can\'t a static method access non-static (instance) variables?',
    options: [
      'Static methods are private by default',
      'Static methods exist at class level, not at object level, so there is no "this" reference',
      'Non-static variables are stored in ROM',
      'Static methods are compiled separately from the class'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Static methods belong to the class, not any specific object.',
    detailedSolution: `Static methods belong to the class itself, not to any instance.
When a static method is called: ClassName.method() — no object may exist yet.
Non-static variables belong to a specific object (instance).
Since no object is guaranteed to exist when calling a static method,
there's no "this" reference, so instance variables cannot be accessed.`
  },

  // ── OOPS: Exceptions and Design Patterns ─────────────

  {
    topicSlug: 'oops-exceptions-patterns', pattern: 'Design Patterns',
    title: 'Singleton Pattern',
    questionText: 'The Singleton design pattern ensures:',
    options: [
      'A class can have many instances but only one is used at a time',
      'Only one instance of a class exists and provides a global access point',
      'A class cannot be instantiated at all',
      'All methods of the class are static'
    ],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Singleton = one and only one instance, globally accessible.',
    detailedSolution: `Singleton Pattern:
- Restricts instantiation to ONE object
- Provides a global access point (usually getInstance() method)
- Used for: Loggers, Configuration Managers, Thread Pools, DB Connection Pools

Implementation:
- Private constructor (prevents new ClassName())
- Private static instance variable
- Public static getInstance() that creates instance on first call

Thread-safe version: Double-checked locking or enum-based Singleton.`
  },
  {
    topicSlug: 'oops-exceptions-patterns', pattern: 'Exception Handling',
    title: 'Checked vs Unchecked',
    questionText: 'Which of the following is an UNCHECKED exception in Java?',
    options: ['IOException', 'SQLException', 'NullPointerException', 'FileNotFoundException'],
    correctAnswerIndex: 2, difficulty: 'Easy',
    hintText: 'Unchecked exceptions extend RuntimeException.',
    detailedSolution: `Unchecked Exceptions (extend RuntimeException):
- NullPointerException, ArrayIndexOutOfBoundsException, ClassCastException
- NOT required to be declared or caught
- Represent programming bugs

Checked Exceptions (extend Exception, not RuntimeException):
- IOException, SQLException, FileNotFoundException
- MUST be caught or declared with throws
- Represent recoverable conditions`
  },
  // ═══════════════════════════════════════════════════════════
  // ADDITIONAL QUESTIONS — paste inside coreSubjectProblemSeed array
  // ═══════════════════════════════════════════════════════════

  // ── OS: Processes and Threads (extra) ──────────────────

  {
    topicSlug: 'os-processes-threads', pattern: 'Context Switching',
    title: 'Cost of Context Switch',
    questionText: 'Why is a context switch between threads (of the same process) generally cheaper than between processes?',
    options: [
      'Threads don\'t have their own registers',
      'Threads share the same address space, so the page table doesn\'t need to be reloaded',
      'Threads never get preempted',
      'The OS skips saving the program counter for threads'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Think about what has to be flushed/reloaded — TLB and page tables are the expensive part.',
    detailedSolution: `A context switch between processes requires switching the memory address space —
the MMU/page table and TLB entries must be reloaded/flushed.
Threads of the same process SHARE the address space, so this expensive step is skipped.
Only the CPU registers, stack pointer, and program counter need saving/restoring for a thread switch,
making it significantly faster than a full process switch.`
  },
  {
    topicSlug: 'os-processes-threads', pattern: 'IPC',
    title: 'Inter-Process Communication',
    questionText: 'Which of these is NOT a standard Inter-Process Communication (IPC) mechanism?',
    options: ['Shared Memory', 'Message Queues', 'Pipes', 'Context Switching'],
    correctAnswerIndex: 3, difficulty: 'Easy',
    hintText: 'Context switching is a scheduling concept, not a way for processes to exchange data.',
    detailedSolution: `IPC mechanisms let independent processes communicate/share data:
- Shared Memory — fastest, but needs synchronization (semaphores/mutex)
- Message Queues — OS-managed queue of messages
- Pipes / Named Pipes (FIFOs) — unidirectional byte streams
- Sockets, Signals

Context Switching is the OS saving/restoring process state to switch which process runs on the CPU —
it has nothing to do with processes exchanging data.`
  },

  // ── OS: CPU Scheduling (extra) ─────────────────────────

  {
    topicSlug: 'os-cpu-scheduling', pattern: 'Scheduling Algorithms',
    title: 'Convoy Effect',
    questionText: 'The "convoy effect" — where short processes wait behind one long process — is a known drawback of which algorithm?',
    options: ['Round Robin', 'FCFS', 'SJF (preemptive)', 'Priority with aging'],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'This happens when scheduling is strictly in arrival order with no preemption.',
    detailedSolution: `Convoy Effect: In FCFS, if a long CPU-bound process runs first,
all shorter processes behind it must wait, drastically increasing average waiting time
— like a convoy of cars stuck behind one slow truck.
SJF/SRTF avoids this by prioritizing shorter jobs.
Round Robin avoids it via time-slicing (preemption).`
  },
  {
    topicSlug: 'os-cpu-scheduling', pattern: 'Scheduling Algorithms',
    title: 'SRTF Definition',
    questionText: 'Shortest Remaining Time First (SRTF) is best described as:',
    options: [
      'Non-preemptive version of SJF',
      'Preemptive version of SJF, based on remaining burst time',
      'Same as Round Robin with quantum = burst time',
      'A priority scheduling variant'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'SRTF can interrupt a running process if a new process has a shorter remaining time.',
    detailedSolution: `SRTF (Shortest Remaining Time First) is the PREEMPTIVE version of SJF.
If a new process arrives with a burst time shorter than the REMAINING time of the currently
running process, the CPU is taken away and given to the new process.
This minimizes average waiting time but can cause starvation of long processes.`
  },

  // ── OS: Deadlock (extra) ────────────────────────────────

  {
    topicSlug: 'os-deadlock', pattern: 'Coffman Conditions',
    title: 'Four Necessary Conditions',
    questionText: 'Which of the following is NOT one of the four necessary (Coffman) conditions for deadlock?',
    options: ['Mutual Exclusion', 'Hold and Wait', 'Circular Wait', 'Starvation'],
    correctAnswerIndex: 3, difficulty: 'Easy',
    hintText: 'All four conditions must hold SIMULTANEOUSLY for deadlock to occur.',
    detailedSolution: `The four Coffman conditions, all required simultaneously for deadlock:
1. Mutual Exclusion — resource held by only one process at a time
2. Hold and Wait — process holds a resource while waiting for another
3. No Preemption — resources can't be forcibly taken away
4. Circular Wait — a cycle of processes each waiting for a resource held by the next

Starvation is a separate phenomenon (indefinite postponement), not a deadlock condition.`
  },
  {
    topicSlug: 'os-deadlock', pattern: 'Deadlock Handling',
    title: 'Prevention vs Avoidance vs Detection',
    questionText: 'What is the key difference between deadlock AVOIDANCE and deadlock PREVENTION?',
    options: [
      'Avoidance and prevention are the same thing',
      'Prevention breaks one of the Coffman conditions structurally; avoidance makes runtime decisions (e.g. Banker\'s Algorithm) using future resource claims',
      'Avoidance never allows a process to request resources',
      'Prevention requires knowing future resource requests, avoidance does not'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Prevention = design-time restriction. Avoidance = runtime, dynamic decision-making.',
    detailedSolution: `Deadlock Prevention: Structurally eliminate one of the 4 necessary conditions
(e.g., request all resources upfront to break Hold-and-Wait). Static, conservative.

Deadlock Avoidance: System dynamically checks whether granting a request keeps the system
in a "safe state" — requires advance knowledge of max resource needs (Banker's Algorithm).

Deadlock Detection: Let deadlock happen, then detect it (resource allocation graph / cycle
detection) and recover (kill/preempt a process).`
  },

  // ── OS: Memory Management (extra) ──────────────────────

  {
    topicSlug: 'os-memory-management', pattern: 'Virtual Memory',
    title: 'Thrashing',
    questionText: 'Thrashing occurs when:',
    options: [
      'The CPU is 100% utilized doing useful work',
      'The system spends more time swapping pages in/out than executing actual processes',
      'A process never gets any CPU time',
      'Two processes access the same page simultaneously'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Too little memory per process → constant page faults → CPU utilization actually drops.',
    detailedSolution: `Thrashing: A high degree of multiprogramming causes each process to have too few frames.
This leads to frequent page faults, so the system spends most of its time doing page I/O
instead of executing instructions. Counterintuitively, CPU utilization DROPS as more processes
are added, because the OS keeps swapping pages instead of running code.
Fix: Working Set model, reduce degree of multiprogramming, or add more RAM.`
  },
  {
    topicSlug: 'os-memory-management', pattern: 'Paging',
    title: 'Role of the TLB',
    questionText: 'The Translation Lookaside Buffer (TLB) is used to:',
    options: [
      'Store the entire page table for every process',
      'Cache recent virtual-to-physical address translations to avoid a full page table walk',
      'Schedule which process runs next',
      'Store swapped-out pages on disk'
    ],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'It\'s a small, fast hardware cache sitting between the CPU and the page table.',
    detailedSolution: `TLB (Translation Lookaside Buffer): A small, fast associative cache inside the CPU/MMU
that stores recently used virtual-address → physical-address translations.
On a memory access: TLB Hit → translation is instant.
TLB Miss → OS/hardware must walk the full page table (slower), then cache the result in the TLB.
This avoids doing a full (potentially multi-level) page table lookup on every memory access.`
  },

  // ── DBMS: ACID and Transactions (extra) ────────────────

  {
    topicSlug: 'dbms-acid-transactions', pattern: 'ACID Properties',
    title: 'Consistency Property',
    questionText: 'The "Consistency" property in ACID guarantees that:',
    options: [
      'Two transactions never run at the same time',
      'A transaction takes the database from one valid state to another, preserving all defined rules/constraints',
      'Once committed, data survives a crash',
      'A transaction is fully rolled back on failure'
    ],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Think about constraints like foreign keys, unique keys, and business rules.',
    detailedSolution: `Consistency: A transaction must bring the database from one VALID state to another VALID state,
respecting all constraints (primary keys, foreign keys, triggers, business rules).
If a transaction would violate a constraint, it is rolled back.

Note the difference from the other ACID letters:
Atomicity = all-or-nothing execution.
Isolation = concurrent transactions don't interfere.
Durability = committed data survives crashes.`
  },
  {
    topicSlug: 'dbms-acid-transactions', pattern: 'Durability',
    title: 'How Durability is Achieved',
    questionText: 'Durability (committed data survives a crash) is typically implemented using:',
    options: [
      'Two-phase locking',
      'Write-Ahead Logging (WAL) to persistent storage before acknowledging commit',
      'Running transactions serially',
      'Storing data only in RAM for speed'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'The log must be flushed to disk BEFORE the transaction is confirmed as committed.',
    detailedSolution: `Write-Ahead Logging (WAL): Before any change is applied to the database, the change is
first written to a durable log on disk. Once the commit record is flushed to disk, the
transaction is considered durable — even if the system crashes immediately after,
the log can be replayed to redo the committed changes.
Two-phase locking is used for Isolation, not Durability.`
  },

  // ── DBMS: Normalization (extra) ─────────────────────────

  {
    topicSlug: 'dbms-normalization', pattern: 'Normal Forms',
    title: 'BCNF vs 3NF',
    questionText: 'A relation satisfies BCNF but a stricter condition than 3NF requires that:',
    options: [
      'Every attribute must be atomic',
      'For every functional dependency X → Y, X must be a super key',
      'There should be no composite primary key',
      'Every table must have exactly one candidate key'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'BCNF is a stricter version of 3NF — it removes an exception 3NF allows.',
    detailedSolution: `BCNF (Boyce-Codd Normal Form): For every non-trivial functional dependency X → Y,
X must be a super key of the relation.

3NF allows one exception: X → Y is fine even if X is NOT a super key,
AS LONG AS Y is a "prime attribute" (part of some candidate key).
BCNF removes this exception, making it strictly stronger (every BCNF relation is in 3NF,
but not vice versa).`
  },
  {
    topicSlug: 'dbms-normalization', pattern: 'Denormalization',
    title: 'Why Denormalize',
    questionText: 'A team deliberately denormalizes a heavily-read reporting table. What is the main trade-off they are accepting?',
    options: [
      'Slower reads in exchange for guaranteed consistency',
      'Faster reads (fewer joins) in exchange for data redundancy and update anomalies',
      'Less storage in exchange for slower writes',
      'Stronger ACID guarantees in exchange for more tables'
    ],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Denormalization intentionally adds redundancy to reduce expensive JOINs.',
    detailedSolution: `Denormalization: Intentionally introducing redundancy (e.g., duplicating a column across
tables, or merging tables) to avoid costly JOINs and speed up READS — common in reporting/
analytics/data-warehouse systems.
Trade-off: More storage, and the risk of update anomalies (the same fact stored in multiple
places can go out of sync if not updated everywhere consistently).`
  },

  // ── DBMS: Indexing (extra) ──────────────────────────────

  {
    topicSlug: 'dbms-indexing', pattern: 'Index Structures',
    title: 'Why B+ Trees for Indexing',
    questionText: 'Most database indexes use a B+ Tree rather than a plain Binary Search Tree mainly because:',
    options: [
      'B+ Trees use less memory than BSTs',
      'B+ Trees are shallower/wider, minimizing costly disk I/O reads per lookup',
      'B+ Trees don\'t need to be balanced',
      'B+ Trees only support equality search, not range search'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Think about how many disk blocks need to be read to find a record.',
    detailedSolution: `B+ Trees have a high branching factor (many keys per node), making the tree very
SHALLOW even for millions of records. Since each node maps roughly to a disk block,
fewer levels = fewer disk I/O operations per lookup — critical because disk access is
orders of magnitude slower than memory access.
B+ Trees also store all data at leaf level linked together, making RANGE queries efficient
(unlike plain BSTs).`
  },
  {
    topicSlug: 'dbms-indexing', pattern: 'Index Trade-offs',
    title: 'When Indexes Hurt Performance',
    questionText: 'Adding many indexes to a table can hurt performance mainly for which type of workload?',
    options: [
      'Read-heavy workloads with simple SELECTs',
      'Write-heavy workloads (frequent INSERT/UPDATE/DELETE)',
      'Workloads that never filter or sort data',
      'Read-only reporting workloads'
    ],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Every index must also be updated whenever the underlying data changes.',
    detailedSolution: `Indexes speed up READS (SELECT with WHERE/ORDER BY/JOIN) but slow down WRITES,
because every INSERT, UPDATE, or DELETE must also update every affected index
— not just the table data.
So a table with 10 indexes pays a write-amplification cost on every write.
This is why OLTP systems with heavy writes are indexed carefully, while OLAP/reporting
tables (mostly read, batch-loaded) can afford many more indexes.`
  },
  {
    topicSlug: 'dbms-indexing', pattern: 'Composite Index',
    title: 'Leftmost Prefix Rule',
    questionText: 'A composite index exists on (last_name, first_name). Which query CAN use this index efficiently?',
    options: [
      'WHERE first_name = \'Ravi\'',
      'WHERE last_name = \'Kumar\'',
      'WHERE first_name = \'Ravi\' AND last_name IS NULL',
      'ORDER BY first_name only'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Composite indexes are usable only if you filter starting from the LEFTMOST column.',
    detailedSolution: `Leftmost Prefix Rule: A composite index on (A, B) can be used efficiently for:
- WHERE A = ?
- WHERE A = ? AND B = ?
- ORDER BY A, B

It CANNOT be used efficiently for a query that filters only on B (the second column)
without also filtering on A — the database would have to scan the whole index/table.
Here, filtering on last_name alone (the leftmost column) works; filtering on first_name
alone does not use the index effectively.`
  },

  // ── CN: OSI and TCP/IP (extra) ──────────────────────────

  {
    topicSlug: 'cn-osi-tcpip', pattern: 'Encapsulation',
    title: 'Data Encapsulation Order',
    questionText: 'As data travels down the OSI stack from Application to Physical layer, it is progressively wrapped into:',
    options: [
      'Segments → Packets → Frames → Bits',
      'Frames → Packets → Segments → Bits',
      'Bits → Frames → Packets → Segments',
      'Packets → Segments → Bits → Frames'
    ],
    correctAnswerIndex: 0, difficulty: 'Medium',
    hintText: 'Transport layer creates segments, Network layer wraps into packets, Data Link wraps into frames.',
    detailedSolution: `Encapsulation order (Application → Physical):
Data (Application/Presentation/Session)
→ Segments (Transport layer adds TCP/UDP header)
→ Packets (Network layer adds IP header)
→ Frames (Data Link layer adds MAC header + trailer)
→ Bits (Physical layer — electrical/optical/radio signals)

Each layer adds its own header (encapsulation) as data moves down the stack.`
  },
  {
    topicSlug: 'cn-osi-tcpip', pattern: 'Protocol Mapping',
    title: 'ARP Layer',
    questionText: 'ARP (Address Resolution Protocol), which maps an IP address to a MAC address, functions at which layer?',
    options: [
      'Application Layer',
      'Network Layer (though it bridges Layer 2 and Layer 3)',
      'Transport Layer',
      'Physical Layer'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'ARP is often called a Layer 2.5 protocol — it resolves Layer 3 addresses to Layer 2 addresses.',
    detailedSolution: `ARP resolves a known IP address (Layer 3 / Network layer concept) to a MAC address
(Layer 2 / Data Link layer concept). Because of this, it's commonly classified at the
Network layer (or informally "Layer 2.5"), since its job is to bridge addressing between
these two layers, letting a device know which physical MAC address to send a frame to
for a given IP destination on the local network.`
  },

  // ── CN: TCP vs UDP (extra) ──────────────────────────────

  {
    topicSlug: 'cn-tcp-udp', pattern: 'TCP Features',
    title: 'Flow Control Mechanism',
    questionText: 'TCP\'s "sliding window" mechanism is primarily used to:',
    options: [
      'Encrypt data in transit',
      'Control how much unacknowledged data the sender can transmit, preventing overwhelming the receiver',
      'Choose the best routing path',
      'Compress data before sending'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'This is about matching the sender\'s rate to what the receiver can actually handle/buffer.',
    detailedSolution: `TCP Sliding Window: A flow control mechanism where the receiver advertises a "window size"
— the amount of data it can currently buffer. The sender can transmit up to that much data
without waiting for an ACK, then must wait/slide the window forward as ACKs arrive.
This prevents a fast sender from overwhelming a slow receiver's buffer.
(Note: Congestion control, a related but separate mechanism, protects the NETWORK from
overload, not just the receiver.)`
  },
  {
    topicSlug: 'cn-tcp-udp', pattern: 'UDP Features',
    title: 'UDP Header Overhead',
    questionText: 'Why does UDP have significantly less overhead than TCP per packet?',
    options: [
      'UDP header is only 8 bytes (source port, dest port, length, checksum) — no connection state, sequencing, or ACK fields',
      'UDP doesn\'t use IP addressing',
      'UDP packets are always smaller in payload size',
      'UDP header includes compression by default'
    ],
    correctAnswerIndex: 0, difficulty: 'Easy',
    hintText: 'Compare header field counts: TCP tracks sequence numbers, ACKs, window size, flags — UDP doesn\'t.',
    detailedSolution: `UDP header = just 8 bytes: Source Port, Destination Port, Length, Checksum.
No connection setup, no sequence numbers, no acknowledgment numbers, no window size, no flags.

TCP header = 20+ bytes minimum, carrying sequence/ack numbers, window size, flags (SYN/ACK/FIN),
and options — all needed to guarantee reliable, ordered, connection-oriented delivery.

This is why UDP is faster and used where speed matters more than reliability (DNS, streaming, gaming).`
  },

  // ── CN: IP Addressing (extra) ───────────────────────────

  {
    topicSlug: 'cn-ip-subnetting', pattern: 'CIDR',
    title: 'CIDR Notation Meaning',
    questionText: 'In the CIDR notation 192.168.1.0/24, what does "/24" represent?',
    options: [
      'The subnet has 24 total addresses',
      'The first 24 bits (of 32) form the network portion of the address',
      'The subnet mask is 24.24.24.0',
      'There are 24 hosts allowed'
    ],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'The "/N" is the prefix length — number of leading bits reserved for the network.',
    detailedSolution: `CIDR (Classless Inter-Domain Routing) notation /N means the first N bits of the
32-bit IPv4 address identify the NETWORK, and the remaining (32-N) bits identify the HOST.

For /24: Network portion = 24 bits → subnet mask = 255.255.255.0.
Remaining 8 bits for hosts → 2^8 = 256 addresses, 254 usable (minus network + broadcast).`
  },
  {
    topicSlug: 'cn-ip-subnetting', pattern: 'NAT',
    title: 'Purpose of NAT',
    questionText: 'Network Address Translation (NAT) primarily allows:',
    options: [
      'Encrypting all traffic leaving a network',
      'Multiple devices on a private network to share a single public IP address to access the internet',
      'Converting IPv4 addresses to MAC addresses',
      'Assigning a unique public IP to every device automatically'
    ],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Think of your home Wi-Fi router — many devices, one public IP from your ISP.',
    detailedSolution: `NAT (Network Address Translation): A router/gateway translates private IP addresses
(e.g., 192.168.x.x) used inside a LAN into a single public IP address for internet-bound traffic,
and translates responses back to the correct internal device (tracked via port numbers).

Benefits: Conserves scarce public IPv4 addresses, and adds a layer of obscurity/security
since internal devices aren't directly addressable from the internet.`
  },

  // ── OOPS: Principles (extra) ────────────────────────────

  {
    topicSlug: 'oops-principles', pattern: 'Abstraction vs Encapsulation',
    title: 'Abstraction vs Encapsulation',
    questionText: 'What is the key difference between Abstraction and Encapsulation?',
    options: [
      'They are exactly the same concept',
      'Abstraction hides complexity by exposing only relevant details (what an object does); Encapsulation hides internal data by bundling/restricting access (how it is protected)',
      'Encapsulation is only used in inheritance; abstraction is only used in polymorphism',
      'Abstraction applies only to interfaces, never to classes'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Abstraction is about design (what to show); Encapsulation is about implementation (how to protect).',
    detailedSolution: `Abstraction: Focuses on WHAT an object does, hiding unnecessary implementation complexity
from the user. Achieved via abstract classes/interfaces. Example: a car's steering wheel
hides the complex steering mechanism.

Encapsulation: Focuses on HOW data is protected — bundling data and methods together and
restricting direct access via access modifiers (private/protected) and getters/setters.

They're related but distinct: abstraction is a design-level concept, encapsulation is an
implementation-level technique that often supports abstraction.`
  },

  // ── OOPS: Classes, Objects (extra) ──────────────────────

  {
    topicSlug: 'oops-classes-objects', pattern: 'Constructors',
    title: 'Constructor Overloading',
    questionText: 'Constructor overloading means:',
    options: [
      'A class can have only one constructor',
      'A class can have multiple constructors with different parameter lists',
      'Constructors can be overridden in subclasses',
      'A constructor can return a value'
    ],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'It\'s the same concept as method overloading, applied to constructors.',
    detailedSolution: `Constructor Overloading: A class can define multiple constructors as long as their
parameter lists differ (in number or type) — same idea as method overloading.
Example: Box() // default, Box(int side) // cube, Box(int l, int w, int h) // custom.
Note: Constructors are NOT overridden (they aren't inherited the way methods are) and
never have a return type, not even void.`
  },
  {
    topicSlug: 'oops-classes-objects', pattern: 'this and super',
    title: 'this vs super Keyword',
    questionText: 'In a subclass constructor, what does the "super" keyword refer to?',
    options: [
      'The current object instance',
      'The immediate parent class, used to call its constructor or access its members',
      'A static utility class',
      'The topmost class in the inheritance hierarchy, regardless of depth'
    ],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: '"this" = current object. "super" = immediate parent.',
    detailedSolution: `this: Refers to the CURRENT object instance — used to access its own fields/methods,
or to disambiguate when a parameter name shadows a field.

super: Refers to the IMMEDIATE PARENT class — used to:
  1. Call the parent's constructor: super(args) (must be the first statement)
  2. Access a parent's method/field that's been overridden/shadowed: super.method()

super refers only to the direct parent, not the whole ancestor chain.`
  },

  // ── OOPS: Exceptions and Design Patterns (extra) ────────

  {
    topicSlug: 'oops-exceptions-patterns', pattern: 'Exception Handling',
    title: 'finally Block Guarantee',
    questionText: 'When does the "finally" block NOT execute after a try-catch?',
    options: [
      'When an exception is caught successfully',
      'When no exception occurs at all',
      'When the JVM/runtime is forcibly terminated (e.g. System.exit() or a crash) during the try block',
      '"finally" always executes with no exceptions, ever'
    ],
    correctAnswerIndex: 2, difficulty: 'Medium',
    hintText: 'finally is guaranteed to run in almost all cases — except when the whole process is killed.',
    detailedSolution: `The "finally" block is designed to ALWAYS execute after try/catch, whether an exception
was thrown, caught, or not — commonly used for cleanup (closing files, releasing locks/connections).

The only exceptions to this guarantee:
1. The JVM/process is forcibly terminated (System.exit(), power failure, kill -9)
2. An infinite loop or deadlock occurs inside the try block, so control never reaches finally
3. A fatal, unrecoverable error crashes the runtime itself

Under normal circumstances (including return statements inside try/catch), finally still runs.`
  },
  {
    topicSlug: 'oops-exceptions-patterns', pattern: 'Design Patterns',
    title: 'Observer Pattern',
    questionText: 'The Observer design pattern is best suited for scenarios where:',
    options: [
      'Only one instance of an object should ever exist',
      'One object\'s state change needs to automatically notify and update multiple dependent objects',
      'Objects need to be created without specifying their exact class',
      'You want to add behavior to an object without altering its class'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Think publisher-subscriber: one "subject" changes, many "observers" get notified.',
    detailedSolution: `Observer Pattern: Defines a one-to-many dependency between objects. When the "Subject"
(publisher) changes state, all registered "Observers" (subscribers) are automatically notified
and updated — without the Subject needing to know their concrete details.

Common real-world use: event listeners/handlers in UI frameworks, pub-sub messaging systems,
MVC (Model notifies View of changes).

(Note: "create without specifying class" = Factory Pattern; "one instance only" = Singleton;
"add behavior without altering class" = Decorator Pattern.)`
  },
  // ═══════════════════════════════════════════════════════════
  // BATCH 2 — tops every core topic up to at least 5 questions
  // Paste this ALSO inside coreSubjectProblemSeed array (same
  // spot as batch 1 — right before the closing `];` on line 630)
  // ═══════════════════════════════════════════════════════════

  // ── OS: Deadlock (extra 2) ──────────────────────────────

  {
    topicSlug: 'os-deadlock', pattern: 'Resource Allocation Graph',
    title: 'Cycle in Resource Allocation Graph',
    questionText: 'In a Resource Allocation Graph where each resource type has only ONE instance, a cycle in the graph implies:',
    options: [
      'The system is definitely deadlocked',
      'The system is definitely safe',
      'A deadlock is only possible, not certain',
      'The graph is invalid'
    ],
    correctAnswerIndex: 0, difficulty: 'Medium',
    hintText: 'With single-instance resource types, cycle detection is a definitive test.',
    detailedSolution: `Resource Allocation Graph (RAG) rule:
- If every resource type has exactly ONE instance: a cycle in the RAG means deadlock is CERTAIN.
- If a resource type has MULTIPLE instances: a cycle is NECESSARY but not SUFFICIENT for
  deadlock — it only indicates the possibility of deadlock; you need further analysis
  (e.g. checking if a safe sequence still exists).
This distinction is a classic exam trap.`
  },

  // ── OS: Memory Management (extra 1) ─────────────────────

  {
    topicSlug: 'os-memory-management', pattern: 'Virtual Memory',
    title: 'Demand Paging',
    questionText: 'In Demand Paging, a page is loaded into memory:',
    options: [
      'Only when it is actually referenced/needed by the process, causing a page fault if absent',
      'All pages of a process are loaded before it starts executing',
      'Only the first page of every process is ever loaded',
      'Pages are loaded in a fixed round-robin order regardless of need'
    ],
    correctAnswerIndex: 0, difficulty: 'Easy',
    hintText: 'The word "demand" means "load only when requested".',
    detailedSolution: `Demand Paging: Pages are loaded into physical memory ONLY when referenced by the CPU
(lazy loading), not all upfront. If a referenced page isn't in memory, a Page Fault occurs:
the OS pauses the process, fetches the page from disk (swap/backing store), updates the
page table, then resumes execution.
Benefit: Less memory wasted on unused pages, faster process startup, allows running
programs larger than physical memory.`
  },

  // ── DBMS: ACID and Transactions (extra 1) ───────────────

  {
    topicSlug: 'dbms-acid-transactions', pattern: 'Isolation Levels',
    title: 'Serializable Isolation',
    questionText: 'The "Serializable" isolation level guarantees that:',
    options: [
      'Transactions run one at a time, physically, with no concurrency at all',
      'The outcome of concurrently running transactions is equivalent to some serial (one-at-a-time) execution order',
      'Only SELECT statements are allowed',
      'Dirty reads are allowed but phantom reads are not'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Serializable doesn\'t mean transactions literally run sequentially — just that the RESULT looks like they did.',
    detailedSolution: `Serializable is the STRICTEST standard isolation level. Transactions may still execute
concurrently under the hood, but the database guarantees the final result is equivalent to
SOME serial (sequential) execution of those same transactions.
It prevents all classic anomalies: Dirty Read, Non-Repeatable Read, and Phantom Read.
Trade-off: Highest correctness guarantee, but lowest concurrency/throughput (more locking
or retries needed).`
  },

  // ── DBMS: Normalization (extra 1) ───────────────────────

  {
    topicSlug: 'dbms-normalization', pattern: 'Normal Forms',
    title: 'First Normal Form (1NF)',
    questionText: 'A table has a column "Phone_Numbers" storing multiple comma-separated numbers per row (e.g. "9876543210, 9998887776"). This violates:',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correctAnswerIndex: 0, difficulty: 'Easy',
    hintText: '1NF requires every column value to be a single, atomic (indivisible) value.',
    detailedSolution: `1NF (First Normal Form) requires:
  - Every column holds ATOMIC (indivisible) values — no comma-separated lists, arrays, or
    nested structures in a single cell.
  - Each row must be unique.
  - No repeating groups of columns.

Storing multiple phone numbers in one field violates atomicity → violates 1NF.
Fix: Create a separate table Phone(StudentID, PhoneNumber) with one row per number,
or use a proper array/JSON type if the DB explicitly supports it with defined semantics.`
  },

  // ── DBMS: Indexing (extra 1) ────────────────────────────

  {
    topicSlug: 'dbms-indexing', pattern: 'Index Types',
    title: 'Hash Index vs B+ Tree Index',
    questionText: 'A hash index generally outperforms a B+ Tree index for which type of query?',
    options: [
      'Range queries (e.g. WHERE age BETWEEN 20 AND 30)',
      'Exact-match equality queries (e.g. WHERE id = 42)',
      'ORDER BY queries',
      'Queries with no WHERE clause at all'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Hashing maps a key directly to a bucket — great for "=" but useless for ordering.',
    detailedSolution: `Hash Index: Uses a hash function to map a key directly to a bucket location — O(1) average
lookup for EXACT-MATCH equality queries (WHERE col = value).
However, hashing destroys ordering, so hash indexes CANNOT efficiently support range queries
(BETWEEN, <, >) or ORDER BY.

B+ Tree Index: Slightly slower for pure equality (O(log n)) but maintains sorted order,
making it efficient for both equality AND range/ordering queries — which is why B+ Trees
are the default choice in most relational databases.`
  },

  // ── CN: OSI and TCP/IP (extra 1) ────────────────────────

  {
    topicSlug: 'cn-osi-tcpip', pattern: 'Layer Identification',
    title: 'Presentation Layer Role',
    questionText: 'Which task is handled by the Presentation Layer (Layer 6) of the OSI model?',
    options: [
      'Routing packets between networks',
      'Data translation, encryption/decryption, and compression',
      'Establishing and terminating connections',
      'Physical transmission of bits over a medium'
    ],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Think of it as the "translator" — it makes sure data formats are understood by both ends.',
    detailedSolution: `Presentation Layer (Layer 6) responsibilities:
  - Data translation between formats (e.g., character encoding, EBCDIC ↔ ASCII)
  - Encryption / Decryption (e.g., SSL/TLS is often associated here)
  - Compression / Decompression

Routing = Network Layer (3). Connection establishment/termination = Session Layer (5) or
Transport Layer (4) depending on context. Physical transmission = Physical Layer (1).
Note: In the simpler TCP/IP model, Presentation and Session are folded into the
Application layer.`
  },

  // ── CN: TCP vs UDP (extra 1) ────────────────────────────

  {
    topicSlug: 'cn-tcp-udp', pattern: 'TCP Features',
    title: 'TCP Connection Termination',
    questionText: 'How many segments are typically exchanged in a normal (graceful) TCP connection termination?',
    options: ['Two (FIN, ACK)', 'Three, same as the handshake', 'Four (FIN, ACK, FIN, ACK) — each side closes independently', 'One (RST)'],
    correctAnswerIndex: 2, difficulty: 'Medium',
    hintText: 'TCP is full-duplex, so each direction of the connection must be closed separately.',
    detailedSolution: `Graceful TCP termination (four-way handshake):
1. Client → Server: FIN (client has no more data to send)
2. Server → Client: ACK (server acknowledges client's FIN)
3. Server → Client: FIN (server also has no more data to send)
4. Client → Server: ACK (client acknowledges server's FIN)

Because TCP is full-duplex, each side must independently signal it's done sending —
that's why closing takes 4 messages, unlike the 3-way handshake used to OPEN a connection.
(An abrupt/abnormal close instead uses a single RST segment.)`
  },

  // ── CN: IP Addressing (extra 1) ─────────────────────────

  {
    topicSlug: 'cn-ip-subnetting', pattern: 'IPv4 vs IPv6',
    title: 'IPv4 vs IPv6 Address Length',
    questionText: 'What is the primary motivation behind IPv6, compared to IPv4?',
    options: [
      'IPv6 addresses are shorter (16 bits) for faster routing',
      'IPv4\'s 32-bit address space (~4.3 billion addresses) is running out; IPv6 uses 128 bits for a vastly larger address space',
      'IPv6 removes the need for subnetting entirely',
      'IPv6 only works over UDP, not TCP'
    ],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Compare bit lengths: IPv4 = 32 bits, IPv6 = 128 bits.',
    detailedSolution: `IPv4: 32-bit addresses → 2^32 ≈ 4.3 billion unique addresses. With billions of internet-
connected devices today, this space is effectively exhausted (mitigated by NAT).

IPv6: 128-bit addresses → 2^128 (an astronomically large number) — designed to give every
device a globally unique address without relying on NAT.
IPv6 also simplifies headers and has built-in support for features like auto-configuration,
but the PRIMARY driver for its adoption was address exhaustion in IPv4.`
  },

  // ── OOPS: Principles (extra 1) ──────────────────────────

  {
    topicSlug: 'oops-principles', pattern: 'Abstract Class vs Interface',
    title: 'Abstract Class vs Interface',
    questionText: 'A key difference between an abstract class and an interface (in languages like Java) is:',
    options: [
      'An interface can have constructors, an abstract class cannot',
      'An abstract class can have both implemented and unimplemented methods, plus state (instance fields); a traditional interface cannot hold instance state',
      'A class can implement multiple abstract classes but only one interface',
      'Interfaces cannot be used for polymorphism'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Think about what each one is allowed to "carry": fields, constructors, method bodies.',
    detailedSolution: `Abstract Class:
  - Can have constructors, instance fields (state), fully implemented methods, AND
    abstract (unimplemented) methods.
  - A class can extend only ONE abstract class (single inheritance).

Interface (traditional):
  - Cannot hold instance state (only constants) and has no constructors.
  - A class can implement MULTIPLE interfaces.
  - (Modern Java allows default/static methods with bodies in interfaces, but instance
    state is still not allowed.)

Use abstract class when subclasses share common state/behavior; use interface to define
a contract multiple unrelated classes can fulfill.`
  },

  // ── OOPS: Classes, Objects (extra 1) ────────────────────

  {
    topicSlug: 'oops-classes-objects', pattern: 'Overloading Rules',
    title: 'Valid Method Overload',
    questionText: 'Which change alone is enough to correctly overload a method `int add(int a, int b)`?',
    options: [
      'Changing only the return type to double, keeping the same parameter list',
      'Changing the parameter list to (double a, double b)',
      'Changing only the method name\'s capitalization',
      'Adding a comment above the method'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Overloading is determined by the parameter list (number/type/order), NOT the return type.',
    detailedSolution: `Method Overloading requires a DIFFERENT parameter list: different number of parameters,
different parameter types, or different order of parameter types.

Changing ONLY the return type (keeping the same name and same parameter list) is NOT valid
overloading — it causes a compile error ("duplicate method") because the compiler can't
distinguish calls based on return type alone.

add(int a, int b) and add(double a, double b) ARE valid overloads — different parameter types.`
  },

  // ── OOPS: Exceptions and Design Patterns (extra 1) ──────

  {
    topicSlug: 'oops-exceptions-patterns', pattern: 'Design Patterns',
    title: 'Factory Pattern',
    questionText: 'The Factory design pattern is primarily used to:',
    options: [
      'Ensure only one instance of a class ever exists',
      'Create objects without exposing the exact instantiation logic to the client, letting a subclass/method decide which concrete class to instantiate',
      'Notify multiple objects when one object\'s state changes',
      'Add new behavior to an object at runtime without subclassing'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'The client asks "give me a Shape" without knowing (or caring) if it\'s a Circle or Square under the hood.',
    detailedSolution: `Factory Pattern: Provides a method (often static) for creating objects, letting the
CALLER avoid direct use of the "new" keyword with a specific concrete class.
The factory decides — based on input parameters or configuration — which concrete
subclass to instantiate and return, all behind a common interface/base type.

Benefit: Client code depends only on the abstract interface, not concrete classes,
making it easy to add new product types later without changing client code.

(Singleton = one instance only; Observer = state-change notification; Decorator = adding
behavior dynamically without subclassing.)`
  },
  // ═══════════════════════════════════════════════════════════
  // BATCH 3 — pushes every core topic to 7-8 questions
  // ═══════════════════════════════════════════════════════════

  // ── OS: Processes and Threads (extra 2) ─────────────────

  {
    topicSlug: 'os-processes-threads', pattern: 'Process States',
    title: 'Zombie vs Orphan Process',
    questionText: 'What is the key difference between a zombie process and an orphan process?',
    options: [
      'A zombie has finished but its exit status hasn\'t been read by its parent yet; an orphan is still running but its parent has terminated first',
      'They are the same thing with different names',
      'A zombie is still running; an orphan has finished execution',
      'A zombie process consumes CPU; an orphan does not exist in the process table'
    ],
    correctAnswerIndex: 0, difficulty: 'Medium',
    hintText: 'One has already terminated, the other is still alive — think about which is missing a parent vs missing cleanup.',
    detailedSolution: `Zombie Process: A process that has FINISHED execution (called exit()), but its entry
remains in the process table because the parent hasn't yet called wait() to read its exit
status. It consumes no resources except a process table slot.

Orphan Process: A process that is STILL RUNNING, but whose parent has terminated before it.
The OS (typically via init/systemd, PID 1) automatically "adopts" orphans and will reap
them when they eventually finish, preventing them from becoming permanent zombies.`
  },
  {
    topicSlug: 'os-processes-threads', pattern: 'Threading Models',
    title: 'User-Level vs Kernel-Level Threads',
    questionText: 'What is a key limitation of pure user-level threads (managed entirely by a user-space library, not the OS kernel)?',
    options: [
      'They are always slower to create than kernel threads',
      'If one user-level thread makes a blocking system call, the entire process (all its threads) blocks',
      'They cannot share memory with each other',
      'They require a separate kernel scheduler for each thread'
    ],
    correctAnswerIndex: 1, difficulty: 'Hard',
    hintText: 'The kernel only sees the process as a whole — it has no idea multiple user-level threads exist inside it.',
    detailedSolution: `User-Level Threads: Managed entirely by a user-space library; the kernel is unaware of them
and only schedules the process as a single unit. Fast to create/switch (no kernel involvement),
but if ANY one thread makes a blocking system call (e.g., a blocking read()), the KERNEL blocks
the whole process — so ALL threads within it are blocked too, since the kernel doesn't know
about the other threads that could otherwise keep running.

Kernel-Level Threads: The kernel is aware of and schedules each thread individually, so a
blocking call in one thread doesn't block sibling threads — at the cost of higher creation/
context-switch overhead (each thread operation needs a kernel transition).`
  },

  // ── OS: CPU Scheduling (extra 2) ────────────────────────

  {
    topicSlug: 'os-cpu-scheduling', pattern: 'Round Robin',
    title: 'Round Robin Time Quantum Tradeoff',
    questionText: 'In Round Robin scheduling, what happens if the time quantum is set TOO SMALL?',
    options: [
      'The system behaves exactly like FCFS',
      'Context-switch overhead dominates, reducing overall CPU efficiency, even though response time improves',
      'Starvation of long processes becomes guaranteed',
      'The scheduler becomes non-preemptive'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Every quantum expiry triggers a context switch — think about what happens if quanta are very frequent.',
    detailedSolution: `Round Robin gives each process a fixed time quantum before preempting it for the next
process in the ready queue.

Quantum too SMALL: Very frequent context switches occur, and since each context switch has
real overhead (saving/restoring state, cache/TLB flushes), a large fraction of CPU time gets
wasted on switching rather than useful work — hurting throughput, even though individual
processes appear to respond quickly.

Quantum too LARGE: Round Robin starts behaving like FCFS, increasing average waiting time for
processes queued behind a long one (bringing back the convoy effect).

The ideal quantum balances responsiveness against switching overhead (a common rule of thumb:
80% of CPU bursts should be shorter than the quantum).`
  },
  {
    topicSlug: 'os-cpu-scheduling', pattern: 'Multilevel Queue',
    title: 'Multilevel Queue Scheduling',
    questionText: 'In Multilevel Queue Scheduling, processes are permanently assigned to different queues (e.g., system, interactive, batch), each with its own algorithm. What is its main drawback compared to Multilevel FEEDBACK Queue scheduling?',
    options: [
      'It cannot use different scheduling algorithms per queue',
      'A process is fixed in its queue for its entire lifetime and cannot move between queues, even if its behavior changes',
      'It doesn\'t support priority between queues',
      'It cannot be used for interactive processes'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'The word "feedback" in the other algorithm\'s name is the hint — it lets processes move.',
    detailedSolution: `Multilevel Queue Scheduling: The ready queue is split into several separate queues
(e.g., system processes, interactive processes, batch processes), each with its own scheduling
algorithm, and queues themselves are scheduled by priority (e.g., strict priority or time-slicing
between queues). A process is assigned to ONE queue permanently based on a property like process
type — it can never move to another queue.

Multilevel FEEDBACK Queue: Improves on this by allowing processes to MOVE between queues based
on their observed behavior — e.g., a CPU-bound process that keeps using its full quantum gets
demoted to a lower-priority (longer-quantum) queue, while an I/O-bound process that frequently
gives up the CPU early can be promoted. This adapts to actual behavior instead of a fixed
upfront classification.`
  },

  // ── OS: Deadlock (extra 2) ───────────────────────────────

  {
    topicSlug: 'os-deadlock', pattern: 'Banker\'s Algorithm',
    title: 'Purpose of Banker\'s Algorithm',
    questionText: 'What does the Banker\'s Algorithm actually do?',
    options: [
      'It detects deadlock after it has already occurred',
      'It decides whether granting a resource request would leave the system in a "safe state" before actually granting it',
      'It forcibly kills the lowest-priority process to prevent deadlock',
      'It prevents deadlock by disabling Mutual Exclusion'
    ],
    correctAnswerIndex: 1, difficulty: 'Hard',
    hintText: 'It runs BEFORE granting a request, simulating the outcome — it\'s an avoidance algorithm, not detection or prevention.',
    detailedSolution: `Banker's Algorithm is a deadlock AVOIDANCE algorithm (not prevention, not detection).

Before granting any resource request, it simulates: "If I grant this, is there still some
order in which ALL processes could finish without getting stuck?" This requires each process
to declare its MAXIMUM possible resource need in advance.

If granting the request would leave the system in a state where no such safe completion order
exists (an "unsafe state"), the request is DENIED (the process waits) even though resources may
technically be available — better safe than risking deadlock later.`
  },
  {
    topicSlug: 'os-deadlock', pattern: 'Deadlock Recovery',
    title: 'Deadlock Recovery Methods',
    questionText: 'Once a deadlock has actually been detected, which of these is a valid recovery approach?',
    options: [
      'Ignore it and hope the OS restarts soon (Ostrich algorithm) — used by many general-purpose OSes since deadlocks are rare',
      'Immediately shut down the entire operating system',
      'Convert all mutexes into semaphores',
      'Increase the time quantum for all processes'
    ],
    correctAnswerIndex: 0, difficulty: 'Medium',
    hintText: 'One legitimate strategy is named after a bird that (supposedly) buries its head in the sand.',
    detailedSolution: `Real recovery approaches once deadlock is detected:
1. Process Termination — kill one process at a time (lowest priority / least work done first)
   until the cycle breaks, or kill ALL deadlocked processes at once (drastic but simple).
2. Resource Preemption — forcibly take a resource away from one process and give it to another,
   rolling that process back to a safe checkpoint.
3. The "Ostrich Algorithm" — deliberately IGNORE the problem entirely. This sounds like a joke,
   but it's what most general-purpose OSes (Windows, Linux, macOS) actually do, since deadlocks
   in practice are rare enough that the overhead of constant detection/avoidance isn't worth it
   for most workloads — a simple reboot is cheaper than always paying the avoidance/detection cost.`
  },

  // ── OS: Memory Management (extra 2) ─────────────────────

  {
    topicSlug: 'os-memory-management', pattern: 'Fragmentation',
    title: 'Internal vs External Fragmentation — Definitions',
    questionText: 'What is the difference between internal and external fragmentation?',
    options: [
      'They are the same thing measured differently',
      'Internal fragmentation is wasted space WITHIN an allocated block (fixed-size allocation); external fragmentation is wasted space BETWEEN allocated blocks (free but too scattered to use)',
      'Internal fragmentation only happens in paging; external only happens in segmentation',
      'Internal fragmentation is caused by disk I/O; external is caused by CPU scheduling'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'One is wasted space inside a block you were given; the other is wasted space in gaps between blocks.',
    detailedSolution: `Internal Fragmentation: Occurs when memory is allocated in FIXED-SIZE blocks (e.g., fixed
page frames), and a process doesn't use the full block it was given — the leftover space
inside that block is wasted and unusable by anyone else. Common in paging.

External Fragmentation: Occurs when free memory exists but is broken into small, scattered
chunks between allocated blocks — so even if the TOTAL free memory is enough for a new
request, no single contiguous chunk is big enough. Common in variable-sized allocation
(e.g., segmentation, or dynamic memory allocation like malloc/free patterns).
Fixed via compaction (rearranging memory) or using paging instead of contiguous allocation.`
  },
  {
    topicSlug: 'os-memory-management', pattern: 'Segmentation vs Paging',
    title: 'Segmentation vs Paging',
    questionText: 'What is the fundamental difference between paging and segmentation as memory management schemes?',
    options: [
      'Paging divides memory into fixed-size blocks; segmentation divides a program into variable-size logical units (code, data, stack)',
      'Segmentation is faster than paging in every case',
      'Paging is only used for virtual memory; segmentation is only used for physical memory',
      'They are identical, just different names for the same technique'
    ],
    correctAnswerIndex: 0, difficulty: 'Medium',
    hintText: 'One splits memory into equal-size chunks; the other splits a program along its natural logical boundaries.',
    detailedSolution: `Paging: Divides both physical and logical memory into FIXED-SIZE blocks (frames and pages).
Since all blocks are the same size, it eliminates external fragmentation, but introduces
internal fragmentation (the last page of a process is rarely exactly full). The division is
purely mechanical — it has no relationship to the program's logical structure.

Segmentation: Divides a program into VARIABLE-SIZE logical units that match how a programmer
thinks about it — e.g., a code segment, a data segment, a stack segment. This makes protection
and sharing more natural (e.g., share the code segment, protect the stack differently), but
being variable-sized, it's prone to external fragmentation.

Many real systems (like x86) combine both: segmentation for logical organization, paging
underneath for physical allocation.`
  },

  // ── DBMS: ACID and Transactions (extra 2) ───────────────

  {
    topicSlug: 'dbms-acid-transactions', pattern: 'ACID Properties',
    title: 'Atomicity Property',
    questionText: 'A bank transfer transaction debits ₹500 from Account A and credits ₹500 to Account B. Midway through, the system crashes right after the debit but before the credit. Which ACID property ensures the database doesn\'t end up with ₹500 simply vanishing?',
    options: ['Consistency', 'Atomicity', 'Isolation', 'Durability'],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Think "all or nothing" — the whole transaction must either fully happen or not happen at all.',
    detailedSolution: `Atomicity guarantees a transaction is treated as a single indivisible unit: either ALL of
its operations complete successfully (commit), or NONE of them take effect at all (rollback) —
there is no partial, half-done state.

In this example, if the crash happens after the debit but before the credit, Atomicity ensures
that on recovery, the incomplete transaction is rolled back entirely — the debit from Account A
is undone too, so the ₹500 is neither lost nor duplicated. The database returns to its state
before the transaction started.`
  },
  {
    topicSlug: 'dbms-acid-transactions', pattern: 'Concurrency Anomalies',
    title: 'Dirty Read Anomaly',
    questionText: 'What is a "Dirty Read" in the context of transaction isolation?',
    options: [
      'Reading data that has been permanently deleted',
      'A transaction reads data written by another transaction that has NOT yet committed — and that data might later be rolled back',
      'Reading the same row twice within one transaction and getting different values',
      'A read operation that returns corrupted binary data'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'The key word is "uncommitted" — you\'re reading something that might not even end up being true.',
    detailedSolution: `Dirty Read: Transaction A reads a value written by Transaction B, while B is still
in-progress and has NOT committed yet. If B later rolls back, A has now acted on data that
never actually became part of the permanent database state — a value that turned out to be
false.

This is the anomaly the "Read Uncommitted" isolation level explicitly allows (the weakest
level). Higher isolation levels ("Read Committed" and above) prevent dirty reads by ensuring
a transaction can only read data that has actually been committed.`
  },

  // ── DBMS: Normalization (extra 2) ───────────────────────

  {
    topicSlug: 'dbms-normalization', pattern: 'Normal Forms',
    title: 'Second Normal Form (2NF) — Partial Dependency',
    questionText: 'A table has a composite primary key (StudentID, CourseID), and a column "StudentName" that depends only on StudentID (not on the full composite key). This violates:',
    options: ['1NF', '2NF', '3NF', 'It doesn\'t violate any normal form'],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: '2NF is specifically about a non-key column depending on only PART of a composite key.',
    detailedSolution: `2NF (Second Normal Form) requires that the table is already in 1NF, AND every non-key
column depends on the ENTIRE composite primary key — not just part of it.

Here, StudentName depends only on StudentID (part of the key), not on the combination of
(StudentID, CourseID) — this is called a PARTIAL DEPENDENCY, which violates 2NF.

Fix: Split into two tables — Student(StudentID, StudentName) and
Enrollment(StudentID, CourseID, [other columns that truly depend on both]).
Note: 2NF only matters when the primary key is composite; a table with a single-column
primary key automatically satisfies 2NF once it satisfies 1NF.`
  },
  {
    topicSlug: 'dbms-normalization', pattern: 'Normal Forms',
    title: 'Third Normal Form (3NF) — Transitive Dependency',
    questionText: 'A table has columns (StudentID, DeptID, DeptName), where DeptName depends on DeptID, and DeptID depends on StudentID. This chain (StudentID → DeptID → DeptName) is an example of what, and which normal form does it violate?',
    options: [
      'A partial dependency, violating 2NF',
      'A transitive dependency, violating 3NF',
      'A multivalued dependency, violating 4NF',
      'This is a normal, valid design with no violation'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'A non-key column depends on ANOTHER non-key column, not directly on the primary key — that\'s the pattern to spot.',
    detailedSolution: `Transitive Dependency: A non-key column (DeptName) depends on ANOTHER non-key column
(DeptID), which in turn depends on the primary key (StudentID) — rather than DeptName
depending directly on the primary key. This chain (Key → non-key A → non-key B) is what
3NF forbids.

3NF requires: the table is in 2NF, AND no non-key column depends transitively on the primary
key (every non-key column must depend directly on the key, the whole key, and nothing but
the key).

Fix: Split into Student(StudentID, DeptID) and Department(DeptID, DeptName), removing the
transitive chain.`
  },

  // ── DBMS: Indexing (extra 2) ────────────────────────────

  {
    topicSlug: 'dbms-indexing', pattern: 'Index Types',
    title: 'Clustered vs Non-Clustered Index',
    questionText: 'What is the key difference between a clustered index and a non-clustered index?',
    options: [
      'A clustered index physically reorders the table\'s actual data rows to match the index order; a non-clustered index is a separate structure that just points to row locations',
      'A clustered index can only be created on numeric columns',
      'A non-clustered index is always faster than a clustered index',
      'A table can have unlimited clustered indexes'
    ],
    correctAnswerIndex: 0, difficulty: 'Medium',
    hintText: 'One of them actually determines the physical storage order of the table itself.',
    detailedSolution: `Clustered Index: Determines the PHYSICAL order in which table rows are actually stored
on disk — the table data itself is sorted according to the clustered index key. Because
data can only be physically sorted one way, a table can have only ONE clustered index
(often the primary key, by default in many databases).

Non-Clustered Index: A separate structure (typically a B+ Tree) that stores the index key
plus a pointer/reference back to the actual row location — it does NOT reorder the table's
physical data. A table can have MANY non-clustered indexes.

Rule of thumb: clustered index lookups tend to be faster for range scans (data is physically
contiguous), while non-clustered indexes add an extra lookup step ("bookmark lookup") to
fetch the actual row.`
  },
  {
    topicSlug: 'dbms-indexing', pattern: 'Index Optimization',
    title: 'Covering Index',
    questionText: 'What makes an index a "covering index" for a particular query?',
    options: [
      'It covers every column in the entire table',
      'The index alone contains ALL the columns needed to answer the query, so the database never needs to fetch the actual table row',
      'It is the largest index on the table by storage size',
      'It automatically covers all future queries regardless of columns used'
    ],
    correctAnswerIndex: 1, difficulty: 'Hard',
    hintText: 'Think about avoiding the extra step of going back to the table after finding a match in the index.',
    detailedSolution: `Covering Index: An index is "covering" for a specific query when the index itself contains
every column the query needs (in the WHERE, SELECT, and ORDER BY clauses) — meaning the
database engine can answer the query using ONLY the index, without ever touching the actual
table data ("index-only scan").

This avoids the extra "bookmark lookup" step normally needed with a non-clustered index
(where you find a match in the index, then still have to jump to the table to fetch other
requested columns), making covering-index queries significantly faster.

Example: an index on (last_name, first_name) covers `+ '`SELECT first_name FROM users WHERE last_name = ?`' + ` completely, since both columns needed are already in the index.`
  },

  // ── CN: OSI and TCP/IP (extra 2) ────────────────────────

  {
    topicSlug: 'cn-osi-tcpip', pattern: 'Protocol Mapping',
    title: 'DNS Protocol and Port',
    questionText: 'DNS (Domain Name System) primarily operates over which transport protocol and port?',
    options: [
      'TCP only, port 443',
      'Primarily UDP (for quick lookups), port 53 — falling back to TCP port 53 for large responses like zone transfers',
      'TCP only, port 80',
      'UDP only, port 25'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'DNS needs to be fast for everyday lookups, but occasionally needs reliability for large transfers.',
    detailedSolution: `DNS uses UDP port 53 for the vast majority of everyday queries (fast, low-overhead,
no connection setup needed for a simple name lookup) — perfectly fine since if a UDP DNS
query is lost, the client's resolver simply retries.

DNS falls back to TCP port 53 when the response would be too large for a single UDP packet
(historically 512 bytes, larger with EDNS0) — most commonly for zone transfers between DNS
servers, or responses with many records (e.g., DNSSEC-signed responses).`
  },
  {
    topicSlug: 'cn-osi-tcpip', pattern: 'OSI vs TCP/IP Model',
    title: 'OSI Model vs TCP/IP Model',
    questionText: 'How many layers does the OSI reference model have compared to the (classic) TCP/IP model?',
    options: [
      'OSI has 7 layers; TCP/IP (classic) has 4 layers, since it merges Application/Presentation/Session into one layer and Data Link/Physical into one Network Access layer',
      'They both have exactly 7 layers with different names',
      'OSI has 4 layers; TCP/IP has 7 layers',
      'OSI has 5 layers; TCP/IP has 5 layers'
    ],
    correctAnswerIndex: 0, difficulty: 'Easy',
    hintText: 'OSI is the more theoretical, granular model; TCP/IP is the practical model actually used to build the internet.',
    detailedSolution: `OSI Model (7 layers): Physical, Data Link, Network, Transport, Session, Presentation,
Application — a theoretical/conceptual reference model.

TCP/IP Model (4 layers, classic version): Network Access (combines Physical + Data Link),
Internet (≈ Network layer), Transport, Application (combines Session + Presentation +
Application).

TCP/IP is the model actually implemented in real-world networking (it predates OSI's
formalization), while OSI is more often used as a teaching/reference framework for
discussing where a given protocol or function conceptually belongs.`
  },

  // ── CN: TCP vs UDP (extra 2) ─────────────────────────────

  {
    topicSlug: 'cn-tcp-udp', pattern: 'TCP Connection Setup',
    title: 'TCP Three-Way Handshake',
    questionText: 'What are the three segments exchanged in a TCP connection\'s three-way handshake, in order?',
    options: [
      'ACK, SYN, FIN',
      'SYN → SYN-ACK → ACK',
      'SYN → ACK → FIN',
      'ACK → SYN → SYN-ACK'
    ],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Both sides need to confirm they can both send AND receive before data flows.',
    detailedSolution: `TCP Three-Way Handshake (establishing a connection):
1. Client → Server: SYN (client requests a connection, proposes an initial sequence number)
2. Server → Client: SYN-ACK (server acknowledges the client's SYN AND sends its own SYN with
   its own initial sequence number)
3. Client → Server: ACK (client acknowledges the server's SYN)

After this, both sides have confirmed they can send AND receive with each other, and the
connection is considered ESTABLISHED — actual data transfer can now begin.`
  },
  {
    topicSlug: 'cn-tcp-udp', pattern: 'Protocol Choice',
    title: 'When to Choose UDP Over TCP',
    questionText: 'Which application would most benefit from choosing UDP over TCP?',
    options: [
      'A file download that must be byte-perfect',
      'Live video calling, where a dropped frame is preferable to the whole stream freezing while waiting for a retransmission',
      'A banking transaction system',
      'Sending an email'
    ],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Think about which application cares more about SPEED than about every single packet arriving.',
    detailedSolution: `UDP is preferred when low latency matters more than perfect reliability, and when the
application can tolerate (or even prefers) occasionally losing data rather than waiting:

- Live video/voice calls: a momentarily glitchy frame is far better than the whole call
  freezing while TCP retransmits an old, now-irrelevant packet.
- Online gaming: stale position data isn't worth waiting for — better to just get the next update.
- DNS lookups: fast retry-if-lost is simpler than a full TCP handshake for a tiny query.

File downloads, banking transactions, and email all need EVERY byte to arrive correctly and
in order — exactly what TCP's reliability guarantees (retransmission, ordering, error
checking) are built for.`
  },

  // ── CN: IP Addressing (extra 2) ──────────────────────────

  {
    topicSlug: 'cn-ip-subnetting', pattern: 'Addressing Schemes',
    title: 'Classful vs Classless Addressing',
    questionText: 'What was the main limitation of the old "classful" IP addressing scheme (Class A/B/C) that CIDR (classless addressing) was designed to fix?',
    options: [
      'Classful addressing couldn\'t support IPv6',
      'Classful addressing only allowed fixed-size blocks (e.g., a Class C only ever gives exactly 254 usable hosts), wasting huge numbers of addresses for networks that needed sizes in between',
      'Classful addressing didn\'t support subnet masks at all',
      'Classful addressing required encryption for every packet'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Think about a company needing exactly 300 addresses — what would classful addressing have forced them to take?',
    detailedSolution: `Classful Addressing (old scheme): Fixed network/host boundaries at Class A (/8, ~16
million hosts), Class B (/16, ~65,000 hosts), or Class C (/24, 254 hosts) — with no options
in between. A company needing just 300 addresses would have to take an entire Class B block
(wasting ~64,700 addresses) since a Class C wasn't big enough.

CIDR (Classless Inter-Domain Routing): Allows an arbitrary prefix length (/25, /26, /27,
etc.), so blocks can be sized to match actual need — dramatically reducing IPv4 address
wastage and slowing the exhaustion of the IPv4 address space.`
  },
  {
    topicSlug: 'cn-ip-subnetting', pattern: 'Private Addressing',
    title: 'Private IP Address Ranges',
    questionText: 'Which of these is a valid PRIVATE IP address range (reserved for internal/LAN use, not routable on the public internet)?',
    options: ['8.8.8.8', '172.16.0.0 – 172.31.255.255', '1.1.1.1', '142.250.0.0 – 142.251.255.255'],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Private ranges are reserved by RFC 1918 — three specific blocks, one of which starts with 172.',
    detailedSolution: `RFC 1918 reserves three private IP address ranges, never routed on the public internet:
- 10.0.0.0 – 10.255.255.255 (10.0.0.0/8)
- 172.16.0.0 – 172.31.255.255 (172.16.0.0/12)
- 192.168.0.0 – 192.168.255.255 (192.168.0.0/16)

These are used inside home/office LANs (behind a NAT router) and can be reused by anyone,
since they never need to be globally unique — only unique within their own private network.
8.8.8.8 (Google DNS) and 1.1.1.1 (Cloudflare DNS) are public addresses.`
  },

  // ── OOPS: Principles (extra 2) ───────────────────────────

  {
    topicSlug: 'oops-principles', pattern: 'Polymorphism',
    title: 'Runtime vs Compile-Time Polymorphism',
    questionText: 'What is the key difference between compile-time (static) and runtime (dynamic) polymorphism?',
    options: [
      'Compile-time polymorphism is resolved via method overloading (decided at compile time based on argument types); runtime polymorphism is resolved via method overriding (decided at runtime based on actual object type)',
      'They are the exact same mechanism with different names',
      'Compile-time polymorphism only works with private methods',
      'Runtime polymorphism doesn\'t require inheritance'
    ],
    correctAnswerIndex: 0, difficulty: 'Medium',
    hintText: 'One is decided by looking at argument types before the program even runs; the other needs to know the actual object at runtime.',
    detailedSolution: `Compile-Time (Static) Polymorphism: Achieved through method OVERLOADING — the compiler
decides WHICH version of a method to call based on the number/type of arguments, at
compile time, before the program even runs.

Runtime (Dynamic) Polymorphism: Achieved through method OVERRIDING — a subclass provides
its own implementation of a parent's method. Which version actually runs is decided at
RUNTIME, based on the actual object type the reference points to (not the reference's
declared type) — this is what enables classic polymorphic behavior like
`+ '`Animal a = new Dog(); a.makeSound();`' + ` calling Dog's version.`
  },
  {
    topicSlug: 'oops-principles', pattern: 'Object Relationships',
    title: 'Association vs Aggregation vs Composition',
    questionText: 'What distinguishes Composition from Aggregation (both are "has-a" relationships between objects)?',
    options: [
      'They are identical; the terms are interchangeable',
      'In Composition, the contained object CANNOT exist independently of the container (strong ownership — if the container is destroyed, so is the part); in Aggregation, it CAN exist independently (weak ownership)',
      'Aggregation always requires inheritance; Composition never does',
      'Composition can only involve exactly two classes'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Think of a House and its Rooms (can\'t exist without the house) vs a University and its Students (students exist independently).',
    detailedSolution: `Association: A general relationship where two independent objects interact/are aware of
each other, with no ownership implied (e.g., a Teacher and a Student).

Aggregation: A "has-a" relationship with WEAK ownership — the contained object can exist
independently of the container. Example: a University "has" Students, but if the University
closes, the Students still exist as people.

Composition: A "has-a" relationship with STRONG ownership — the contained object's lifecycle
is tightly bound to the container; it typically cannot exist meaningfully without it. Example:
a House "has" Rooms — if the House is destroyed, the Rooms cease to exist as a concept too.`
  },

  // ── OOPS: Classes, Objects (extra 2) ─────────────────────

  {
    topicSlug: 'oops-classes-objects', pattern: 'Static vs Instance',
    title: 'Static vs Instance Members',
    questionText: 'What is the key difference between a static member and an instance member of a class?',
    options: [
      'Static members belong to the CLASS itself (one shared copy across all objects); instance members belong to each individual OBJECT (a separate copy per object)',
      'Static members can only be private; instance members can only be public',
      'Instance members are faster to access than static members',
      'Static members are recreated every time a new object is instantiated'
    ],
    correctAnswerIndex: 0, difficulty: 'Easy',
    hintText: 'Think about whether the value is shared across every object, or unique to each one.',
    detailedSolution: `Static (Class) Members: Belong to the CLASS itself, not to any individual object. There
is exactly ONE copy shared by all instances — if one object changes a static field, every
other object (and the class itself) sees that change. Accessed via the class name, and can
be used even without creating any object (e.g., a counter tracking "total objects created").

Instance Members: Belong to each individual OBJECT — every object gets its OWN separate
copy. Changing one object's instance field has no effect on any other object's copy of
that field.`
  },
  {
    topicSlug: 'oops-classes-objects', pattern: 'Copying Objects',
    title: 'Shallow Copy vs Deep Copy',
    questionText: 'An object contains a reference to another object (e.g., an array or a nested object). What is the difference between a shallow copy and a deep copy of it?',
    options: [
      'A shallow copy duplicates the outer object but still shares the SAME inner referenced object; a deep copy duplicates the outer object AND recursively duplicates every referenced inner object too',
      'A shallow copy is always faster but always produces incorrect results',
      'A deep copy only works on primitive data types',
      'They produce identical results in every case'
    ],
    correctAnswerIndex: 0, difficulty: 'Medium',
    hintText: 'One copy still points at the exact same nested object as the original; the other creates fully independent nested copies too.',
    detailedSolution: `Shallow Copy: Creates a new outer object, but any fields that are REFERENCES (arrays,
other objects) still point to the SAME underlying objects as the original. So modifying the
nested object through the copy also affects the original — they share that inner state.

Deep Copy: Creates a new outer object AND recursively creates new copies of every referenced
inner object too, so the copy is FULLY independent of the original — modifying the copy's
nested data has zero effect on the original.

A default copy constructor (or naive object.clone()) often performs a shallow copy by
default — deep copying usually needs to be implemented explicitly.`
  },

  // ── OOPS: Exceptions and Design Patterns (extra 2) ───────

  {
    topicSlug: 'oops-exceptions-patterns', pattern: 'Custom Exceptions',
    title: 'Why Create Custom Exception Classes',
    questionText: 'What is the main benefit of creating a custom exception class (e.g., `InsufficientFundsException`) instead of just throwing a generic `Exception`?',
    options: [
      'Custom exceptions run faster than built-in ones',
      'Callers can catch specific, meaningful exception types and handle different failure cases distinctly, instead of catching a vague generic Exception and having to inspect its message string',
      'Custom exceptions don\'t need to be caught at all',
      'It\'s required by every programming language'
    ],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Think about how a caller can tell WHICH specific problem occurred if everything just throws the same generic type.',
    detailedSolution: `Custom Exception Classes let calling code catch and respond to SPECIFIC failure conditions
distinctly:

`+ '```'+`
try {
  transferFunds(...);
} catch (InsufficientFundsException e) {
  // handle this specific case
} catch (AccountFrozenException e) {
  // handle this different case
}
`+'```'+`

If everything just threw a generic Exception, the caller would have to parse error message
strings to figure out what actually went wrong — fragile and error-prone. Custom exceptions
also let you attach relevant extra data (e.g., the shortfall amount) as fields on the
exception object itself.`
  },
  {
    topicSlug: 'oops-exceptions-patterns', pattern: 'Design Patterns',
    title: 'Thread-Safe Singleton',
    questionText: 'In a multi-threaded application, a naive Singleton getInstance() method (checking "if instance is null, create it" with no synchronization) can fail because:',
    options: [
      'It runs too slowly to be usable',
      'Two threads can both pass the null check simultaneously before either finishes construction, resulting in two separate instances being created',
      'Java and C++ do not support the Singleton pattern at all',
      'The garbage collector deletes the instance immediately after creation'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Think about what happens if two threads both check "instance == null" at the exact same moment.',
    detailedSolution: `The race condition: Thread A checks "instance == null" → true. Before A finishes creating
the object, Thread B also checks "instance == null" → still true (A hasn't assigned it yet).
Now both threads proceed to create and assign their own instance — you end up with two
different objects, breaking the "only one instance" guarantee entirely.

Common fixes:
1. Synchronize the whole method (simple but can be slow under contention).
2. Double-checked locking — check null, lock, check null again, then create (faster).
3. Eager initialization — create the instance at class-load time instead of lazily (simplest,
   avoids the race entirely, at the cost of creating it even if never used).
4. Language-specific idioms — e.g., Java's static holder class pattern, which relies on the
   JVM's guarantee that class initialization is thread-safe.`
  },

  // ── OS: Process & Thread Fundamentals (batch 2) ─────────

  {
    topicSlug: 'os-processes-threads', pattern: 'Process vs Thread',
    title: 'Process vs Thread — Key Difference',
    questionText: 'What is the KEY difference between a process and a thread?',
    options: [
      'There is no difference, the terms are interchangeable',
      'A process has its own independent memory space; threads within the same process share that memory space (code, data, heap) but each has its own stack',
      'A thread is always faster than a process at every task',
      'A process can only ever contain one thread'
    ],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Think about what is SHARED between threads vs what is PRIVATE to each.',
    detailedSolution: `Process: an independent execution unit with its own address space (code, data, heap, open
files). Thread: a lightweight unit of execution WITHIN a process — all threads of a process
share the same address space (heap, global data, open files) but each has its own stack,
program counter, and register set.

This is why threads are cheaper to create/switch than processes (no new address space needed)
but also why a bug in one thread (e.g. an unsynchronized write) can corrupt data another
thread depends on — unlike separate processes, which the OS keeps fully isolated.`
  },
  {
    topicSlug: 'os-processes-threads', pattern: 'Process Lifecycle',
    title: 'fork() vs exec()',
    questionText: 'In Unix/Linux, what is the difference between fork() and exec()?',
    options: [
      'They are two names for the exact same system call',
      'fork() creates a new (child) process as a copy of the caller; exec() replaces the CURRENT process\'s memory image with a new program, without creating a new process',
      'fork() only works for the init process; exec() works for all others',
      'exec() creates a new process; fork() replaces the current one'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'One of them duplicates a process. The other one replaces what\'s running, in place, with no new PID.',
    detailedSolution: `fork() creates a new child process that is (initially) a near-exact copy of the calling
process — same code, same open files, a copy of the data/heap/stack — with its own new PID.
Both parent and child then continue executing independently from the point right after
fork() returned.

exec() (execve() and its variants) does something different: it REPLACES the current
process's memory image (code, data, stack) with a brand-new program, keeping the same PID —
no new process is created. The classic Unix shell pattern is fork() followed by exec() in
the child: fork() to get a new process, then exec() in that child to load the actual program
the user wants to run (e.g., running "ls" from a shell).`
  },
  {
    topicSlug: 'os-processes-threads', pattern: 'Process Lifecycle',
    title: 'Orphan Process',
    questionText: 'A child process is still running, but its parent has already terminated. What happens to the child?',
    options: [
      'The OS immediately kills the child',
      'The child becomes an "orphan" and is automatically re-parented to the init/system process (PID 1), which will reap it once it exits',
      'The child freezes forever, unable to make progress',
      'The child\'s PID is instantly reused by a new process, causing a conflict'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'The child keeps running just fine — it just needs a new "guardian" to eventually clean up after it.',
    detailedSolution: `Orphan processes are automatically adopted (re-parented) by the init/system process
(traditionally PID 1) — this guarantees every process always has SOME parent that can call
wait() on it eventually, so its zombie entry gets cleaned up when it finishes, even if the
original parent is long gone.`
  },
  {
    topicSlug: 'os-processes-threads', pattern: 'Context Switching',
    title: 'What a Context Switch Saves',
    questionText: 'Which of these is NOT saved as part of a process\'s context during a context switch?',
    options: [
      'Program counter',
      'CPU register values',
      'The physical RAM contents of a different, unrelated process',
      'Memory management info (e.g., page table base register)'
    ],
    correctAnswerIndex: 2, difficulty: 'Easy',
    hintText: 'Think about what belongs to THIS process vs what has nothing to do with it.',
    detailedSolution: `A context switch saves the current process's PCB (Process Control Block): program counter,
CPU registers, stack pointer, memory management info (page table pointer), scheduling info,
and open file list — everything the OS needs to resume exactly this process later.

It has nothing to do with copying another, unrelated process's memory — that's not part of
a context switch at all; each process's memory stays right where it is.`
  },
  {
    topicSlug: 'os-processes-threads', pattern: 'IPC',
    title: 'Fastest IPC Mechanism',
    questionText: 'Which IPC mechanism allows the fastest data transfer between two processes on the same machine?',
    options: ['Signals', 'Pipes', 'Shared memory', 'Message queues'],
    correctAnswerIndex: 2, difficulty: 'Medium',
    hintText: 'Which method avoids routing every read/write through the kernel?',
    detailedSolution: `Shared memory maps the same physical memory region into both processes' address spaces —
after setup, they read/write directly with no kernel involvement or data copying, making it
the fastest IPC mechanism available.

Pipes, message queues, and signals all typically route data (or at least control) through
the kernel, adding overhead per operation. The trade-off with shared memory: the OS won't
order accesses for you, so the processes must handle their own synchronization (e.g., via
semaphores or mutexes) to avoid race conditions.`
  },
  {
    topicSlug: 'os-processes-threads', pattern: 'Threading Models',
    title: 'Why Threads Share Data Cheaply',
    questionText: 'What is a major advantage of using multiple threads (instead of multiple processes) for a task that needs to share a lot of data?',
    options: [
      'Threads are completely isolated from each other, improving security',
      'Threads share the same address space, so sharing data is just accessing the same memory — no IPC required',
      'Threads always run on multiple CPU cores simultaneously, guaranteed',
      'A crash in one thread can never affect the rest of the application'
    ],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'What do threads of the same process have direct, immediate access to?',
    detailedSolution: `Since threads of the same process share the same memory space, passing data between them is
just accessing the same variables — no serialization, no IPC, no copying required. That's
far cheaper than the process equivalent, which needs explicit IPC (pipes, shared memory,
sockets).

The downside is the flip side of the same coin: since memory IS shared, one thread's bug
(e.g. an unsynchronized write) can corrupt data another thread depends on — whereas separate
processes are isolated from each other by the OS.`
  },
  {
    topicSlug: 'os-processes-threads', pattern: 'Process States',
    title: 'Running to Waiting Transition',
    questionText: 'A process in the RUNNING state needs to perform a disk I/O operation. Which state does it move to?',
    options: ['Ready', 'Waiting / Blocked', 'Terminated', 'New'],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'It can\'t keep using the CPU while it waits on slow I/O — but it\'s also not ready to run right now.',
    detailedSolution: `Running → Waiting (Blocked): the process voluntarily gives up the CPU because it's waiting
for an event (I/O completion, a resource, a signal) that hasn't happened yet.

It cannot go directly back to Ready, because Ready specifically means "waiting for CPU,
able to run right now" — but this process isn't able to run yet, it's stuck on I/O. Once
the I/O completes, an interrupt moves it Waiting → Ready (now it can compete for CPU again)
— never directly Waiting → Running.`
  },
  {
    topicSlug: 'os-processes-threads', pattern: 'Process Control Block',
    title: 'What Is a PCB?',
    questionText: 'The Process Control Block (PCB) is best described as:',
    options: [
      'A hardware chip dedicated to managing processes',
      'A data structure the OS maintains, containing everything needed to manage a specific process (state, program counter, registers, memory info, scheduling info, etc.)',
      'A user-level library used only for creating threads',
      'A special type of page table used exclusively in paging'
    ],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Think of it as a process\'s "identity card" that the OS kernel keeps.',
    detailedSolution: `Every process has exactly one PCB in the OS: process ID, current state, program counter,
CPU register values, scheduling info (priority, etc.), memory management info (page/segment
tables), accounting info, and I/O status (open files, devices).

This is exactly what gets saved and restored during a context switch — the PCB IS the
process, as far as the OS's bookkeeping is concerned.`
  },
  {
    topicSlug: 'os-processes-threads', pattern: 'Threading Models',
    title: 'Many-to-One Threading Model',
    questionText: 'In the "many-to-one" threading model, multiple user-level threads are mapped onto how many kernel threads?',
    options: [
      'Exactly one kernel thread',
      'Exactly as many kernel threads as there are user threads',
      'A fixed number, always 4',
      'Zero — user threads never involve the kernel at all'
    ],
    correctAnswerIndex: 0, difficulty: 'Medium',
    hintText: '"Many-to-one" literally describes the mapping ratio in its name.',
    detailedSolution: `Many-to-one: many user-level threads map onto a SINGLE kernel thread. Thread scheduling
happens entirely in user space, which is fast — but has a big downside: if ANY user thread
makes a blocking system call, the single underlying kernel thread blocks too, freezing every
user thread in that process. True parallelism across multiple CPU cores is also impossible,
since the kernel only sees one schedulable thread.

Contrast: the one-to-one model maps each user thread to its own kernel thread, enabling true
parallelism, at the cost of more expensive thread creation (each needs kernel resources).`
  },
  {
    topicSlug: 'os-processes-threads', pattern: 'Race Condition',
    title: 'What Is a Race Condition?',
    questionText: 'A "race condition" occurs when:',
    options: [
      'Two processes are simply competing for CPU time via the scheduler',
      'The outcome of a computation depends on the unpredictable timing/interleaving of two or more threads accessing shared data without proper synchronization',
      'A process finishes faster than the OS expected',
      'The OS deliberately runs two threads against each other to pick a winner'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'The bug depends on WHEN each thread happens to run relative to the other — not on what the code says.',
    detailedSolution: `Multiple threads access and modify shared data concurrently, and the final result depends
on the precise (unpredictable) order their operations happen to interleave in — different
runs can produce different, sometimes wrong, results.

Classic example: two threads both execute "x = x + 1" on a shared variable x with no lock.
Depending on interleaving, both might read the SAME old value before either writes back,
so the final value ends up x+1 instead of the intended x+2. Fixed via synchronization
primitives: mutexes/locks, semaphores, or atomic operations.`
  },
  {
    topicSlug: 'os-processes-threads', pattern: 'Critical Section',
    title: 'Critical Section Problem Requirements',
    questionText: 'What are the three requirements a correct solution to the Critical Section Problem must satisfy?',
    options: [
      'Speed, Simplicity, Portability',
      'Mutual Exclusion, Progress, Bounded Waiting',
      'Deadlock, Starvation, Livelock',
      'Paging, Segmentation, Swapping'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'One is about exclusivity, one is about not stalling forever, one is about fairness.',
    detailedSolution: `1. Mutual Exclusion — only one process/thread may execute in its critical section at a time.
2. Progress — if no one is in the critical section and some processes want to enter, that
   decision can't be postponed indefinitely by processes that aren't even trying to enter.
3. Bounded Waiting — there's a limit on how many times OTHER processes can enter their
   critical section after a process has requested entry and before that request is granted
   (this is what prevents starvation).

Together these define "correctness" for a critical-section solution — not just mutual
exclusion, but also liveness and fairness guarantees.`
  },

  // ── OS: CPU Scheduling (batch 2) ─────────────────────────

  {
    topicSlug: 'os-cpu-scheduling', pattern: 'SJF',
    title: 'Why SJF Minimizes Average Waiting Time',
    questionText: 'Which CPU scheduling algorithm provably minimizes average waiting time, assuming all processes arrive at the same time?',
    options: ['FCFS', 'Shortest Job First (SJF)', 'Round Robin', 'Non-preemptive Priority (random priorities)'],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Think about which order clears the MOST processes out of the queue the fastest.',
    detailedSolution: `SJF is provably optimal for minimizing average waiting time among non-preemptive
algorithms when all processes are available at time 0. Intuition: making short jobs wait
behind long jobs (as FCFS might) drags up everyone's average wait; running short jobs first
clears them out fast, so most processes only wait a little.

Trade-off: SJF needs to know (or predict) burst time in advance — often impossible in real
systems — and can starve long jobs if short jobs keep arriving.`
  },
  {
    topicSlug: 'os-cpu-scheduling', pattern: 'Preemptive vs Non-preemptive',
    title: 'Preemptive vs Non-Preemptive Scheduling',
    questionText: 'What is the key difference between preemptive and non-preemptive scheduling?',
    options: [
      'Preemptive scheduling only works on multi-core CPUs',
      'In preemptive scheduling, a running process can be forcibly interrupted and moved back to Ready; in non-preemptive scheduling, once a process starts, it keeps the CPU until it finishes or blocks',
      'Non-preemptive scheduling is always faster in every scenario',
      'They are functionally identical, just different terminology'
    ],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Can the OS take the CPU away from a running process before it\'s done?',
    detailedSolution: `Preemptive: the OS can interrupt a running process and switch to another (used by Round
Robin, preemptive Priority, SRTF) — better responsiveness for interactive systems, but adds
context-switch overhead and needs careful synchronization for shared data.

Non-preemptive: once given the CPU, a process holds it until it finishes or blocks on I/O
(FCFS, non-preemptive SJF) — simpler, no risk of interruption mid-critical-section, but a
long process can hog the CPU and hurt responsiveness (the "convoy effect").`
  },
  {
    topicSlug: 'os-cpu-scheduling', pattern: 'Priority Scheduling',
    title: 'Starvation in Priority Scheduling',
    questionText: 'What problem can occur with priority scheduling, and what is the standard fix?',
    options: [
      'Deadlock; fixed by using mutex locks',
      'Starvation of low-priority processes; fixed by "aging" — gradually increasing a process\'s priority the longer it waits',
      'Thrashing; fixed by adding more RAM',
      'Fragmentation; fixed by memory compaction'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'What happens to a low-priority process if higher-priority ones keep showing up?',
    detailedSolution: `If new higher-priority processes keep arriving, a low-priority process can be pushed back
indefinitely and never get the CPU — this is starvation.

The standard fix is AGING: periodically increase the priority of processes that have been
waiting a long time, so eventually even a low-priority process's effective priority becomes
high enough to run. This guarantees no process waits forever.`
  },
  {
    topicSlug: 'os-cpu-scheduling', pattern: 'Round Robin',
    title: 'Round Robin with a Very Large Quantum',
    questionText: 'In Round Robin scheduling, what happens if the time quantum is set larger than every process\'s burst time?',
    options: [
      'It becomes equivalent to Shortest Job First',
      'It becomes equivalent to FCFS, since every process finishes within its first quantum and is never preempted',
      'The system deadlocks',
      'All processes execute simultaneously'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'If the quantum never expires before a process finishes, is there anything left to preempt?',
    detailedSolution: `If the quantum exceeds any process's total burst time, no process is ever preempted — each
just runs to completion in ready-queue order, which is exactly FCFS behavior. This shows
FCFS is a special case of Round Robin with an infinite/very-large quantum.

Conversely, a very SMALL quantum causes excessive context-switching overhead, hurting
throughput (while maximizing responsiveness) — quantum size is a classic
responsiveness-vs-overhead trade-off.`
  },
  {
    topicSlug: 'os-cpu-scheduling', pattern: 'Round Robin',
    title: 'Downside of a Too-Small Quantum',
    questionText: 'What is the main downside of setting the Round Robin time quantum too small?',
    options: [
      'Processes never finish executing',
      'Excessive context-switching overhead — the CPU spends a significant fraction of time switching between processes instead of doing useful work',
      'It always causes deadlock',
      'It causes priority inversion'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Every context switch has a real, non-zero cost.',
    detailedSolution: `Every context switch has overhead (saving/restoring registers, sometimes flushing caches or
the TLB). If the quantum is tiny, the CPU switches so often that a large fraction of total
time goes to switching overhead rather than actual execution — throughput drops even though
responsiveness improves.

A good quantum is usually chosen so most bursts finish within it (a common rule of thumb:
around 80% of CPU bursts should be shorter than the quantum).`
  },
  {
    topicSlug: 'os-cpu-scheduling', pattern: 'Multilevel Queue',
    title: 'Rigidity of Multilevel Queue Scheduling',
    questionText: 'What is a key limitation of strict Multilevel Queue scheduling compared to Multilevel Feedback Queue?',
    options: [
      'It cannot have more than 2 queues total',
      'Processes are permanently assigned to one queue and can never move between queues, even if their actual behavior changes over time',
      'It requires specialized hardware to function',
      'It is functionally identical to Round Robin'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Once a process is classified into a queue in Multilevel Queue scheduling, can it ever move?',
    detailedSolution: `Multilevel Queue: separates processes into queues (e.g., system, interactive, batch), each
possibly with its own scheduling algorithm — but a process, once assigned to a queue, STAYS
there permanently, regardless of how it actually behaves.

Multilevel FEEDBACK Queue fixes this: it lets processes MOVE between queues based on
observed behavior (e.g., a process that uses its full quantum repeatedly gets demoted to a
lower-priority queue; one that blocks quickly for I/O might get promoted) — adapting to
real behavior rather than a fixed initial classification.`
  },
  {
    topicSlug: 'os-cpu-scheduling', pattern: 'Convoy Effect',
    title: 'The Convoy Effect',
    questionText: 'The "convoy effect" in scheduling refers to:',
    options: [
      'Multiple threads racing to update the same shared memory',
      'In FCFS, a short process getting stuck waiting behind a long CPU-bound process, dragging down average waiting time for everyone behind it',
      'A deadlock involving four or more processes',
      'Network packets arriving out of order'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'This is specifically an FCFS problem — think about who\'s stuck at the front of the line.',
    detailedSolution: `If a long CPU-bound process happens to be at the front of the FCFS queue, every short
process behind it — even I/O-bound ones that would finish almost instantly — must wait for
the entire long process to finish first, even though letting the short ones go first would
keep everyone's average wait low.

This is one of the core motivations for SJF or Round Robin over plain FCFS.`
  },
  {
    topicSlug: 'os-cpu-scheduling', pattern: 'Turnaround Time',
    title: 'Turnaround Time and Waiting Time',
    questionText: 'A process arrives at t=0 with burst time 10, starts execution immediately at t=0, and finishes at t=10 with no waiting. What are its Turnaround Time and Waiting Time?',
    options: ['Turnaround=10, Waiting=10', 'Turnaround=10, Waiting=0', 'Turnaround=0, Waiting=10', 'Turnaround=20, Waiting=10'],
    correctAnswerIndex: 1, difficulty: 'Easy',
    hintText: 'Turnaround = Completion − Arrival. Waiting = Turnaround − Burst.',
    detailedSolution: `Turnaround Time = Completion Time − Arrival Time = 10 − 0 = 10.
Waiting Time = Turnaround Time − Burst Time = 10 − 10 = 0 (it never waited in the ready
queue since it started immediately).

These two formulas are the backbone of every scheduling-algorithm comparison problem —
Turnaround tells you total time in the system; Waiting tells you time spent NOT running.`
  },
  {
    topicSlug: 'os-cpu-scheduling', pattern: 'SRTF',
    title: 'Shortest Remaining Time First (SRTF)',
    questionText: 'Shortest Remaining Time First (SRTF) is best described as:',
    options: [
      'The non-preemptive version of SJF',
      'The preemptive version of SJF — a new arrival with a shorter burst time than the currently running process\'s REMAINING time preempts it immediately',
      'Functionally identical to Round Robin',
      'Only usable with exactly two processes'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'It compares a new process\'s burst time to how much time is LEFT on the currently running one.',
    detailedSolution: `SRTF = preemptive SJF. Whenever a new process arrives, the scheduler compares its burst
time against the REMAINING burst time of whatever is currently running — if the new arrival
is shorter, it preempts the current process immediately.

This further reduces average waiting time versus non-preemptive SJF, but adds context-switch
overhead and — like SJF — needs burst-time knowledge (usually estimated) and can starve long
processes if short ones keep arriving.`
  },
  {
    topicSlug: 'os-cpu-scheduling', pattern: 'Dispatch Latency',
    title: 'Dispatch Latency',
    questionText: '"Dispatch latency" refers to:',
    options: [
      'The total time it takes a process to finish execution',
      'The time taken by the dispatcher to stop one process and start running another (context switch + mode switch + jump to the new process)',
      'The time a network packet spends in a router queue',
      'The time between two consecutive disk seeks'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'It\'s specifically about the SWITCHING overhead, not the running time.',
    detailedSolution: `Dispatch latency is the overhead of actually switching the CPU from one process to another
— saving the old process's context, loading the new one's, and switching to user mode at the
new process's instruction.

Low dispatch latency matters most for real-time systems, where a high-priority task needing
the CPU right away can't afford long switching delays.`
  },
  {
    topicSlug: 'os-cpu-scheduling', pattern: 'Round Robin',
    title: 'Round Robin Gantt Chart',
    questionText: 'Two processes P1(BT=4) and P2(BT=3) arrive at t=0. Round Robin scheduling, quantum=2. What is the execution order?',
    options: [
      'P1(0-4), P2(4-7)',
      'P1(0-2), P2(2-4), P1(4-6), P2(6-7)',
      'P2(0-3), P1(3-7)',
      'P1 and P2 run simultaneously on the same CPU'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'With quantum 2, each process runs at most 2 units before yielding to the next in the ready queue.',
    detailedSolution: `Round Robin with quantum=2: P1 runs 0-2 (2 used, 2 remain, requeued), P2 runs 2-4 (2 used,
1 remains, requeued), P1 runs 4-6 (its remaining 2 used up, finishes), P2 runs 6-7 (its
last 1 unit, finishes).

Final Gantt chart: P1(0-2), P2(2-4), P1(4-6), P2(6-7). This is the mechanical process every
RR problem follows: cycle the ready queue, each process getting at most \`quantum\` time
before being preempted and requeued if unfinished.`
  },
  {
    topicSlug: 'os-cpu-scheduling', pattern: 'Response Time',
    title: 'What Is Response Time?',
    questionText: '"Response Time" in scheduling is best defined as:',
    options: [
      'The total time from arrival to completion (same as turnaround time)',
      'The time from arrival until the process FIRST gets the CPU — not necessarily until it finishes',
      'Time spent waiting in the ready queue after being preempted, specifically',
      'The time quantum used in Round Robin'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'It\'s about when a process starts getting attention, not when it\'s fully done.',
    detailedSolution: `Response Time = Time of first CPU burst − Arrival Time. This differs from both Turnaround
Time (arrival to completion) and Waiting Time (total time spent in the ready queue).

Response time matters most for interactive systems — a user typing at a terminal cares how
fast the system starts responding, not necessarily how fast the whole job finishes. This is
exactly why Round Robin (which gives every process a slice quickly) has much better response
time than FCFS, where a process at the back of a long queue might wait a long time before
even starting.`
  },

  // ── OS: Deadlock (batch 2) ────────────────────────────────

  {
    topicSlug: 'os-deadlock', pattern: 'Deadlock Prevention',
    title: 'Deadlock Prevention Strategy',
    questionText: 'Deadlock PREVENTION works by:',
    options: [
      'Detecting deadlock after it happens and killing a process',
      'Ensuring at least one of the four necessary Coffman conditions can NEVER hold, making deadlock structurally impossible',
      'Carefully checking each resource request against a safe-state algorithm before granting it',
      'Ignoring the problem entirely (the "ostrich algorithm")'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'You only need to eliminate ONE of the four Coffman conditions to make deadlock impossible.',
    detailedSolution: `Prevention designs the SYSTEM so one of the 4 Coffman conditions can never occur. E.g., to
break Hold-and-Wait: require a process to request ALL resources it will ever need up front.
To break No-Preemption: let the OS forcibly reclaim resources. To break Circular Wait:
impose a strict global ordering on resource types and require requests in increasing order.

This differs from Avoidance (lets the conditions potentially hold, but checks each request
against a safe-state test, like Banker's Algorithm) and Detection+Recovery (let deadlock
happen, then detect and fix it).`
  },
  {
    topicSlug: 'os-deadlock', pattern: 'Deadlock Avoidance',
    title: 'What Deadlock Avoidance Requires',
    questionText: 'What must the system know in advance for deadlock AVOIDANCE algorithms like Banker\'s Algorithm to work?',
    options: [
      'Nothing — they work with zero information about processes',
      'The maximum resource need of each process, before it starts running',
      'The exact CPU speed of the machine',
      'The number of physical CPU cores available'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'The algorithm has to know the WORST CASE demand a process might ever make.',
    detailedSolution: `Avoidance algorithms (Banker's Algorithm being the classic example) require advance
knowledge of the MAXIMUM resources each process might ever request. Before granting any
request, the algorithm checks if the resulting state is "safe" — meaning there's SOME order
in which all processes could still finish even in the worst case. If a request would lead to
an unsafe state, it's denied or delayed.

This is more flexible than prevention (doesn't eliminate a whole necessary condition), but
needs info that's often unrealistic to know in advance in real systems.`
  },
  {
    topicSlug: 'os-deadlock', pattern: 'Detection and Recovery',
    title: 'Deadlock Detection and Recovery',
    questionText: 'Deadlock detection and recovery (as opposed to prevention or avoidance) means:',
    options: [
      'Never letting deadlock occur in the first place',
      'Allowing deadlock to potentially occur, periodically checking for it (e.g., via a wait-for graph), and recovering when found',
      'Ignoring deadlock entirely and rebooting the system on a fixed daily schedule',
      'Only ever running single-threaded processes'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'This strategy accepts deadlock MIGHT happen, rather than restricting the system to prevent it.',
    detailedSolution: `This strategy accepts deadlock might happen, and periodically runs a detection algorithm —
commonly building a wait-for graph and checking for a cycle (a cycle among single-instance
resources implies deadlock).

If detected, recovery options include process termination (kill one or more deadlocked
processes) or resource preemption (forcibly take a resource from one process and give it
to another, rolling that process back). Chosen when the overhead of prevention/avoidance
isn't worth it and deadlocks are genuinely rare.`
  },
  {
    topicSlug: 'os-deadlock', pattern: 'Resource Allocation Graph',
    title: 'Cycles with Multi-Instance Resources',
    questionText: 'In a Resource Allocation Graph, when does a cycle guarantee deadlock?',
    options: [
      'Always, regardless of how many instances each resource type has',
      'Only if every resource type involved in the cycle has a single instance; with multiple instances, a cycle is necessary but not sufficient for deadlock',
      'Never — cycles in a Resource Allocation Graph are always harmless',
      'Only when exactly two processes are involved'
    ],
    correctAnswerIndex: 1, difficulty: 'Hard',
    hintText: 'With multiple instances of a resource type, could the cycle still be "broken" by a free instance?',
    detailedSolution: `With single-instance resource types, a cycle in the graph IS deadlock (necessary and
sufficient). But once resources can have multiple instances (e.g., 3 identical printers), a
cycle no longer guarantees deadlock — it's possible for the cycle to resolve because another
free instance of a needed resource can still be granted, breaking the cycle.

In that general case, you need the fuller deadlock detection algorithm (which accounts for
resource counts), not just "does a cycle exist?"`
  },
  {
    topicSlug: 'os-deadlock', pattern: 'Coffman Conditions',
    title: 'The Easiest Coffman Condition to Break',
    questionText: 'Which single Coffman condition is most commonly targeted by practical prevention strategies (via a global resource ordering)?',
    options: [
      'Mutual Exclusion — often inherent to the resource itself and hard to remove',
      'Circular Wait — commonly broken by imposing a global ordering on resource types and requiring requests in increasing order',
      'Hold and Wait — impossible to ever address in practice',
      'No Preemption — trivial to break for every resource type'
    ],
    correctAnswerIndex: 1, difficulty: 'Hard',
    hintText: 'What clean, low-cost fix exists for preventing a CYCLE from ever forming?',
    detailedSolution: `Mutual Exclusion is often inherent to the resource (can't share a printer mid-print) — hard
to remove. Hold-and-Wait can be broken, but at a cost (forcing all-at-once resource
requests hurts concurrency). No-Preemption is only feasible for some resource types.

Circular Wait, by contrast, has a clean, widely practical fix: impose a strict linear
ordering on all resource types system-wide, and require every process to request resources
only in strictly increasing order — this makes a cycle mathematically impossible, since
every request edge must go from a lower-numbered to a higher-numbered resource.`
  },
  {
    topicSlug: 'os-deadlock', pattern: 'Banker\'s Algorithm',
    title: 'What Makes a State "Safe"',
    questionText: 'In Banker\'s Algorithm, a state is called "safe" if:',
    options: [
      'All resources in the system are currently free',
      'There exists at least one ordering ("safe sequence") in which all processes can run to completion using currently available plus soon-to-be-released resources',
      'No process is currently running',
      'The system has strictly more resources than processes'
    ],
    correctAnswerIndex: 1, difficulty: 'Hard',
    hintText: 'It doesn\'t require resources to be free NOW — just that SOME valid finishing order exists.',
    detailedSolution: `Safe state: there's SOME sequence <P1, P2, ..., Pn> such that for each process Pi, its
maximum remaining need can be satisfied using currently available resources plus the
resources held by all processes before it in the sequence (who would have finished and
released their resources by then).

If such a sequence exists, the system is guaranteed to eventually satisfy every process's
max need in that order, even in the worst case — so deadlock cannot occur, even though the
system might look quite "full" of allocations right now. If no such sequence exists, the
state is unsafe — not necessarily deadlocked immediately, but deadlock becomes POSSIBLE.`
  },
  {
    topicSlug: 'os-deadlock', pattern: 'Deadlock vs Starvation',
    title: 'Deadlock vs Starvation',
    questionText: 'What is the difference between deadlock and starvation?',
    options: [
      'They are the same phenomenon described with different words',
      'Deadlock: processes are ALL permanently blocked, none can ever proceed. Starvation: a process keeps getting denied a resource unfairly but is NOT structurally stuck — it could eventually get it',
      'Deadlock only affects CPU scheduling; starvation only affects memory management',
      'Starvation always leads directly to deadlock'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'One is a genuinely unbreakable cycle; the other is a fairness/luck problem.',
    detailedSolution: `Deadlock: a genuinely unbreakable cycle — none of the involved processes can EVER make
progress without external intervention (killing one, preempting a resource).

Starvation: a process is technically ABLE to eventually get what it needs, but keeps losing
out to other processes (e.g., a low-priority process repeatedly skipped by a scheduler
favoring higher-priority arrivals) — a fairness problem, not a structural impossibility.
There's no formal "impossible to resolve" guarantee the way there is with deadlock.`
  },
  {
    topicSlug: 'os-deadlock', pattern: 'Livelock',
    title: 'Livelock vs Deadlock',
    questionText: 'How does "livelock" differ from deadlock?',
    options: [
      'Livelock only happens on single-core CPUs',
      'In livelock, processes are NOT blocked — they keep actively changing state in response to each other, but never make actual forward progress; in deadlock, processes are genuinely blocked and idle',
      'Livelock is a hardware fault, not a software issue',
      'Livelock always resolves itself automatically within a fixed time'
    ],
    correctAnswerIndex: 1, difficulty: 'Hard',
    hintText: 'Think of two people in a hallway both repeatedly stepping aside to let the other pass.',
    detailedSolution: `In deadlock, involved processes are WAITING (blocked, idle) — a classic circular-wait
freeze. In livelock, processes are actively RUNNING and changing state (not blocked!) in
response to each other, but their states just keep cycling without actual progress.

Classic analogy: two people in a hallway both step aside to let the other pass, then both
step back, repeatedly — never actually getting past each other. A real example: two threads
each detecting a potential deadlock and repeatedly backing off and retrying at the same
moment, forever colliding again.`
  },
  {
    topicSlug: 'os-deadlock', pattern: 'Necessary vs Sufficient Conditions',
    title: 'Coffman Conditions — Necessary and Sufficient',
    questionText: 'The four Coffman conditions must all hold simultaneously for deadlock. This makes them:',
    options: [
      'Sufficient, but not necessary',
      'Necessary — all four must hold for deadlock to be possible — and, together, sufficient too',
      'Irrelevant to whether deadlock can occur',
      'Applicable only to single-processor systems'
    ],
    correctAnswerIndex: 1, difficulty: 'Hard',
    hintText: 'If even ONE of the four is false, can deadlock still occur?',
    detailedSolution: `All four conditions holding simultaneously is both NECESSARY (deadlock cannot happen if even
ONE is false — e.g., if preemption is always allowed, a circular wait can be broken by
forcibly reclaiming a resource) and, together, SUFFICIENT (if all four DO hold, deadlock
becomes possible, though a specific execution might still avoid it by lucky timing).

This is exactly why prevention strategies only need to make ONE of the four impossible —
you don't need to break all four, breaking any single one is enough.`
  },
  {
    topicSlug: 'os-deadlock', pattern: 'Deadlock Handling',
    title: 'The Ostrich Algorithm',
    questionText: 'The "Ostrich Algorithm" refers to which deadlock-handling strategy?',
    options: [
      'Actively detecting and preventing every possible deadlock',
      'Simply ignoring the possibility of deadlock entirely — the approach most general-purpose OSes actually use, since deadlocks are rare enough that prevention overhead isn\'t worth it',
      'Using specialized deadlock-resistant hardware',
      'Rebooting the system on every process crash'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Named after the myth that ostriches bury their heads in the sand to ignore danger.',
    detailedSolution: `Just don't deal with deadlock at all — pretend it doesn't happen, and if it does (rarely),
let a human or a reboot fix it. This sounds naive, but is a genuinely pragmatic trade-off:
most general-purpose OSes (Windows, Linux) actually use this for most resources, because the
overhead of running Banker's-Algorithm-style avoidance on every resource request
system-wide would cost far more than the occasional inconvenience of a deadlock (usually
fixed by killing a hung process).

Real deadlock prevention/avoidance is reserved for specific high-stakes contexts, like
database transaction managers.`
  },
  {
    topicSlug: 'os-deadlock', pattern: 'Deadlock Recovery',
    title: 'Choosing a Process to Terminate',
    questionText: 'When recovering from deadlock via process termination, what is a key factor in choosing which process(es) to kill?',
    options: [
      'It doesn\'t matter — any deadlocked process works equally well',
      'Factors like priority, how much computation is already complete, how many resources it holds, and how many more it needs',
      'Always kill the process with the lowest PID, regardless of anything else',
      'Always kill every process in the system, to be safe'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Killing a process wastes whatever work it already did — so not all victims cost the same.',
    detailedSolution: `Killing a process "wastes" whatever work it had already done (unless it can safely restart
from a checkpoint). A well-designed recovery strategy picks the victim(s) minimizing total
cost — factors typically considered: process priority (avoid killing important processes),
how much computation is complete and how much more is needed, how many and what type of
resources it holds (killing one holding a resource many others need breaks the cycle more
effectively), and whether it's interactive or batch.

Killing "all" processes is a valid option in principle, but a very heavy-handed last resort.`
  },
  {
    topicSlug: 'os-deadlock', pattern: 'Resource Allocation Graph',
    title: 'Request vs Assignment Edges',
    questionText: 'In a Resource Allocation Graph, an edge from Process P1 to Resource R1 (P1 → R1) means:',
    options: [
      'P1 currently holds R1',
      'P1 is REQUESTING R1 — waiting to be allocated it',
      'R1 is currently allocated to nobody',
      'P1 has just released R1'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Look at the direction of the arrow — FROM the process TO the resource.',
    detailedSolution: `By convention: a REQUEST edge points FROM the process TO the resource (P1 → R1 means "P1
wants R1"). An ASSIGNMENT edge points the opposite way, FROM the resource TO the process
(R1 → P1 means "R1 is currently held by P1").

A cycle formed by a mix of request and assignment edges — with single-instance resources —
indicates a circular wait, i.e., deadlock.`
  },

  // ── OS: Memory Management (batch 2) ──────────────────────

  {
    topicSlug: 'os-memory-management', pattern: 'Page Replacement',
    title: 'Global vs Local Page Replacement',
    questionText: 'What is the difference between global and local page replacement policies?',
    options: [
      'Global and local are just two names for the same policy',
      'Global replacement lets a process steal a frame from ANY process in the system; local replacement restricts it to only replacing among its OWN allocated frames',
      'Local replacement only works on a single-CPU system',
      'Global replacement is only used for kernel processes, never for user processes'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'The question is: whose frame is a process allowed to take when IT needs a replacement?',
    detailedSolution: `Local replacement: when a process page-faults, it can only replace one of the frames
ALREADY allocated to itself — its total frame allocation stays fixed, giving predictable,
isolated performance (one process's paging behavior can't hurt another's).

Global replacement: a faulting process can take a frame from ANY process in the system,
including ones it doesn't own — this lets frames flow dynamically to whichever process
needs them most, often improving overall system throughput, but at the cost of
predictability: one memory-hungry process can degrade another's performance by stealing its
frames, and it becomes harder to reason about or guarantee any one process's behavior in
isolation.`
  },
  {
    topicSlug: 'os-memory-management', pattern: 'Page Replacement',
    title: 'LRU Page Fault Count',
    questionText: 'Reference string: 1,2,3,4,1,2,5,1,2,3,4,5 with 4 page frames, using LRU replacement. How many page faults occur?',
    options: ['6', '8', '10', '4'],
    correctAnswerIndex: 1, difficulty: 'Hard',
    hintText: 'LRU evicts whichever resident page hasn\'t been used for the longest time. Track recency order at each step.',
    detailedSolution: `Trace (frames shown oldest→newest by recency):
1→fault {1} | 2→fault {1,2} | 3→fault {1,2,3} | 4→fault {1,2,3,4} (full, 4 faults so far)
1→hit, order becomes 2,3,4,1
2→hit, order becomes 3,4,1,2
5→fault, evict LRU=3, frames{4,1,2,5} (5 faults), order 4,1,2,5
1→hit, order 4,2,5,1
2→hit, order 4,5,1,2
3→fault, evict LRU=4, frames{5,1,2,3} (6 faults), order 5,1,2,3
4→fault, evict LRU=5, frames{1,2,3,4} (7 faults), order 1,2,3,4
5→fault, evict LRU=1, frames{2,3,4,5} (8 faults)

Total page faults = 8.`
  },
  {
    topicSlug: 'os-memory-management', pattern: 'Thrashing',
    title: 'What Is Thrashing?',
    questionText: '"Thrashing" occurs when:',
    options: [
      'A process uses 100% of the CPU productively',
      'The system spends more time paging than executing actual instructions, because processes lack enough frames for their working sets',
      'Two threads deadlock on the same mutex',
      'The disk controller physically malfunctions'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'The CPU looks "busy" — but busy doing what, exactly?',
    detailedSolution: `When the degree of multiprogramming is too high relative to available physical memory,
each process doesn't get enough frames for its "working set" (the pages it's actively
using), so it constantly page-faults — CPU utilization actually DROPS even though the CPU
looks "busy," because it's spending nearly all its time handling page faults rather than
running instructions.

Fixed by: reducing the degree of multiprogramming, or using the working-set model to
allocate frames based on each process's actual active page-usage pattern.`
  },
  {
    topicSlug: 'os-memory-management', pattern: 'Working Set',
    title: 'The Working Set Model',
    questionText: 'The "Working Set" of a process is best defined as:',
    options: [
      'The total virtual memory size of the process',
      'The set of pages a process has referenced in the most recent time window (Δ) — an estimate of what it\'s actively using right now',
      'Every page ever allocated to the process since it started',
      'The pages currently sitting on disk rather than in RAM'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'It\'s about RECENT activity, using a sliding time window.',
    detailedSolution: `Working Set Model: tracks, for each process, the set of distinct pages referenced in the
last Δ time units (a sliding window) — an approximation of the process's active memory
footprint at any given moment.

The OS uses this to decide how many frames to give each process: if a process's working set
doesn't fit in its allocated frames, it will thrash; giving it enough frames to hold its
working set (without excess) is the goal of working-set-based frame allocation.`
  },
  {
    topicSlug: 'os-memory-management', pattern: 'TLB',
    title: 'Translation Lookaside Buffer (TLB)',
    questionText: 'What is a Translation Lookaside Buffer (TLB)?',
    options: [
      'A type of hard disk used for virtual memory',
      'A small, fast hardware cache storing recent virtual-to-physical address translations, avoiding a full page table walk on every memory reference',
      'A purely software structure with no hardware involvement',
      'A backup copy of the entire page table stored on disk'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Without it, every single memory access would need an EXTRA memory access just for translation.',
    detailedSolution: `Without a TLB, every memory access would require an extra memory access (or more, for
multi-level page tables) just to look up the physical address — effectively doubling (or
worse) memory access time.

The TLB is a small, very fast cache (built into the CPU/MMU) holding the most recently used
virtual→physical translations. On a TLB hit, translation is nearly instant. On a miss, the
full page table walk happens, and the result gets cached for next time. TLB hit rate is a
critical performance factor in virtual memory systems.`
  },
  {
    topicSlug: 'os-memory-management', pattern: 'Virtual Memory',
    title: 'Copy-on-Write (COW)',
    questionText: 'What does "Copy-on-Write" (COW) optimize, typically used right after a fork()?',
    options: [
      'It compresses memory pages to save disk space',
      'Parent and child initially SHARE the same physical pages (marked read-only); a page is only actually copied when either process tries to WRITE to it',
      'It copies every page immediately upon fork(), before either process runs',
      'It deletes unused pages permanently to free memory'
    ],
    correctAnswerIndex: 1, difficulty: 'Hard',
    hintText: 'Why copy a page immediately if it might never actually be modified by either process?',
    detailedSolution: `Right after fork(), the child is (logically) a full copy of the parent's memory — but
actually duplicating every page immediately would be wasteful, especially since many
fork()+exec() patterns immediately discard the child's copied memory anyway.

Copy-on-Write avoids this: parent and child initially share the exact same physical pages,
each marked read-only. Both processes can read freely from the shared pages. The moment
EITHER process tries to WRITE to a shared page, a page fault triggers, and only THEN does
the OS actually copy that specific page — giving the writing process its own private copy.
This makes fork() dramatically cheaper in the common case, since most pages are never
written to by the child (e.g., if it immediately calls exec()).`
  },
  {
    topicSlug: 'os-memory-management', pattern: 'Segmentation',
    title: 'Segmentation vs Fixed-Size Paging',
    questionText: 'Unlike paging (fixed-size frames), segmentation divides a process\'s memory into:',
    options: [
      'Also fixed-size, identical blocks',
      'Variable-size logical units, each matching a meaningful program construct (code, stack, heap, a specific data structure)',
      'Physical disk sectors',
      'CPU cache lines'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'Segmentation reflects how a PROGRAMMER thinks about a program, not a fixed mechanical size.',
    detailedSolution: `Segmentation reflects the LOGICAL structure of a program — separate segments for code,
stack, heap, global data, etc. — each sized based on what it actually needs, unlike paging's
fixed-size frames which have no relationship to program structure.

This makes segmentation natural for protection (mark code read-only+executable, data
read-write) and sharing (share a library's code segment across processes) — but variable-size
segments reintroduce EXTERNAL fragmentation, exactly the problem paging's fixed frames avoid.`
  },
  {
    topicSlug: 'os-memory-management', pattern: 'Address Binding',
    title: 'What Is Address Binding?',
    questionText: '"Address binding" refers to:',
    options: [
      'Locking a memory address so no process can ever access it',
      'Mapping a program\'s logical/symbolic addresses to actual physical memory addresses — which can happen at compile, load, or execution time',
      'Merging two separate processes into one',
      'Encrypting memory addresses for security purposes'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'This can happen at three different points: when the code is compiled, loaded, or actually running.',
    detailedSolution: `Compile-time binding: physical address fixed at compilation — only works if the process's
exact memory location is known in advance (rare). Load-time binding: relocatable code, with
physical addresses decided at load time (still fixed once loaded). Execution-time (dynamic)
binding: mapping happens on the fly, DURING execution, via hardware support (e.g., a
base/relocation register in the MMU).

Modern OSes use dynamic binding — it's exactly what allows a process to be swapped out and
reloaded into a different physical location, and underlies virtual memory / paging.`
  },
  {
    topicSlug: 'os-memory-management', pattern: 'Page Table',
    title: 'Why Multi-Level Page Tables?',
    questionText: 'What problem does a multi-level page table solve compared to a single flat page table?',
    options: [
      'It makes every memory access faster with no downsides',
      'A flat table for a large address space would need to be huge even if the process uses only a tiny fraction of it; multi-level tables avoid allocating page-table memory for unused regions',
      'It eliminates the need for a TLB entirely',
      'It removes the need for any page replacement algorithm'
    ],
    correctAnswerIndex: 1, difficulty: 'Hard',
    hintText: 'Think about how much of a process\'s full address space actually gets used in practice.',
    detailedSolution: `A flat page table for, say, a 32-bit address space with 4KB pages needs about 2^20
(roughly 1 million) entries — even if the process only actually uses a few megabytes. That's
a lot of wasted page-table memory.

A multi-level (hierarchical) table breaks the virtual address into parts (outer index, inner
index, offset) — outer-level entries for UNUSED regions simply aren't allocated at all,
saving substantial memory. The trade-off: a page table walk now needs multiple sequential
memory accesses instead of one — exactly why the TLB matters so much for performance.`
  },
  {
    topicSlug: 'os-memory-management', pattern: 'Optimal Page Replacement',
    title: "Optimal (Belady's) Page Replacement",
    questionText: 'The Optimal (OPT / Belady\'s) page replacement algorithm evicts the page that:',
    options: [
      'Was used least recently',
      'Will NOT be used for the longest time in the future — i.e., whichever page\'s next use is furthest away',
      'Arrived first (FIFO order)',
      'Is chosen uniformly at random'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'This algorithm needs to know the FUTURE — which is exactly why it can\'t actually be implemented live.',
    detailedSolution: `Optimal evicts the page whose next use is furthest in the future (or never used again,
treated as "infinitely far away"). This is provably the best possible strategy — it
minimizes page faults for any given reference string.

The catch: it requires knowing the future reference string in advance, which is impossible
in a real running system — so OPT is used purely as a theoretical baseline to measure how
close practical algorithms like LRU or Clock come to ideal performance, not as something you
can actually implement live.`
  },
  {
    topicSlug: 'os-memory-management', pattern: 'Clock Algorithm',
    title: 'Clock (Second-Chance) Algorithm',
    questionText: 'The Clock (Second-Chance) page replacement algorithm is popular because:',
    options: [
      'It requires exact access timestamps for every page, like true LRU',
      'It approximates LRU using just one "reference bit" per page and a circular pointer — much cheaper to implement than true LRU',
      'It always performs worse than FIFO in every scenario',
      'It only works with exactly two page frames'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'True LRU needs precise access history. Clock approximates the same idea with far less overhead.',
    detailedSolution: `True LRU requires precisely tracking the recency of every access — expensive in hardware at
memory-access speed. Clock/Second-Chance approximates this cheaply: each page has one
reference bit, set to 1 on access. On a page fault, a circular pointer scans frames — if a
page's bit is 1, give it a "second chance" (clear the bit, move on) instead of evicting it;
if the bit is already 0, evict it.

This gives LRU-like behavior (recently touched pages survive) using far cheaper hardware
(1 bit per page + a pointer) than true LRU would need.`
  },
  {
    topicSlug: 'os-memory-management', pattern: 'Swapping',
    title: 'What Is Swapping?',
    questionText: '"Swapping" as a memory management technique refers to:',
    options: [
      'Exchanging the execution roles of two running processes',
      'Moving an ENTIRE process out of main memory to disk to free RAM, and later moving it back — as opposed to paging, which moves individual pages',
      'Swapping which CPU core a process runs on',
      'Renaming variables during compilation'
    ],
    correctAnswerIndex: 1, difficulty: 'Medium',
    hintText: 'This moves a WHOLE process, not individual pages — that\'s the key difference from demand paging.',
    detailedSolution: `Swapping (classical sense) moves a whole process's memory image out to disk (a "swap
space") when not actively needed, freeing that RAM for others — and swaps it back later,
possibly at a different physical address (why dynamic address binding matters).

This differs from paging's demand-based approach, which brings in/evicts individual PAGES
as needed rather than entire processes. Modern OSes primarily use paging, but under severe
memory pressure some will swap out an entire inactive process's pages together — which is
where the term "swap space"/"swap file" (Linux swap partition, Windows pagefile) comes from.`
  },

  // ── DBMS: ACID & Transactions (batch 2) ──────────────────

  {
    topicSlug: "dbms-acid-transactions", pattern: "Isolation Levels",
    title: "Read Committed Isolation Level",
    questionText: "The \"Read Committed\" isolation level guarantees that:",
    options: [
      "A transaction never sees any changes from other transactions, ever",
      "A transaction only reads data that has been COMMITTED by other transactions — but may see different committed values if it reads the same row twice (non-repeatable read)",
      "A transaction can freely read uncommitted (dirty) data from others",
      "All transactions run strictly one at a time, with no concurrency at all"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "It protects against dirty reads specifically — but not against other timing issues.",
    detailedSolution: `Read Committed prevents DIRTY READS (you'll never see another transaction's uncommitted
changes) but does NOT prevent NON-REPEATABLE READS — if you read the same row twice within
your transaction, and another transaction commits a change to that row in between, you'll
see two different values.

This sits between Read Uncommitted (weakest, allows dirty reads) and Repeatable Read
(stronger, also fixes non-repeatable reads) in the standard SQL isolation-level hierarchy.`
  },
  {
    topicSlug: "dbms-acid-transactions", pattern: "Isolation Levels",
    title: "Non-Repeatable Read",
    questionText: "A \"non-repeatable read\" anomaly occurs when:",
    options: [
      "A query returns zero rows unexpectedly",
      "A transaction reads the SAME row twice and gets DIFFERENT values, because another transaction committed an update to that row in between",
      "A transaction reads a row that no one ever committed",
      "A SELECT query never terminates"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Think: same row, read twice, different answer each time.",
    detailedSolution: `Within a single transaction, you SELECT the same row twice and the value differs between
reads — because another transaction updated (and committed) that exact row in between.

This differs from a "phantom read", which is about the SET of rows matching a query
changing (new rows appearing/disappearing), not an already-read row's value changing.
Fixed by using REPEATABLE READ isolation or stricter.`
  },
  {
    topicSlug: "dbms-acid-transactions", pattern: "Isolation Levels",
    title: "Phantom Read",
    questionText: "A \"phantom read\" anomaly occurs when:",
    options: [
      "A specific row's value changes between two reads within the same transaction",
      "A transaction re-runs the same RANGE query twice and gets a different SET of rows, because another transaction inserted/deleted matching rows in between",
      "A row is read before it technically exists",
      "The database crashes in the middle of a query"
    ],
    correctAnswerIndex: 1, difficulty: "Hard",
    hintText: "This is about new/missing ROWS appearing — not an existing row's value changing.",
    detailedSolution: `A transaction runs a range query (e.g., "SELECT * FROM orders WHERE amount > 100") twice and
gets a different set of matching rows the second time — because another transaction inserted
a new row (or deleted one) that now matches (or no longer matches), and committed, in
between the two reads.

Even REPEATABLE READ doesn't fully prevent this in some databases — SERIALIZABLE (the
strictest level) is needed to eliminate phantom reads entirely.`
  },
  {
    topicSlug: "dbms-acid-transactions", pattern: "Isolation Levels",
    title: "Isolation Level Hierarchy",
    questionText: "Ranking the standard SQL isolation levels from WEAKEST to STRONGEST, which order is correct?",
    options: [
      "Serializable → Repeatable Read → Read Committed → Read Uncommitted",
      "Read Uncommitted → Read Committed → Repeatable Read → Serializable",
      "Read Committed → Read Uncommitted → Serializable → Repeatable Read",
      "They are all equally strict, just implemented differently"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Which one allows the MOST anomalies (weakest) vs the FEWEST (strongest)?",
    detailedSolution: `Weakest (most anomalies allowed, best concurrency) to strongest (fewest anomalies, worst
concurrency): Read Uncommitted (allows dirty reads) → Read Committed (blocks dirty reads,
allows non-repeatable reads) → Repeatable Read (blocks non-repeatable reads, may still allow
phantom reads depending on the database) → Serializable (blocks all anomalies).

Higher isolation = stronger correctness guarantees, but typically more locking/blocking and
lower throughput — a classic consistency-vs-performance trade-off.`
  },
  {
    topicSlug: "dbms-acid-transactions", pattern: "Schedules",
    title: "Serial vs Concurrent Schedule",
    questionText: "A \"serial schedule\" of transactions means:",
    options: [
      "Transactions execute in parallel, interleaved instruction by instruction",
      "Transactions execute one completely after another, with zero interleaving — always correct, but with no concurrency benefit",
      "Transactions are automatically cancelled if any conflict occurs",
      "Only SELECT statements are permitted in the schedule"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "\"Serial\" = one after another, in a series — no overlap at all.",
    detailedSolution: `A serial schedule runs each transaction to completion before the next starts — zero
interleaving. This is always correct by definition (equivalent to running transactions in
isolation, one at a time) but gives up all concurrency performance benefits.

Real databases instead use CONCURRENT (interleaved) schedules for performance, relying on
concurrency control (locking, MVCC) to guarantee the concurrent schedule is CONFLICT
SERIALIZABLE — equivalent in its final effect to some serial schedule, even though it wasn't
literally executed that way.`
  },
  {
    topicSlug: "dbms-acid-transactions", pattern: "Schedules",
    title: "Conflict Serializability",
    questionText: "A concurrent (interleaved) schedule is called \"conflict serializable\" if:",
    options: [
      "It contains zero read or write operations",
      "It can be transformed into an equivalent SERIAL schedule by swapping non-conflicting operations, without changing the final result",
      "Every transaction in it commits successfully, regardless of order",
      "It uses only SELECT statements, never INSERT/UPDATE/DELETE"
    ],
    correctAnswerIndex: 1, difficulty: "Hard",
    hintText: "Two operations \"conflict\" if they're from different transactions, touch the same data, and at least one is a write.",
    detailedSolution: `Two operations conflict if they belong to different transactions, operate on the same data
item, and at least one is a WRITE. A schedule is conflict serializable if repeatedly
swapping ADJACENT non-conflicting operations can transform it into some serial schedule.

This is checked in practice using a "precedence graph" (edge Ti→Tj if a conflicting
operation of Ti precedes one of Tj) — if the graph has no cycle, the schedule is conflict
serializable, guaranteeing the same result as some valid serial order.`
  },
  {
    topicSlug: "dbms-acid-transactions", pattern: "Two-Phase Locking",
    title: "Two-Phase Locking (2PL)",
    questionText: "The Two-Phase Locking (2PL) protocol requires that a transaction:",
    options: [
      "Acquire and release locks in any order, at any time",
      "First acquire all needed locks (growing phase), and only then start releasing them (shrinking phase) — never acquiring a new lock after releasing one",
      "Hold at most exactly two locks total",
      "Never acquire more than one lock per table"
    ],
    correctAnswerIndex: 1, difficulty: "Hard",
    hintText: "\"Two-phase\" = a growing phase, then a shrinking phase — never back to growing once shrinking starts.",
    detailedSolution: `2PL splits a transaction's lifetime into two phases: Growing Phase — the transaction can
acquire locks, but not release any. Shrinking Phase — it can release locks, but not acquire
new ones. Once it releases its first lock, it can never acquire another. This guarantees the
resulting schedule is conflict serializable.

A stricter variant, "Strict 2PL," holds ALL locks until the transaction actually commits or
aborts — this additionally prevents cascading aborts and is what most real databases
implement.`
  },
  {
    topicSlug: "dbms-acid-transactions", pattern: "Deadlock in Transactions",
    title: "Deadlock Between Transactions",
    questionText: "Transaction T1 holds a lock on Row A and wants Row B. Transaction T2 holds a lock on Row B and wants Row A. What happens?",
    options: [
      "Both transactions succeed instantly, since they want different rows",
      "T1 and T2 deadlock — each waits for a lock the other holds; the DBMS detects this and aborts one to break the cycle",
      "The database automatically merges the two transactions into one",
      "Row A and Row B become permanently locked with no possible resolution"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "This is the classic OS-style deadlock scenario, applied to database row locks.",
    detailedSolution: `This is a textbook deadlock: T1 waits for T2 (who holds Row B), T2 waits for T1 (who holds
Row A) — a circular wait, structurally identical to OS-level resource deadlocks.

Databases handle this via DEADLOCK DETECTION: periodically (or per lock request) build a
wait-for graph and check for cycles; when found, pick a "victim" transaction to ABORT and
roll back (releasing its locks), letting the other proceed. The aborted transaction's
application typically needs to retry from scratch.`
  },
  {
    topicSlug: "dbms-acid-transactions", pattern: "Transaction States",
    title: "Transaction State Diagram",
    questionText: "After a transaction issues its final statement, but before the DBMS confirms the commit is permanently recorded, what state is it in?",
    options: [
      "Active",
      "Partially Committed — finished executing, but durability isn't guaranteed yet",
      "Aborted",
      "Failed"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "This is a brief in-between state: after \"done executing\" but before \"guaranteed durable.\"",
    detailedSolution: `Transaction states: Active (executing) → Partially Committed (finished its last operation,
but durability isn't guaranteed yet) → Committed (DBMS confirms the effects are permanently
recorded, e.g., written to the log/disk).

If a failure occurs in the Partially Committed state before commit finalizes, the
transaction moves to Failed instead, then rolls back to Aborted. This is exactly why
"committed" specifically means durably guaranteed, not just "the code finished running."`
  },
  {
    topicSlug: "dbms-acid-transactions", pattern: "ACID vs BASE",
    title: "ACID vs BASE",
    questionText: "How does the \"BASE\" model (common in many NoSQL databases) differ philosophically from ACID?",
    options: [
      "BASE guarantees strictly stronger consistency than ACID, always",
      "BASE (Basically Available, Soft state, Eventually consistent) trades strict, immediate consistency for higher availability and scalability, converging eventually",
      "BASE and ACID are identical, just different acronyms for the same guarantees",
      "BASE only applies to single-node databases, never distributed ones"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "BASE deliberately relaxes one of ACID's core promises in exchange for something else.",
    detailedSolution: `ACID prioritizes strict correctness and immediate consistency, often at the cost of
availability/scalability in distributed systems (related to the CAP theorem trade-off).

BASE takes the opposite philosophy, common in NoSQL/distributed systems: prioritize
availability and scale, accept that replicas might briefly disagree, but guarantee they'll
converge EVENTUALLY. Neither is universally "better" — it depends on whether the
application needs strict correctness (banking) or can tolerate brief staleness for better
availability/scale (a social media like-counter).`
  },
  {
    topicSlug: "dbms-acid-transactions", pattern: "Write-Ahead Logging",
    title: "Write-Ahead Logging (WAL)",
    questionText: "The Write-Ahead Logging (WAL) protocol requires that:",
    options: [
      "Data changes are written to disk before any log entry is recorded",
      "A log record describing a change must be written to stable storage BEFORE the actual data change is written to the database",
      "Logs are optional and used only for debugging purposes",
      "All transactions using WAL must be read-only"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "\"Write-ahead\" — the LOG comes first, before the actual change.",
    detailedSolution: `Before modifying the actual database, the DBMS first writes a log record describing that
change to durable storage. This guarantees that even if the system crashes right after the
data modification but before it's fully flushed to disk, the log record survives and can be
used during crash recovery to REDO the change (if committed) or UNDO it (if not).

This is exactly what makes the "Durability" guarantee in ACID achievable in practice —
without WAL, a crash could lose committed data with no way to recover it.`
  },
  {
    topicSlug: "dbms-acid-transactions", pattern: "Savepoints",
    title: "Savepoints in a Transaction",
    questionText: "What does a SAVEPOINT allow you to do within a single transaction?",
    options: [
      "Permanently commit part of the transaction while the rest continues",
      "Roll back to a specific intermediate point within the transaction, undoing only the changes after it, without aborting the whole transaction",
      "Skip the isolation level entirely for that one transaction",
      "Automatically retry the transaction if it fails"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Think of it as a checkpoint you can rewind to, without losing everything before it.",
    detailedSolution: `A SAVEPOINT marks an intermediate point inside a transaction. If something goes wrong
later, you can ROLLBACK TO that savepoint — undoing only the work after it, while keeping
earlier work (still uncommitted, but not discarded) and continuing the transaction from
there.

Useful for complex transactions needing partial error recovery without discarding the whole
transaction. Note: nothing is committed until an explicit COMMIT — savepoints only give
partial rollback control within one still-open transaction, not partial durability.`
  },

  // ── DBMS: Normalization (batch 2) ─────────────────────────

  {
    topicSlug: "dbms-normalization", pattern: "Functional Dependency",
    title: "What Is a Functional Dependency?",
    questionText: "In a relation, \"A → B\" (A functionally determines B) means:",
    options: [
      "A and B must always have the exact same value",
      "For any two rows with the same value of A, they must also have the same value of B",
      "B must always come after A alphabetically",
      "A and B must belong to different tables"
    ],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "It's a constraint about what CAN'T happen — two rows can't share A but differ on B.",
    detailedSolution: `A → B means knowing the value of A tells you exactly what B must be — you can never have
two rows with the same A value but different B values. Example: StudentID → StudentName
(given a StudentID, there's exactly one correct StudentName).

Functional dependencies are the foundation normalization is built on — 1NF/2NF/3NF/BCNF are
all defined in terms of which functional dependencies are "allowed" to exist without
causing anomalies.`
  },
  {
    topicSlug: "dbms-normalization", pattern: "Anomalies",
    title: "Update, Insert, and Delete Anomalies",
    questionText: "An unnormalized table (StudentID, StudentName, CourseID, CourseName, Instructor) repeats CourseName/Instructor for every enrolled student. What problem does this cause?",
    options: [
      "No problem — this is the most efficient possible design",
      "Update anomaly (changing an instructor requires updating every row for that course, risking inconsistency), plus similar insert/delete anomalies",
      "The table becomes impossible to query with SQL",
      "The database automatically fixes this at query time"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "What happens if the instructor changes for a popular course with 200 enrolled students?",
    detailedSolution: `UPDATE anomaly: changing the instructor for one course means updating EVERY row for that
course — miss one, and now data is inconsistent (two different instructors listed for the
"same" course). INSERT anomaly: you can't add a new course until at least one student
enrolls (since course info is embedded in student rows). DELETE anomaly: if the last student
for a course drops it, you lose ALL information about that course as a side effect.

Normalization (splitting into Students, Courses, and Enrollments tables) fixes all three by
storing each fact exactly once.`
  },
  {
    topicSlug: "dbms-normalization", pattern: "Normal Forms",
    title: "0NF / Unnormalized Form",
    questionText: "A table with a column holding MULTIPLE values in a single cell (e.g., a \"PhoneNumbers\" column storing \"9876543210, 8765432109\" as one string) violates:",
    options: [
      "BCNF only",
      "First Normal Form (1NF) — which requires every column to hold a single, atomic value per row",
      "Nothing — this is a perfectly valid relational design",
      "Only the naming convention, not the actual structure"
    ],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "1NF's core rule is about ATOMIC values — one value per cell.",
    detailedSolution: `1NF requires every attribute to contain a single, atomic (indivisible) value per row — no
repeating groups, no comma-separated lists stuffed into one cell.

The fix: either split into multiple columns if the count is fixed and small, or — the
standard relational fix — move phone numbers into a SEPARATE table (StudentID,
PhoneNumber) with one row per phone number, linked by a foreign key.`
  },
  {
    topicSlug: "dbms-normalization", pattern: "Normal Forms",
    title: "Candidate Key and Prime Attribute",
    questionText: "A \"prime attribute\" is:",
    options: [
      "Any attribute whose data type is an integer",
      "Any attribute that is part of at least one candidate key of the relation",
      "The single most important column in a table, subjectively chosen",
      "An attribute that can never contain NULL"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "This term matters specifically for precisely defining 2NF and 3NF.",
    detailedSolution: `A candidate key is any minimal set of attributes that can uniquely identify a row (a table
can have multiple candidate keys; one is chosen as the PRIMARY key). A prime attribute is
any attribute belonging to at least one candidate key.

This distinction matters because 2NF and 3NF are defined in terms of dependencies involving
NON-prime attributes — e.g., 2NF forbids a non-prime attribute depending on only part of a
composite candidate key.`
  },
  {
    topicSlug: "dbms-normalization", pattern: "BCNF",
    title: "Boyce-Codd Normal Form (BCNF) Definition",
    questionText: "A relation is in BCNF if, for every non-trivial functional dependency A → B:",
    options: [
      "B must be a prime attribute",
      "A must be a superkey of the relation — every determinant must be a candidate key or a superset of one",
      "A and B must belong to the same candidate key",
      "There must be no functional dependencies at all"
    ],
    correctAnswerIndex: 1, difficulty: "Hard",
    hintText: "BCNF is essentially \"every determinant must be a key\" — a stricter version of 3NF.",
    detailedSolution: `BCNF requires: for every non-trivial functional dependency A → B, A must be a superkey
(something that could, by itself, uniquely determine every other attribute).

This is stricter than 3NF, which permits A → B even if A is NOT a superkey, as long as B is
a prime attribute. This is exactly the gap between 3NF and BCNF — a relation can satisfy 3NF
but still violate BCNF if it has an FD where the determinant isn't a superkey but the
dependent happens to be prime.`
  },
  {
    topicSlug: "dbms-normalization", pattern: "4NF",
    title: "Multi-Valued Dependency and 4NF",
    questionText: "Fourth Normal Form (4NF) specifically eliminates which redundancy that BCNF does NOT address?",
    options: [
      "Repeating groups within a single cell",
      "Multi-valued dependencies — where two independent \"many\" facts combined in one table cause redundant combinations",
      "Transitive dependencies between non-key attributes",
      "Partial dependencies on a composite key"
    ],
    correctAnswerIndex: 1, difficulty: "Hard",
    hintText: "This is about a table combining two UNRELATED \"many\" relationships, causing a combinatorial blow-up.",
    detailedSolution: `Example: a table (Employee, Skill, Language) where an employee can have multiple skills AND
multiple languages, independently of each other. Storing all combinations (every skill
paired with every language for that employee) creates massive redundancy even though it may
satisfy BCNF.

4NF fixes this by requiring such independent multi-valued facts to be split into SEPARATE
tables (Employee-Skill, Employee-Language) rather than combined in one.`
  },
  {
    topicSlug: "dbms-normalization", pattern: "Denormalization",
    title: "When Denormalization Makes Sense",
    questionText: "In which scenario is deliberately DENORMALIZING a schema (adding controlled redundancy back) a reasonable trade-off?",
    options: [
      "Never — normalization should always be maximized regardless of use case",
      "In read-heavy analytical/reporting systems where JOIN cost across many normalized tables becomes a bottleneck, and update frequency is low",
      "Only when storing binary files",
      "Only when the database has fewer than 10 rows"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Think about a data warehouse serving complex reporting queries with heavy joins.",
    detailedSolution: `Normalization minimizes redundancy and update anomalies, but each additional normal form
typically means MORE tables and MORE joins to answer a query — hurting read performance,
especially for analytical workloads.

Denormalization deliberately reintroduces some redundancy (pre-joining commonly-needed
data, storing a computed total) to speed up reads, accepting more complex updates and some
consistency risk. Common in data warehouses and read-heavy systems where writes are
infrequent relative to reads.`
  },
  {
    topicSlug: "dbms-normalization", pattern: "ER to Relational",
    title: "Converting a Many-to-Many Relationship",
    questionText: "When converting an ER diagram's MANY-TO-MANY relationship into relational tables, what is the standard approach?",
    options: [
      "Add a foreign key directly into one of the two entity tables",
      "Create a separate junction/bridge table with foreign keys to both entities, plus any relationship-specific attributes",
      "Merge both entities into a single combined table",
      "Many-to-many relationships cannot be represented relationally at all"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "A single foreign key column can only reference ONE row — not enough for \"many-to-many.\"",
    detailedSolution: `A foreign key column can only point to ONE row in another table, which works for
one-to-many (put the FK on the "many" side). For many-to-many, you need a separate JUNCTION
table with a composite key made of foreign keys referencing BOTH entities — e.g., a
"StudentCourse" table with (StudentID, CourseID).

Any attributes specific to the relationship itself (enrollment date, grade) live in this
junction table too.`
  },
  {
    topicSlug: "dbms-normalization", pattern: "Composite Key",
    title: "Partial Dependency Explained",
    questionText: "A \"partial dependency\" specifically requires:",
    options: [
      "Any functional dependency at all, on any key",
      "A composite (multi-column) candidate key, where a non-prime attribute depends on only PART of it, not the whole thing",
      "A dependency between two different tables",
      "A dependency involving a NULL value"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "This concept literally cannot exist if the key is a single column — it needs a MULTI-column key.",
    detailedSolution: `Partial dependency requires a composite candidate key — say (StudentID, CourseID) — where
some non-prime attribute depends on only part of it. Example: if StudentName depends only on
StudentID (not the full StudentID+CourseID combination), that's a partial dependency.

This is exactly what 2NF forbids: every non-prime attribute must depend on the WHOLE
candidate key. If the primary key is a single column, partial dependency is structurally
impossible.`
  },
  {
    topicSlug: "dbms-normalization", pattern: "Lossless Decomposition",
    title: "Lossless Join Decomposition",
    questionText: "When decomposing a table into two smaller tables during normalization, what must hold for the decomposition to be \"lossless\"?",
    options: [
      "Both resulting tables must have exactly the same number of rows as the original",
      "Joining the two resulting tables back together must reproduce exactly the original table, with no extra or missing rows",
      "The decomposition must use exactly two columns per table",
      "No decomposition can ever truly be lossless"
    ],
    correctAnswerIndex: 1, difficulty: "Hard",
    hintText: "\"Lossless\" means you can always get back to where you started by joining.",
    detailedSolution: `A decomposition is lossless if re-joining the pieces (via natural join on common
attributes) reconstructs EXACTLY the original relation — no spurious extra rows, nothing
missing. A "lossy" decomposition would introduce fake rows on join, silently corrupting
query results.

The formal test: a decomposition into R1 and R2 is lossless if the common attributes of R1
and R2 form a superkey of at least one of them.`
  },
  {
    topicSlug: "dbms-normalization", pattern: "Dependency Preservation",
    title: "Dependency-Preserving Decomposition",
    questionText: "A decomposition is \"dependency-preserving\" if:",
    options: [
      "It creates the maximum possible number of tables",
      "All original functional dependencies can still be checked using only the decomposed tables, without needing to join them first",
      "No functional dependencies exist in the decomposed tables",
      "Every resulting table has exactly one functional dependency"
    ],
    correctAnswerIndex: 1, difficulty: "Hard",
    hintText: "Can you still ENFORCE the original rules just by looking at each smaller table individually?",
    detailedSolution: `If dependency-preserving, every original functional dependency can be checked within just
ONE resulting table — no expensive join needed to verify it, keeping constraint enforcement
efficient.

A decomposition can be LOSSLESS but NOT dependency-preserving (BCNF decompositions
sometimes sacrifice this). 3NF decomposition, by contrast, always guarantees BOTH
losslessness AND dependency preservation — one reason 3NF is often the practical "sweet
spot" even though BCNF is technically stricter.`
  },
  {
    topicSlug: "dbms-normalization", pattern: "Trivial vs Non-trivial FD",
    title: "Trivial Functional Dependency",
    questionText: "A functional dependency A → B is called \"trivial\" if:",
    options: [
      "It involves fewer than 3 attributes total",
      "B is a SUBSET of A (e.g., {StudentID, Name} → StudentID) — automatically true, providing no new information",
      "A and B belong to different tables",
      "It was defined by mistake during schema design"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Could this dependency be true no matter what the actual data is?",
    detailedSolution: `A → B is trivial if B ⊆ A — automatically, unconditionally true regardless of the actual
data (e.g., {StudentID, Name} → StudentID, since StudentID is already part of the left
side).

Trivial dependencies carry no real information about data structure and are excluded when
checking normal form definitions — only NON-trivial dependencies (where B is NOT a subset
of A) actually constrain the data and matter for normalization analysis.`
  },

  // ── DBMS: Indexing (batch 2) ──────────────────────────────

  {
    topicSlug: "dbms-indexing", pattern: "Index Basics",
    title: "What Is a Database Index?",
    questionText: "A database index is best understood as:",
    options: [
      "A duplicate copy of the entire table, kept purely for backup",
      "A separate data structure mapping column values to the physical location of matching rows, avoiding a full table scan",
      "A constraint that prevents duplicate rows",
      "A type of nightly database backup"
    ],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "Think of a book's index — it maps a term to a page number, so you don't read the whole book.",
    detailedSolution: `An index is a separate structure (commonly a B+ Tree) storing sorted column values
alongside pointers to where full rows live. Without one, matching rows requires a FULL TABLE
SCAN. With an appropriate index, the database can jump nearly straight to matches, turning
an O(n) scan into something closer to O(log n).

Cost: indexes take extra storage and slow writes slightly, since the index itself must also
be updated on every INSERT/UPDATE/DELETE.`
  },
  {
    topicSlug: "dbms-indexing", pattern: "Primary Key Index",
    title: "Primary Key and Indexing",
    questionText: "What happens automatically, in most relational databases, when you declare a PRIMARY KEY on a column?",
    options: [
      "Nothing — you must manually create an index separately",
      "The database automatically creates an index (often the clustered index) on that column",
      "The column becomes permanently read-only",
      "All other columns in the table get indexed too"
    ],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "Primary keys are looked up so often that databases don't leave this to chance.",
    detailedSolution: `Because primary keys are used constantly — lookups, joins, foreign key enforcement —
virtually every relational database automatically creates an index the moment you declare
one (often specifically the clustered index, meaning table rows are physically stored in
primary-key order).

This is why primary key lookups (WHERE id = 5) are typically fast by default, without any
extra setup.`
  },
  {
    topicSlug: "dbms-indexing", pattern: "Composite Index",
    title: "Composite (Multi-Column) Index",
    questionText: "A composite index is created on columns (LastName, FirstName), in that order. Which query can efficiently use it?",
    options: [
      "WHERE FirstName = 'John' (searching by FirstName alone)",
      "WHERE LastName = 'Smith' AND FirstName = 'John' (or just WHERE LastName = 'Smith') — since LastName is the leading column",
      "Neither query can use this index at all",
      "Both queries are equally fast regardless of column order"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "This connects directly to the \"leftmost prefix\" idea — the LEADING column matters most.",
    detailedSolution: `A composite index on (LastName, FirstName) is physically sorted first by LastName, then by
FirstName within each LastName group. So it efficiently supports queries filtering on
LastName alone, or LastName+FirstName together.

A query filtering ONLY on FirstName generally CANNOT use this index efficiently — FirstName
values are scattered throughout rather than grouped, so the database would need to scan the
whole index anyway.`
  },
  {
    topicSlug: "dbms-indexing", pattern: "Unique Index",
    title: "Unique Index vs Regular Index",
    questionText: "What is the key difference between a UNIQUE index and a regular (non-unique) index?",
    options: [
      "A unique index is always faster for every type of query",
      "A unique index also enforces that no two rows share the same indexed value, in addition to speeding up lookups",
      "A unique index can only ever be created on a primary key",
      "A unique index cannot be used inside a WHERE clause"
    ],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "One of these ALSO acts as a data-integrity constraint, not just a performance tool.",
    detailedSolution: `A regular index exists purely for performance. A UNIQUE index does that too, but ALSO
enforces a constraint: any insert/update that would create a duplicate value in the indexed
column(s) is rejected.

This is exactly the mechanism underlying UNIQUE and PRIMARY KEY constraints — declaring
either causes the database to create a unique index behind the scenes to enforce it.`
  },
  {
    topicSlug: "dbms-indexing", pattern: "Index Cardinality",
    title: "Index Cardinality and Selectivity",
    questionText: "An index on a \"Gender\" column (only 2 distinct values) across 1 million rows is generally:",
    options: [
      "Extremely effective — fewer distinct values always means a better index",
      "Not very effective — low cardinality means each lookup still matches roughly half the table, so a full scan may actually be faster",
      "Effective only for INSERT operations, never SELECT",
      "Automatically converted into a unique index by the database"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Cardinality = number of DISTINCT values. What does an index buy you with only 2 possible values?",
    detailedSolution: `High cardinality (e.g., an email column, nearly all unique) makes indexes very effective — a
lookup narrows to just a few matching rows. Low cardinality (Gender, a boolean flag) makes
an index much less useful — "Gender = Male" still matches roughly half the table.

The query optimizer often decides a full table scan is actually faster than an index lookup
in this case, avoiding the overhead of jumping between the index and the table for hundreds
of thousands of matches.`
  },
  {
    topicSlug: "dbms-indexing", pattern: "Index Maintenance Cost",
    title: "Why Too Many Indexes Slow Down Writes",
    questionText: "Why does adding many indexes to a table slow down INSERT/UPDATE/DELETE operations?",
    options: [
      "It doesn't — indexes only ever affect SELECT performance",
      "Every index on a table must also be updated whenever the underlying data changes, adding extra work to every write",
      "Indexes automatically lock the entire database during any write",
      "Indexes convert all write operations into read operations"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "What has to stay in sync every time a row is added, changed, or removed?",
    detailedSolution: `An index must stay consistent with the table's data. Every INSERT adds an entry to EVERY
index on the table; every UPDATE to an indexed column updates its index entry; every DELETE
removes entries from every relevant index.

A table with 10 indexes pays roughly 10x the index-maintenance overhead per write compared
to a table with 1. This is why indexing is a trade-off: index columns you actually
query/filter/join on frequently, but avoid indexing everything "just in case," especially
on write-heavy tables.`
  },
  {
    topicSlug: "dbms-indexing", pattern: "Index Usage",
    title: "Function on Indexed Column Prevents Index Use",
    questionText: "A query uses WHERE YEAR(order_date) = 2024 on a table with a regular index on order_date. What typically happens?",
    options: [
      "The index is used efficiently, exactly as if comparing order_date directly",
      "The index generally cannot be used efficiently, since YEAR() is applied before comparison and the index only stores raw values",
      "The query fails to execute at all",
      "The database automatically rewrites the query to avoid the function"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "The index stores raw order_date values — it has no idea what YEAR(order_date) equals without computing it.",
    detailedSolution: `A regular index on order_date stores raw date values in sorted order, with no precomputed
knowledge of YEAR(order_date). Wrapping the indexed column in a function means the database
typically has to evaluate that function for every row (a full scan), unless the database
specifically supports function-based indexes.

Practical fix: rewrite as WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01' —
same logical result, but index-friendly.`
  },
  {
    topicSlug: "dbms-indexing", pattern: "Full Text Index",
    title: "When to Use a Full-Text Index",
    questionText: "A regular B+ Tree index is poorly suited for which kind of search?",
    options: [
      "WHERE id = 5 (an exact match on a key)",
      "Searching for whether a word appears anywhere inside a large text/article column",
      "WHERE price BETWEEN 10 AND 50 (a range query)",
      "ORDER BY created_at (sorting)"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "B+ Trees excel at exact matches and ranges over ordered values — but a word buried in a paragraph isn't naturally \"sorted.\"",
    detailedSolution: `B+ Tree indexes excel at exact-match lookups, range queries, and sorting, because indexed
values are naturally orderable and comparable. Searching for a word anywhere within free
text doesn't fit that model — you can't meaningfully sort paragraphs to binary-search for a
substring.

This is what FULL-TEXT indexes are built for — specialized structures (often inverted
indexes) purpose-built for text search, supported as a distinct index type from the standard
B+ Tree.`
  },
  {
    topicSlug: "dbms-indexing", pattern: "B+ Tree Structure",
    title: "Why B+ Tree Leaf Nodes Are Linked",
    questionText: "In a B+ Tree index, leaf nodes are typically linked in a doubly linked list. Why?",
    options: [
      "Purely for redundancy/backup purposes",
      "It makes RANGE queries efficient — once you find the starting point, you can walk sequentially along the linked leaves instead of re-traversing the tree",
      "It allows the tree to store more data than an unlinked structure",
      "It prevents the tree from ever needing to rebalance"
    ],
    correctAnswerIndex: 1, difficulty: "Hard",
    hintText: "Think about how you'd answer a RANGE query if the leaves were NOT connected at all.",
    detailedSolution: `Without linked leaves, a range query would require traversing the tree from the root
separately for every matching value — very wasteful. With leaves linked in sorted order,
the database finds the starting value once (a single root-to-leaf traversal), then follows
linked-list pointers sequentially to collect the rest.

This is exactly why B+ Trees (not plain B-Trees, which lack leaf-linking) are the standard
choice for database indexes specifically.`
  },
  {
    topicSlug: "dbms-indexing", pattern: "Index on Foreign Key",
    title: "Indexing Foreign Key Columns",
    questionText: "Why is it usually good practice to index a FOREIGN KEY column, even though databases don't always create one automatically?",
    options: [
      "Foreign keys are always indexed automatically in every database, so this is unnecessary",
      "Without an index, JOINs and cascading DELETE/UPDATE checks on the referenced table can require a full scan of the referencing table",
      "Foreign keys must always be unique, requiring an index by definition",
      "It has no measurable performance impact — only stylistic value"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Think about what the database has to check every time you try to delete a row other rows might reference.",
    detailedSolution: `Unlike primary keys, many databases don't automatically index foreign key columns. Without
one, two things get slow: JOINs on that foreign key require scanning the whole referencing
table; and whenever a referenced row is deleted or its key updated, the database must check
the referencing table for dependents (to enforce or cascade the change) — without an index,
that's a full table scan.

This is why explicitly indexing foreign key columns is considered a standard best practice.`
  },
  {
    topicSlug: "dbms-indexing", pattern: "Sparse vs Dense Index",
    title: "Sparse vs Dense Index",
    questionText: "What is the difference between a DENSE index and a SPARSE index?",
    options: [
      "They are the same thing, just different names",
      "A dense index has an entry for every record; a sparse index has entries for only some records, relying on sorted data to locate nearby records from there",
      "A sparse index is always faster than a dense index for every query",
      "Dense indexes can only be built on numeric columns"
    ],
    correctAnswerIndex: 1, difficulty: "Hard",
    hintText: "\"Dense\" = every single row gets an entry. \"Sparse\" = only some do.",
    detailedSolution: `A dense index has one entry per record — guarantees direct lookup for every row, but takes
more space. A sparse index has entries for only some records — typically one per physical
data block — relying on the underlying data being sorted so that once you find the nearest
sparse entry, you can scan a small local region to find the exact record.

Sparse indexes trade a small amount of extra scanning per lookup for significantly less
index storage overhead, which matters more as tables grow.`
  },
  {
    topicSlug: "dbms-indexing", pattern: "Index Selectivity in Query Optimizer",
    title: "How the Query Optimizer Chooses to Use an Index",
    questionText: "A query optimizer decides WHETHER to use an available index mainly based on:",
    options: [
      "Whichever index was created first, in creation order",
      "The estimated SELECTIVITY of the condition — how small a fraction of rows the lookup is expected to match, weighed against index-vs-table jump overhead",
      "Alphabetical order of the involved column names",
      "The optimizer always uses every available index on every query, regardless of the condition"
    ],
    correctAnswerIndex: 1, difficulty: "Hard",
    hintText: "An index isn't automatically used just because it EXISTS — the optimizer estimates whether it will actually help.",
    detailedSolution: `The optimizer maintains statistics about data distribution and uses them to ESTIMATE how
selective a condition is — what fraction of the table a WHERE clause is likely to match. If
only a small fraction matches, using the index is far cheaper than a full scan.

But if a large fraction is estimated to match (low selectivity), the overhead of repeatedly
jumping between the index and the actual table rows can make a full table scan genuinely
faster — so the optimizer may deliberately choose to IGNORE an available index in that case.`
  },

  // ── CN: OSI / TCP-IP Model (batch 2) ──────────────────────

  {
    topicSlug: "cn-osi-tcpip", pattern: "Layers",
    title: "Session Layer Role",
    questionText: "What is the primary responsibility of the OSI Session Layer?",
    options: [
      "Encrypting data for transmission",
      "Establishing, managing, and terminating sessions between two communicating applications, including synchronization checkpoints",
      "Routing packets between different networks",
      "Physical transmission of bits over a cable"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Think about managing the \"conversation\" itself, not the data inside it or the network path.",
    detailedSolution: `Session Layer (Layer 5) manages the "conversation" between two applications — opening a
session, keeping it synchronized (e.g., inserting checkpoints so a large file transfer can
resume from the last checkpoint instead of restarting entirely after a failure), and
properly closing it.

Distinct from the Transport Layer below it (reliable delivery) and the Presentation Layer
above it (data formatting/encryption). In practice, the TCP/IP model doesn't have a
distinct Session Layer — this is often handled within the application itself.`
  },
  {
    topicSlug: "cn-osi-tcpip", pattern: "Layers",
    title: "Network Layer Responsibility",
    questionText: "Which OSI layer is responsible for logical addressing (IP addresses) and routing packets across multiple networks?",
    options: ["Data Link Layer", "Network Layer", "Transport Layer", "Physical Layer"],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "This is the layer routers primarily operate at.",
    detailedSolution: `The Network Layer (Layer 3) handles logical addressing (IP addresses) and routing —
determining the best path for a packet across multiple interconnected networks to reach its
destination.

This is distinct from the Data Link Layer (Layer 2), which handles physical/MAC addressing
and delivery within a SINGLE local network segment only. Routers operate primarily at the
Network Layer, using IP addresses to forward packets between networks.`
  },
  {
    topicSlug: "cn-osi-tcpip", pattern: "Layers",
    title: "Data Link Layer Responsibility",
    questionText: "The Data Link Layer is primarily responsible for:",
    options: [
      "End-to-end reliable delivery across the entire internet",
      "Node-to-node delivery within a single local network segment, using MAC addresses, plus error detection",
      "Assigning IP addresses to devices",
      "Rendering a webpage in a browser"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "This layer works with MAC addresses, not IP addresses.",
    detailedSolution: `The Data Link Layer (Layer 2) handles delivery between two directly connected nodes on the
SAME local network using physical (MAC) addresses — not IP addresses, which belong to the
Network Layer above it. It also handles framing and error detection (like CRC checksums) to
catch corrupted frames.

Switches operate primarily at this layer, using MAC addresses to forward frames within a
local network.`
  },
  {
    topicSlug: "cn-osi-tcpip", pattern: "Encapsulation",
    title: "PDU Names Per Layer",
    questionText: "As data moves down the OSI stack, what is the data unit called specifically at the Transport Layer?",
    options: ["Frame", "Segment (TCP) or Datagram (UDP)", "Packet", "Bit"],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Each layer has its own specific name for \"data unit at this layer.\"",
    detailedSolution: `The Protocol Data Unit (PDU) name changes at each layer as headers get added: Application
data → Segment (Transport Layer, TCP) or Datagram (UDP) → Packet (Network Layer, after
adding the IP header) → Frame (Data Link Layer, after adding the MAC header) → Bits
(Physical Layer, the actual transmitted signal).

Precise terminology matters for describing exactly which layer's header is being discussed
in networking problems.`
  },
  {
    topicSlug: "cn-osi-tcpip", pattern: "DHCP",
    title: "DHCP Purpose",
    questionText: "What does DHCP (Dynamic Host Configuration Protocol) do?",
    options: [
      "Translates domain names to IP addresses",
      "Automatically assigns IP addresses and other network configuration to devices joining a network, without manual setup",
      "Encrypts network traffic",
      "Routes packets between different networks"
    ],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "This is why most devices \"just work\" on a network without any manual IP configuration.",
    detailedSolution: `DHCP eliminates manual IP configuration — when a device joins a network, it broadcasts a
DHCP request, and a DHCP server responds by "leasing" it an available IP address (plus
subnet mask, default gateway, DNS server info) for a limited time.

Contrast: DNS translates domain names to IPs — a completely different job, easy to confuse
with DHCP by name similarity alone.`
  },
  {
    topicSlug: "cn-osi-tcpip", pattern: "ICMP",
    title: "Purpose of ICMP",
    questionText: "What is ICMP (Internet Control Message Protocol) primarily used for?",
    options: [
      "Transferring files between two hosts",
      "Sending error messages and diagnostic/control information — such as the basis of the ping command — rather than carrying application data",
      "Encrypting HTTP traffic",
      "Assigning IP addresses to new devices"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Think about what happens behind the scenes when you run the ping command.",
    detailedSolution: `ICMP isn't used to transfer regular application data — it's a control/diagnostic protocol.
It's how routers report problems back to a sender (e.g., "Destination Unreachable" if a
route fails, "Time Exceeded" if a packet's TTL hits zero).

It's also literally the protocol underlying ping and traceroute: ping sends ICMP Echo
Request messages and listens for ICMP Echo Reply messages to test reachability and measure
round-trip time.`
  },
  {
    topicSlug: "cn-osi-tcpip", pattern: "Ports",
    title: "Well-Known Port Numbers",
    questionText: "Which port number is the standard \"well-known\" port for HTTPS?",
    options: ["21", "443", "25", "80"],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "HTTP uses 80. HTTPS is a different, specific, memorable number.",
    detailedSolution: `Well-known ports (0-1023) are standardized for common services: HTTP = 80, HTTPS = 443,
FTP = 21 (control), SMTP (email sending) = 25, SSH = 22, DNS = 53.

These conventions let clients connect to standard services without needing to know a custom
port number in advance — typing "https://example.com" implicitly means "connect to
example.com on port 443."`
  },
  {
    topicSlug: "cn-osi-tcpip", pattern: "Layers",
    title: "Application Layer Examples",
    questionText: "Which of the following operates at the OSI Application Layer?",
    options: [
      "IP addressing",
      "HTTP, FTP, SMTP — protocols that directly serve end-user applications",
      "MAC addressing",
      "Electrical voltage signaling"
    ],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "This is the topmost layer, closest to what the user is actually doing.",
    detailedSolution: `The Application Layer (Layer 7) is the topmost layer, closest to the actual user-facing
application — protocols here directly support what the user is doing: HTTP for web
browsing, FTP for file transfer, SMTP for sending email, DNS for name resolution.

Lower layers handle progressively more "plumbing" concerns (formatting, session management,
reliable delivery, routing, physical transmission) that the application itself doesn't need
to worry about directly.`
  },
  {
    topicSlug: "cn-osi-tcpip", pattern: "TCP/IP Model",
    title: "TCP/IP Model Layer Count",
    questionText: "The TCP/IP model, as commonly taught, condenses the OSI model's 7 layers into how many layers?",
    options: [
      "3",
      "4 (Network Interface, Internet, Transport, Application)",
      "7, identical to OSI",
      "10"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "The TCP/IP model merges several OSI layers into broader combined layers.",
    detailedSolution: `The TCP/IP model has 4 layers: Network Interface (combining OSI's Physical + Data Link),
Internet (equivalent to OSI's Network layer), Transport (same concept as OSI's Transport
layer), and Application (combining OSI's Session + Presentation + Application).

OSI is more of a detailed theoretical/teaching reference model; TCP/IP is the model actually
implemented on the real internet — which is why "the internet doesn't really have a
distinct Session Layer" is a fair statement in TCP/IP terms, even though OSI defines one.`
  },
  {
    topicSlug: "cn-osi-tcpip", pattern: "MAC Address",
    title: "MAC Address vs IP Address",
    questionText: "What is the key difference between a MAC address and an IP address?",
    options: [
      "They are the same thing, just different formats",
      "A MAC address is a fixed, hardware-level physical address (Layer 2); an IP address is a logical, assignable address (Layer 3) that changes based on which network a device joins",
      "MAC addresses are used only for internet traffic; IP addresses only for local networks",
      "IP addresses never change, while MAC addresses always do"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "One stays fixed as you move between networks; the other changes.",
    detailedSolution: `A MAC (Media Access Control) address is tied to the network interface hardware itself — a
Layer 2, physical-level identifier that stays the same as the device moves between
different networks. An IP address is a Layer 3, LOGICAL address assigned based on which
network you're currently connected to — it changes as you move networks (different IP at
home vs. a coffee shop), even though your MAC address stays constant.

Both are needed: IP gets a packet to the right NETWORK, MAC gets the frame to the right
DEVICE within that local network.`
  },
  {
    topicSlug: "cn-osi-tcpip", pattern: "Encapsulation",
    title: "Why Encapsulation Happens",
    questionText: "As data travels DOWN the OSI/TCP-IP stack for transmission, why does each layer add its own header?",
    options: [
      "To make the data larger for no functional reason",
      "Each layer adds the control info IT needs for its job (e.g., Transport adds ports, Network adds IP addresses, Data Link adds MAC addresses); the receiving peer layer reads and strips its matching header",
      "To compress the data at each layer",
      "To encrypt the data at every single layer"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Each layer only needs to understand its OWN small piece of the puzzle.",
    detailedSolution: `Each layer encapsulates the data from the layer above by wrapping it with its OWN header
containing exactly the info that layer needs — Transport header has port numbers, Network
header has IP addresses, Data Link header has MAC addresses.

On the receiving end, each layer's corresponding peer reads and strips off its OWN header
before passing the remaining data up — this is called DE-encapsulation, and it's how the
receiving side reconstructs the original data while each layer only handles its own piece.`
  },
  {
    topicSlug: "cn-osi-tcpip", pattern: "Physical Layer",
    title: "Physical Layer Responsibility",
    questionText: "The OSI Physical Layer is responsible for:",
    options: [
      "Routing packets between different networks",
      "The actual transmission of raw bits over a physical medium — voltage levels, timing, physical connectors",
      "Assigning domain names to devices",
      "Encrypting application data"
    ],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "This is the lowest layer, dealing purely with raw signal transmission.",
    detailedSolution: `The Physical Layer (Layer 1) is the lowest layer — it deals purely with the actual physical
transmission of raw bits: voltage levels representing 0s and 1s on a copper cable, light
pulses in fiber optics, radio frequency modulation for Wi-Fi, connector/cable specs (like
RJ45 for Ethernet).

It has no concept of "addresses" or "packets" at all — every layer above it exists to give
structure and meaning to that raw bit stream.`
  },

  // ── CN: TCP/UDP (batch 2) ──────────────────────────────────

  {
    topicSlug: "cn-tcp-udp", pattern: "Congestion Control",
    title: "TCP Congestion Control",
    questionText: "What is the purpose of TCP's congestion control mechanism (e.g., slow start)?",
    options: [
      "To encrypt data during transmission",
      "To avoid overwhelming the NETWORK by gradually increasing send rate and backing off when packet loss suggests congestion",
      "To choose the shortest physical route to the destination",
      "To assign port numbers to applications"
    ],
    correctAnswerIndex: 1, difficulty: "Hard",
    hintText: "This is different from FLOW CONTROL, which protects the RECEIVER, not the network.",
    detailedSolution: `Congestion control protects the NETWORK itself from being overwhelmed (distinct from flow
control, which protects the RECEIVER from data it can't process fast enough). TCP's "slow
start" begins sending conservatively and exponentially increases the rate as long as no
packet loss occurs; when loss IS detected (interpreted as network congestion), TCP backs off
significantly before cautiously ramping back up.

This adaptive behavior is why TCP is considered network-friendly, unlike a protocol that
blindly sends at maximum speed regardless of network conditions.`
  },
  {
    topicSlug: "cn-tcp-udp", pattern: "Sequence Numbers",
    title: "Purpose of TCP Sequence Numbers",
    questionText: "What do TCP sequence numbers allow the receiver to do?",
    options: [
      "Encrypt the data being received",
      "Reorder segments that arrive out of order, and detect missing segments based on gaps in the sequence",
      "Choose which application should receive the data",
      "Determine the sender's exact geographic location"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "IP itself gives no guarantee about ordering or delivery — TCP has to add that on top.",
    detailedSolution: `IP packets can arrive out of order or get lost, since IP itself makes no ordering or
delivery guarantee. TCP assigns each byte of data a sequence number, so the receiver can
reorder out-of-sequence segments before passing data to the application, and detect gaps
(missing segments) by noticing a jump in sequence numbers — triggering a retransmission
request.

This mechanism is exactly what gives TCP its "reliable, ordered delivery" guarantee that
UDP does not provide.`
  },
  {
    topicSlug: "cn-tcp-udp", pattern: "ACK",
    title: "TCP Acknowledgment Number",
    questionText: "A TCP ACK with acknowledgment number = 5001 tells the sender:",
    options: [
      "Exactly 5001 bytes were lost and need retransmission",
      "The receiver has successfully received all bytes up through byte 5000, and is now expecting byte 5001 next",
      "The connection has been closed",
      "The sender should stop sending data permanently"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Think of the ACK number as \"next byte I'm expecting,\" not \"bytes received so far.\"",
    detailedSolution: `TCP's ACK number represents the NEXT byte the receiver expects — meaning everything up to
(ACK number − 1) has been successfully received. So ACK=5001 means bytes 1 through 5000
arrived successfully.

If the sender doesn't receive an updated ACK within an expected time, it assumes the
corresponding data was lost and retransmits it — this feedback loop is central to how TCP
achieves reliable delivery.`
  },
  {
    topicSlug: "cn-tcp-udp", pattern: "UDP Use Cases",
    title: "Why DNS Often Uses UDP",
    questionText: "Why does DNS typically use UDP rather than TCP for its queries?",
    options: [
      "DNS queries and responses are usually small and time-sensitive; UDP's lack of handshake overhead makes it more efficient",
      "UDP is inherently more secure than TCP",
      "DNS cannot function over TCP under any circumstances",
      "TCP does not support port numbers"
    ],
    correctAnswerIndex: 0, difficulty: "Medium",
    hintText: "Think about what TCP requires BEFORE it can send even a single byte of actual data.",
    detailedSolution: `TCP requires a three-way handshake before any actual data is exchanged — extra round trips
that add latency. For a typical small DNS query, that handshake overhead is proportionally
significant. UDP has no handshake at all — send the query, get the response, done.

DNS CAN fall back to TCP for larger responses or zone transfers between servers — it's not
that DNS can't use TCP, just that UDP is the default for the common, latency-sensitive
case.`
  },
  {
    topicSlug: "cn-tcp-udp", pattern: "TCP Header Fields",
    title: "TCP Header Overhead",
    questionText: "A standard TCP header (without options) is how many bytes, compared to UDP's 8-byte header?",
    options: [
      "8 bytes, identical to UDP",
      "20 bytes — reflecting the extra fields TCP needs for reliability",
      "100 bytes",
      "4 bytes, smaller than UDP"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "TCP needs room for sequence numbers, ACK numbers, window size, and flags — UDP doesn't.",
    detailedSolution: `TCP's minimum header is 20 bytes (can grow larger with options), versus UDP's fixed 8-byte
header. The extra ~12 bytes carry exactly what's needed for reliable, ordered,
flow-controlled delivery: sequence number, acknowledgment number, window size, control flags
(SYN/ACK/FIN/RST, etc.).

UDP skips all of this — a deliberately minimal "fire and forget" header, which is exactly
why it has lower overhead but no reliability guarantees.`
  },
  {
    topicSlug: "cn-tcp-udp", pattern: "Socket",
    title: "What Uniquely Identifies a TCP Connection?",
    questionText: "A single TCP connection between two hosts is uniquely identified by which combination?",
    options: [
      "Just the destination IP address",
      "The 4-tuple: source IP, source port, destination IP, destination port",
      "Just the port number, regardless of IP addresses",
      "Just the MAC addresses of both devices"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "How does a web server distinguish 1000 different browsers all connecting on port 443 at once?",
    detailedSolution: `A TCP connection is uniquely identified by source IP + source port + destination IP +
destination port — the "4-tuple" (sometimes called a socket pair).

This is exactly how a web server handles thousands of simultaneous connections all arriving
on the SAME destination port (443 for HTTPS): each client has a different source IP and/or
port, so each connection's 4-tuple is unique, letting the OS route packets to the right
connection even though they share a destination port.`
  },
  {
    topicSlug: "cn-tcp-udp", pattern: "TCP Flags",
    title: "Purpose of the SYN Flag",
    questionText: "In TCP, what does the SYN flag signal?",
    options: [
      "The connection is being terminated",
      "A request to synchronize sequence numbers and initiate a new connection — the first step of the three-way handshake",
      "The receiver's buffer is full",
      "An error occurred during transmission"
    ],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "\"SYN\" is short for \"synchronize\" — it's literally what it says.",
    detailedSolution: `SYN kicks off a new TCP connection — it tells the receiving side "I want to establish a
connection, and here's my initial sequence number."

The three-way handshake: SYN (client → server), SYN-ACK (server → client, acknowledging AND
sending its own SYN), ACK (client → server, acknowledging the server's SYN) — after this,
both sides have agreed on initial sequence numbers and the connection is established.`
  },
  {
    topicSlug: "cn-tcp-udp", pattern: "Window Size",
    title: "TCP Sliding Window",
    questionText: "TCP's \"sliding window\" mechanism is primarily used for:",
    options: [
      "Choosing which port number to use",
      "Flow control — letting the receiver tell the sender how much unacknowledged data it can handle at once",
      "Selecting the network route",
      "Encrypting the payload"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "This protects the RECEIVER from being flooded faster than it can process data.",
    detailedSolution: `The sliding window is how TCP implements flow control: the receiver advertises a "window
size" — how many bytes of unacknowledged data it's willing to accept at once, based on
available buffer space. The sender can send up to that many bytes without waiting for an
ACK, then must wait as the window "slides forward" with each acknowledgment.

If the receiver's buffer fills up, it can advertise a smaller (even zero) window, telling
the sender to slow down or pause.`
  },
  {
    topicSlug: "cn-tcp-udp", pattern: "Multiplexing",
    title: "Port Numbers and Multiplexing",
    questionText: "What role do TCP/UDP port numbers play for a machine running multiple network applications?",
    options: [
      "They determine which physical network cable is used",
      "They let the OS deliver incoming data to the correct application/process — multiple apps share one IP but use different ports",
      "They encrypt traffic on a per-application basis",
      "They assign a unique MAC address per application"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "An IP address identifies a MACHINE — what identifies a specific APPLICATION on that machine?",
    detailedSolution: `An IP address identifies a specific machine, but a single machine typically runs MANY
network applications simultaneously — port numbers let the OS distinguish between them and
deliver incoming data to the correct process.

This is multiplexing/demultiplexing: the Transport layer uses the port number to know
exactly which application's socket should receive each incoming segment, even though they
all arrive at the same IP address.`
  },
  {
    topicSlug: "cn-tcp-udp", pattern: "Reliable vs Unreliable",
    title: "Why UDP Has No Retransmission",
    questionText: "UDP does not retransmit lost packets. Why might an application deliberately choose UDP anyway?",
    options: [
      "UDP guarantees packets arrive faster than the speed of light",
      "For real-time applications (video calls, live streaming, gaming), a late/retransmitted packet is often WORSE than a dropped one — that moment has already passed",
      "UDP is simply a newer protocol than TCP",
      "Applications never actually get to choose their own protocol"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "For a live video call, is old retransmitted data useful, or is it better to just skip it and move on?",
    detailedSolution: `For real-time applications, a dropped packet describing a fraction of a second of
video/audio is often better simply skipped — waiting for TCP-style retransmission would
introduce a delay, and by the time the retransmitted data arrives, that moment has already
passed and become useless.

This is exactly why VoIP, live video streaming, and many online multiplayer games use UDP:
they'd rather have occasional glitches than the stuttering delay reliable-delivery
retransmission would introduce.`
  },
  {
    topicSlug: "cn-tcp-udp", pattern: "Checksum",
    title: "TCP/UDP Checksum Purpose",
    questionText: "What does the checksum field in a TCP or UDP header detect?",
    options: [
      "Whether the sender's IP address is valid",
      "Whether the segment/datagram's data was corrupted during transmission — a lightweight, best-effort check",
      "Whether the receiver's port is currently open",
      "The exact round-trip time of the connection"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "This is a basic corruption check, not a guarantee of delivery.",
    detailedSolution: `The checksum is computed from the segment/datagram's contents (header + data). The receiver
recomputes it on arrival and compares — a mismatch means the data was corrupted in transit
and should be discarded.

This is a lightweight, best-effort check — not cryptographically strong, but cheap and
catches most real-world transmission errors. For TCP, a checksum failure typically leads to
the segment being dropped and eventually retransmitted; for UDP, a failed datagram is simply
discarded with no automatic retry.`
  },
  {
    topicSlug: "cn-tcp-udp", pattern: "Half-Close",
    title: "TCP Connection Termination — Half-Close",
    questionText: "During TCP termination, one side sends a FIN while still being able to RECEIVE data from the other side. What is this called?",
    options: [
      "Full duplex termination",
      "Half-close — one direction is closed while the other direction can remain open and actively transferring data",
      "A connection reset",
      "A protocol violation"
    ],
    correctAnswerIndex: 1, difficulty: "Hard",
    hintText: "TCP connections are actually TWO independent data streams, one each direction — can one close while the other stays open?",
    detailedSolution: `TCP connections are logically full-duplex — two independent data streams, one per
direction. A "half-close" happens when one side sends a FIN ("I'm done sending"), but the
OTHER side hasn't sent its own FIN yet — that side can still send data, and the first side
can still receive it, even though it won't send anything more itself.

Full termination requires FIN+ACK in BOTH directions — this is why TCP termination often
involves 4 separate steps rather than always a clean simultaneous close.`
  },

  // ── CN: IP Addressing & Subnetting (batch 2) ──────────────

  {
    topicSlug: "cn-ip-subnetting", pattern: "Subnet Mask",
    title: "What a Subnet Mask Does",
    questionText: "What is the purpose of a subnet mask (e.g., 255.255.255.0)?",
    options: [
      "It encrypts the IP address",
      "It defines which portion of an IP address is the NETWORK and which is the HOST, letting devices determine if another address is on the same local network",
      "It assigns a MAC address to a device",
      "It's used only for IPv6, never IPv4"
    ],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "It separates an IP address into two conceptual parts.",
    detailedSolution: `Applied bitwise against an IP address, a subnet mask separates the address into a network
portion and a host portion — e.g., 255.255.255.0 means the first 24 bits identify the
network, the last 8 bits identify a specific host within it.

This lets a device determine, before sending a packet, whether the destination is on its
OWN local network (send directly) or a different network (send via the default gateway) — a
fundamental decision in how IP routing works at the device level.`
  },
  {
    topicSlug: "cn-ip-subnetting", pattern: "Default Gateway",
    title: "Purpose of a Default Gateway",
    questionText: "What is a \"default gateway\" used for?",
    options: [
      "It's the address of the DNS server",
      "It's the router a device sends traffic to when the destination is on a DIFFERENT network than its own",
      "It only handles traffic within the local network",
      "It automatically assigns IP addresses (DHCP's job)"
    ],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "This is the \"exit point\" for traffic headed outside the local network.",
    detailedSolution: `When a device determines (via the subnet mask) that a destination IP is NOT on its own
local network, it sends the packet to its configured default gateway (typically the local
router), which forwards it onward toward the actual destination, potentially through
several more routers.

Without a correctly configured default gateway, a device can only communicate with others
on its own local network segment — nothing beyond it, including the internet.`
  },
  {
    topicSlug: "cn-ip-subnetting", pattern: "Broadcast Address",
    title: "Purpose of the Broadcast Address",
    questionText: "In a subnet like 192.168.1.0/24, what is the special purpose of the last address, 192.168.1.255?",
    options: [
      "It's reserved for the router only",
      "It's the broadcast address — a packet sent to it is delivered to every host on that local subnet",
      "It's always the DNS server's address",
      "It cannot be used or assigned for any purpose"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "The FIRST address in a subnet also has a reserved purpose — what might the last one mirror?",
    detailedSolution: `In a subnet, the FIRST address (all host bits = 0) identifies the network itself, and the
LAST address (all host bits = 1) is the broadcast address — a packet sent to it is delivered
to every device on that local subnet.

This is why usable host addresses in a subnet are typically 2 fewer than the raw address
count — a /24 subnet has 256 total addresses, but only 254 usable for actual hosts, since
the first and last are reserved.`
  },
  {
    topicSlug: "cn-ip-subnetting", pattern: "Subnetting Calculation",
    title: "Number of Subnets from Borrowed Bits",
    questionText: "If you borrow 3 bits from the host portion of a /24 network to create subnets, how many subnets result?",
    options: ["3", "8 (2\u00b3)", "24", "6"],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Borrowing n bits creates 2^n subnets.",
    detailedSolution: `Borrowing n bits from the host portion to extend the network portion creates 2^n possible
subnets. Borrowing 3 bits gives 2^3 = 8 subnets.

Each resulting subnet has fewer bits remaining for hosts than the original (a /24 becomes a
/27 — reducing host bits from 8 to 5, meaning 2^5 − 2 = 30 usable hosts per subnet instead
of 254). This trade-off — more, smaller subnets vs fewer, larger ones — is the core of
subnetting design decisions.`
  },
  {
    topicSlug: "cn-ip-subnetting", pattern: "IPv4 vs IPv6",
    title: "Why IPv6 Was Introduced",
    questionText: "What is the main motivation behind IPv6's introduction?",
    options: [
      "IPv6 makes internet traffic faster than IPv4 in every case",
      "IPv4's ~4.3 billion possible addresses are effectively exhausted; IPv6's 128-bit space provides a vastly larger pool",
      "IPv6 is simply a rebranding of IPv4 with no technical differences",
      "IPv6 was introduced purely for better encryption"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Think about how many devices are connected to the internet today, versus IPv4's fixed 32-bit space.",
    detailedSolution: `IPv4 uses 32-bit addresses (~4.3 billion possible addresses) — nowhere near enough for the
modern world's phones, laptops, IoT devices, and servers (mitigated for years via NAT, but
that's a workaround, not a real solution).

IPv6 uses 128-bit addresses, providing an astronomically larger address space (~3.4×10^38
addresses) — designed to make address exhaustion a non-issue for the foreseeable future,
along with a simplified header format and other improvements.`
  },
  {
    topicSlug: "cn-ip-subnetting", pattern: "Loopback Address",
    title: "Purpose of the Loopback Address",
    questionText: "What is the IPv4 loopback address (127.0.0.1) used for?",
    options: [
      "Routing traffic to the nearest DNS server",
      "Letting a device send network traffic to ITSELF, useful for testing local network software",
      "Serving as the default gateway on every network",
      "Reserved exclusively for broadcast traffic"
    ],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "\"Loopback\" — the traffic loops right back to where it came from.",
    detailedSolution: `127.0.0.1 (the whole 127.0.0.0/8 range) is reserved as the loopback address — traffic sent
to it stays entirely within the sending device, never touching a physical network
interface.

A developer running a local web server can access it via http://127.0.0.1 (or "localhost")
to test it exactly as a real client would, without needing any actual network connectivity.`
  },
  {
    topicSlug: "cn-ip-subnetting", pattern: "ARP",
    title: "Purpose of ARP",
    questionText: "What problem does ARP (Address Resolution Protocol) solve?",
    options: [
      "Translating domain names into IP addresses",
      "Finding the MAC address corresponding to a known IP address on the local network",
      "Automatically assigning IP addresses to new devices",
      "Encrypting traffic between two hosts"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "You know the destination's IP — but delivering a frame locally needs its MAC address too.",
    detailedSolution: `A device knows the destination's IP address, but delivering a frame within a local network
segment requires the destination's MAC address (Layer 2). ARP bridges this gap: the sender
broadcasts an ARP request ("who has IP address X?"), and the device with that IP responds
with its MAC address, which the sender caches in its ARP table.

This resolution step happens before the very first frame can be delivered to a new
destination on the local network.`
  },
  {
    topicSlug: "cn-ip-subnetting", pattern: "Reserved Address Ranges",
    title: "APIPA / Link-Local Address",
    questionText: "If a device fails to get an address from a DHCP server, what range (169.254.x.x) might it self-assign?",
    options: [
      "A public, internet-routable address",
      "An APIPA (link-local) address, allowing basic communication with other devices on the SAME local network",
      "The loopback address",
      "A broadcast-only address that cannot be assigned to any device"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "This is a fallback specifically for when DHCP can't be reached.",
    detailedSolution: `When DHCP fails, many operating systems automatically self-assign an address from the
reserved 169.254.0.0/16 range (APIPA / link-local addressing) as a fallback.

This lets devices on the same local network segment still communicate with EACH OTHER (since
they'd likely all self-assign from the same range) even though none have real,
internet-routable addresses — useful for basic troubleshooting, but a 169.254.x.x address
in normal operation is a strong sign something is wrong with DHCP.`
  },
  {
    topicSlug: "cn-ip-subnetting", pattern: "Subnetting Calculation",
    title: "Subnet Mask from Prefix Length",
    questionText: "What is the dotted-decimal subnet mask equivalent of the CIDR prefix /26?",
    options: ["255.255.255.0", "255.255.255.192", "255.255.0.0", "255.255.255.255"],
    correctAnswerIndex: 1, difficulty: "Hard",
    hintText: "/26 means 26 network bits, leaving 6 host bits — convert the last octet's binary pattern to decimal.",
    detailedSolution: `/26 means the first 26 bits are network bits. The first 3 octets (24 bits) are entirely
network (255.255.255), leaving 2 more network bits inside the 4th octet.

The 4th octet with the first 2 bits set to 1 and the rest 0: 11000000 = 192. So /26 =
255.255.255.192, leaving 6 host bits → 2^6 − 2 = 62 usable host addresses per subnet.`
  },
  {
    topicSlug: "cn-ip-subnetting", pattern: "Public vs Private",
    title: "Why NAT Is Needed with Private IPs",
    questionText: "Devices using private IPs (like 192.168.x.x) generally cannot reach the public internet directly. Why is NAT the standard fix?",
    options: [
      "Private IP addresses are technically invalid and unusable for any purpose",
      "Private addresses aren't globally unique/routable on the internet; NAT translates them to a shared public IP at the network boundary",
      "NAT encrypts traffic for security purposes",
      "NAT assigns MAC addresses to private devices"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "The same private address is reused inside millions of different local networks worldwide.",
    detailedSolution: `Private IP ranges (like 192.168.0.0/16, 10.0.0.0/8) are reserved for use WITHIN local
networks and aren't globally unique — the same 192.168.1.5 is reused inside millions of
different home networks, so it can't be used directly for internet routing.

NAT solves this at the network boundary (usually the home/office router): it rewrites the
source address of outbound packets to the router's single public IP, and keeps a translation
table to route responses back to the right internal device.`
  },
  {
    topicSlug: "cn-ip-subnetting", pattern: "Multicast Address",
    title: "Multicast vs Broadcast vs Unicast",
    questionText: "How does multicast addressing differ from broadcast?",
    options: [
      "They are the same thing with different names",
      "Multicast delivers to a specific GROUP of opted-in recipients; broadcast delivers to EVERY device on the local network regardless of interest",
      "Broadcast is more efficient than multicast for every use case",
      "Multicast only works within a single device, never across a network"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Think of a video stream sent only to subscribed viewers, versus blasting to literally everyone.",
    detailedSolution: `Unicast: one sender to one specific receiver. Broadcast: one sender to EVERY device on the
local network, whether they want the data or not. Multicast: one sender to a specific GROUP
of receivers who explicitly joined that group (e.g., IPTV streaming) — everyone else on the
network is unaffected.

Multicast is more efficient than sending individual unicast copies, while being far more
targeted than a network-wide broadcast to uninterested devices.`
  },
  {
    topicSlug: "cn-ip-subnetting", pattern: "VLSM",
    title: "VLSM (Variable Length Subnet Masking)",
    questionText: "What problem does VLSM solve compared to using one fixed subnet mask for an entire network?",
    options: [
      "It makes every subnet exactly the same size, for simplicity",
      "It lets different subnets use DIFFERENT prefix lengths sized to each subnet's actual number of hosts, avoiding wasted addresses",
      "It eliminates the need for subnetting entirely",
      "It only applies to IPv6, never IPv4"
    ],
    correctAnswerIndex: 1, difficulty: "Hard",
    hintText: "Does a point-to-point link between two routers really need the same subnet size as a department with 100 employees?",
    detailedSolution: `A fixed subnet size for an entire organization wastes addresses — a point-to-point WAN link
between two routers only needs 2 usable addresses, but a fixed /24 subnet would waste 252
addresses on that link alone.

VLSM allows different subnets to use different prefix lengths based on actual need — a
small /30 subnet for point-to-point links, a larger /24 or /23 for a big department —
matching subnet size to actual requirements and conserving IPv4's limited address space.`
  },

  // ── OOPS: Principles (batch 2) ────────────────────────────

  {
    topicSlug: "oops-principles", pattern: "Inheritance",
    title: "Why Inheritance? (Code Reuse)",
    questionText: "What is the primary benefit of using inheritance in OOP?",
    options: [
      "It makes programs run faster at the CPU level",
      "It lets a subclass reuse (and extend/override) the fields and methods of a parent class, avoiding duplicated code",
      "It automatically encrypts a class's internal data",
      "It removes the need for constructors entirely"
    ],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "Think about shared behavior across related classes, like Dog and Cat both being Animals.",
    detailedSolution: `Inheritance lets a subclass automatically get the fields and methods of its parent, then
add new ones or override existing ones as needed — instead of copy-pasting shared logic
into every related class. If Dog and Cat both extend Animal, shared behavior (eat(),
sleep()) lives once in Animal, while Dog and Cat only define what's actually DIFFERENT.

This reduces code duplication and centralizes shared logic — fix a bug in Animal's eat(),
and every subclass automatically benefits.`
  },
  {
    topicSlug: "oops-principles", pattern: "Polymorphism",
    title: "What Is Polymorphism?",
    questionText: "\"Polymorphism\" literally means \"many forms.\" What does this refer to in OOP practice?",
    options: [
      "A class having many different constructors",
      "The ability for the SAME method call/interface to behave differently depending on the actual object it's called on",
      "A variable holding values of many unrelated types simultaneously",
      "Having many unrelated classes that happen to share the same name"
    ],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "Think of calling draw() on a list of different Shape objects.",
    detailedSolution: `Polymorphism means the same method call (through a common interface or parent class
reference) produces different, type-appropriate behavior depending on the ACTUAL object
underneath. Calling shape.draw() on a list of Circle, Square, and Triangle objects — each
executes ITS OWN version of draw(), even though the calling code just says "draw()"
uniformly.

This lets code work generically with a family of related types while each type still
behaves correctly per its own implementation.`
  },
  {
    topicSlug: "oops-principles", pattern: "Inheritance",
    title: "Diamond Problem in Multiple Inheritance",
    questionText: "The \"Diamond Problem\" in multiple inheritance refers to:",
    options: [
      "A performance issue unrelated to inheritance structure",
      "Ambiguity when a class inherits from two parents that both inherit from the SAME common ancestor — which version of a member should be used?",
      "A syntax error that always prevents multiple inheritance from compiling",
      "A design pattern for organizing class hierarchies"
    ],
    correctAnswerIndex: 1, difficulty: "Hard",
    hintText: "Picture 4 classes shaped like a diamond — one common ancestor, two parents, one child inheriting from both.",
    detailedSolution: `If class D inherits from both B and C, and both B and C inherit from a common class A, D
effectively has TWO paths to A's members — ambiguous if B and C each overrode something
from A differently.

This is why Java doesn't allow multiple inheritance of CLASSES at all (only single class
inheritance, though multiple INTERFACE implementation is allowed). C++ does allow multiple
class inheritance and has to explicitly handle this ambiguity via "virtual inheritance."`
  },
  {
    topicSlug: "oops-principles", pattern: "Encapsulation",
    title: "Encapsulation via Access Modifiers",
    questionText: "How do access modifiers (private, protected, public) support the principle of encapsulation?",
    options: [
      "They control how fast a method executes",
      "They restrict which parts of the code can directly access a class's internal fields, forcing interaction through controlled public methods instead",
      "They determine the memory address of a variable",
      "They have no relationship to encapsulation at all"
    ],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "This is the language-level tool that actually enforces the encapsulation principle.",
    detailedSolution: `Encapsulation bundles data with the methods that operate on it, and restricts direct
outside access to that data's internal representation. Marking fields private prevents
outside code from directly reading/writing them; outside code must instead go through
public methods (getters/setters) the class controls.

This lets the class validate input, maintain invariants, or even change its internal
representation later without breaking dependent code — the public interface stays the same
even if the private internals change.`
  },
  {
    topicSlug: "oops-principles", pattern: "Abstraction",
    title: "Abstraction — Hiding Complexity",
    questionText: "What does \"abstraction\" mean in the context of OOP?",
    options: [
      "Making a class impossible to instantiate under any circumstances",
      "Exposing only the essential, relevant features of an object while hiding complex implementation details behind a simpler interface",
      "Converting a class into an abstract data type stored on disk",
      "Removing all methods from a class"
    ],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "Think about driving a car — steering wheel and pedals, without needing to know the engine internals.",
    detailedSolution: `Abstraction focuses on WHAT an object does, hiding HOW it does it internally. Driving a
car is the classic analogy: you interact with a simple interface (steering wheel, pedals)
without understanding the internal combustion engine or transmission mechanics.

In code, this often means exposing a small, clean set of public methods while keeping
complex implementation details private — callers use the simple interface without needing
to understand (or being able to break) the internals.`
  },
  {
    topicSlug: "oops-principles", pattern: "SOLID Principles",
    title: "Single Responsibility Principle",
    questionText: "The Single Responsibility Principle (the \"S\" in SOLID) states that:",
    options: [
      "A class should have as many responsibilities as possible, for efficiency",
      "A class should have only ONE reason to change — responsible for a single, well-defined piece of functionality",
      "Every program should have exactly one class total",
      "A method should only ever return a single value"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "A change to one concern shouldn't force a change to unrelated code in the same class.",
    detailedSolution: `A class following SRP has one clear, focused job — and consequently, only one reason it
would ever need modification. A class that calculates pay AND saves to a database AND
formats printing has THREE bundled responsibilities — a printing-format change shouldn't
require touching pay-calculation logic, but in this design, it risks doing so.

Splitting into separate classes (PayCalculator, EmployeeRepository, PayrollFormatter) means
each changes only when ITS specific concern changes.`
  },
  {
    topicSlug: "oops-principles", pattern: "SOLID Principles",
    title: "Open/Closed Principle",
    questionText: "The Open/Closed Principle (the \"O\" in SOLID) states that software entities should be:",
    options: [
      "Open for modification, closed for extension",
      "Open for EXTENSION, but closed for MODIFICATION — add new behavior without changing existing, tested code",
      "Open to being deleted at any time",
      "Closed to all forms of inheritance"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Modifying working code always risks breaking functionality that used to work correctly.",
    detailedSolution: `You should be able to add new functionality by EXTENDING a system (e.g., a new subclass or
new interface implementation) rather than by MODIFYING existing, already-tested code, since
modifying working code always risks introducing new bugs.

A common way to achieve this: define behavior through abstractions, and add new
capabilities by creating new implementations of those abstractions rather than adding more
if/else branches inside an existing class every time a new case appears.`
  },
  {
    topicSlug: "oops-principles", pattern: "Composition vs Inheritance",
    title: "Composition Over Inheritance",
    questionText: "The design guideline \"favor composition over inheritance\" suggests:",
    options: [
      "Never use inheritance under any circumstances",
      "When possible, build complex behavior by combining objects (a class HAS-A reference to another it delegates to) rather than deep inheritance hierarchies",
      "Always use exactly one level of inheritance, never more",
      "Composition and inheritance are the exact same technique"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Composition lets you swap the composed object at runtime; inheritance is fixed at compile time.",
    detailedSolution: `Inheritance creates a tight, permanent IS-A relationship fixed at compile time — deep
hierarchies can become rigid (changing a base class can ripple unpredictably through many
subclasses). Composition (a class HAS-A reference and delegates to it) is more flexible —
swap the composed object at runtime, combine behaviors freely, and avoid pitfalls like the
Diamond Problem.

This doesn't mean "never use inheritance" — consider composition first, and reach for
inheritance when a genuine, stable IS-A relationship exists.`
  },
  {
    topicSlug: "oops-principles", pattern: "Interface",
    title: "Why Interfaces Enable Loose Coupling",
    questionText: "How do interfaces help achieve \"loose coupling\" between different parts of a program?",
    options: [
      "Interfaces make code run on multiple threads automatically",
      "Code depending on an INTERFACE doesn't need to know which actual implementation it's using — implementations can be swapped without changing dependent code",
      "Interfaces eliminate the need for testing entirely",
      "Interfaces automatically optimize memory usage"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "This is exactly what makes mock-based unit testing practical.",
    detailedSolution: `Code depending on a concrete class directly is tightly coupled to that SPECIFIC
implementation. Code depending on an INTERFACE (a contract describing WHAT operations are
available, not HOW) lets any implementing class be substituted without touching the
dependent code at all.

This is exactly what makes dependency injection and mock-based unit testing practical —
swap in a test/mock implementation during testing, the real one in production, with calling
code staying identical either way.`
  },
  {
    topicSlug: "oops-principles", pattern: "Static Binding vs Dynamic Binding",
    title: "Static Binding vs Dynamic Binding",
    questionText: "What is the difference between static binding and dynamic binding of a method call?",
    options: [
      "Static binding happens at runtime; dynamic binding happens at compile time",
      "Static binding: the method is determined at COMPILE time (overloaded/private/static methods); dynamic binding: determined at RUNTIME (overridden methods)",
      "They are identical, just used in different programming languages",
      "Static binding only applies to interfaces"
    ],
    correctAnswerIndex: 1, difficulty: "Hard",
    hintText: "One is decided by the compiler ahead of time; the other needs to know the actual object at runtime.",
    detailedSolution: `Static (early) binding: the compiler determines exactly which method will be called at
compile time — used for method overloading, private methods, static methods. Dynamic (late)
binding: the actual method invoked is determined at runtime, based on the real object's
type — this is what makes runtime polymorphism/method overriding actually work.

This underlying mechanism (often a "vtable" in C++/Java) is what lets
\`Animal ref = new Dog(); ref.speak();\` correctly call Dog's speak() even though ref is
declared as type Animal.`
  },
  {
    topicSlug: "oops-principles", pattern: "Object Slicing",
    title: "Object Slicing (C++ Concept)",
    questionText: "In C++, \"object slicing\" occurs when:",
    options: [
      "A derived class object is assigned to a base class object (by value), losing the derived-specific portion and polymorphic behavior",
      "An object is deleted before it's fully constructed",
      "A class is split across two separate source files",
      "An array of objects is sorted incorrectly"
    ],
    correctAnswerIndex: 0, difficulty: "Hard",
    hintText: "This happens specifically when copying a derived object INTO a base object BY VALUE, not via pointer or reference.",
    detailedSolution: `If you assign a Derived object to a Base object BY VALUE (not through a pointer or
reference), only the Base portion gets copied — the Derived-specific data/behavior is
"sliced off" and lost. Virtual method calls on that base object will use Base's behavior,
not Derived's, because the object genuinely IS just a Base object now.

This is exactly why polymorphism in C++ requires pointers or references to the base class
(e.g., \`Base* ptr = new Derived();\`) rather than base-class objects by value.`
  },
  {
    topicSlug: "oops-principles", pattern: "Abstract Class",
    title: "Can an Abstract Class Have a Constructor?",
    questionText: "Can an abstract class have a constructor, even though it can never be directly instantiated?",
    options: [
      "No, abstract classes can never have any constructor at all",
      "Yes — the constructor runs when a concrete subclass is instantiated, via the implicit or explicit super() call",
      "Only if the class has zero fields",
      "Only in languages that don't support inheritance"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Think about who actually CALLS an abstract class's constructor, even though \"new AbstractClass()\" is illegal.",
    detailedSolution: `While you can never write \`new AbstractClass()\` directly, when a concrete SUBCLASS is
instantiated, its constructor implicitly (or explicitly, via super(...)) calls the abstract
parent's constructor first, as part of building the full object.

This lets the abstract class properly initialize whatever fields/state IT is responsible
for, even though only fully concrete subclasses can ever be instantiated as complete
objects. "Abstract" means "cannot be instantiated directly," not "has no constructor logic
at all."`
  },

  // ── OOPS: Classes & Objects (batch 2) ─────────────────────

  {
    topicSlug: "oops-classes-objects", pattern: "Constructors",
    title: "Default Constructor",
    questionText: "If a class defines no constructors at all, what happens?",
    options: [
      "The class can never be instantiated",
      "The compiler automatically provides a default (no-argument) constructor that does nothing beyond default field initialization",
      "The class automatically gets a copy constructor instead",
      "A compile-time error always occurs"
    ],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "But this stops happening the moment you define ANY constructor yourself.",
    detailedSolution: `If you define zero constructors, most OOP languages (Java, C++) automatically generate a
default, no-argument constructor that initializes fields to their defaults (0, null, false)
and calls the parent's default constructor.

Important: the moment you define ANY constructor yourself (even a parameterized one), the
compiler STOPS auto-generating the default one — if you still want a no-argument
constructor available too, you must write it yourself explicitly.`
  },
  {
    topicSlug: "oops-classes-objects", pattern: "Constructors",
    title: "Constructor Chaining",
    questionText: "\"Constructor chaining\" refers to:",
    options: [
      "Linking multiple unrelated classes together",
      "One constructor calling another constructor of the SAME class (this(...)) or the PARENT's constructor (super(...)), to reuse initialization logic",
      "A constructor that never finishes executing",
      "Combining two classes into a single constructor"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "This avoids duplicating the same initialization logic across multiple overloaded constructors.",
    detailedSolution: `Constructor chaining avoids duplicating initialization logic across multiple overloaded
constructors — a constructor with fewer parameters can call a more complete one with
default values (via this(...)), or a subclass constructor can explicitly invoke a specific
parent constructor (via super(...)) to ensure the parent's part of the object is set up
correctly first.

This keeps initialization logic centralized rather than repeated across every overload.`
  },
  {
    topicSlug: "oops-classes-objects", pattern: "Object Creation",
    title: "Object Creation and Memory (Heap vs Stack)",
    questionText: "In languages like Java, where are objects created with the new keyword typically stored?",
    options: [
      "Always on the stack, alongside local primitive variables",
      "On the HEAP — the reference variable may live on the stack, but the actual object data lives on the heap",
      "In a special \"object file\" on disk",
      "Directly inside the CPU's registers"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "The object itself and the REFERENCE to it are stored in two different places.",
    detailedSolution: `Writing \`Dog d = new Dog();\` allocates the actual Dog OBJECT on the HEAP, while the local
variable d (holding a reference to that heap location) typically lives on the stack.

This is why objects can outlive the method that created them (as long as something still
references them) while stack-allocated locals are automatically cleaned up when their
method returns. Garbage collection periodically reclaims heap memory for objects no longer
reachable from any live reference.`
  },
  {
    topicSlug: "oops-classes-objects", pattern: "Inner Classes",
    title: "Purpose of a Nested/Inner Class",
    questionText: "What is a common reason to define a class nested inside another class?",
    options: [
      "It's required syntax in every OOP language",
      "To logically group a helper class only meaningful in the context of its enclosing class, optionally with direct access to its private members",
      "To make the inner class run faster than a normal class",
      "To prevent the inner class from ever being instantiated"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Think of a LinkedList.Node class — meaningless outside the context of the LinkedList it belongs to.",
    detailedSolution: `A nested/inner class is useful when a helper class only makes sense in the context of its
enclosing class. A (non-static) inner class instance also typically gets automatic access
to its enclosing instance's private fields/methods, enabling tight collaboration without
exposing those internals to the rest of the codebase.

This keeps related code logically grouped and can improve encapsulation by hiding
implementation-detail classes from the broader public API.`
  },
  {
    topicSlug: "oops-classes-objects", pattern: "equals() and hashCode()",
    title: "Why Override equals() and hashCode() Together",
    questionText: "If you override equals() for a class, why is it important to also override hashCode() consistently?",
    options: [
      "It's not actually necessary — they're completely unrelated methods",
      "Hash-based collections rely on the contract that equal objects must have equal hash codes; breaking this causes incorrect behavior as map/set keys",
      "hashCode() is automatically regenerated whenever equals() changes",
      "Overriding equals() automatically disables hashCode()"
    ],
    correctAnswerIndex: 1, difficulty: "Hard",
    hintText: "Think about how a HashMap decides which \"bucket\" to look in for a key, and how it verifies a match.",
    detailedSolution: `Hash-based collections use hashCode() to find which "bucket" an object might be in, then
use equals() to confirm the exact match within that bucket. If two equals()-equal objects
have DIFFERENT hashCode() values, a HashMap might look in the wrong bucket entirely and
fail to find an object that should logically match.

The contract is strict: equal objects MUST produce equal hash codes (the reverse isn't
required — unequal objects CAN share a hash code, that's a "collision," expected and
handled).`
  },
  {
    topicSlug: "oops-classes-objects", pattern: "Final Keyword",
    title: "The final Keyword on Classes",
    questionText: "In Java, what does marking a CLASS as final mean?",
    options: [
      "The class cannot have any fields",
      "The class cannot be extended/subclassed by any other class",
      "The class can only have static methods",
      "The class is automatically thread-safe"
    ],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "Java's own String class is a well-known example of this.",
    detailedSolution: `A final class cannot be subclassed at all — no other class can extend it. Used when a
class's implementation should never be altered by inheritance (Java's String is final,
specifically to guarantee its immutability can never be silently changed by an overriding
subclass).

Contrast: a final FIELD can't be reassigned after initialization; a final METHOD can't be
overridden by a subclass — three related but distinct uses of the same keyword.`
  },
  {
    topicSlug: "oops-classes-objects", pattern: "Object Comparison",
    title: "== vs equals() for Object Comparison",
    questionText: "In Java, what is the difference between using == and .equals() to compare two objects?",
    options: [
      "They always produce identical results for every type",
      "== compares REFERENCE identity (same object in memory?); .equals() compares LOGICAL/content equality as defined by the class",
      ".equals() is only usable on primitive types",
      "== can only be used inside a constructor"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Two objects with identical field values can still be \"different\" by ==.",
    detailedSolution: `== checks whether two references point to the EXACT SAME object in memory — even two
objects with identical field values are considered "different" by == if they're separate
objects. .equals() checks LOGICAL equality — as defined by the class's own equals() method
(by default, Object's equals() just falls back to ==, unless a class overrides it, like
String does, to compare actual content).`
  },
  {
    topicSlug: "oops-classes-objects", pattern: "Instance Initialization Order",
    title: "Order of Field Initialization vs Constructor Execution",
    questionText: "When an object is created, in what order do parent initialization, field initializers, and constructor body execution happen?",
    options: [
      "Constructor body first, then fields, then parent",
      "Parent class fully initialized first → this class's field initializers run → then this class's constructor body executes",
      "All three happen simultaneously",
      "The order is random and unspecified"
    ],
    correctAnswerIndex: 1, difficulty: "Hard",
    hintText: "A subclass constructor implicitly or explicitly calls super() as its very first action.",
    detailedSolution: `(1) The PARENT class is fully initialized first (its fields, then its constructor body) —
because a subclass constructor implicitly or explicitly calls super() first. (2) THEN this
class's own field initializers run. (3) FINALLY this class's own constructor body executes.

This ordering guarantees that by the time a subclass's constructor body starts running, the
entire parent portion of the object is already fully set up and safe to use.`
  },
  {
    topicSlug: "oops-classes-objects", pattern: "toString() Method",
    title: "Purpose of Overriding toString()",
    questionText: "Why would you override the toString() method on a custom class in Java?",
    options: [
      "It's required for the class to compile at all",
      "By default, printing an object shows an unhelpful string like \"ClassName@1a2b3c\"; overriding it gives a meaningful, human-readable representation instead",
      "toString() controls how the object is stored in memory",
      "toString() is only used internally by the garbage collector"
    ],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "Think about what println(obj) shows for a class you haven't customized this on.",
    detailedSolution: `Every object inherits a default toString() from Object, returning something like
"ClassName@hashCodeInHex" — valid but not useful for debugging or display. Overriding it
lets a class define a meaningful text representation (a Point class might return "(3, 5)"
instead).

This is automatically used whenever the object is implicitly converted to a String — string
concatenation, println(), and many logging tools all call toString() behind the scenes.`
  },
  {
    topicSlug: "oops-classes-objects", pattern: "Access Modifiers Recap",
    title: "protected Access Modifier",
    questionText: "A member marked protected in Java is accessible from:",
    options: [
      "Only within the exact same class, nowhere else",
      "The same class, the same package, AND subclasses in OTHER packages",
      "Literally anywhere in any program, with zero restriction",
      "Nowhere — protected means completely inaccessible"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "This sits between package-private and public in terms of accessibility.",
    detailedSolution: `protected access is broader than package-private (default) access: it allows access from
the same class, the same package, AND additionally from SUBCLASSES even in a DIFFERENT
package.

This is specifically designed to support inheritance — a subclass anywhere can access its
parent's protected members to extend/customize behavior, while those members stay hidden
from unrelated, non-subclass code outside the package.`
  },
  {
    topicSlug: "oops-classes-objects", pattern: "Static Initialization Block",
    title: "Static Initialization Block",
    questionText: "What is a static initialization block used for in Java?",
    options: [
      "Initializing instance fields for every new object created",
      "Running one-time setup code for static fields/state, executed exactly once when the class is first loaded",
      "Replacing the need for any constructor entirely",
      "Running code after the program exits"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "This runs once per CLASS, not once per OBJECT created.",
    detailedSolution: `A static block (static { ... }) runs exactly ONCE, when the class is first loaded by the
JVM — regardless of how many objects are later created. Used for complex static field
initialization that can't be done in a single expression, e.g., populating a static lookup
table.

This is fundamentally different from a constructor, which runs once PER OBJECT, every time
new is called.`
  },
  {
    topicSlug: "oops-classes-objects", pattern: "Method Overloading Resolution",
    title: "Ambiguous Method Overload Resolution",
    questionText: "A class has overloaded methods process(int x) and process(long x). Calling process(5) invokes which one?",
    options: [
      "It's always ambiguous and causes a compile error",
      "process(int x) — the compiler prefers an EXACT type match over one requiring an implicit widening conversion",
      "process(long x), since long can hold larger values",
      "Both are called simultaneously"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "The compiler picks the overload matching the argument's ACTUAL type most precisely, before considering conversions.",
    detailedSolution: `When resolving overloaded methods, the compiler prefers an EXACT type match first. Since 5
is an int literal, process(int x) matches exactly with no conversion needed, so it's chosen
over process(long x), which would require an implicit widening conversion (int → long).

If only process(long x) existed, the compiler would apply the widening conversion
automatically. Ambiguity errors only occur when the compiler genuinely can't determine a
single "best" match.`
  },

  // ── OOPS: Exceptions & Patterns (batch 2) ─────────────────

  {
    topicSlug: "oops-exceptions-patterns", pattern: "Exception Hierarchy",
    title: "Exception Class Hierarchy",
    questionText: "In Java, both Exception and Error extend a common superclass. What is it?",
    options: ["RuntimeException", "Throwable — the root of the entire exception/error hierarchy", "Object directly, with no intermediate class", "IOException"],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "RuntimeException is itself a subclass of Exception, not the root of the whole hierarchy.",
    detailedSolution: `Throwable is the root of the whole hierarchy, with two direct subclasses: Exception
(conditions a reasonable application might want to catch and handle) and Error (serious
problems typically NOT meant to be caught by application code, like OutOfMemoryError).

RuntimeException is a subclass of Exception specifically (the "unchecked" branch) — not a
sibling of Exception, and not the root.`
  },
  {
    topicSlug: "oops-exceptions-patterns", pattern: "try-catch-finally",
    title: "Multiple catch Blocks Ordering",
    questionText: "If a try block can throw FileNotFoundException or its parent IOException, what determines valid catch order?",
    options: [
      "Order doesn't matter, Java resolves it automatically",
      "The more specific type (FileNotFoundException) must be caught BEFORE the more general one (IOException), or it's a compile error",
      "You can never catch two related exception types in the same try block",
      "The general exception must always come first"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "If the general catch came first, would the specific catch block ever actually run?",
    detailedSolution: `Putting catch (IOException e) BEFORE catch (FileNotFoundException e) is flagged as a
compile error — since FileNotFoundException IS-A IOException, the broader catch would
already match, making the more specific catch unreachable dead code.

Catch blocks must be ordered from MOST specific to MOST general, so each block actually
gets a chance to handle exceptions it's uniquely suited for.`
  },
  {
    topicSlug: "oops-exceptions-patterns", pattern: "try-with-resources",
    title: "try-with-resources",
    questionText: "What problem does Java's \"try-with-resources\" syntax solve?",
    options: [
      "It makes try blocks execute faster",
      "It automatically calls close() on a resource when the try block exits, even on exception, eliminating a manual finally block just for cleanup",
      "It prevents any exceptions from ever being thrown",
      "It removes the need for a catch block entirely, always"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Think about how error-prone it is to remember manual cleanup in EVERY possible exit path.",
    detailedSolution: `Before try-with-resources, safely closing a resource required a finally block explicitly
calling close() — easy to forget, awkward with multiple resources. try-with-resources
(try (Resource r = ...) { ... }) automatically calls close() when the try block exits for
ANY reason, as long as the resource implements AutoCloseable.

This eliminates a whole common class of resource-leak bugs, like a file handle staying
open because an exception skipped past the cleanup code.`
  },
  {
    topicSlug: "oops-exceptions-patterns", pattern: "Custom Exceptions",
    title: "Rethrowing an Exception",
    questionText: "What does it mean to \"rethrow\" an exception inside a catch block?",
    options: [
      "Automatically retrying the operation that caused the exception",
      "Catching an exception to log it or do partial cleanup, then explicitly throwing it again (or wrapped) so it keeps propagating up the call stack",
      "Converting the exception into a return value instead",
      "Permanently suppressing the exception so it's never seen again"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Sometimes catching isn't about fully handling — it's about doing something limited, then letting it continue.",
    detailedSolution: `A method may catch an exception not to fully handle it, but to log it or add context, then
let it continue propagating — either rethrowing the same exception (throw e;) or wrapping
it in a more meaningful type (throw new ServiceException("...", e);, preserving the
original as the "cause").

This is common in layered architectures, where a low-level exception gets translated into a
higher-level, more meaningful one as it crosses architectural boundaries.`
  },
  {
    topicSlug: "oops-exceptions-patterns", pattern: "Strategy Pattern",
    title: "Strategy Pattern",
    questionText: "The Strategy design pattern is used to:",
    options: [
      "Ensure a class has only one instance",
      "Define a family of interchangeable algorithms, encapsulate each, and let the client swap which one to use at runtime",
      "Notify multiple objects automatically when one object's state changes",
      "Provide a simplified interface to a complex subsystem"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Think of a checkout flow that can pay via credit card, PayPal, or bank transfer.",
    detailedSolution: `Strategy defines a common interface for a family of interchangeable algorithms (payment
methods, sorting algorithms), each in a separate class. Client code depends only on the
common interface and can swap which concrete strategy is used at RUNTIME without any
changes to itself.

This avoids large if/else chains for selecting behavior, and adding a new strategy is just
writing a new class — a nice real-world tie to the Open/Closed Principle.`
  },
  {
    topicSlug: "oops-exceptions-patterns", pattern: "Decorator Pattern",
    title: "Decorator Pattern",
    questionText: "The Decorator design pattern allows you to:",
    options: [
      "Create exactly one instance of a class",
      "Dynamically add new behavior to an individual object at runtime by wrapping it, without modifying the original class",
      "Convert one interface into another incompatible interface",
      "Restrict access to an object's methods"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Think of a base Coffee object wrapped by a MilkDecorator, then a SugarDecorator.",
    detailedSolution: `Decorator adds behavior to a SPECIFIC object instance by wrapping it in decorator objects
implementing the same interface, delegating to it while adding their own behavior. A base
Coffee object wrapped by MilkDecorator (adds milk's cost) then SugarDecorator (adds sugar's
cost) — combinations composed at runtime.

This avoids modifying the original class or creating a combinatorial explosion of
subclasses (CoffeeWithMilk, CoffeeWithSugar, CoffeeWithMilkAndSugar, ...).`
  },
  {
    topicSlug: "oops-exceptions-patterns", pattern: "Adapter Pattern",
    title: "Adapter Pattern",
    questionText: "The Adapter design pattern's main purpose is to:",
    options: [
      "Create a single shared instance of a class",
      "Convert the interface of an existing class into another interface client code expects, letting incompatible classes work together",
      "Notify observers when an object's state changes",
      "Restrict which methods can be called on an object"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Think of a physical power plug adapter — it doesn't change the electricity, just the shape of the interface.",
    detailedSolution: `Adapter translates between two incompatible interfaces — it wraps an existing class (whose
interface the client doesn't expect) and exposes a different interface the client DOES
expect, translating calls under the hood.

Especially useful when integrating a third-party library or legacy code whose interface you
can't modify, but whose functionality you need in a system expecting a different shape —
just like a physical plug adapter lets mismatched plug shapes work together.`
  },
  {
    topicSlug: "oops-exceptions-patterns", pattern: "Builder Pattern",
    title: "Builder Pattern",
    questionText: "The Builder design pattern is especially useful when:",
    options: [
      "A class needs exactly one instance system-wide",
      "An object requires many optional configuration parameters, and a single giant constructor would become unwieldy",
      "Two incompatible interfaces need to work together",
      "An object's state changes need to notify other objects"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Think about constructing a complex object with 10+ optional parameters via positional arguments.",
    detailedSolution: `When a class has many optional fields, a single constructor taking all of them becomes hard
to read ("what does the 7th positional boolean even mean?"), and overloaded constructors
explode combinatorially. Builder instead provides a separate object with chainable methods
for setting each optional property (new PizzaBuilder().size(LARGE).cheese(EXTRA).build()).

This makes construction self-documenting, letting the caller set only what they care about,
in any order.`
  },
  {
    topicSlug: "oops-exceptions-patterns", pattern: "Exception Handling Best Practices",
    title: "Why Catching a Generic Exception Is Bad Practice",
    questionText: "Why is an empty catch (Exception e) { } block generally considered bad practice?",
    options: [
      "It's actually the recommended, best-practice approach in all cases",
      "It silently swallows ALL exceptions, including unrelated bugs you didn't anticipate, with no logging — making debugging extremely difficult",
      "It causes the program to always crash immediately",
      "It's a syntax error in most languages"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "What happens to information about a failure if you catch everything and do nothing with it?",
    detailedSolution: `This "catch and ignore" pattern silently swallows EVERY exception — including ones you
never anticipated and have no idea how to correctly handle — with zero logging, meaning
when something goes wrong, there's no trace of what happened or why.

Better practice: catch SPECIFIC exception types you actually know how to handle, and for
anything broader, at minimum log it (with its stack trace) even if you can't fully recover
— preserving crucial debugging information instead of letting failures vanish silently.`
  },
  {
    topicSlug: "oops-exceptions-patterns", pattern: "Custom Exceptions",
    title: "Creating a Custom Exception Class",
    questionText: "In Java, what is the standard way to define a custom exception class?",
    options: [
      "Extend the Object class directly",
      "Extend Exception (checked) or RuntimeException (unchecked), typically providing constructors that pass a message up to the parent",
      "Implement the Runnable interface",
      "Custom exceptions cannot be created; only built-in types are usable"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "The choice of parent class determines whether callers are forced to handle or declare it.",
    detailedSolution: `A custom exception is typically defined by extending Exception (if it should be checked,
forcing callers to handle or declare it) or RuntimeException (if unchecked). The class
usually provides constructors mirroring the parent's — a message, and optionally a "cause"
— passed up via super(message) or super(message, cause).

This lets application code throw and catch exceptions specific to its own domain (e.g.,
InsufficientFundsException) rather than relying only on generic built-in types.`
  },
  {
    topicSlug: "oops-exceptions-patterns", pattern: "Command Pattern",
    title: "Command Pattern",
    questionText: "The Command design pattern encapsulates:",
    options: [
      "A single shared instance of a class",
      "A request (an action plus its parameters) as an OBJECT, allowing it to be stored, queued, logged, or undone",
      "A conversion between two incompatible interfaces",
      "Notification logic between multiple observers"
    ],
    correctAnswerIndex: 1, difficulty: "Medium",
    hintText: "Think about an \"undo\" feature — each user action needs to be represented as something storable and reversible.",
    detailedSolution: `Command wraps a request (an action + its parameters) as a standalone object implementing a
common interface (typically with execute(), often undo() too). This decouples the code
that TRIGGERS an action (a UI button) from the code that PERFORMS it — and lets commands be
stored in a list for later execution, logged for auditing, or reversed for undo, since each
command is now a first-class object rather than an immediate method call.

This is exactly the pattern behind most undo/redo implementations.`
  },
  {
    topicSlug: "oops-exceptions-patterns", pattern: "Exception Propagation",
    title: "Exception Propagation Up the Call Stack",
    questionText: "If a method throws an exception and doesn't catch it itself, what happens?",
    options: [
      "The exception disappears silently, and the program continues as if nothing happened",
      "It propagates UP to the calling method, and keeps propagating until some method catches it or it reaches the top and crashes with a stack trace",
      "The program automatically restarts from the beginning",
      "The exception is automatically converted into a return value of null"
    ],
    correctAnswerIndex: 1, difficulty: "Easy",
    hintText: "Think of it as a chain — each method that doesn't handle it passes the problem back to whoever called it.",
    detailedSolution: `An uncaught exception propagates up the call stack: from the method where it was thrown,
to whichever method called it, and so on — at each level, a matching catch block stops the
propagation; without one, it keeps going upward.

If it reaches the very top (e.g., main()) without being caught, the program terminates and
prints a stack trace showing the full chain of calls — this trace is exactly how you can
trace back through propagation to find the original problem.`
  }
];

// ═══════════════════════════════════════════════════════════
// SEED FUNCTIONS
// ═══════════════════════════════════════════════════════════

// Seeding only needs to run ONCE per server process — not on every request.
// Previously this loop (13 topics + 92 questions, one sequential DB
// round-trip each) ran again on EVERY single request to any core-subjects
// route, which is why opening the module felt slow. Caching this means
// it only pays that cost once, right after a server restart.
let hasSeeded = false;

export async function ensureCoreSubjectsSeedData() {
  if (hasSeeded) return;

  // Upsert topics — in parallel instead of one-at-a-time
  await Promise.all(coreSubjectTopicSeed.map(topic =>
    TopicModel.findOneAndUpdate(
      { slug: topic.slug },
      {
        $set: {
          title: topic.title,
          category: topic.category,
          icon: topic.icon,
          conceptArticle: topic.conceptArticle
        },
        $setOnInsert: { slug: topic.slug }
      },
      { upsert: true, new: true }
    )
  ));

  const allTopics = await TopicModel.find({
    slug: { $in: coreSubjectTopicSeed.map(t => t.slug) }
  }).lean();
  const topicBySlug = new Map(allTopics.map(t => [t.slug, t]));

  // Upsert problems — batched into one bulk DB call instead of 92
  // separate round-trips
  const problemOps = coreSubjectProblemSeed
    .map(problem => {
      const topic = topicBySlug.get(problem.topicSlug);
      if (!topic) return null;
      return {
        updateOne: {
          filter: { topicId: topic._id, title: problem.title },
          update: {
            $set: {
              topicId: topic._id,
              title: problem.title,
              questionText: problem.questionText,
              options: problem.options,
              correctAnswerIndex: problem.correctAnswerIndex,
              difficulty: problem.difficulty,
              hintText: problem.hintText,
              detailedSolution: problem.detailedSolution,
              pattern: problem.pattern || ''
            }
          },
          upsert: true
        }
      };
    })
    .filter(Boolean);

  if (problemOps.length > 0) {
    await ProblemModel.bulkWrite(problemOps);
  }

  hasSeeded = true;
}

// Per-user progress rows also only need to be ensured ONCE per user per
// server process, not on every request from that user.
const seededUserIds = new Set();

export async function ensureCoreUserProgressRows(userId) {
  const cacheKey = String(userId);
  if (seededUserIds.has(cacheKey)) return;

  const topics = await TopicModel.find({
    slug: { $in: coreSubjectTopicSeed.map(t => t.slug) }
  }, { _id: 1 }).lean();

  const problems = await ProblemModel.find({
    topicId: { $in: topics.map(t => t._id) }
  }, { _id: 1 }).lean();

  if (problems.length > 0) {
    await UserProgressModel.bulkWrite(
      problems.map(problem => ({
        updateOne: {
          filter: { userId, problemId: problem._id },
          update: { $setOnInsert: { isSolved: false, personalNote: '' } },
          upsert: true
        }
      }))
    );
  }

  seededUserIds.add(cacheKey);
}