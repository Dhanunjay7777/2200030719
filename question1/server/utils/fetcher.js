function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchNumbers(id) {
  await sleep(100);

  switch (id) {
    case 'p':
      return [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
    case 'f':
      return [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
    case 'e':
      return Array.from({ length: 15 }, (_, i) => (i + 1) * 2);
    case 'r':
      const nums = new Set();
      while (nums.size < 10) {
        nums.add(Math.floor(Math.random() * 100) + 1);
      }
      return Array.from(nums);
    default:
      return [];
  }
}

module.exports = { fetchNumbers };
