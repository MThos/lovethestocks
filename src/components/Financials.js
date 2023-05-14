import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NumberConverter } from '../helper.js';
import LoadingIcon from './LoadingIcon.js';
import Button from './Button';
import NoData from './NoData.js';

const Financials = () => {
  const [annualData, setAnnualData] = useState([]);
  const [quarterlyData, setQuarterlyData] = useState([]);
  const [displayType, setDisplayType] = useState("annual");
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(true);

  const active = (localStorage.getItem('active')) ? localStorage.getItem('active') : 'AAPL';

  const onClick = (e) => {
    e.preventDefault();
    setDisplayType(e.target.id);
  }

  useEffect(() => {
    try {
      setLoading(true);

      const endPoints = [
        'http://localhost:8000/annual',
        'http://localhost:8000/quarterly'
      ];

      axios.all(endPoints.map((endPoint) => axios.get(endPoint, { params: { symbol: active }})))
      .then((response) => {
        console.log(response);
        setAnnualData(response[0]['data'][0]);
        setQuarterlyData(response[1]['data'][0]);
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

  if ((annualData && quarterlyData) && 
       Object.keys(annualData).length > 0 &&
       Object.keys(quarterlyData).length > 0) {
    return(
      <section className="fade-in">
        {<div className="flex flex-col font-custom font-semibold text-center p-3 mb-10 text-white">
          <div className="sm:text-5xl md:text-5xl lg:text-5xl xl:text-7xl mt-2 font-bold">
            {
              displayType === 'annual' ? 
                annualData['symbol'] :
                quarterlyData['symbol']
            }
          </div>
          <div className="flex flex-row gap-7 items-center m-auto sm:mt-6 xl:mt-12 xl:mb-6">
            <Button name="annual" displayText={annualData['period'] + ' ' + annualData['calendarYear']} onClick={onClick} active={displayType === 'annual' ? 'yes' : 'no'} />
            <div className="sm:text-2xl md:text-3xl lg:text-3xl xl:text-5xl text-yellow-200 sm:w-24 md:w-40 lg:w-40 xl:w-80">
              {
                displayType === 'annual' ? 
                  annualData['period'] + '·' + annualData['calendarYear'] :
                  quarterlyData['period'] + '·' + quarterlyData['calendarYear']
              }
            </div>
            <Button name="quarterly" displayText={quarterlyData['period'] + ' ' + quarterlyData['calendarYear']} onClick={onClick} active={displayType === 'quarterly' ? 'yes' : 'no'} />
          </div>
          <div className="flex flex-col mt-10">
            <div className="flex flex-row gap-3 m-auto">
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">YEAR</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-pink-200">
                  {
                    displayType === 'annual' ? 
                      annualData['calendarYear'] : 
                      quarterlyData['calendarYear']
                  }
                </div>
              </div>
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">PERIOD</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-pink-200">
                  {displayType === 'annual' ? annualData['period'] : quarterlyData['period']}
                </div>
              </div>
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">FILING DATE</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-pink-200">
                  {displayType === 'annual' ? annualData['fillingDate'] : quarterlyData['fillingDate']}
                </div>
              </div>       
            </div>
            <div className="flex flex-row gap-3 m-auto mt-6">
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">CURRENCY</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-pink-200">
                  {displayType === 'annual' ? annualData['reportedCurrency'] : quarterlyData['reportedCurrency']}
                </div>
              </div>
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">SHARES</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-pink-200">
                  {displayType === 'annual' ? NumberConverter(annualData['weightedAverageShsOut'], 1) : NumberConverter(quarterlyData['weightedAverageShsOut'], 1)}
                </div>
              </div>
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">EBITDA</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-pink-200">
                  {displayType === 'annual' ? NumberConverter(annualData['ebitda'], 2) : NumberConverter(quarterlyData['ebitda'], 2)}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-3 m-auto mt-6">
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">REVENUE</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-pink-200">
                  {displayType === 'annual' ? NumberConverter(annualData['revenue'], 2, 1) : NumberConverter(quarterlyData['revenue'], 2)}
                </div>
              </div>
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">EPS</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-pink-200">
                  {displayType === 'annual' ? annualData['eps'] : quarterlyData['eps']}
                </div>
              </div>
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">EBITDA RATIO</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-pink-200">
                  {displayType === 'annual' ? NumberConverter(annualData['ebitdaratio'], 2) : NumberConverter(quarterlyData['ebitdaratio'], 2)}
                </div>
              </div>            
            </div>
            <div className="text-2xl mt-10 border-b-2 w-fit m-auto">
              INCOME
            </div>
            <div className="flex flex-row gap-3 m-auto mt-6">
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">GROSS</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-green">
                  {displayType === 'annual' ? NumberConverter(annualData['grossProfit'], 2, 1) : NumberConverter(quarterlyData['grossProfit'], 2, 1)}
                </div>
              </div>              
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">NET</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-green">
                  {displayType === 'annual' ? NumberConverter(annualData['netIncome'], 1, 1) : NumberConverter(quarterlyData['netIncome'], 1, 1)}
                </div>
              </div>
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">OPERATING</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-green">
                  {displayType === 'annual' ? NumberConverter(annualData['operatingIncome'], 2, 1) : NumberConverter(quarterlyData['operatingIncome'], 2, 1)}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-3 m-auto mt-6">
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">GROSS RATIO</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-green">
                  {displayType === 'annual' ? NumberConverter(annualData['grossProfitRatio'], 2, 1) : NumberConverter(quarterlyData['grossProfitRatio'], 2, 1)}
                </div>
              </div>
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">NET RATIO</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-green">
                  {displayType === 'annual' ? NumberConverter(annualData['netIncomeRatio'], 2, 1) : NumberConverter(quarterlyData['netIncomeRatio'], 2, 1)}
                </div>
              </div>              
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">OPERATING RATIO</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-green">
                  {displayType === 'annual' ? NumberConverter(annualData['operatingIncomeRatio'], 2, 1) : NumberConverter(quarterlyData['operatingIncomeRatio'], 2, 1)}
                </div>
              </div>
            </div>
            <div className="text-2xl mt-10 border-b-2 w-fit m-auto">
              EXPENSES
            </div>
            <div className="flex flex-row gap-3 m-auto mt-6">
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">R&D</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-red-400">
                  {displayType === 'annual' ? NumberConverter(annualData['researchAndDevelopmentExpenses'], 2) : NumberConverter(quarterlyData['researchAndDevelopmentExpenses'], 2)}
                </div>
              </div>
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">ADMIN</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-red-400">
                  {displayType === 'annual' ? NumberConverter(annualData['generalAndAdministrativeExpenses'], 2) : NumberConverter(quarterlyData['generalAndAdministrativeExpenses'], 2)}
                </div>
              </div>
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">MARKETING</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-red-400">
                  {displayType === 'annual' ? NumberConverter(annualData['sellingAndMarketingExpenses'], 2) : NumberConverter(quarterlyData['sellingAndMarketingExpenses'], 2)}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-3 m-auto mt-6">
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">GENERAL</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-red-400">
                  {displayType === 'annual' ? NumberConverter(annualData['sellingGeneralAndAdministrativeExpenses'], 2) : NumberConverter(quarterlyData['sellingGeneralAndAdministrativeExpenses'], 2)}
                </div>
              </div>
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">OPERATING</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-red-400">
                  {displayType === 'annual' ? NumberConverter(annualData['operatingExpenses'], 2, 1) : NumberConverter(quarterlyData['operatingExpenses'], 2, 1)}
                </div>
              </div>
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">COSTS</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-red-400">
                  {displayType === 'annual' ? NumberConverter(annualData['costAndExpenses'], 2, 1) : NumberConverter(quarterlyData['costAndExpenses'], 2, 1)}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-3 m-auto mt-6">
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">INTEREST</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-red-400">
                  {displayType === 'annual' ? NumberConverter(annualData['interestExpense'], 2, 1) : NumberConverter(quarterlyData['interestExpense'], 2, 1)}
                </div>
              </div>
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">OTHER INCOME</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-red-400">
                  {displayType === 'annual' ? NumberConverter(annualData['totalOtherIncomeExpensesNet'], 2, 1) : NumberConverter(quarterlyData['totalOtherIncomeExpensesNet'], 2, 1)}
                </div>
              </div>
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">INCOME TAX</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-red-400">
                  {displayType === 'annual' ? NumberConverter(annualData['incomeTaxExpense'], 2, 1) : NumberConverter(quarterlyData['incomeTaxExpense'], 2, 1)}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-3 m-auto mt-6">
              <div className="sm:w-28 md:w-40 lg:w-40 xl:w-80">
                <div className="sm:text-md md:text-lg lg:text-xl xl:text-2xl">DEPRECIATION</div>
                <div className="sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-red-400">
                  {displayType === 'annual' ? NumberConverter(annualData['depreciationAndAmortization'], 2, 1) : NumberConverter(quarterlyData['depreciationAndAmortization'], 2, 1)}
                </div>
              </div>
            </div>
          </div>
        </div>}
      </section>
    )
  } else {
    return (
      <NoData />
    );
  }
  
}

export default Financials;