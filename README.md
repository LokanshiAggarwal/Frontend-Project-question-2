# Stickers to Spell Words

A JavaScript solution to the "Stickers to Spell Words" problem, extended with a per-sticker cost.

## Problem

Given `n` types of stickers (each with a lowercase word on it) and a `target` string, find the **minimum number of stickers** needed to spell `target` by cutting out individual letters and rearranging them. Each sticker type can be used any number of times. If it is impossible, return `-1`.

## What I Implemented

| Requirement | Status |
|---|---|
| Classic problem (minimum number of stickers) | Implemented |
| Per-sticker cost (minimize total cost instead of count) | Implemented |
| Impossible case returns `-1` | Implemented |
| Category limit (only K stickers per category) | Not implemented |
| Target length up to 10^5 | Not supported (see Limitations) |

## Approach

Memoized DFS (top-down dynamic programming) over the **remaining letters** of the target.

1. **Early exit:** if any target letter appears in no sticker, return `-1` immediately.
2. **Count letters:** pre-compute the letter frequency of every sticker.
3. **Sort the target** once at the start. Removing letters from a sorted string keeps it sorted, so equivalent states (for example `"ab"` and `"ba"`) share a single memo entry.
4. **Recursive step:** take the first remaining letter. Only stickers that contain this letter are tried, so every branch makes progress and the recursion always terminates.
5. For each such sticker, remove every letter it can cover from the remaining string, then recurse on what is left.
6. **Take the minimum** of `cost[sticker] + solve(next)` across all candidate stickers.
7. Results are cached in a `Map`, including unreachable states (`Infinity`).

The `costs` parameter is optional and defaults to 1 per sticker, so the classic behavior is unchanged.

## Usage

```javascript
minStickers(stickers, target, costs?)
```

- `stickers`: array of strings
- `target`: string
- `costs` (optional): array of numbers, one per sticker (default: all `1`)
- Returns the minimum number of stickers (or minimum total cost), or `-1` if impossible

Run the file with:

```bash
node stickers.js
```

## Test Results

| Test | Input | Expected | Output |
|---|---|---|---|
| Test 1 | `["with","example","science"]`, `"thehat"` | 3 | 3 |
| Test 2 | `["notice","possible"]`, `"basic"` | -1 | -1 |
| Test 3 | `["these","guess","about","garden","him"]`, `"atomher"` | 3 | 3 |
| Test 4 | `["a","b","c"]`, `"abcabc"` | 6 | 6 |
| Cost 1 | `["a","ab"]`, `"ab"`, costs `[1,5]` | 5 | 5 |
| Cost 2 | `["a","b","ab"]`, `"ab"`, costs `[1,1,5]` | 2 | 2 |

All tests pass.

## Complexity

- **Time:** exponential in the length of the target, roughly `O(2^m * n * m)` in the worst case, where `m` is the target length and `n` the number of stickers. The number of states is bounded by the sub-multisets of the target's letters.
- **Space:** `O(2^m)` for the memo table in the worst case, plus recursion depth up to `m`.

This is well suited to short targets, such as a concatenation of two common words.

## Limitations

- **Large targets (up to 10^5):** the memo state space is exponential, so this approach cannot handle targets of that size. A different formulation (for example, working on a 52-letter count vector with integer linear programming or a greedy heuristic) would be needed.
- **Category limit (K stickers per category):** this adds another dimension to the state and makes the problem a harder constrained covering problem. It is not implemented here.
- **Example mismatch:** the examples in the problem statement (`P = "AAAB"`, `Q = "A+B"`) describe a regex-style pattern matching problem, not the stickers problem. I solved the stickers problem as described in the title and main statement.

## Possible Improvements

- Remove stickers that have no letters in common with the target.
- Remove stickers that are subsets of another (equal or cheaper) sticker.
- Use a 26/52-length array instead of an object for letter counts.
- For the category limit and very large targets, use ILP or a cost-per-useful-letter greedy heuristic and document it as approximate.

## Conclusion

The solution correctly solves the classic Stickers to Spell Words problem and its cost-minimizing variant, passing all test cases including the impossible case. It uses a memoized DFS with a sorted target and early exit to keep the state space small. It is efficient for short targets but exponential in general, so the category-limit and 10^5-length-target constraints are out of scope and would need a different technique.
