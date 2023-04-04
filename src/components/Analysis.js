import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NumberConverter } from '../helper.js';
import LoadingIcon from './LoadingIcon.js';
import NoData from './NoData.js';

const Analysis = () => {
  const [priceTargetsData, setPriceTargetsData] = useState([]);
  const [priceTargetConsensusData, setPriceTargetConsensusData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const active = (localStorage.getItem('active')) ? localStorage.getItem('active') : 'AAPL';

  useEffect(() => {
    try {
      setLoading(true);

      const endPoints = [
        'http://localhost:8000/pricetargets',
        'http://localhost:8000/pricetargetconsensus'
      ];

      axios.all(endPoints.map((endPoint) => axios.get(endPoint, { params: { symbol: active }})))
      .then((response) => {
        //console.log(response);
        setPriceTargetsData(response[0]['data']);
        setPriceTargetConsensusData(response[1]['data'][0]);
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

  if ((priceTargetsData && 
       priceTargetConsensusData) && 
       Object.keys(priceTargetsData).length > 0 && 
       Object.keys(priceTargetConsensusData).length > 0) {
    return (
      <section className="fade-in">        
        <div className="flex flex-col text-white font-custom font-semibold text-center">
          <div className="text-5xl mt-4 font-bold">
            {priceTargetConsensusData['symbol']}
          </div>
          <div className="flex flex-row gap-4 m-auto mt-8">
            <div className="w-28">
              <div className="text-lg">HIGH</div>
              <div className="text-2xl text-green">
                ${NumberConverter(priceTargetConsensusData['targetHigh'], 2)}
              </div>
            </div>
            <div className="w-28">
              <div className="text-lg">CONSENSUS</div>
              <div className="text-2xl text-green">
                ${NumberConverter(priceTargetConsensusData['targetConsensus'], 2)}
              </div>
            </div>
            <div className="w-28">
              <div className="text-lg">LOW</div>
              <div className="text-2xl text-green">
                ${NumberConverter(priceTargetConsensusData['targetLow'], 2)}
              </div>
            </div>            
          </div>
        </div>
        <div className="flex flex-col text-white font-custom font-semibold text-center mt-8">
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
      <div className="my-5 border-4 border-purple-200 mx-5" key={counter++}>
        <div className="flex flex-row justify-center py-5">
          <div className="w-32">
            <div className="text-lg">TARGET</div>
            <div className={`text-xl ${key['priceTarget'] < key['priceWhenPosted'] ? "text-red-400" : "text-green"}`}>${NumberConverter(key['priceTarget'], 2)}</div>
          </div>
          <div className="w-32">
            <div className="text-lg">DATE</div> 
            <div className="text-xl text-pink-200">{key['publishedDate'].substring(0, 10)}</div>
          </div>
          <div className="w-32">
            <div className="text-lg">PRICE</div>
            <div className="text-xl text-green">${NumberConverter(key['priceWhenPosted'], 2)}</div>
          </div>
        </div>
        <div className="flex flex-row justify-center py-5">
          <div className="w-32">
            <div className="text-lg">Name</div>
            <div className="text-xl text-pink-200">{key['analystName'] ? key['analystName'] : "N/A"}</div>
          </div>
          <div className="w-32">
            <div className="text-lg">Publisher</div>
            <div className="text-xl text-pink-200">{key['newsPublisher'] ? key['newsPublisher'] : "N/A"}</div>
          </div>
          <div className="w-32">
            <div className="text-lg">Company</div>
            <div className="text-xl text-pink-200">{key['analystCompany'] ? key['analystCompany'] : "N/A"}</div>
          </div>
        </div>
        <div className="flex flex-col px-4 py-5">
          <div className="text-lg">Article Link</div>
          <div className="text-lg text-yellow-200">
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