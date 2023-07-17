const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const app = express();
const rateLimit = require('express-rate-limit')
require('dotenv').config();

app.use(cors());

// API KEY
const API_KEY = process.env.REACT_APP_API_KEY

// RATE LIMITER
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 745,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// MONGODB CONNECTION
const mongo_host = process.env.REACT_APP_MONGO_HOST;
const mongo_replica = process.env.REACT_APP_MONGO_REPLICA_SET;
const mongo_port = process.env.REACT_APP_MONGO_PORT;
const mongo_user = process.env.REACT_APP_MONGO_USER;
const mongo_pass = process.env.REACT_APP_MONGO_PASS;
const mongo_db = process.env.REACT_APP_MONGO_DB;
mongoose.set("strictQuery", false);
mongoose.connect(`mongodb+srv://${mongo_user}:${mongo_pass}@${mongo_host}/${mongo_db}?tls=true&authSource=admin&replicaSet=${mongo_replica}`);
const db = mongoose.connection;
db.on('error', error => console.log(error));
db.once('connected', () => {
  console.log(`MongoDB connected -> ${mongo_host} : ${mongo_port}.`);
  //db.collection('').deleteMany(); // delete collection data
  //db.dropDatabase(); // delete database
});

// RUN SERVER
try {
  const port = process.env.REACT_APP_NODE_PORT
  app.listen(port, () => console.log(`Server is running -> 127.0.0.1 : ${port}.`));
} catch (error) {
  console.log(error);
}

// STOCK LIST
app.get('/api/stocklist', (req, res) => {
  const STOCKLIST_CACHE_TIME = 1000 * 60 * 60 * 24;; // 60 minutes
  const STOCKLIST_ENDPOINT = `https://financialmodelingprep.com/api/v3/stock-screener?marketCapMoreThan=1&volumeMoreThan=1&isActivelyTrading=true&isEtf=false&exchange=NASDAQ,NYSE,AMEX,TSX,EURONEXT&apikey=${API_KEY}`;
  cachedStockList('stocklist', req, res, STOCKLIST_ENDPOINT, STOCKLIST_CACHE_TIME);
})

// PROFILE
app.get('/api/profile', (req, res) => {
  const SYMBOL = req.query.symbol;
  const PROFILE_CACHE_TIME = 1000 * 60 * 60; // 60 minutes
  const PROFILE_ENDPOINT = `https://financialmodelingprep.com/api/v3/profile/${SYMBOL}?apikey=${API_KEY}`;
  cachedStockData('profile', req, res, SYMBOL, PROFILE_ENDPOINT, PROFILE_CACHE_TIME);
});

// QUOTE
app.get('/api/quote', (req, res) => {
  const SYMBOL = req.query.symbol;
  const QUOTE_CACHE_TIME = 1000 * 60 * 5 // 5 minutes
  const QUOTE_ENDPOINT = `https://financialmodelingprep.com/api/v3/quote/${SYMBOL}?apikey=${API_KEY}`;
  cachedStockData('quote', req, res, SYMBOL, QUOTE_ENDPOINT, QUOTE_CACHE_TIME);
});

// KEY METRICS
app.get('/api/keymetrics', (req, res) => {
  const SYMBOL = req.query.symbol;
  const KEY_METRIC_CACHE_TIME = 1000 * 60 * 60; // 60 minutes
  const KEY_METRIC_ENDPOINT = `https://financialmodelingprep.com/api/v3/key-metrics/${SYMBOL}?limit=1&apikey=${API_KEY}`;
  cachedStockData('keymetric', req, res, SYMBOL, KEY_METRIC_ENDPOINT, KEY_METRIC_CACHE_TIME);
});

// INCOME STATEMENT
app.get('/api/income', (req, res) => {
  const SYMBOL = req.query.symbol;
  const INCOME_CACHE_TIME = 1000 * 60 * 60; // 30 minutes
  const INCOME_ENDPOINT = `https://financialmodelingprep.com/api/v3/income-statement/${SYMBOL}?limit=1&apikey=${API_KEY}`;
  cachedStockData('income', req, res, SYMBOL, INCOME_ENDPOINT, INCOME_CACHE_TIME);
});

