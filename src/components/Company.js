import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NumberConverter } from '../helper.js';
import LoadingIcon from './LoadingIcon.js';
import NoData from './NoData.js';

const Company = () => {
  const [stockData, setStockData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(true);
  const active = (localStorage.getItem('active')) ? localStorage.getItem('active') : 'AAPL';

  useEffect(() => {
    try {
      setLoading(true);

      const options = {
        method: 'GET',
        url: 'http://localhost:8000/api/profile',
        params: { symbol: active }
      };
  
      axios.request(options).then((response) => {        
        console.log(response.data[0]);
        setStockData(response.data[0]);
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

  if (stockData && Object.keys(stockData).length > 0) { 
    return (
      <section className="fade-in">
        <div className="flex flex-col font-custom font-semibold text-center text-md pd-3 mb-10 text-white">
          <div className="sm:text-5xl md:text-5xl lg:text-5xl xl:text-7xl mt-5 font-bold">
            {stockData['symbol']}
          </div>
          <div className="text-xl mt-1">
            {stockData['companyName']}
          </div>
          <div>
            <img className="w-32 m-auto mt-3" src={stockData['image']} alt={stockData['symbol']} 
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src="images/missing.png";
              }}/>
          </div>
          <div className="flex flex-row gap-6 m-auto mt-10">
            <div className="sm:w-24 md:w-40 lg:w-40 xl:w-60">
              <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl">PRICE</div>
              <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-green">
                ${NumberConverter(stockData['price'], 2)}
              </div>
            </div>
            <div className="sm:w-24 md:w-40 lg:w-40 xl:w-60">
              <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl">MARKET CAP</div>
              <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-green">
                ${NumberConverter(stockData['mktCap'], 2)}
              </div>
            </div>
            <div className="sm:w-24 md:w-40 lg:w-40 xl:w-60">
              <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl">VOLUME</div>
              <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-green">
                {NumberConverter(stockData['volAvg'], 1)}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 sm:mt-6 md:mt-8 xl:mt-12">
            <div className="flex flex-col sm:w-24 md:w-40 lg:w-40 xl:w-60">
              <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl">EXCHANGE</div>
              <div className="sm:text-xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
                {stockData['exchangeShortName']}
              </div>
            </div>
            <div className="flex flex-col sm:w-24 md:w-40 lg:w-40 xl:w-60">
              <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl">COUNTRY</div>
              <div className="sm:text-xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
                {stockData['country']}
              </div>
            </div>
            <div className="flex flex-col sm:w-24 md:w-40 lg:w-40 xl:w-60">
              <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl">EMPLOYEES</div>
              <div className="sm:text-xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
                {stockData['isEtf'] === true ? 'N/A' : NumberConverter(stockData['fullTimeEmployees'], 0)}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center sm:mt-6 md:mt-8 xl:mt-12">
            <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl">SECTOR</div>
            <div className="sm:text-xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
              {stockData['isEtf'] === true ? 'ETF' : stockData['sector']}
            </div>
          </div>
          <div className="flex flex-col justify-center sm:mt-6 md:mt-8 xl:mt-12">
            <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl">INDUSTRY</div>
            <div className="sm:text-xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
              {stockData['industry']}
            </div>
          </div>
          <div className="flex flex-col justify-center sm:mt-6 md:mt-8 xl:mt-12">
            <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl">CEO</div>
            <div className="sm:text-xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
              {stockData['isEtf'] === true ? 'N/A' : stockData['ceo']}
            </div>
          </div>
          <div className="flex flex-col justify-center sm:mt-6 md:mt-8 xl:mt-12">
            <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl">IPO</div>
            <div className="sm:text-xl md:text-3xl lg:text-3xl xl:text-4xl text-pink-200">
              {stockData['ipoDate']}
            </div>            
          </div>
          <div className="flex flex-col m-auto mt-10">
            <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl">SUMMARY</div>
            <div className="font-normal text-left px-4 sm:text-xl md:text-xl lg:text-2xl xl:text-2xl text-pink-200 max-w-4xl">
              {stockData['description']}
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

export default Company;