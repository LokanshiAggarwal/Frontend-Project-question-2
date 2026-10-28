function minStickers(stickers, target, costs = stickers.map(() => 1)) {
  // Early exit: every target letter must exist in at least one sticker
  const available = new Set(stickers.join(""));
  for (const ch of target) {
    if (!available.has(ch)) return -1;
  }

  // Letter counts for each sticker
  const stickerCounts = stickers.map(sticker => {
    const count = {};
    for (const letter of sticker) {
      count[letter] = (count[letter] || 0) + 1;
    }
    return count;
  });

  const memo = new Map();
  memo.set("", 0);

  function solve(remaining) {
    if (memo.has(remaining)) return memo.get(remaining);

    const firstLetter = remaining[0];
    let best = Infinity;

    stickerCounts.forEach((sticker, j) => {
      // Only try stickers that cover the first remaining letter
      if (!sticker[firstLetter]) return;

      const used = {};
      let next = "";

      for (const letter of remaining) {
        if ((used[letter] || 0) < (sticker[letter] || 0)) {
          used[letter] = (used[letter] || 0) + 1;
        } else {
          next += letter;
        }
      }

      const result = solve(next);
      if (result !== Infinity) {
        best = Math.min(best, costs[j] + result);
      }
    });

    memo.set(remaining, best);
    return best;
  }

  // Sort the target so equivalent remaining strings share one memo key
  const answer = solve([...target].sort().join(""));
  return answer === Infinity ? -1 : answer;
}

// ---------- Tests (classic: every sticker costs 1) ----------
console.log("Test 1:", minStickers(["with", "example", "science"], "thehat")); // 3
console.log("Test 2:", minStickers(["notice", "possible"], "basic"));         // -1
console.log("Test 3:", minStickers(["these", "guess", "about", "garden", "him"], "atomher")); // 3
console.log("Test 4:", minStickers(["a", "b", "c"], "abcabc"));               // 6

// ---------- Tests (cost variant) ----------
console.log("Cost 1:", minStickers(["a", "ab"], "ab", [1, 5]));              // 5
console.log("Cost 2:", minStickers(["a", "b", "ab"], "ab", [1, 1, 5]));      // 2