// CASH FLOW STATEMENT
app.get('/api/cash', (req, res) => {
  const SYMBOL = req.query.symbol;
  const CASH_CACHE_TIME = 1000 * 60 * 60; // 60 minutes
  const CASH_ENDPOINT = `https://financialmodelingprep.com/api/v3/cash-flow-statement/${SYMBOL}?limit=1&apikey=${API_KEY}`;
  cachedStockData('cash', req, res, SYMBOL, CASH_ENDPOINT, CASH_CACHE_TIME);
});

// ANNUAL STATEMENT
app.get('/api/annual', (req, res) => {
  const SYMBOL = req.query.symbol;
  const ANNUAL_CACHE_TIME = 1000 * 60 * 60; // 60 minutes
  const ANNUAL_ENDPOINT = `https://financialmodelingprep.com/api/v3/income-statement/${SYMBOL}?limit=120&apikey=${API_KEY}`;
  cachedStockData('annual', req, res, SYMBOL, ANNUAL_ENDPOINT, ANNUAL_CACHE_TIME);
});

// QUARTERLY STATEMENT
app.get('/api/quarterly', (req, res) => {
  const SYMBOL = req.query.symbol;
  const QUARTERLY_CACHE_TIME = 1000 * 60 * 60; // 60 minutes
  const QUARTERLY_ENDPOINT = `https://financialmodelingprep.com/api/v3/income-statement/${SYMBOL}?period=quarter&limit=400&apikey=${API_KEY}`;
  cachedStockData('quarterly', req, res, SYMBOL, QUARTERLY_ENDPOINT, QUARTERLY_CACHE_TIME);
});

// INDEXES
app.get('/api/indexes', (req, res) => {
  const INDEX_CACHE_TIME = 1000 * 60 * 1 // 1 minutes
  const INDEX_ENDPOINT = `https://financialmodelingprep.com/api/v3/quote/%5EGSPC,%5EDJI,%5EIXIC?apikey=${API_KEY}`;
  cachedTickerData('indexes', req, res, INDEX_ENDPOINT, INDEX_CACHE_TIME);
});

// GAINERS
app.get('/api/gainers', (req, res) => {
  const GAINER_CACHE_TIME = 1000 * 60 * 1 // 1 minutes
  const GAINER_ENDPOINT = `https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${API_KEY}`;
  cachedTickerData('gainers', req, res, GAINER_ENDPOINT, GAINER_CACHE_TIME);
});

// LOSERS
app.get('/api/losers', (req, res) => {
  const LOSER_CACHE_TIME = 1000 * 60 * 1 // 1 minutes
  const LOSER_ENDPOINT = `https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=${API_KEY}`;
  cachedTickerData('losers', req, res, LOSER_ENDPOINT, LOSER_CACHE_TIME);
});

// PRICE TARGETS
app.get('/api/pricetargets', (req, res) => {
  const SYMBOL = req.query.symbol;
  const PRICE_TARGETS_CACHE_TIME = 1000 * 60 * 120 // 120 minutes
  const PRICE_TARGETS_ENDPOINT = `https://financialmodelingprep.com/api/v4/price-target?symbol=${SYMBOL}&apikey=${API_KEY}`;
  cachedStockData('pricetargets', req, res, SYMBOL, PRICE_TARGETS_ENDPOINT, PRICE_TARGETS_CACHE_TIME);
});

// PRICE TARGET CONSENSUS
app.get('/api/pricetargetconsensus', (req, res) => {
  const SYMBOL = req.query.symbol;
  const PRICE_TARGET_CONSENSUS_CACHE_TIME = 1000 * 60 * 120 // 120 minutes
  const PRICE_TARGET_CONSENSUS_ENDPOINT = `https://financialmodelingprep.com/api/v4/price-target-consensus?symbol=${SYMBOL}&apikey=${API_KEY}`;
  cachedStockData('pricetargetconsensus', req, res, SYMBOL, PRICE_TARGET_CONSENSUS_ENDPOINT, PRICE_TARGET_CONSENSUS_CACHE_TIME);
});

