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
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(true);
  const active = (localStorage.getItem('active')) ? localStorage.getItem('active') : 'AAPL';

  useEffect(() => {
    try {
      setLoading(true);

      const endPoints = [
        'http://localhost:8000/api/profile',
        'http://localhost:8000/api/quote',
        'http://localhost:8000/api/keymetrics',
        'http://localhost:8000/api/income',
        'http://localhost:8000/api/cash' 
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
        if (error.response.status === 429) {
          setLoading(true);
          setErrorMessage('too many requests');
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [active]);

  if (isLoading) {
    return (
      <LoadingIcon message={errorMessage} />
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
        <div className="flex flex-col font-custom font-semibold text-center text-md p-3 mb-10 text-white">
          <div className="text-5xl mt-2 font-bold">
            {profileData['symbol']}
          </div>
          <div className="text-xl mt-1">
            {profileData['companyName']}
          </div>      
          <div className="flex gap-10 m-auto mt-6">
            <div className="flex flex-col">
              <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl">PRICE</div>
              <div className="sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-green">
                ${NumberConverter(quoteData['price'], 2)}
              </div>
              <div className="sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">
                <div className={NumberConverter(quoteData['change'], 2, 2).includes('-') ? 'text-red-400' : 'text-green'}>
                  {NumberConverter(quoteData['change'], 2, 2)} ({NumberConverter(quoteData['changesPercentage'], 1, 2)}%)
                </div>
              </div>
              <div className="flex flex-row gap-3 sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl mb-6 mt-6">
                <div className="text-red-400">{NumberConverter(quoteData['dayLow'], 2)}</div>
                <div>&#8596;</div>
                <div className="text-green">{NumberConverter(quoteData['dayHigh'], 2)}</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-10 mb-5">
            <div className="sm:w-32 md:w-40 lg:w-40 xl:w-80">
              <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl">MARKET CAP</div>
              <div className="sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl">
                ${NumberConverter(quoteData['marketCap'], 2)}
              </div>
              <div className="sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">
                <div className={Subtract(quoteData['price'] * quoteData['sharesOutstanding'], quoteData['previousClose'] * quoteData['sharesOutstanding'], 2, 2).includes('-') ? 'text-red-400' : 'text-green'}>
                  {Subtract(quoteData['price'] * quoteData['sharesOutstanding'], quoteData['previousClose'] * quoteData['sharesOutstanding'], 2, 2)}
                </div>
              </div>
            </div>
            <div className="sm:w-32 md:w-40 lg:w-40 xl:w-80">
              <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl">DAY VOLUME</div>
              <div className="sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl">
                {NumberConverter(quoteData['volume'], 1)}
              </div>
              <div className="sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">
                <div className={Subtract(quoteData['volume'], quoteData['avgVolume'], 1, 2).includes('-') ? 'text-red-400' : 'text-green'}>
                  {Subtract(quoteData['volume'], quoteData['avgVolume'], 1, 2)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-6">
            <div className="flex flex-row gap-6 m-auto">
              <div className="sm:w-24 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">CIK</div>
                <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
                  {parseInt(profileData['cik'], 10)}
                </div>
              </div>
              <div className="sm:w-24 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">COUNTRY</div>
                <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
                  {profileData['country']}
                </div>
              </div>
              <div className="sm:w-24 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">CURRENCY</div>
                <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
                  {profileData['currency']}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-6 mt-10 m-auto">
              <div className="sm:w-24 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">EXCHANGE</div>
                <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
                  {profileData['exchangeShortName']}
                </div>
              </div>
              <div className="sm:w-24 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">SHARES</div>
                <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
                  {NumberConverter(quoteData['sharesOutstanding'], 1)}
                </div>
              </div>
              <div className="sm:w-24 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">FISCAL</div>
                <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
                  {MonthFromDate(keyMetricData['date'])}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-6 mt-10 m-auto">
              <div className="sm:w-24 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">EPS</div>
                <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
                  {NumberConverter(quoteData['eps'], 2, 1)}
                </div>
              </div>
              <div className="sm:w-24 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">REVENUE</div>
                <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
                  {NumberConverter(incomeData['revenue'], 1, 1)}
                </div>
              </div>
              <div className="sm:w-24 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">EBITDA</div>
                <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
                  {NumberConverter(incomeData['ebitda'], 2, 1)}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-6 mt-10 m-auto">
              <div className="sm:w-24 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">NET INCOME</div>
                <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
                  {NumberConverter(cashData['netIncome'], 1, 1)}
                </div>
              </div>
              <div className="sm:w-24 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">CASH</div>
                <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
                  {NumberConverter(cashData['cashAtEndOfPeriod'], 1, 1)}
                </div>
              </div>
              <div className="sm:w-24 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">DEBT&#8594;ASSET</div>
                <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
                  {NumberConverter(keyMetricData['debtToAssets'], 2, 1)}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-6 mt-10 m-auto">
              <div className="sm:w-24 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">52W HIGH</div>
                <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
                  {NumberConverter(quoteData['yearHigh'], 2)}
                </div>
              </div>
              <div className="sm:w-24 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">52W LOW</div>
                <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
                  {NumberConverter(quoteData['yearLow'], 2)}
                </div>
              </div>
              <div className="sm:w-24 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">PE</div>
                <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
                  {NumberConverter(keyMetricData['peRatio'], 2, 1)}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-6 mt-10 m-auto">
              <div className="sm:w-24 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">50 MA</div>
                <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
                  {NumberConverter(quoteData['priceAvg50'], 2)}
                </div>
              </div>
              <div className="sm:w-24 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">200 MA</div>
                <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
                  {NumberConverter(quoteData['priceAvg200'], 2)}
                </div>
              </div>
              <div className="sm:w-24 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">BETA</div>
                <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
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