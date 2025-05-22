const express = require('express');
const cors = require('cors');
const { fetchNumbers } = require('./utils/fetcher');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;

app.use(cors());

const VALID_IDS = ['p', 'f', 'e', 'r'];
const store = {
  p: [],
  f: [],
  e: [],
  r: []
};

app.get('/numbers/:id', async (req, res) => {
  const id = req.params.id;
  if (!VALID_IDS.includes(id)) {
    return res.status(400).json({ error: 'Invalid number ID' });
  }

  const prev = [...store[id]];
  const startTime = Date.now();

  try {
    const fetched = await fetchNumbers(id);
    const currentSet = new Set(store[id]);

    const newNumbers = [];
    for (const num of fetched) {
      if (!currentSet.has(num)) {
        newNumbers.push(num);
        currentSet.add(num);
      }
    }

    let updated = [...store[id], ...newNumbers];
    if (updated.length > WINDOW_SIZE) {
      updated = updated.slice(-WINDOW_SIZE);
    }

    store[id] = updated;
    const avg = updated.length ? +(updated.reduce((a, b) => a + b, 0) / updated.length).toFixed(2) : 0;

    const timeElapsed = Date.now() - startTime;
    if (timeElapsed < 500) {
      await new Promise(resolve => setTimeout(resolve, 500 - timeElapsed));
    }

    res.json({
      windowPrevState: prev,
      windowCurrState: store[id],
      numbers: newNumbers,
      avg: avg
    });
  } catch (err) {
    res.status(504).json({ error: 'Failed to fetch from third-party server' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