// DAILY HISTORICAL PRICING
app.get('/api/dailyhistory', (req, res) => {
  const SYMBOL = req.query.symbol;
  const DAILY_HISTORY_CACHE_TIME = 1000 * 60 * 5 // 5 minutes
  const DAILY_HISTORY_ENDPOINT = `https://financialmodelingprep.com/api/v3/historical-price-full/${SYMBOL}?apikey=${API_KEY}`;
  cachedStockData('dailyhistory', req, res, SYMBOL, DAILY_HISTORY_ENDPOINT, DAILY_HISTORY_CACHE_TIME);
});

// TOP 100 MARKET CAP
app.get('/api/topmarketcap', (req, res) => {
  const TOP_MARKET_CAP_CACHE_TIME = 1000 * 60 * 1 // 1 minute
  const TOP_MARKET_CAP_ENDPOINT = `https://financialmodelingprep.com/api/v3/stock-screener?marketCapMoreThan=1000000000&volumeMoreThan=1&exchange=NYSE,NASDAQ,AMEX,EURONEXT,TSX&isActivelyTrading=true&isEtf=false&limit=100&apikey=${API_KEY}`;
  cachedTickerData('topmarketcap', req, res, TOP_MARKET_CAP_ENDPOINT, TOP_MARKET_CAP_CACHE_TIME);
});

// S&P500
app.get('/api/sp500', (req, res) => {
  const SP500_CACHE_TIME = 1000 * 60 * 1 // 1 minute
  const SP500_ENDPOINT = `https://financialmodelingprep.com/api/v3/sp500_constituent?apikey=${API_KEY}`;
  cachedTickerData('sp500', req, res, SP500_ENDPOINT, SP500_CACHE_TIME);
});

// NASDAQ
app.get('/api/nasdaq', (req, res) => {
  const NASDAQ_CACHE_TIME = 1000 * 60 * 1 // 1 minute
  const NASDAQ_ENDPOINT = `https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=${API_KEY}`;
  cachedTickerData('nasdaq', req, res, NASDAQ_ENDPOINT, NASDAQ_CACHE_TIME);
});

// DOW JONES
app.get('/api/dowjones', (req, res) => {
  const DOWJONES_CACHE_TIME = 1000 * 60 * 1 // 1 minute
  const DOWJONES_ENDPOINT = `https://financialmodelingprep.com/api/v3/dowjones_constituent?apikey=${API_KEY}`;
  cachedTickerData('dowjones', req, res, DOWJONES_ENDPOINT, DOWJONES_CACHE_TIME);
});

// NEWS ARTICLES
app.get('/api/news', (req, res) => {
  const NEWS_CACHE_TIME = 1000 * 60 * 1 // 1 minute
  const NEWS_ENDPOINT = `https://financialmodelingprep.com/api/v3/stock_news?limit=100&apikey=${API_KEY}`;
  cachedTickerData('news', req, res, NEWS_ENDPOINT, NEWS_CACHE_TIME);
});

// requires a symbol to be passed
function cachedStockData(type, req, res, symbol, end_point, cache_time) {
  try {
    db.collection(type).countDocuments(
      {
        symbol: symbol, 
        timestamp: {
          $gt: Date.now() - cache_time
        }
      }
    )
    .then((counter) => {
      if (counter === 0) {
        const options = {
          method: 'GET',
          url: end_point,
        };
    
        axios.request(options).then((response) => {
          db.collection(type).replaceOne(
            {
              symbol: symbol
            },
            {
              symbol: symbol, 
              timestamp: Date.now(),
              [type]: response.data
            },
            {
              upsert: true
            }
          );

          res.json(response.data);
          access_log(API_KEY, type, end_point, req.socket.remoteAddress, true);
          call_history();
          console.log(`API request (${type}) -> ${new Date().toUTCString()} -> Client: ${req.socket.remoteAddress}`);
        }).catch((error) => {
          console.log(error); 
        });
      } else {
        db.collection(type).find(
          {
            symbol: symbol
          }
        ).forEach((response) => {
          if (response[type]) {
            //console.log(response[type]);
            res.json(response[type]);
          }
        });

        console.log(`Database request (${type}) -> (${symbol}) -> ${new Date().toUTCString()} -> Client: ${req.socket.remoteAddress}`);
      }
    });    
  } catch (error) {
    console.log(error);
  }
}

