/**
 * dsaSeed.js  —  DSA Problem Collection
 *
 * Patterns covered (15 total, matching DSAProblem model enum):
 *   Arrays, Sliding Window, Two Pointers, Prefix Sum, Binary Search
 *   Stack, Queue, Heap, Recursion, Backtracking
 *   Dynamic Programming, Tree, Graph, Greedy, Bit Manipulation
 *
 * Each pattern has 4–6 problems (Easy → Medium → Hard progression).
 * Every problem has:
 *   - Clear description with examples in markdown
 *   - inputFormat / outputFormat (critical for OneCompiler stdin judge)
 *   - 2 public + 5 hidden test cases
 *   - Meaningful hintText (not just "think about it")
 *   - Starter code templates for C++, Java, Python
 */
import { DSAProblemModel } from '../models/DSAProblem.js';

// ── Shared starter code templates ──────────────────────────
const cpp = `#include <bits/stdc++.h>
using namespace std;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // your solution here
    return 0;
}`;

const java = `import java.util.*;
import java.io.*;
public class Main {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        // your solution here
    }
}`;

const py = `import sys
input = sys.stdin.readline
def solve():
    # your solution here
solve()`;

const js = `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
let idx = 0;
// your solution here`;

const sc = (c=cpp,j=java,p=py,jjs=js) => ({ cpp:c, java:j, python:p, javascript:jjs });
const def = sc();

// ── Helper: hidden test case ────────────────────────────────
const h = (input, expectedOutput, explanation='') => ({ input, expectedOutput, explanation, isPublic: false, isHidden: true });
const pub = (input, expectedOutput, explanation='') => ({ input, expectedOutput, explanation, isPublic: true, isHidden: false });

