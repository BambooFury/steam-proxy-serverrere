import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

const USD_TO_UAH = 41.87; // актуальный курс

app.get('/specials', async (req, res) => {
  try {
    const response = await fetch('https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=1000');
    const deals = await response.json();

    const formatted = deals.map(deal => {
      const priceOldUAH = Math.round(parseFloat(deal.normalPrice) * USD_TO_UAH * 100);
      const priceNewUAH = Math.round(parseFloat(deal.salePrice) * USD_TO_UAH * 100);

      return {
        appid: deal.steamAppID || deal.gameID,
        name: deal.title,
        img: deal.steamAppID
          ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${deal.steamAppID}/capsule_616x353.jpg`
          : deal.thumb,
        old: priceOldUAH,
        new: priceNewUAH,
        discount: Math.round(parseFloat(deal.savings)),
        url: deal.steamAppID
          ? `https://store.steampowered.com/app/${deal.steamAppID}/`
          : `https://store.steampowered.com/`
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('Ошибка при загрузке скидок:', err);
    res.status(500).json({ error: 'Не удалось получить скидки' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Steam API работает на порту ${PORT}`));
