import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NumberConverter } from '../helper.js';
import LoadingIcon from './LoadingIcon.js';
import NoData from './NoData.js';

const Company = () => {
  const [stockData, setStockData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const active = (localStorage.getItem('active')) ? localStorage.getItem('active') : 'AAPL';

  useEffect(() => {
    try {
      setLoading(true);

      const options = {
        method: 'GET',
        url: 'http://localhost:8000/profile',
        params: { symbol: active }
      };
  
      axios.request(options).then((response) => {
        console.log(response.data[0]);
        setStockData(response.data[0]);
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

  if (stockData && Object.keys(stockData).length > 0) { 
    return (
      <section className="fade-in">
        <div className="flex flex-col font-custom font-semibold text-center text-md pd-3 mb-10 text-white">
          <div className="text-5xl mt-5 font-bold">
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
          <div className="flex flex-row gap-6 m-auto mt-4">
            <div className="w-24">
              <div className="text-lg">PRICE</div>
              <div className="text-2xl text-green">
                ${NumberConverter(stockData['price'], 2)}
              </div>
            </div>
            <div className="w-24">
              <div className="text-lg">MARKET CAP</div>
              <div className="text-2xl text-green">
                ${NumberConverter(stockData['mktCap'], 2)}
              </div>
            </div>
            <div className="w-24">
              <div className="text-lg">VOLUME</div>
              <div className="text-2xl text-green">
                {NumberConverter(stockData['volAvg'], 1)}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-8">
            <div className="flex flex-col w-24">
              <div className="text-lg">EXCHANGE</div>
              <div className="text-xl text-pink-200">
                {stockData['exchangeShortName']}
              </div>
            </div>
            <div className="flex flex-col w-24">
              <div className="text-lg">COUNTRY</div>
              <div className="text-xl text-pink-200">
                {stockData['country']}
              </div>
            </div>
            <div className="flex flex-col w-24">
              <div className="text-lg">EMPLOYEES</div>
              <div className="text-xl text-pink-200">
                {stockData['isEtf'] === true ? 'N/A' : NumberConverter(stockData['fullTimeEmployees'], 0)}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center mt-5">
            <div className="text-lg">SECTOR</div>
            <div className="text-xl text-pink-200">
              {stockData['isEtf'] === true ? 'ETF' : stockData['sector']}
            </div>
          </div>
          <div className="flex flex-col justify-center mt-5">
            <div className="text-lg">INDUSTRY</div>
            <div className="text-xl text-pink-200">
              {stockData['industry']}
            </div>
          </div>
          <div className="flex flex-col justify-center mt-5">
            <div className="text-lg">CEO</div>
            <div className="text-xl text-pink-200">
              {stockData['isEtf'] === true ? 'N/A' : stockData['ceo']}
            </div>
          </div>
          <div className="flex flex-row gap-6 m-auto mt-5">
            <div className="w-32">
              <div className="text-lg">IPO</div>
              <div className="text-xl text-pink-200">
                {stockData['ipoDate']}
              </div>
            </div>
            
          </div>
          <div className="flex flex-col m-auto mt-10">
            <div className="text-lg">SUMMARY</div>
            <div className="font-normal text-left px-4 text-lg text-pink-200 max-w-4xl">
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