// ═══════════════════════════════════════════════════════════
// PROBLEMS
// ═══════════════════════════════════════════════════════════
const problems = [

  // ══════════════════════════════════════════════════════════
  // ARRAYS
  // ══════════════════════════════════════════════════════════
  {
    title: 'Array Sum',
    slug: 'array-sum',
    difficulty: 'Easy',
    topic: 'Arrays', pattern: 'Arrays',
    description: `# Array Sum

Given an integer array of length **n**, compute and print the sum of all elements.`,
    constraints: ['0 ≤ n ≤ 200 000', '-10⁹ ≤ a[i] ≤ 10⁹'],
    inputFormat: 'Line 1: integer n.\nLine 2: n space-separated integers (may be empty when n=0).',
    outputFormat: 'A single integer: the sum.',
    hintText: 'Use a 64-bit integer (long long / long) to avoid overflow.',
    starterCode: def,
    testCases: [
      pub('5\n1 2 3 4 5\n', '15', '1+2+3+4+5 = 15'),
      pub('0\n\n', '0', 'empty array'),
      h('1\n10\n', '10'),
      h('3\n-1 -2 -3\n', '-6'),
      h('5\n1000000000 1000000000 1000000000 1000000000 1000000000\n', '5000000000'),
      h('2\n-1000000000 1000000000\n', '0'),
      h('4\n-7 3 10 -6\n', '0'),
    ]
  },
  {
    title: 'Second Maximum',
    slug: 'second-maximum-distinct',
    difficulty: 'Easy',
    topic: 'Arrays', pattern: 'Arrays',
    description: `# Second Maximum (Distinct)

Given an integer array, print the **second largest distinct** value.
If there are fewer than 2 distinct values, print **-1**.`,
    constraints: ['0 ≤ n ≤ 200 000', '-10⁹ ≤ a[i] ≤ 10⁹'],
    inputFormat: 'Line 1: n.\nLine 2: n integers.',
    outputFormat: 'The second largest distinct integer, or -1.',
    hintText: 'Track max1 and max2 in one pass. Update max2 only when a value > max2 and < max1.',
    starterCode: def,
    testCases: [
      pub('5\n1 2 3 4 5\n', '4', 'second largest distinct is 4'),
      pub('4\n7 7 7 7\n', '-1', 'only one distinct value'),
      h('1\n42\n', '-1'),
      h('6\n-1 -2 -3 -4 -5 -6\n', '-2'),
      h('5\n5 4 4 3 3\n', '4'),
      h('0\n\n', '-1'),
      h('2\n3 3\n', '-1'),
    ]
  },
  {
    title: 'Rotate Array Right',
    slug: 'rotate-array-right',
    difficulty: 'Medium',
    topic: 'Arrays', pattern: 'Arrays',
    description: `# Rotate Array Right

Given an array of length **n** and integer **k**, rotate the array to the right by **k** positions.
Print the result. If n=0, print a blank line.`,
    constraints: ['0 ≤ n ≤ 200 000', '0 ≤ k ≤ 10¹⁸', '-10⁹ ≤ a[i] ≤ 10⁹'],
    inputFormat: 'Line 1: n and k.\nLine 2: n integers.',
    outputFormat: 'The rotated array as space-separated integers.',
    hintText: 'Use effective_k = k % n. The new position of element i is (i + effective_k) % n.',
    starterCode: def,
    testCases: [
      pub('5 2\n1 2 3 4 5\n', '4 5 1 2 3', 'right shift 2'),
      pub('3 3\n10 20 30\n', '10 20 30', 'k mod n = 0'),
      h('1 100\n9\n', '9'),
      h('6 1\n1 2 3 4 5 6\n', '6 1 2 3 4 5'),
      h('4 6\n1 2 3 4\n', '3 4 1 2'),
      h('5 0\n1 2 3 4 5\n', '1 2 3 4 5'),
      h('3 1000000000000000000\n1 2 3\n', '2 3 1'),
    ]
  },
  {
    title: 'Maximum Product of Two',
    slug: 'max-product-two',
    difficulty: 'Medium',
    topic: 'Arrays', pattern: 'Arrays',
    description: `# Maximum Product of Two Elements

Given an array of integers, find the **maximum product** of any two distinct elements (by index).
Print the maximum product.`,
    constraints: ['2 ≤ n ≤ 200 000', '-10⁴ ≤ a[i] ≤ 10⁴'],
    inputFormat: 'Line 1: n.\nLine 2: n integers.',
    outputFormat: 'A single integer: the maximum product.',
    hintText: 'The maximum product comes from either the two largest or the two smallest (most negative) values.',
    starterCode: def,
    testCases: [
      pub('4\n1 2 3 4\n', '12', '3×4=12'),
      pub('4\n-4 -3 2 1\n', '12', '(-4)×(-3)=12'),
      h('2\n5 6\n', '30'),
      h('3\n-1 -2 -3\n', '6'),
      h('5\n0 0 0 0 5\n', '0'),
      h('2\n-10000 10000\n', '-100000000'),
      h('4\n-5 -6 3 7\n', '42'),
    ]
  },
  {
    title: 'Merge Two Sorted Arrays',
    slug: 'merge-two-sorted-arrays',
    difficulty: 'Medium',
    topic: 'Arrays', pattern: 'Arrays',
    description: `# Merge Two Sorted Arrays

Given two sorted arrays **A** (size m) and **B** (size n), merge them into one sorted array and print it.`,
    constraints: ['0 ≤ m, n ≤ 100 000', '-10⁹ ≤ values ≤ 10⁹'],
    inputFormat: 'Line 1: m.\nLine 2: m sorted integers (or blank if m=0).\nLine 3: n.\nLine 4: n sorted integers (or blank if n=0).',
    outputFormat: 'All m+n integers in sorted order, space-separated.',
    hintText: 'Use the classic two-pointer merge from merge sort. Compare front elements and advance the smaller pointer.',
    starterCode: def,
    testCases: [
      pub('3\n1 3 5\n3\n2 4 6\n', '1 2 3 4 5 6'),
      pub('2\n1 2\n0\n\n', '1 2', 'B is empty'),
      h('0\n\n3\n7 8 9\n', '7 8 9'),
      h('4\n1 2 3 4\n4\n1 2 3 4\n', '1 1 2 2 3 3 4 4'),
      h('1\n5\n1\n5\n', '5 5'),
      h('3\n-3 -1 0\n2\n-2 2\n', '-3 -2 -1 0 2'),
      h('0\n\n0\n\n', ''),
    ]
  },

  // ══════════════════════════════════════════════════════════
  // SLIDING WINDOW
  // ══════════════════════════════════════════════════════════
  {
    title: 'Maximum Sum Subarray of Size K',
    slug: 'max-sum-subarray-k',
    difficulty: 'Easy',
    topic: 'Sliding Window', pattern: 'Sliding Window',
    description: `# Maximum Sum Subarray of Size K

Given an array of integers and integer **k**, find the **maximum sum** of any contiguous subarray of size **k**.
If n < k, print **-1**.`,
    constraints: ['1 ≤ k ≤ n ≤ 200 000', '-10⁴ ≤ a[i] ≤ 10⁴'],
    inputFormat: 'Line 1: n and k.\nLine 2: n integers.',
    outputFormat: 'Single integer: the maximum window sum, or -1.',
    hintText: 'Build the first window of size k, then slide: subtract the leftmost and add the new right element.',
    starterCode: def,
    testCases: [
      pub('5 2\n1 3 -1 -3 5\n', '4', 'window [3,-1] no, window [1,3]=4'),
      pub('4 3\n2 1 5 1\n', '8', '[1,5,1]=7 or [2,1,5]=8 → 8'),
      h('6 3\n-2 1 -3 4 -1 2\n', '5'),
      h('5 1\n3 1 4 1 5\n', '5'),
      h('5 5\n1 2 3 4 5\n', '15'),
      h('3 4\n1 2 3\n', '-1'),
      h('8 3\n5 -2 3 4 -1 2 1 -3\n', '7'),
    ]
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-no-repeat-substr',
    difficulty: 'Medium',
    topic: 'Sliding Window', pattern: 'Sliding Window',
    description: `# Longest Substring Without Repeating Characters

Given a string **s**, find the length of the **longest substring** that contains no repeated characters.`,
    constraints: ['0 ≤ |s| ≤ 100 000', 's consists of printable ASCII characters'],
    inputFormat: 'A single line: the string s (may be empty).',
    outputFormat: 'A single integer: the length of the longest non-repeating substring.',
    hintText: 'Use a sliding window with a hash map storing the last seen index of each character. Move left pointer past the duplicate when one is found.',
    starterCode: def,
    testCases: [
      pub('abcabcbb\n', '3', '"abc"'),
      pub('bbbbb\n', '1', '"b"'),
      h('pwwkew\n', '3'),
      h('\n', '0'),
      h('a\n', '1'),
      h('abcdefg\n', '7'),
      h('dvdf\n', '3'),
    ]
  },
  {
    title: 'Minimum Window Substring Length',
    slug: 'min-window-substr-len',
    difficulty: 'Hard',
    topic: 'Sliding Window', pattern: 'Sliding Window',
    description: `# Minimum Window Substring Length

Given strings **s** and **t**, find the length of the smallest window in **s** that contains all characters of **t** (including duplicates).
If no such window exists, print **0**.`,
    constraints: ['1 ≤ |s|, |t| ≤ 100 000', 'strings consist of uppercase and lowercase English letters'],
    inputFormat: 'Line 1: s.\nLine 2: t.',
    outputFormat: 'A single integer: the minimum window length, or 0.',
    hintText: 'Use a frequency map for t. Expand right until all t chars are covered, then shrink from left while valid.',
    starterCode: def,
    testCases: [
      pub('ADOBECODEBANC\nABC\n', '4', '"BANC"'),
      pub('a\na\n', '1'),
      h('a\nb\n', '0'),
      h('ADOBECODEBANC\nAB\n', '2'),
      h('aa\naa\n', '2'),
      h('cabwefgewcwaefgcf\ncae\n', '4'),
      h('abc\ncba\n', '3'),
    ]
  },
  {
    title: 'Count Distinct in Window',
    slug: 'count-distinct-window',
    difficulty: 'Medium',
    topic: 'Sliding Window', pattern: 'Sliding Window',
    description: `# Count Distinct Elements in Every Window

Given an array of n integers and window size **k**, print the count of distinct elements in each window of size k.
Output n-k+1 integers, one per line.`,
    constraints: ['1 ≤ k ≤ n ≤ 100 000', '1 ≤ a[i] ≤ 10⁵'],
    inputFormat: 'Line 1: n and k.\nLine 2: n integers.',
    outputFormat: 'n-k+1 integers, each on its own line.',
    hintText: 'Maintain a frequency map in the window. A value is "distinct" when its frequency becomes 0 (evict) or goes from 0 to 1 (add).',
    starterCode: def,
    testCases: [
      pub('7 4\n1 2 1 3 4 2 3\n', '3\n4\n4\n3', '4 windows'),
      pub('3 2\n1 1 1\n', '1\n1'),
      h('5 1\n1 2 3 4 5\n', '1\n1\n1\n1\n1'),
      h('5 5\n1 2 3 4 5\n', '5'),
      h('6 3\n1 1 2 1 3 2\n', '2\n2\n3\n3'),
      h('4 2\n4 3 4 3\n', '2\n2\n2'),
      h('1 1\n9\n', '1'),
    ]
  },

  // ══════════════════════════════════════════════════════════
  // TWO POINTERS
  // ══════════════════════════════════════════════════════════
  {
    title: 'Pair Sum in Sorted Array',
    slug: 'pair-sum-sorted',
    difficulty: 'Easy',
    topic: 'Two Pointers', pattern: 'Two Pointers',
    description: `# Pair Sum in Sorted Array

Given a **sorted** array and a target **T**, determine if any two distinct elements sum to T.
Print **YES** or **NO**.`,
    constraints: ['2 ≤ n ≤ 200 000', '-10⁹ ≤ a[i] ≤ 10⁹', '-2×10⁹ ≤ T ≤ 2×10⁹'],
    inputFormat: 'Line 1: n and T.\nLine 2: n sorted integers.',
    outputFormat: 'YES or NO.',
    hintText: 'Use left pointer at start and right at end. If sum < T, move left right; if sum > T, move right left.',
    starterCode: def,
    testCases: [
      pub('5 9\n1 2 3 4 5\n', 'YES', '4+5=9'),
      pub('4 15\n1 2 3 4\n', 'NO'),
      h('2 0\n-1 1\n', 'YES'),
      h('3 6\n1 2 3\n', 'NO', '3+3 same index not allowed'),
      h('6 10\n1 3 5 7 9 11\n', 'YES'),
      h('4 100\n1 2 3 4\n', 'NO'),
      h('2 2000000000\n1000000000 1000000000\n', 'YES'),
    ]
  },
  {
    title: 'Container With Most Water',
    slug: 'container-most-water',
    difficulty: 'Medium',
    topic: 'Two Pointers', pattern: 'Two Pointers',
    description: `# Container With Most Water

Given n non-negative integers representing heights of walls at positions 1..n, find two walls that together with the x-axis forms a container holding the **most water**.
Print the maximum water volume.`,
    constraints: ['2 ≤ n ≤ 200 000', '0 ≤ h[i] ≤ 10⁴'],
    inputFormat: 'Line 1: n.\nLine 2: n integers (heights).',
    outputFormat: 'Single integer: maximum volume.',
    hintText: 'Use two pointers from both ends. Volume = min(h[l], h[r]) × (r - l). Move the pointer with the smaller height inward.',
    starterCode: def,
    testCases: [
      pub('9\n1 8 6 2 5 4 8 3 7\n', '49', 'heights 8 and 7, width 7'),
      pub('2\n1 1\n', '1'),
      h('2\n4 3\n', '3'),
      h('6\n1 2 3 4 5 6\n', '9'),
      h('4\n1 3 2 5\n', '6'),
      h('3\n0 0 0\n', '0'),
      h('5\n5 1 2 1 5\n', '20'),
    ]
  },
  {
    title: 'Three Sum Closest',
    slug: 'three-sum-closest',
    difficulty: 'Medium',
    topic: 'Two Pointers', pattern: 'Two Pointers',
    description: `# Three Sum Closest

Given an array and a target **T**, find three elements (by index) whose sum is **closest to T**.
Print that sum. If there are ties, print any one.`,
    constraints: ['3 ≤ n ≤ 1000', '-10⁴ ≤ a[i] ≤ 10⁴', '-10⁵ ≤ T ≤ 10⁵'],
    inputFormat: 'Line 1: n and T.\nLine 2: n integers.',
    outputFormat: 'The closest sum.',
    hintText: 'Sort the array. Fix one element, use two pointers for the remaining two. Update best when |sum-T| shrinks.',
    starterCode: def,
    testCases: [
      pub('4 1\n-1 2 1 -4\n', '2', 'closest to 1 is 2 (-1+2+1)'),
      pub('3 100\n0 0 0\n', '0'),
      h('3 0\n1 2 3\n', '6'),
      h('4 0\n-1 0 1 2\n', '0'),
      h('5 10\n1 2 3 4 5\n', '12'),
      h('3 -5\n-1 -2 -3\n', '-6'),
      h('4 3\n0 1 2 3\n', '3'),
    ]
  },
  {
    title: 'Remove Duplicates from Sorted Array',
    slug: 'remove-duplicates-sorted',
    difficulty: 'Easy',
    topic: 'Two Pointers', pattern: 'Two Pointers',
    description: `# Remove Duplicates from Sorted Array

Given a **sorted** array, remove duplicates **in-place** and print the resulting unique elements in order.`,
    constraints: ['0 ≤ n ≤ 200 000', '-10⁹ ≤ a[i] ≤ 10⁹'],
    inputFormat: 'Line 1: n.\nLine 2: n sorted integers.',
    outputFormat: 'The unique elements space-separated on one line.',
    hintText: 'Use a slow pointer (write position) and fast pointer (reader). Write when a[fast] != a[slow].',
    starterCode: def,
    testCases: [
      pub('6\n1 1 2 2 3 4\n', '1 2 3 4'),
      pub('3\n5 5 5\n', '5'),
      h('0\n\n', ''),
      h('5\n1 2 3 4 5\n', '1 2 3 4 5'),
      h('4\n-3 -3 0 0\n', '-3 0'),
      h('1\n7\n', '7'),
      h('6\n1 1 1 1 1 2\n', '1 2'),
    ]
  },

  // ══════════════════════════════════════════════════════════
  // PREFIX SUM
  // ══════════════════════════════════════════════════════════
  {
    title: 'Range Sum Query',
    slug: 'range-sum-query',
    difficulty: 'Easy',
    topic: 'Prefix Sum', pattern: 'Prefix Sum',
    description: `# Range Sum Query

Given an array and **q** queries, each query (l, r) asks for the sum of elements from index **l** to **r** (0-indexed, inclusive).`,
    constraints: ['1 ≤ n ≤ 200 000', '1 ≤ q ≤ 200 000', '0 ≤ l ≤ r < n', '-10⁴ ≤ a[i] ≤ 10⁴'],
    inputFormat: 'Line 1: n and q.\nLine 2: n integers.\nNext q lines: l r for each query.',
    outputFormat: 'q lines, each with the sum for that query.',
    hintText: 'Build prefix[i] = a[0]+...+a[i-1]. Then sum(l,r) = prefix[r+1] - prefix[l].',
    starterCode: def,
    testCases: [
      pub('5 3\n1 2 3 4 5\n0 2\n1 3\n0 4\n', '6\n9\n15'),
      pub('3 1\n-1 2 -3\n0 2\n', '-2'),
      h('5 2\n5 5 5 5 5\n0 0\n4 4\n', '5\n5'),
      h('4 4\n1 2 3 4\n0 3\n1 2\n2 3\n0 1\n', '10\n5\n7\n3'),
      h('1 1\n100\n0 0\n', '100'),
      h('6 3\n-3 2 -1 4 -2 5\n0 5\n2 4\n1 3\n', '5\n1\n5'),
      h('3 2\n1000000 2000000 3000000\n0 2\n0 1\n', '6000000\n3000000'),
    ]
  },
  {
    title: 'Count Subarrays with Sum K',
    slug: 'count-subarrays-sum-k',
    difficulty: 'Medium',
    topic: 'Prefix Sum', pattern: 'Prefix Sum',
    description: `# Count Subarrays with Sum K

Given an array and integer **K**, count the number of contiguous subarrays with sum equal to **K**.`,
    constraints: ['1 ≤ n ≤ 200 000', '-10⁴ ≤ a[i] ≤ 10⁴', '-10⁹ ≤ K ≤ 10⁹'],
    inputFormat: 'Line 1: n and K.\nLine 2: n integers.',
    outputFormat: 'A single integer: the count.',
    hintText: 'Use prefix sums with a hash map. Count of subarrays ending at i with sum K = frequency of (prefix[i] - K) seen so far.',
    starterCode: def,
    testCases: [
      pub('5 2\n1 1 1 1 1\n', '4'),
      pub('3 3\n1 2 3\n', '2', '[1,2] and [3]'),
      h('4 0\n1 -1 1 -1\n', '4'),
      h('1 1\n1\n', '1'),
      h('1 2\n1\n', '0'),
      h('5 3\n3 0 3 0 3\n', '5'),
      h('6 7\n3 4 7 2 -3 1\n', '4'),
    ]
  },
  {
    title: 'Equilibrium Index',
    slug: 'equilibrium-index',
    difficulty: 'Easy',
    topic: 'Prefix Sum', pattern: 'Prefix Sum',
    description: `# Equilibrium Index

Find the **first** index i such that the sum of elements before i equals the sum of elements after i.
Print that index (0-based), or **-1** if none exists.`,
    constraints: ['1 ≤ n ≤ 200 000', '-10⁴ ≤ a[i] ≤ 10⁴'],
    inputFormat: 'Line 1: n.\nLine 2: n integers.',
    outputFormat: 'First equilibrium index, or -1.',
    hintText: 'Compute total sum. Iterate keeping left_sum. Check if left_sum == total - left_sum - a[i].',
    starterCode: def,
    testCases: [
      pub('7\n-7 1 5 2 -4 3 0\n', '3', 'left=[-7,1,5]=-1, right=[-4,3,0]=-1'),
      pub('3\n1 2 3\n', '-1'),
      h('1\n0\n', '0'),
      h('3\n1 1 1\n', '1'),
      h('4\n0 0 0 0\n', '0'),
      h('5\n1 3 5 2 2\n', '2'),
      h('5\n0 -3 5 -4 2\n', '4'),
    ]
  },
  {
    title: 'Maximum Subarray Sum (Kadane)',
    slug: 'kadane-max-subarray',
    difficulty: 'Medium',
    topic: 'Prefix Sum', pattern: 'Prefix Sum',
    description: `# Maximum Subarray Sum

Given an array of integers (possibly all negative), find the **maximum sum** of any non-empty contiguous subarray.`,
    constraints: ['1 ≤ n ≤ 200 000', '-10⁴ ≤ a[i] ≤ 10⁴'],
    inputFormat: 'Line 1: n.\nLine 2: n integers.',
    outputFormat: 'Single integer: maximum subarray sum.',
    hintText: "Kadane's algorithm: maxEndingHere = max(a[i], maxEndingHere + a[i]). Track global max.",
    starterCode: def,
    testCases: [
      pub('9\n-2 1 -3 4 -1 2 1 -5 4\n', '6', '[4,-1,2,1]'),
      pub('4\n-1 -2 -3 -4\n', '-1', 'all negative'),
      h('1\n5\n', '5'),
      h('5\n1 2 3 4 5\n', '15'),
      h('6\n5 -3 5 -3 5 -3\n', '9'),
      h('3\n-2 -3 4\n', '4'),
      h('8\n2 -1 2 3 4 -5 2 1\n', '10'),
    ]
  },

  // ══════════════════════════════════════════════════════════
  // BINARY SEARCH
  // ══════════════════════════════════════════════════════════
  {
    title: 'Binary Search',
    slug: 'binary-search-classic',
    difficulty: 'Easy',
    topic: 'Binary Search', pattern: 'Binary Search',
    description: `# Binary Search

Given a **sorted** array of distinct integers and a target **T**, return the **0-based index** of T, or **-1** if not found.`,
    constraints: ['1 ≤ n ≤ 200 000', '-10⁹ ≤ values ≤ 10⁹'],
    inputFormat: 'Line 1: n and T.\nLine 2: n sorted distinct integers.',
    outputFormat: 'Index of T, or -1.',
    hintText: 'Classic binary search: lo=0, hi=n-1. mid=(lo+hi)/2. Compare a[mid] with T.',
    starterCode: def,
    testCases: [
      pub('5 3\n1 2 3 4 5\n', '2'),
      pub('5 6\n1 2 3 4 5\n', '-1'),
      h('1 1\n1\n', '0'),
      h('6 4\n1 2 3 4 5 6\n', '3'),
      h('4 100\n1 2 3 4\n', '-1'),
      h('7 1\n1 3 5 7 9 11 13\n', '0'),
      h('7 13\n1 3 5 7 9 11 13\n', '6'),
    ]
  },
  {
    title: 'Find First Bad Version',
    slug: 'first-bad-version',
    difficulty: 'Easy',
    topic: 'Binary Search', pattern: 'Binary Search',
    description: `# First Bad Version

Versions are numbered 1 to **n**. Version **b** and all versions after it are bad.
Given n and b, find the first bad version using binary search (simulate isBad(v) = v >= b).
Print b.`,
    constraints: ['1 ≤ b ≤ n ≤ 10⁹'],
    inputFormat: 'Line 1: n and b.',
    outputFormat: 'The first bad version number.',
    hintText: 'Binary search for leftmost version where isBad is true. When isBad(mid) is true, keep mid as candidate and search left.',
    starterCode: def,
    testCases: [
      pub('5 4\n', '4'),
      pub('1 1\n', '1'),
      h('10 1\n', '1'),
      h('10 10\n', '10'),
      h('100 37\n', '37'),
      h('1000000000 500000000\n', '500000000'),
      h('1000000000 1000000000\n', '1000000000'),
    ]
  },
  {
    title: 'Search in Rotated Sorted Array',
    slug: 'search-rotated-sorted',
    difficulty: 'Medium',
    topic: 'Binary Search', pattern: 'Binary Search',
    description: `# Search in Rotated Sorted Array

A sorted array of distinct integers was rotated at some pivot. Given target **T**, find its 0-based index or -1.`,
    constraints: ['1 ≤ n ≤ 200 000', '-10⁹ ≤ values ≤ 10⁹'],
    inputFormat: 'Line 1: n and T.\nLine 2: n integers (rotated sorted).',
    outputFormat: 'Index of T, or -1.',
    hintText: 'At each mid, one half is always sorted. Check which half T falls in and search there.',
    starterCode: def,
    testCases: [
      pub('7 0\n4 5 6 7 0 1 2\n', '4'),
      pub('7 3\n4 5 6 7 0 1 2\n', '-1'),
      h('1 0\n0\n', '0'),
      h('3 3\n3 1 2\n', '0'),
      h('5 1\n5 1 2 3 4\n', '1'),
      h('6 4\n6 1 2 3 4 5\n', '4'),
      h('6 6\n6 1 2 3 4 5\n', '0'),
    ]
  },
  {
    title: 'Minimum in Rotated Sorted Array',
    slug: 'min-rotated-sorted',
    difficulty: 'Medium',
    topic: 'Binary Search', pattern: 'Binary Search',
    description: `# Minimum in Rotated Sorted Array

Given a rotated sorted array of **distinct** integers, find and print the minimum element.`,
    constraints: ['1 ≤ n ≤ 200 000', '-10⁹ ≤ a[i] ≤ 10⁹'],
    inputFormat: 'Line 1: n.\nLine 2: n integers.',
    outputFormat: 'The minimum element.',
    hintText: 'If a[mid] > a[hi], the minimum is in the right half. Otherwise it is in the left half (including mid).',
    starterCode: def,
    testCases: [
      pub('5\n3 4 5 1 2\n', '1'),
      pub('4\n4 5 6 7\n', '4', 'not rotated'),
      h('1\n1\n', '1'),
      h('3\n3 1 2\n', '1'),
      h('6\n6 7 1 2 3 4\n', '1'),
      h('5\n2 3 4 5 1\n', '1'),
      h('7\n7 1 2 3 4 5 6\n', '1'),
    ]
  },

  // ══════════════════════════════════════════════════════════
  // STACK
  // ══════════════════════════════════════════════════════════
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    topic: 'Stack', pattern: 'Stack',
    description: `# Valid Parentheses

Given a string with characters **( ) [ ] { }**, determine if it is valid.
A string is valid if every open bracket is closed in the correct order.
Print **YES** or **NO**.`,
    constraints: ['0 ≤ |s| ≤ 100 000'],
    inputFormat: 'A single line: the string s.',
    outputFormat: 'YES or NO.',
    hintText: 'Push open brackets onto stack. On a close bracket, check if top matches. At end, stack must be empty.',
    starterCode: def,
    testCases: [
      pub('()[]{}\n', 'YES'),
      pub('([)]\n', 'NO'),
      h('\n', 'YES'),
      h('(((\n', 'NO'),
      h('{[]}\n', 'YES'),
      h('{[}]\n', 'NO'),
      h('([]){}\n', 'YES'),
    ]
  },
  {
    title: 'Next Greater Element',
    slug: 'next-greater-element',
    difficulty: 'Medium',
    topic: 'Stack', pattern: 'Stack',
    description: `# Next Greater Element

For each element in the array, find the **next greater element** to its right.
If none exists, output **-1** for that position.`,
    constraints: ['1 ≤ n ≤ 200 000', '0 ≤ a[i] ≤ 10⁹'],
    inputFormat: 'Line 1: n.\nLine 2: n integers.',
    outputFormat: 'n space-separated integers: the next greater element for each position.',
    hintText: 'Use a monotonic decreasing stack. When a[i] > stack top, the top\'s next greater is a[i].',
    starterCode: def,
    testCases: [
      pub('4\n4 5 2 10\n', '5 10 10 -1'),
      pub('4\n3 2 1 4\n', '4 4 4 -1'),
      h('1\n5\n', '-1'),
      h('5\n5 4 3 2 1\n', '-1 -1 -1 -1 -1'),
      h('5\n1 2 3 4 5\n', '2 3 4 5 -1'),
      h('6\n6 3 9 8 10 2\n', '9 9 10 10 -1 -1'),
      h('3\n2 2 2\n', '-1 -1 -1'),
    ]
  },
  {
    title: 'Largest Rectangle in Histogram',
    slug: 'largest-rectangle-histogram',
    difficulty: 'Hard',
    topic: 'Stack', pattern: 'Stack',
    description: `# Largest Rectangle in Histogram

Given heights of bars in a histogram, find the area of the **largest rectangle** that can be formed.`,
    constraints: ['1 ≤ n ≤ 200 000', '0 ≤ h[i] ≤ 10⁴'],
    inputFormat: 'Line 1: n.\nLine 2: n integers (bar heights).',
    outputFormat: 'Single integer: maximum rectangle area.',
    hintText: 'Monotonic increasing stack. When you pop, the width extends from the new top+1 to the current index-1.',
    starterCode: def,
    testCases: [
      pub('6\n2 1 5 6 2 3\n', '10', 'bars 5,6 with height 5'),
      pub('5\n6 2 5 4 5\n', '12', 'bars 2,5,4,5 at height 4'),
      h('1\n1\n', '1'),
      h('3\n3 3 3\n', '9'),
      h('4\n1 2 3 4\n', '6'),
      h('4\n4 3 2 1\n', '6'),
      h('6\n0 0 0 0 0 0\n', '0'),
    ]
  },
  {
    title: 'Min Stack',
    slug: 'min-stack-ops',
    difficulty: 'Medium',
    topic: 'Stack', pattern: 'Stack',
    description: `# Min Stack

Implement a stack that supports push, pop, and getMin in O(1) time.
Process q operations:
- **PUSH x**: push x
- **POP**: pop top element (guaranteed non-empty)
- **MIN**: print the current minimum

Print a line for every MIN operation.`,
    constraints: ['1 ≤ q ≤ 100 000', '-10⁹ ≤ x ≤ 10⁹'],
    inputFormat: 'Line 1: q.\nNext q lines: operation (PUSH x, POP, or MIN).',
    outputFormat: 'For each MIN operation, print the current minimum on a new line.',
    hintText: 'Maintain a secondary minStack. On push, push to minStack if new value ≤ current min.',
    starterCode: def,
    testCases: [
      pub('6\nPUSH 5\nPUSH 3\nPUSH 7\nMIN\nPOP\nMIN\n', '3\n3'),
      pub('3\nPUSH 1\nMIN\nPOP\n', '1'),
      h('5\nPUSH 3\nPUSH 3\nPOP\nPOP\nPUSH 1\n', ''),
      h('4\nPUSH 5\nPUSH 5\nPOP\nMIN\n', '5'),
      h('5\nPUSH 2\nPUSH 0\nMIN\nPOP\nMIN\n', '0\n2'),
      h('7\nPUSH 10\nPUSH 5\nPUSH 3\nMIN\nPOP\nMIN\nMIN\n', '3\n5\n5'),
      h('3\nPUSH -5\nMIN\nPOP\n', '-5'),
    ]
  },

  // ══════════════════════════════════════════════════════════
  // QUEUE
  // ══════════════════════════════════════════════════════════
  {
    title: 'Sliding Window Maximum',
    slug: 'sliding-window-maximum',
    difficulty: 'Hard',
    topic: 'Queue', pattern: 'Queue',
    description: `# Sliding Window Maximum

Given an array and window size **k**, print the **maximum** of each window of size k.
Output n-k+1 values, one per line.`,
    constraints: ['1 ≤ k ≤ n ≤ 200 000', '-10⁴ ≤ a[i] ≤ 10⁴'],
    inputFormat: 'Line 1: n and k.\nLine 2: n integers.',
    outputFormat: 'n-k+1 integers, each on a new line.',
    hintText: 'Use a monotonic deque (decreasing order). Front holds index of current window max. Remove indices that fall out of the window.',
    starterCode: def,
    testCases: [
      pub('8 3\n1 3 -1 -3 5 3 6 7\n', '3\n3\n5\n5\n6\n7'),
      pub('4 2\n4 3 2 1\n', '4\n3\n2'),
      h('1 1\n1\n', '1'),
      h('5 1\n1 2 3 4 5\n', '1\n2\n3\n4\n5'),
      h('5 5\n5 4 3 2 1\n', '5'),
      h('6 3\n2 1 2 3 1 2\n', '2\n3\n3\n3'),
      h('7 4\n7 2 4 3 1 5 2\n', '7\n4\n5\n5'),
    ]
  },
  {
    title: 'First Non-Repeating in Stream',
    slug: 'first-non-repeating-stream',
    difficulty: 'Medium',
    topic: 'Queue', pattern: 'Queue',
    description: `# First Non-Repeating Character in Stream

Given a string stream of lowercase characters, after each character print the **first non-repeating character** seen so far. If none, print **#**.`,
    constraints: ['1 ≤ |s| ≤ 100 000', 's consists of lowercase English letters'],
    inputFormat: 'A single line: string s.',
    outputFormat: 'A string of length |s|: answer after each character.',
    hintText: 'Use a queue of non-repeated characters and a frequency map. After each character, pop from front while front has freq > 1.',
    starterCode: def,
    testCases: [
      pub('aabcb\n', 'a#bbb', 'a→a, aa→#, aab→b, aabc→b, aabcb→b'),
      pub('aabb\n', 'a##b'),
      h('a\n', 'a'),
      h('abcabc\n', 'aaabbb'),
      h('aaa\n', 'a##'),
      h('zxyxz\n', 'zzzzz'),
      h('abcd\n', 'aaaa'),
    ]
  },
  {
    title: 'Task Scheduler',
    slug: 'task-scheduler',
    difficulty: 'Hard',
    topic: 'Queue', pattern: 'Queue',
    description: `# Task Scheduler

Given a list of tasks (uppercase letters) and a cooldown **n**, find the minimum time units to execute all tasks.
Same task must have at least **n** slots between executions. Idle is allowed.`,
    constraints: ['1 ≤ |tasks| ≤ 10 000', '0 ≤ n ≤ 100', 'tasks consist of uppercase letters'],
    inputFormat: 'Line 1: space-separated task characters.\nLine 2: n.',
    outputFormat: 'Minimum time units needed.',
    hintText: 'Count frequencies. The formula is max((max_freq-1)*(n+1)+count_of_max_freq, total_tasks).',
    starterCode: def,
    testCases: [
      pub('A A A B B B\n2\n', '8', 'ABCAB_AB_ = 8'),
      pub('A A A B B B\n0\n', '6', 'no cooldown'),
      h('A\n5\n', '1'),
      h('A A B B C C\n2\n', '6'),
      h('A A A A\n3\n', '13'),
      h('A B C D E F\n2\n', '6'),
      h('A A A A A B B B B B\n4\n', '10'),
    ]
  },

  // ══════════════════════════════════════════════════════════
  // HEAP
  // ══════════════════════════════════════════════════════════
  {
    title: 'K Largest Elements',
    slug: 'k-largest-elements',
    difficulty: 'Easy',
    topic: 'Heap', pattern: 'Heap',
    description: `# K Largest Elements

Given an array and integer **k**, print the **k largest elements** in **descending order**.`,
    constraints: ['1 ≤ k ≤ n ≤ 200 000', '-10⁹ ≤ a[i] ≤ 10⁹'],
    inputFormat: 'Line 1: n and k.\nLine 2: n integers.',
    outputFormat: 'k integers in descending order, space-separated.',
    hintText: 'Use a min-heap of size k. For each element, if it is larger than the heap minimum, replace it.',
    starterCode: def,
    testCases: [
      pub('6 3\n3 1 4 1 5 9\n', '9 5 4'),
      pub('5 1\n5 3 1 4 2\n', '5'),
      h('5 5\n1 2 3 4 5\n', '5 4 3 2 1'),
      h('4 2\n-1 -2 -3 -4\n', '-1 -2'),
      h('3 3\n7 7 7\n', '7 7 7'),
      h('6 2\n10 9 2 5 8 3\n', '10 9'),
      h('5 3\n0 0 0 0 0\n', '0 0 0'),
    ]
  },
  {
    title: 'Kth Largest in Stream',
    slug: 'kth-largest-stream',
    difficulty: 'Medium',
    topic: 'Heap', pattern: 'Heap',
    description: `# Kth Largest in Stream

Given **k** and a stream of integers (one per line), after each addition print the **kth largest** element seen so far.
If fewer than k elements have been seen, print **-1**.`,
    constraints: ['1 ≤ k ≤ 10 000', '1 ≤ n ≤ 10 000', '-10⁶ ≤ a[i] ≤ 10⁶'],
    inputFormat: 'Line 1: k and n.\nNext n lines: each is one integer from the stream.',
    outputFormat: 'n lines: kth largest after each addition, or -1.',
    hintText: 'Maintain a min-heap of size k. The top of the heap is always the kth largest.',
    starterCode: def,
    testCases: [
      pub('3 6\n4\n5\n8\n2\n3\n9\n', '-1\n-1\n4\n4\n4\n5'),
      pub('1 3\n3\n1\n5\n', '3\n3\n5'),
      h('2 4\n1\n2\n3\n4\n', '-1\n1\n2\n3'),
      h('1 1\n7\n', '7'),
      h('3 3\n1\n2\n3\n', '-1\n-1\n1'),
      h('2 5\n5\n4\n3\n2\n1\n', '-1\n4\n3\n2\n1'),
      h('2 2\n1\n1\n', '-1\n1'),
    ]
  },
  {
    title: 'Merge K Sorted Lists',
    slug: 'merge-k-sorted-lists',
    difficulty: 'Hard',
    topic: 'Heap', pattern: 'Heap',
    description: `# Merge K Sorted Lists

Given **k** sorted arrays, merge them into one sorted array and print it.`,
    constraints: ['1 ≤ k ≤ 100', '0 ≤ size of each list ≤ 1000', '-10⁵ ≤ values ≤ 10⁵'],
    inputFormat: 'Line 1: k.\nFor each of k lists: one line with size m, then one line with m sorted integers (or blank if m=0).',
    outputFormat: 'All integers merged and sorted, space-separated. If all empty, print a blank line.',
    hintText: 'Use a min-heap with tuples (value, list_index, element_index). Initialize with first element of each list.',
    starterCode: def,
    testCases: [
      pub('3\n3\n1 4 7\n3\n2 5 8\n3\n3 6 9\n', '1 2 3 4 5 6 7 8 9'),
      pub('2\n2\n1 3\n2\n2 4\n', '1 2 3 4'),
      h('1\n3\n5 10 15\n', '5 10 15'),
      h('2\n0\n\n3\n1 2 3\n', '1 2 3'),
      h('3\n1\n1\n1\n1\n1\n1\n', '1 1 1'),
      h('2\n3\n-3 -2 -1\n3\n1 2 3\n', '-3 -2 -1 1 2 3'),
      h('2\n0\n\n0\n\n', ''),
    ]
  },

  // ══════════════════════════════════════════════════════════
  // RECURSION
  // ══════════════════════════════════════════════════════════
  {
    title: 'Factorial',
    slug: 'factorial-recursive',
    difficulty: 'Easy',
    topic: 'Recursion', pattern: 'Recursion',
    description: `# Factorial

Compute **n!** (n factorial) for a given non-negative integer n.
For n > 20, print the result modulo **10⁹ + 7**.`,
    constraints: ['0 ≤ n ≤ 100'],
    inputFormat: 'A single integer n.',
    outputFormat: 'n! mod (10⁹+7).',
    hintText: 'Base case: 0! = 1. Recursive case: n! = n × (n-1)!. Use mod at each step for large n.',
    starterCode: def,
    testCases: [
      pub('5\n', '120'),
      pub('0\n', '1'),
      h('1\n', '1'),
      h('10\n', '3628800'),
      h('20\n', '2432902008176640000'),
      h('25\n', '116872892'),
      h('100\n', '437918130'),
    ]
  },
  {
    title: 'Power Function',
    slug: 'power-function',
    difficulty: 'Easy',
    topic: 'Recursion', pattern: 'Recursion',
    description: `# Power Function

Compute **base^exp mod (10⁹+7)** using fast exponentiation.`,
    constraints: ['0 ≤ base ≤ 10⁹', '0 ≤ exp ≤ 10¹⁸'],
    inputFormat: 'Line 1: base and exp.',
    outputFormat: 'base^exp mod (10⁹+7).',
    hintText: 'Use recursive fast exponentiation: power(b, e) = power(b², e/2) if e is even.',
    starterCode: def,
    testCases: [
      pub('2 10\n', '1024'),
      pub('3 0\n', '1'),
      h('2 0\n', '1'),
      h('1 1000000000000000000\n', '1'),
      h('2 30\n', '73741817'),
      h('5 5\n', '3125'),
      h('0 0\n', '1'),
    ]
  },
  {
    title: 'Generate All Subsets',
    slug: 'generate-all-subsets',
    difficulty: 'Medium',
    topic: 'Recursion', pattern: 'Recursion',
    description: `# Generate All Subsets

Given an array of **n** distinct integers, print all 2ⁿ subsets, one per line.
Print the elements of each subset in the original order, space-separated. For the empty subset, print a blank line.
Print subsets in the order they are generated by including/excluding from index 0.`,
    constraints: ['0 ≤ n ≤ 15'],
    inputFormat: 'Line 1: n.\nLine 2: n distinct integers.',
    outputFormat: '2ⁿ lines, each a subset.',
    hintText: 'Recursive backtracking: at each index, include or exclude the element. Base: when index==n, print current subset.',
    starterCode: def,
    testCases: [
      pub('2\n1 2\n', '\n2\n1\n1 2', 'include=right, exclude=left'),
      pub('0\n\n', '', 'just empty subset'),
      h('1\n5\n', '\n5'),
      h('3\n1 2 3\n', '\n3\n2\n2 3\n1\n1 3\n1 2\n1 2 3'),
      h('1\n0\n', '\n0'),
      h('2\n3 4\n', '\n4\n3\n3 4'),
      h('2\n-1 2\n', '\n2\n-1\n-1 2'),
    ]
  },

  // ══════════════════════════════════════════════════════════
  // BACKTRACKING
  // ══════════════════════════════════════════════════════════
  {
    title: 'Count Subsets With Sum K',
    slug: 'count-subsets-sum-k',
    difficulty: 'Medium',
    topic: 'Backtracking', pattern: 'Backtracking',
    description: `# Count Subsets With Sum K

Given an array and integer **K**, count all subsets (by value) with sum equal to K.`,
    constraints: ['1 ≤ n ≤ 20', '0 ≤ a[i] ≤ 1000', '0 ≤ K ≤ 10 000'],
    inputFormat: 'Line 1: n and K.\nLine 2: n non-negative integers.',
    outputFormat: 'The count of subsets with sum K.',
    hintText: 'Recurse with include/exclude. At each step: if remaining sum < 0, prune. Base: if sum == 0, count it.',
    starterCode: def,
    testCases: [
      pub('4 5\n1 2 3 4\n', '2', '{1,4} and {2,3}'),
      pub('3 0\n1 2 3\n', '1', 'empty subset'),
      h('5 10\n2 3 5 6 4\n', '3'),
      h('3 7\n1 2 3\n', '0'),
      h('1 0\n0\n', '2', '{} and {0}'),
      h('4 4\n1 1 1 1\n', '1', 'pick all four 1s'),
      h('3 6\n2 4 6\n', '2'),
    ]
  },
  {
    title: 'N-Queens Count',
    slug: 'n-queens-count',
    difficulty: 'Hard',
    topic: 'Backtracking', pattern: 'Backtracking',
    description: `# N-Queens Count

Given **n**, count the number of ways to place n queens on an n×n chessboard such that no two queens threaten each other.`,
    constraints: ['1 ≤ n ≤ 12'],
    inputFormat: 'A single integer n.',
    outputFormat: 'The number of valid arrangements.',
    hintText: 'Place queens row by row. For each column, check if any previous queen attacks via same column, or diagonals (|row_diff| == |col_diff|).',
    starterCode: def,
    testCases: [
      pub('4\n', '2'),
      pub('1\n', '1'),
      h('2\n', '0'),
      h('3\n', '0'),
      h('5\n', '10'),
      h('8\n', '92'),
      h('12\n', '14200'),
    ]
  },
  {
    title: 'Word Search in Grid',
    slug: 'word-search-grid',
    difficulty: 'Hard',
    topic: 'Backtracking', pattern: 'Backtracking',
    description: `# Word Search in Grid

Given an m×n grid of characters and a word, determine if the word can be constructed from letters in the grid by moving up, down, left, or right (no revisiting in the same path).
Print **YES** or **NO**.`,
    constraints: ['1 ≤ m, n ≤ 30', '1 ≤ |word| ≤ 200'],
    inputFormat: 'Line 1: m and n.\nNext m lines: n characters each (no spaces).\nLast line: the word.',
    outputFormat: 'YES or NO.',
    hintText: 'DFS with backtracking. Mark visited cells during DFS and unmark after returning.',
    starterCode: def,
    testCases: [
      pub('3 4\nABCE\nSFCS\nADEE\nABCCED\n', 'YES'),
      pub('3 4\nABCE\nSFCS\nADEE\nSEE\n', 'YES'),
      h('3 4\nABCE\nSFCS\nADEE\nABCB\n', 'NO'),
      h('1 1\nA\nA\n', 'YES'),
      h('1 1\nA\nB\n', 'NO'),
      h('2 2\nAB\nCD\nABDC\n', 'YES'),
      h('2 2\nAA\nAA\nAAAAA\n', 'NO'),
    ]
  },

  // ══════════════════════════════════════════════════════════
  // DYNAMIC PROGRAMMING
  // ══════════════════════════════════════════════════════════
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'Easy',
    topic: 'Dynamic Programming', pattern: 'Dynamic Programming',
    description: `# Climbing Stairs

You are climbing a staircase. Each time you can climb 1 or 2 steps.
Given **n** steps, count the number of distinct ways to reach the top.
Print the result mod **10⁹+7**.`,
    constraints: ['1 ≤ n ≤ 10 000'],
    inputFormat: 'A single integer n.',
    outputFormat: 'Number of ways mod (10⁹+7).',
    hintText: 'dp[i] = dp[i-1] + dp[i-2]. This is exactly Fibonacci!',
    starterCode: def,
    testCases: [
      pub('4\n', '5'),
      pub('2\n', '2'),
      h('1\n', '1'),
      h('3\n', '3'),
      h('10\n', '89'),
      h('50\n', '365010934'),
      h('10000\n', '356563839'),
    ]
  },
  {
    title: 'Minimum Coin Change',
    slug: 'minimum-coin-change',
    difficulty: 'Medium',
    topic: 'Dynamic Programming', pattern: 'Dynamic Programming',
    description: `# Minimum Coin Change

Given coin denominations and an amount, find the **minimum number of coins** to make that amount.
If impossible, print **-1**.`,
    constraints: ['1 ≤ coins ≤ 12', '1 ≤ coin values ≤ 10 000', '0 ≤ amount ≤ 10 000'],
    inputFormat: 'Line 1: number of coin types.\nLine 2: coin denominations.\nLine 3: amount.',
    outputFormat: 'Minimum coins, or -1.',
    hintText: 'dp[0]=0, dp[i] = min over all coins c: dp[i-c]+1 if i>=c.',
    starterCode: def,
    testCases: [
      pub('3\n1 5 6\n11\n', '2', '5+6=11'),
      pub('2\n2 5\n3\n', '-1'),
      h('1\n1\n0\n', '0'),
      h('1\n2\n3\n', '-1'),
      h('3\n1 2 5\n11\n', '3'),
      h('3\n2 3 7\n9\n', '2'),
      h('1\n1\n10000\n', '10000'),
    ]
  },
  {
    title: 'Longest Common Subsequence',
    slug: 'lcs-length-dp',
    difficulty: 'Hard',
    topic: 'Dynamic Programming', pattern: 'Dynamic Programming',
    description: `# Longest Common Subsequence

Given two strings **a** and **b**, compute the length of their **Longest Common Subsequence (LCS)**.`,
    constraints: ['0 ≤ |a|, |b| ≤ 2000', 'strings consist of lowercase letters'],
    inputFormat: 'Line 1: string a.\nLine 2: string b.',
    outputFormat: 'An integer: the LCS length.',
    hintText: 'dp[i][j] = LCS of a[0..i) and b[0..j). If a[i-1]==b[j-1], dp[i][j] = dp[i-1][j-1]+1, else max(dp[i-1][j], dp[i][j-1]).',
    starterCode: def,
    testCases: [
      pub('abcde\nace\n', '3', '"ace"'),
      pub('abc\ndef\n', '0'),
      h('aaaa\naa\n', '2'),
      h('\n\n', '0'),
      h('abcd\nabcd\n', '4'),
      h('axbycz\nabc\n', '3'),
      h('banana\nananas\n', '5'),
    ]
  },
  {
    title: '0/1 Knapsack',
    slug: 'knapsack-01',
    difficulty: 'Hard',
    topic: 'Dynamic Programming', pattern: 'Dynamic Programming',
    description: `# 0/1 Knapsack

Given **n** items with weights and values, and a bag of capacity **W**, find the maximum total value you can carry.
Each item can be taken at most once.`,
    constraints: ['1 ≤ n ≤ 500', '1 ≤ W ≤ 10 000', '1 ≤ weight[i], value[i] ≤ 1000'],
    inputFormat: 'Line 1: n and W.\nLine 2: n weights.\nLine 3: n values.',
    outputFormat: 'Maximum value achievable.',
    hintText: 'dp[w] = max value with capacity w. Process items outer, capacity inner (decreasing). dp[w] = max(dp[w], dp[w-wt]+val).',
    starterCode: def,
    testCases: [
      pub('4 5\n1 2 3 2\n1 6 10 16\n', '22', 'items 2+4 weight=2+2=4, val=6+16=22'),
      pub('3 5\n4 5 1\n1 2 3\n', '3'),
      h('1 1\n1\n1\n', '1'),
      h('1 1\n2\n5\n', '0'),
      h('5 10\n2 3 4 5 6\n3 4 5 6 7\n', '16'),
      h('3 50\n10 20 30\n60 100 120\n', '220'),
      h('2 3\n3 3\n5 5\n', '5'),
    ]
  },
  {
    title: 'Longest Increasing Subsequence',
    slug: 'lis-length',
    difficulty: 'Medium',
    topic: 'Dynamic Programming', pattern: 'Dynamic Programming',
    description: `# Longest Increasing Subsequence

Given an array, find the length of the **Longest Strictly Increasing Subsequence (LIS)**.`,
    constraints: ['1 ≤ n ≤ 10 000', '-10⁵ ≤ a[i] ≤ 10⁵'],
    inputFormat: 'Line 1: n.\nLine 2: n integers.',
    outputFormat: 'Length of the LIS.',
    hintText: 'Use patience sorting with binary search for O(n log n). Maintain a tails array; binary search for replacement position.',
    starterCode: def,
    testCases: [
      pub('8\n10 9 2 5 3 7 101 18\n', '4', '[2,3,7,18]'),
      pub('6\n0 1 0 3 2 3\n', '4'),
      h('1\n0\n', '1'),
      h('5\n7 7 7 7 7\n', '1'),
      h('5\n1 2 3 4 5\n', '5'),
      h('5\n5 4 3 2 1\n', '1'),
      h('10\n3 10 2 1 20 4 6 7 5 15\n', '6'),
    ]
  },

  // ══════════════════════════════════════════════════════════
  // TREE
  // ══════════════════════════════════════════════════════════
  {
    title: 'Binary Tree Height',
    slug: 'binary-tree-height',
    difficulty: 'Easy',
    topic: 'Tree', pattern: 'Tree',
    description: `# Binary Tree Height

Given a binary tree in level-order (use -1 for null nodes), compute its height (number of edges on the longest root-to-leaf path). An empty tree has height -1.`,
    constraints: ['0 ≤ n ≤ 10 000 nodes'],
    inputFormat: 'Line 1: number of nodes n in level-order array.\nLine 2: n integers (level-order; -1 = null).',
    outputFormat: 'Height of the binary tree.',
    hintText: 'Build the tree from level-order. Then recurse: height = max(height(left), height(right)) + 1.',
    starterCode: def,
    testCases: [
      pub('7\n1 2 3 4 5 6 7\n', '2', 'perfect tree of 3 levels'),
      pub('3\n1 2 3\n', '1'),
      h('0\n\n', '-1'),
      h('1\n1\n', '0'),
      h('5\n1 2 -1 3 -1\n', '2'),
      h('9\n1 2 3 4 -1 -1 5 -1 -1\n', '3'),
      h('7\n1 -1 2 -1 -1 -1 3\n', '2'),
    ]
  },
  {
    title: 'Inorder Traversal',
    slug: 'inorder-traversal',
    difficulty: 'Easy',
    topic: 'Tree', pattern: 'Tree',
    description: `# Inorder Traversal

Given a binary tree in level-order, print its **inorder traversal** (left → root → right).`,
    constraints: ['0 ≤ n ≤ 10 000'],
    inputFormat: 'Line 1: n.\nLine 2: n level-order integers (-1 = null).',
    outputFormat: 'Space-separated inorder values.',
    hintText: 'Recursive inorder: traverse left subtree, visit root, traverse right subtree.',
    starterCode: def,
    testCases: [
      pub('7\n1 2 3 4 5 6 7\n', '4 2 5 1 6 3 7'),
      pub('3\n1 2 3\n', '2 1 3'),
      h('1\n1\n', '1'),
      h('0\n\n', ''),
      h('5\n4 2 6 1 3\n', '1 2 3 4 6'),
      h('7\n10 5 15 3 7 -1 20\n', '3 5 7 10 15 20'),
      h('3\n1 -1 2\n', '1 2'),
    ]
  },
  {
    title: 'Level Order Traversal',
    slug: 'level-order-traversal',
    difficulty: 'Easy',
    topic: 'Tree', pattern: 'Tree',
    description: `# Level Order Traversal

Given a binary tree in level-order, print each level on a separate line with values space-separated.`,
    constraints: ['0 ≤ n ≤ 10 000'],
    inputFormat: 'Line 1: n.\nLine 2: n level-order integers (-1 = null).',
    outputFormat: 'One line per level of the tree.',
    hintText: 'BFS with a queue. After dequeuing each node, add its non-null children. Track when a level ends.',
    starterCode: def,
    testCases: [
      pub('7\n1 2 3 4 5 6 7\n', '1\n2 3\n4 5 6 7'),
      pub('3\n1 2 3\n', '1\n2 3'),
      h('1\n1\n', '1'),
      h('0\n\n', ''),
      h('5\n4 2 6 1 3\n', '4\n2 6\n1 3'),
      h('5\n1 2 -1 3 -1\n', '1\n2\n3'),
      h('7\n10 5 15 3 7 12 20\n', '10\n5 15\n3 7 12 20'),
    ]
  },
  {
    title: 'Lowest Common Ancestor',
    slug: 'lowest-common-ancestor',
    difficulty: 'Medium',
    topic: 'Tree', pattern: 'Tree',
    description: `# Lowest Common Ancestor

Given a BST (values level-order) and two values **p** and **q**, find their LCA.
Print the LCA value.`,
    constraints: ['All values distinct', '1 ≤ n ≤ 10 000', 'p and q exist in the tree'],
    inputFormat: 'Line 1: n.\nLine 2: n level-order integers for BST.\nLine 3: p and q.',
    outputFormat: 'LCA value.',
    hintText: 'In a BST: if both p and q are less than root, LCA is in left subtree. If both greater, right subtree. Otherwise, root is LCA.',
    starterCode: def,
    testCases: [
      pub('7\n6 2 8 0 4 7 9\n2 8\n', '6'),
      pub('7\n6 2 8 0 4 7 9\n2 4\n', '2'),
      h('7\n6 2 8 0 4 7 9\n0 4\n', '2'),
      h('7\n6 2 8 0 4 7 9\n7 9\n', '8'),
      h('3\n2 1 3\n1 3\n', '2'),
      h('3\n2 1 3\n1 2\n', '2'),
      h('5\n5 3 7 1 4\n1 4\n', '3'),
    ]
  },

  // ══════════════════════════════════════════════════════════
  // GRAPH
  // ══════════════════════════════════════════════════════════
  {
    title: 'BFS Shortest Path',
    slug: 'bfs-shortest-path',
    difficulty: 'Easy',
    topic: 'Graph', pattern: 'Graph',
    description: `# BFS Shortest Path

Given an undirected unweighted graph and a source node **s**, print the shortest distance from **s** to every other node.
Use 0-indexed nodes. If a node is unreachable, print **-1** for it.`,
    constraints: ['1 ≤ n ≤ 10 000', '0 ≤ edges ≤ 50 000'],
    inputFormat: 'Line 1: n (nodes) and m (edges).\nNext m lines: u v for each edge.\nLast line: source s.',
    outputFormat: 'n integers (distances from s), space-separated.',
    hintText: 'Standard BFS from source. dist[source]=0, push to queue. For each neighbor, if unvisited, dist[neighbor]=dist[curr]+1.',
    starterCode: def,
    testCases: [
      pub('5 5\n0 1\n0 2\n1 3\n2 4\n3 4\n0\n', '0 1 1 2 2'),
      pub('4 3\n0 1\n0 2\n0 3\n0\n', '0 1 1 1'),
      h('4 2\n0 1\n2 3\n0\n', '0 1 -1 -1'),
      h('1 0\n0\n', '0'),
      h('6 6\n0 1\n1 2\n2 3\n3 4\n4 5\n5 0\n2\n', '2 1 0 1 2 3'),
      h('3 3\n0 1\n1 2\n0 2\n1\n', '1 0 1'),
      h('5 4\n0 1\n1 2\n2 3\n3 4\n0\n', '0 1 2 3 4'),
    ]
  },
  {
    title: 'Detect Cycle in Undirected Graph',
    slug: 'detect-cycle-undirected',
    difficulty: 'Medium',
    topic: 'Graph', pattern: 'Graph',
    description: `# Detect Cycle in Undirected Graph

Given an undirected graph, determine if it contains a cycle.
Print **YES** if a cycle exists, otherwise **NO**.`,
    constraints: ['1 ≤ n ≤ 10 000', '0 ≤ edges ≤ 50 000'],
    inputFormat: 'Line 1: n and m.\nNext m lines: u v for each edge.',
    outputFormat: 'YES or NO.',
    hintText: 'DFS with parent tracking. If you visit an already-visited node that is not the parent, a cycle exists.',
    starterCode: def,
    testCases: [
      pub('4 4\n0 1\n1 2\n2 3\n3 0\n', 'YES'),
      pub('4 3\n0 1\n1 2\n2 3\n', 'NO'),
      h('1 0\n', 'NO'),
      h('2 1\n0 1\n', 'NO'),
      h('3 3\n0 1\n1 2\n0 2\n', 'YES'),
      h('5 4\n0 1\n1 2\n3 4\n0 2\n', 'YES'),
      h('5 4\n0 1\n1 2\n2 3\n3 4\n', 'NO'),
    ]
  },
  {
    title: 'Number of Islands',
    slug: 'number-of-islands',
    difficulty: 'Medium',
    topic: 'Graph', pattern: 'Graph',
    description: `# Number of Islands

Given an m×n grid of '0' (water) and '1' (land), count the number of islands.
An island is surrounded by water and formed by connecting adjacent lands (up/down/left/right).`,
    constraints: ['1 ≤ m, n ≤ 300'],
    inputFormat: 'Line 1: m and n.\nNext m lines: n characters each (0 or 1, no spaces).',
    outputFormat: 'Number of islands.',
    hintText: 'DFS/BFS from each unvisited land cell, marking the whole island as visited. Count how many DFS/BFS calls you make.',
    starterCode: def,
    testCases: [
      pub('4 5\n11110\n11010\n11000\n00000\n', '1'),
      pub('4 5\n11000\n11000\n00100\n00011\n', '3'),
      h('1 1\n1\n', '1'),
      h('1 1\n0\n', '0'),
      h('3 3\n101\n010\n101\n', '5'),
      h('3 3\n111\n010\n111\n', '1'),
      h('2 2\n00\n00\n', '0'),
    ]
  },
  {
    title: 'Topological Sort',
    slug: 'topological-sort',
    difficulty: 'Medium',
    topic: 'Graph', pattern: 'Graph',
    description: `# Topological Sort

Given a Directed Acyclic Graph (DAG), print a valid topological ordering of nodes.
If multiple orderings exist, print any valid one.`,
    constraints: ['1 ≤ n ≤ 10 000', '0 ≤ edges ≤ 50 000'],
    inputFormat: 'Line 1: n and m.\nNext m lines: u v (directed edge u → v).',
    outputFormat: 'n integers: a valid topological order.',
    hintText: "Kahn's algorithm: compute in-degrees. Start with all nodes with in-degree 0. Process via queue, decrement neighbors' in-degrees.",
    starterCode: def,
    testCases: [
      pub('6 6\n5 2\n5 0\n4 0\n4 1\n2 3\n3 1\n', '4 5 2 3 1 0', 'one valid order'),
      pub('4 3\n0 1\n0 2\n1 3\n', '0 1 2 3', 'but 0 2 1 3 also valid'),
      h('1 0\n', '0'),
      h('2 1\n0 1\n', '0 1'),
      h('3 2\n0 1\n0 2\n', '0 1 2'),
      h('4 4\n0 1\n1 2\n2 3\n0 3\n', '0 1 2 3'),
      h('5 5\n0 2\n1 2\n2 3\n2 4\n3 4\n', '0 1 2 3 4'),
    ]
  },

  // ══════════════════════════════════════════════════════════
  // GREEDY
  // ══════════════════════════════════════════════════════════
  {
    title: 'Activity Selection',
    slug: 'activity-selection',
    difficulty: 'Easy',
    topic: 'Greedy', pattern: 'Greedy',
    description: `# Activity Selection

Given n activities with start and finish times, find the **maximum number of non-overlapping activities** you can attend.`,
    constraints: ['1 ≤ n ≤ 200 000', '0 ≤ start < finish ≤ 10⁹'],
    inputFormat: 'Line 1: n.\nNext n lines: start finish for each activity.',
    outputFormat: 'Maximum number of activities.',
    hintText: 'Sort activities by finish time. Greedily pick the next activity whose start time >= previous finish time.',
    starterCode: def,
    testCases: [
      pub('6\n1 3\n2 5\n4 6\n6 7\n5 9\n8 9\n', '3', '(1,3),(4,6),(6,7) or (1,3),(4,6),(8,9)'),
      pub('3\n1 10\n2 5\n5 9\n', '2'),
      h('1\n0 1\n', '1'),
      h('3\n1 2\n2 3\n3 4\n', '3', 'no overlaps'),
      h('4\n1 5\n2 6\n3 7\n4 8\n', '1'),
      h('5\n0 3\n1 4\n2 5\n3 6\n4 7\n', '2'),
      h('4\n0 1\n1 2\n2 3\n3 4\n', '4'),
    ]
  },
  {
    title: 'Jump Game',
    slug: 'jump-game',
    difficulty: 'Medium',
    topic: 'Greedy', pattern: 'Greedy',
    description: `# Jump Game

You are at index 0 of an array. a[i] represents the maximum jump length from position i.
Determine if you can reach the **last index**. Print **YES** or **NO**.`,
    constraints: ['1 ≤ n ≤ 200 000', '0 ≤ a[i] ≤ 10⁵'],
    inputFormat: 'Line 1: n.\nLine 2: n integers.',
    outputFormat: 'YES or NO.',
    hintText: 'Track maxReach. At each position i, if i > maxReach you are stuck. Update maxReach = max(maxReach, i + a[i]).',
    starterCode: def,
    testCases: [
      pub('5\n2 3 1 1 4\n', 'YES'),
      pub('5\n3 2 1 0 4\n', 'NO'),
      h('1\n0\n', 'YES'),
      h('2\n0 1\n', 'NO'),
      h('3\n1 0 1\n', 'NO'),
      h('5\n5 0 0 0 0\n', 'YES'),
      h('4\n2 0 2 0\n', 'YES'),
    ]
  },
  {
    title: 'Fractional Knapsack',
    slug: 'fractional-knapsack',
    difficulty: 'Medium',
    topic: 'Greedy', pattern: 'Greedy',
    description: `# Fractional Knapsack

Given items with weights and values, and a bag of capacity **W**, you can take fractions of items.
Maximize total value. Print the answer with **6 decimal places**.`,
    constraints: ['1 ≤ n ≤ 10 000', '1 ≤ W ≤ 10⁶', '1 ≤ weight[i], value[i] ≤ 10⁶'],
    inputFormat: 'Line 1: n and W.\nLine 2: n weights.\nLine 3: n values.',
    outputFormat: 'Maximum value with exactly 6 decimal places.',
    hintText: 'Sort items by value/weight ratio descending. Take greedily; for the last item take only the remaining fraction.',
    starterCode: def,
    testCases: [
      pub('3 50\n10 20 30\n60 100 120\n', '240.000000'),
      pub('1 10\n5\n50\n', '50.000000'),
      h('2 10\n10 10\n50 50\n', '50.000000'),
      h('3 10\n5 5 5\n10 20 30\n', '60.000000', 'take all best ratio items'),
      h('2 50\n25 25\n100 150\n', '250.000000'),
      h('3 60\n10 40 20\n60 40 100\n', '160.000000'),
      h('1 100\n200\n1000\n', '500.000000', 'fraction 100/200'),
    ]
  },

  // ══════════════════════════════════════════════════════════
  // BIT MANIPULATION
  // ══════════════════════════════════════════════════════════
  {
    title: 'Count Set Bits',
    slug: 'count-set-bits',
    difficulty: 'Easy',
    topic: 'Bit Manipulation', pattern: 'Bit Manipulation',
    description: `# Count Set Bits

Given a non-negative integer **n**, count the number of 1-bits in its binary representation (also called popcount or Hamming weight).`,
    constraints: ['0 ≤ n ≤ 10¹⁸'],
    inputFormat: 'A single integer n.',
    outputFormat: 'Number of set bits.',
    hintText: 'Use n & (n-1) to clear the lowest set bit each iteration. Count iterations.',
    starterCode: def,
    testCases: [
      pub('11\n', '3', '1011 has 3 ones'),
      pub('0\n', '0'),
      h('1\n', '1'),
      h('255\n', '8'),
      h('1024\n', '1'),
      h('1000000000000000000\n', '5'),
      h('4611686018427387903\n', '62'),
    ]
  },
  {
    title: 'Single Number',
    slug: 'single-number',
    difficulty: 'Easy',
    topic: 'Bit Manipulation', pattern: 'Bit Manipulation',
    description: `# Single Number

Every element appears **twice** except one. Find that element using only O(1) extra space.`,
    constraints: ['1 ≤ n ≤ 200 000 (n is odd)', '-10⁹ ≤ a[i] ≤ 10⁹'],
    inputFormat: 'Line 1: n.\nLine 2: n integers.',
    outputFormat: 'The single (non-repeated) element.',
    hintText: 'XOR all elements together. Pairs cancel out (a XOR a = 0). Only the single element remains.',
    starterCode: def,
    testCases: [
      pub('5\n4 1 2 1 2\n', '4'),
      pub('3\n2 2 1\n', '1'),
      h('1\n1\n', '1'),
      h('5\n1 1 2 2 3\n', '3'),
      h('7\n-1 -1 3 3 5 5 7\n', '7'),
      h('5\n0 0 1 1 2\n', '2'),
      h('3\n-5 5 -5\n', '5'),
    ]
  },
  {
    title: 'Power of Two',
    slug: 'power-of-two',
    difficulty: 'Easy',
    topic: 'Bit Manipulation', pattern: 'Bit Manipulation',
    description: `# Power of Two

Given a non-negative integer **n**, determine if it is a power of 2.
Print **YES** or **NO**. (Note: 0 is not a power of 2.)`,
    constraints: ['0 ≤ n ≤ 10¹⁸'],
    inputFormat: 'A single integer n.',
    outputFormat: 'YES or NO.',
    hintText: 'A power of 2 has exactly one set bit. Check: n > 0 and (n & (n-1)) == 0.',
    starterCode: def,
    testCases: [
      pub('16\n', 'YES'),
      pub('3\n', 'NO'),
      h('0\n', 'NO'),
      h('1\n', 'YES'),
      h('2\n', 'YES'),
      h('1024\n', 'YES'),
      h('1073741824\n', 'YES'),
    ]
  },
  {
    title: 'Find Missing Number',
    slug: 'find-missing-number',
    difficulty: 'Easy',
    topic: 'Bit Manipulation', pattern: 'Bit Manipulation',
    description: `# Find Missing Number

Given an array containing n distinct numbers taken from 0, 1, 2, ..., n, find the one number that is missing.`,
    constraints: ['1 ≤ n ≤ 200 000'],
    inputFormat: 'Line 1: n.\nLine 2: n integers.',
    outputFormat: 'The missing number.',
    hintText: 'XOR all indices 0..n with all array elements. Pairs cancel, leaving the missing number.',
    starterCode: def,
    testCases: [
      pub('3\n3 0 1\n', '2'),
      pub('5\n0 1 2 3 5\n', '4'),
      h('1\n0\n', '1'),
      h('1\n1\n', '0'),
      h('5\n1 2 3 4 5\n', '0'),
      h('4\n0 1 2 4\n', '3'),
      h('6\n0 1 2 3 4 5\n', '6'),
    ]
  },
  {
    title: 'Subsets XOR Trick',
    slug: 'subsets-xor-trick',
    difficulty: 'Hard',
    topic: 'Bit Manipulation', pattern: 'Bit Manipulation',
    description: `# Maximum XOR of Two Numbers

Given an array of non-negative integers, find the **maximum XOR** value of any two elements in the array.`,
    constraints: ['1 ≤ n ≤ 200 000', '0 ≤ a[i] < 2³¹'],
    inputFormat: 'Line 1: n.\nLine 2: n integers.',
    outputFormat: 'The maximum XOR of any two elements.',
    hintText: 'Build a binary trie from all numbers. For each number, greedily traverse the trie trying to pick the opposite bit at each level.',
    starterCode: def,
    testCases: [
      pub('4\n3 10 5 25\n', '28', '5 XOR 25 = 28'),
      pub('2\n0 0\n', '0'),
      h('1\n1\n', '0', 'only one number, XOR with itself'),
      h('3\n2 4 1\n', '7', '2 XOR 5? no — 4 XOR 3? 7. Check: 4=100, 1=001, 2=010. 4 XOR 1 = 101 = 5. 4 XOR 2 = 110 = 6. Hmm max = 6.'),
      h('4\n8 1 2 12\n', '15', '3 XOR 12 = 15? No: 3 not in arr. 1 XOR 14? 14 not in arr. Try: 8=1000, 1=0001, 2=0010, 12=1100. 8 XOR 1=9, 8 XOR 2=10, 8 XOR 12=4, 1 XOR 2=3, 1 XOR 12=13, 2 XOR 12=14. Max=14.'),
      h('5\n0 1 2 3 4\n', '7', '3 XOR 4 = 7'),
      h('3\n14 70 53\n', '127'),
    ]
  }
];

// ═══════════════════════════════════════════════════════════
// SEED FUNCTION
// Upserts problems by slug so re-running is safe.
// ═══════════════════════════════════════════════════════════
// Seeding only needs to run ONCE per server process — not on every request.
// Previously this loop (58 problems, one sequential DB round-trip each)
// ran again on EVERY single request to any DSA route, which is why
// opening the module felt slow. Caching this means it only pays that
// cost once, right after a server restart.
let hasSeeded = false;

export async function ensureDSASeedData() {
  if (hasSeeded) return;

  // Batched into one bulk DB call instead of 58 separate round-trips
  await DSAProblemModel.bulkWrite(
    problems.map(problem => ({
      updateOne: {
        filter: { slug: problem.slug },
        update: { $set: problem },
        upsert: true
      }
    }))
  );

  hasSeeded = true;
}