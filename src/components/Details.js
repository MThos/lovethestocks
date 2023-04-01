import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Subtract, NumberConverter, MonthFromDate } from '../helper.js';
import LoadingIcon from './LoadingIcon.js';
import NoData from './NoData.js';

const Details = () => {
  const [profileData, setProfileData] = useState([]);
  const [quoteData, setQuoteData] = useState([]);
  const [keyMetricData, setKeyMetricData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [cashData, setCashData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const active = (localStorage.getItem('active')) ? localStorage.getItem('active') : 'AAPL';

  useEffect(() => {
    try {
      setLoading(true);

      const endPoints = [
        'http://localhost:8000/profile',
        'http://localhost:8000/quote',
        'http://localhost:8000/keymetrics',
        'http://localhost:8000/income',
        'http://localhost:8000/cash' 
      ];

      axios.all(endPoints.map((endPoint) => axios.get(endPoint, { params: { symbol: active }})))
      .then((response) => {
        console.log(response);
        setProfileData(response[0]['data'][0]);
        setQuoteData(response[1]['data'][0]);
        setKeyMetricData(response[2]['data'][0]);
        setIncomeData(response[3]['data'][0]);
        setCashData(response[4]['data'][0]);
        setLoading(false);
      }).catch((error) => {
        console.log(error);
      });
    } catch (error) {
      console.log(error);
    }
  }, [active]);

  if (isLoading) {
    return (
      <LoadingIcon />
    )
  }

  if ((profileData && quoteData && keyMetricData && incomeData && cashData) &&
      Object.keys(profileData).length > 0 && 
      Object.keys(quoteData).length > 0 && 
      Object.keys(keyMetricData).length > 0 &&
      Object.keys(incomeData).length > 0 &&
      Object.keys(cashData).length > 0) {
    return (
      <section className="fade-in">
        <div className="flex flex-col font-custom font-semibold text-center text-md p-3 mb-10 text-light-purple-800">
          <div className="text-5xl mt-1 font-bold">
            {profileData['symbol']}
          </div>
          <div className="text-xl mt-1">
            {profileData['companyName']}
          </div>      
          <div className="flex flex-row gap-10 m-auto mt-6">
            <div className="flex flex-col">
              <div className="text-xl">PRICE</div>
              <div className="text-green text-5xl">
                ${NumberConverter(quoteData['price'], 2)}
              </div>
              <div className="text-xl">
                <div className={NumberConverter(quoteData['change'], 2, 2).includes('-') ? 'text-red' : 'text-green'}>
                  {NumberConverter(quoteData['change'], 2, 2)} ({NumberConverter(quoteData['changesPercentage'], 1, 2)}%)
                </div>
              </div>
              <div className="flex flex-row gap-3 text-2xl mb-6 mt-6">
                <div className="text-light-red">{NumberConverter(quoteData['dayLow'], 2)}</div>
                <div>&#8212;</div>
                <div className="text-green">{NumberConverter(quoteData['dayHigh'], 2)}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-center gap-10 mb-5">
            <div className="w-32">
              <div className="text-lg">MARKET CAP</div>
              <div className="text-4xl">
                ${NumberConverter(quoteData['marketCap'], 2)}
              </div>
              <div className="text-xl">
                <div className={Subtract(quoteData['price'] * quoteData['sharesOutstanding'], quoteData['previousClose'] * quoteData['sharesOutstanding'], 2, 2).includes('-') ? 'text-light-red' : 'text-green'}>
                  {Subtract(quoteData['price'] * quoteData['sharesOutstanding'], quoteData['previousClose'] * quoteData['sharesOutstanding'], 2, 2)}
                </div>
              </div>
            </div>
            <div className="w-32">
              <div className="text-lg">DAY VOLUME</div>
              <div className="text-4xl">
                {NumberConverter(quoteData['volume'], 1)}
              </div>
              <div className="text-xl">
                <div className={Subtract(quoteData['volume'], quoteData['avgVolume'], 1, 2).includes('-') ? 'text-light-red' : 'text-green'}>
                  {Subtract(quoteData['volume'], quoteData['avgVolume'], 1, 2)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-6">
            <div className="flex flex-row gap-6 m-auto">
              <div className="w-24">
                <div className="text-md">CIK</div>
                <div className="text-2xl">
                  {parseInt(profileData['cik'], 10)}
                </div>
              </div>
              <div className="w-24">
                <div className="text-md">COUNTRY</div>
                <div className="text-2xl">
                  {profileData['country']}
                </div>
              </div>
              <div className="w-24">
                <div className="text-md">CURRENCY</div>
                <div className="text-2xl">
                  {profileData['currency']}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-6 mt-10 m-auto">
              <div className="w-24">
                <div className="text-md">EXCHANGE</div>
                <div className="text-2xl">
                  {profileData['exchangeShortName']}
                </div>
              </div>
              <div className="w-24">
                <div className="text-md">SHARES</div>
                <div className="text-2xl">
                  {NumberConverter(quoteData['sharesOutstanding'], 1)}
                </div>
              </div>
              <div className="w-24">
                <div className="text-md">FISCAL</div>
                <div className="text-2xl">
                  {MonthFromDate(keyMetricData['date'])}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-6 mt-10 m-auto">
              <div className="w-24">
                <div className="text-md">EPS</div>
                <div className="text-2xl">
                  {NumberConverter(quoteData['eps'], 2, 1)}
                </div>
              </div>
              <div className="w-24">
                <div className="text-md">REVENUE</div>
                <div className="text-2xl">
                  {NumberConverter(incomeData['revenue'], 1, 1)}
                </div>
              </div>
              <div className="w-24">
                <div className="text-md">EBITDA</div>
                <div className="text-2xl">
                  {NumberConverter(incomeData['ebitda'], 2, 1)}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-6 mt-10 m-auto">
              <div className="w-24">
                <div className="text-md">NET INCOME</div>
                <div className="text-2xl">
                  {NumberConverter(cashData['netIncome'], 1, 1)}
                </div>
              </div>
              <div className="w-24">
                <div className="text-md">CASH</div>
                <div className="text-2xl">
                  {NumberConverter(cashData['cashAtEndOfPeriod'], 1, 1)}
                </div>
              </div>
              <div className="w-24">
                <div className="text-md">CASH/SHARE</div>
                <div className="text-2xl">
                  {NumberConverter(keyMetricData['cashPerShare'], 1, 1)}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-6 mt-10 m-auto">
              <div className="w-24">
                <div className="text-md">52W HIGH</div>
                <div className="text-2xl">
                  {NumberConverter(quoteData['yearHigh'], 2)}
                </div>
              </div>
              <div className="w-24">
                <div className="text-md">52W LOW</div>
                <div className="text-2xl">
                  {NumberConverter(quoteData['yearLow'], 2)}
                </div>
              </div>
              <div className="w-24">
                <div className="text-md">PE</div>
                <div className="text-2xl">
                  {NumberConverter(keyMetricData['peRatio'], 2, 1)}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-6 mt-10 m-auto">
              <div className="w-24">
                <div className="text-md">50 MA</div>
                <div className="text-2xl">
                  {NumberConverter(quoteData['priceAvg50'], 2)}
                </div>
              </div>
              <div className="w-24">
                <div className="text-md">200 MA</div>
                <div className="text-2xl">
                  {NumberConverter(quoteData['priceAvg200'], 2)}
                </div>
              </div>
              <div className="w-24">
                <div className="text-md">BETA</div>
                <div className="text-2xl">
                  {NumberConverter(profileData['beta'], 2, 1)}
                </div>
              </div>              
            </div>
          </div>
        </div>
      </section>
    )
  } else {
    return (
      <NoData />
    );
  }
  
}

export default Details;