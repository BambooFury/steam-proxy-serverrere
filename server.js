import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

app.get('/specials', async (req, res) => {
  try {
    const response = await fetch(
      'https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=1000'
    );
    const deals = await response.json();

    const formatted = deals.map(deal => ({
      appid: deal.steamAppID || deal.gameID,
      name: deal.title,
      img: deal.thumb,
      old: Math.round(parseFloat(deal.normalPrice) * 100),
      new: Math.round(parseFloat(deal.salePrice) * 100),
      discount: Math.round(parseFloat(deal.savings)),
      url: deal.steamAppID
        ? `https://store.steampowered.com/app/${deal.steamAppID}/`
        : `https://store.steampowered.com/`
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Ошибка при загрузке скидок:', err);
    res.status(500).json({ error: 'Не удалось получить скидки' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API запущен на порту ${PORT}`));
