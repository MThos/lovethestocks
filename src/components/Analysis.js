import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NumberConverter } from '../helper.js';
import LoadingIcon from './LoadingIcon.js';
import NoData from './NoData.js';

const Analysis = () => {
  const [priceTargetsData, setPriceTargetsData] = useState([]);
  const [priceTargetConsensusData, setPriceTargetConsensusData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(true);
  const active = (localStorage.getItem('active')) ? localStorage.getItem('active') : 'AAPL';

  useEffect(() => {
    try {
      setLoading(true);

      const endPoints = [
        'http://localhost:8000/api/pricetargets',
        'http://localhost:8000/api/pricetargetconsensus'
      ];

      axios.all(endPoints.map((endPoint) => axios.get(endPoint, { params: { symbol: active }})))
      .then((response) => {
        //console.log(response);
        setPriceTargetsData(response[0]['data']);
        setPriceTargetConsensusData(response[1]['data'][0]);
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

  if ((priceTargetsData && 
       priceTargetConsensusData) && 
       Object.keys(priceTargetsData).length > 0 && 
       Object.keys(priceTargetConsensusData).length > 0) {
    return (
      <section className="fade-in">        
        <div className="flex flex-col text-white font-custom font-semibold text-center">
          <div className="sm:text-5xl md:text-5xl lg:text-5xl xl:text-7xl mt-4 font-bold">
            {priceTargetConsensusData['symbol']}
          </div>
          <div className="flex flex-row gap-4 m-auto mt-8">
            <div className="sm:w-28 md:w-40 lg:w-40 xl:w-60">
              <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl">HIGH</div>
              <div className="sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-green">
                ${NumberConverter(priceTargetConsensusData['targetHigh'], 2)}
              </div>
            </div>
            <div className="sm:w-28 md:w-40 lg:w-40 xl:w-60">
              <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl">CONSENSUS</div>
              <div className="sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-green">
                ${NumberConverter(priceTargetConsensusData['targetConsensus'], 2)}
              </div>
            </div>
            <div className="sm:w-28 md:w-40 lg:w-40 xl:w-60">
              <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl">LOW</div>
              <div className="sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-green">
                ${NumberConverter(priceTargetConsensusData['targetLow'], 2)}
              </div>
            </div>            
          </div>
        </div>
        <div className="flex flex-col text-white font-custom font-semibold text-center mt-10">
          { AnalysisList(priceTargetsData) }
        </div>
      </section>
    )
  } else {
    return (
      <NoData />
    );
  }  
}

const AnalysisList = (priceTargetsData) => {
  const analysis_collection = [];
  let counter = 0;

  priceTargetsData.map((key) => (
    counter < 25 ?
    analysis_collection.push(
      <div className="bg-purple-700 border-4 rounded border-purple-400 m-auto mb-10 sm:max-w-sm md:max-w-lg xl:max-w-4xl" key={counter++}>
        <div className="flex flex-row justify-center py-5">
          <div className="sm:w-32 md:w-40 lg:w-40 xl:w-80">
            <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl uppercase">Target</div>
            <div className={`sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl ${key['priceTarget'] < key['priceWhenPosted'] ? "text-red-400" : "text-green"}`}>${NumberConverter(key['priceTarget'], 2)}</div>
          </div>
          <div className="sm:w-32 md:w-40 lg:w-40 xl:w-80">
            <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl uppercase">Date</div> 
            <div className="sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl text-pink-200">{key['publishedDate'].substring(0, 10)}</div>
          </div>
          <div className="sm:w-32 md:w-40 lg:w-40 xl:w-80">
            <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl uppercase">Price</div>
            <div className="sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl text-green">${NumberConverter(key['priceWhenPosted'], 2)}</div>
          </div>
        </div>
        <div className="flex flex-row justify-center py-5">
          <div className="sm:w-32 md:w-40 lg:w-40 xl:w-80">
            <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl uppercase">Name</div>
            <div className="sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl text-pink-200">{key['analystName'] ? key['analystName'] : "N/A"}</div>
          </div>
          <div className="sm:w-32 md:w-40 lg:w-40 xl:w-80">
            <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl uppercase">Publisher</div>
            <div className="sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl text-pink-200">{key['newsPublisher'] ? key['newsPublisher'] : "N/A"}</div>
          </div>
          <div className="sm:w-32 md:w-40 lg:w-40 xl:w-80">
            <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl uppercase">Company</div>
            <div className="sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl text-pink-200">{key['analystCompany'] ? key['analystCompany'] : "N/A"}</div>
          </div>
        </div>
        <div className="flex flex-col px-4 py-5">
          <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl uppercase">Article Link</div>
          <div className="sm:text-lg md:text-xl lg:text-xl xl:text-2xl text-yellow-200">
            <a href={key['newsURL']} target="_blank" rel="noopener noreferrer">
              {key['newsTitle'] && key['newsTitle'].length >= 200 ? key['newsTitle'].substring(0, 200) : key['newsTitle']}....
            </a>
          </div>
        </div>
      </div>
    ) : ""
  ))

  return analysis_collection;
}

export default Analysis;