// does not require a symbol to be passed
function cachedTickerData(type, req, res, end_point, cache_time) {
  try {
    db.collection(type).countDocuments(
      {
        type: type, 
        timestamp: {
          $gt: Date.now() - cache_time
        }
      }
    )
    .then((counter) => {
      if (counter === 0) {
        const options = {
          method: 'GET',
          url: end_point,
        };
    
        axios.request(options).then((response) => {
          db.collection(type).replaceOne(
            {
              type: type
            },
            {
              type: type, 
              timestamp: Date.now(),
              [type]: response.data
            },
            {
              upsert: true
            }
          );

          res.json(response.data);
          access_log(API_KEY, type, end_point, req.socket.remoteAddress, true);
          call_history();
          console.log(`API request (${type}) -> ${new Date().toUTCString()} -> Client: ${req.socket.remoteAddress}`);
        }).catch((error) => {
          console.log(error); 
        });
      } else {
        db.collection(type).find(
          {
            type: type
          }
        ).forEach((response) => {
          if (response[type]) {
            //console.log(response[type]);
            res.json(response[type]);
          }
        });

        console.log(`Database request (${type}) -> ${new Date().toUTCString()} -> Client: ${req.socket.remoteAddress}`);
      }
    });    
  } catch (error) {
    console.log(error);
  }
}

// does not require a symbol to be passed
function cachedStockList(type, req, res, end_point, cache_time) {
  try {
    db.collection(type).countDocuments(
      {
        type: type, 
        timestamp: {
          $gt: Date.now() - cache_time
        }
      }
    )
    .then((counter) => {
      if (counter === 0) {
        const options = {
          method: 'GET',
          url: end_point,
        };
    
        axios.request(options).then((response) => {
          db.collection(type).replaceOne(
            {
              type: type
            },
            {
              type: type, 
              timestamp: Date.now(),
              [type]: response.data
            },
            {
              upsert: true
            }
          );

          access_log(API_KEY, type, end_point, req.socket.remoteAddress, true);
          call_history();
          console.log(`API request (${type}) -> ${new Date().toUTCString()} -> Client: ${req.socket.remoteAddress}`);
        }).catch((error) => {
          console.log(error); 
        });
      } else {
        db.collection(type).find().forEach((response) => {
          if (response[type]) {
            //console.log(response[type]);
            res.json(response[type]);
          }
        });

        console.log(`Database request (${type}) -> ${new Date().toUTCString()} -> Client: ${req.socket.remoteAddress}`);
      }
    });    
  } catch (error) {
    console.log(error);
  }
}

// count number of calls in the last minute
function call_history() {
  try {
    db.collection('access_log').countDocuments(
      {
        'success': true,
        'timestamp': {
          $gt: Date.now() - (1000 * 60) // 1m
        }
      }
    ).then((counter) => {      
      console.log(`API calls in the last 60s: ${counter}`);
      return counter;
    });
  } catch (error) {
    console.log(error);
  }
}

// log all api calls
function access_log(api_key, type, end_point, client, success) {
  try {
    db.collection('access_log').insertOne(
      {
        api_key: api_key, 
        type: type,
        end_point: end_point,
        datetimestamp: new Date().toUTCString(),
        timestamp: Date.now(),
        client: client,
        success: success
      }
    );
  } catch (error) {
    console.log(error);
  }
}