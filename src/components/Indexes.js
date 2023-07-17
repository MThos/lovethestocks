import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingIcon from './LoadingIcon.js';
import { styled } from '@mui/material/styles';
import Button from './Button';
import NoData from './NoData.js';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const Indexes = () => {
  const [dowJones, setDowJones] = useState([]);
  const [sp500, setSP500] = useState([]);
  const [nasdaq, setNasdaq] = useState([]);
  const [displayType, setDisplayType] = useState("dowjones");
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(true);
  
  const rows = (displayType === 'sp500') ?
    sp500.map((stock, index) => (
      createData(
        index + 1,
        stock.name,
        stock.symbol)
    )) : (displayType === 'nasdaq') ?
    nasdaq.map((stock, index) => (
      createData(
        index + 1,
        stock.name,
        stock.symbol)
    )) : 
    dowJones.map((stock, index) => (
      createData(
        index + 1,
        stock.name,
        stock.symbol)
    ));

  function createData(rank, name, symbol) {
    return { rank, name, symbol };
  };

  const onClick = (e) => {
    e.preventDefault();
    setDisplayType(e.target.id);
  }

  const OnClickSymbolHandler = (symbol) => {
    localStorage.setItem('active', symbol.toUpperCase());
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#3709A1',
      color: 'white',
      fontSize: 20,
      fontWeight: 500,
    },
    [`&.${tableCellClasses.body}`]: {
      borderTop: '2px solid rgba(50, 50, 50, 0.3)',
      borderBottom: '2px solid rgba(50, 50, 50, 0.3)',
      backgroundColor: '#6527F3',
      color: 'white',
      fontSize: 18,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      borderTop: '1px solid rgba(50, 50, 50, 0.3)',
      borderBottom: '1px solid rgba(50, 50, 50, 0.3)',
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const StyledTableHead = styled(TableHead)(() => ({
    border: '1px solid rgba(50, 50, 50, 0.2)',
    backgroundColor: 'mediumslateblue',
  }));

  useEffect(() => {
    try {
      setLoading(true);

      const endPoints = [
        `${process.env.REACT_APP_NODE_ENDPOINT}/api/dowjones`,
        `${process.env.REACT_APP_NODE_ENDPOINT}/api/sp500`,
        `${process.env.REACT_APP_NODE_ENDPOINT}/api/nasdaq`
      ];

      axios.all(endPoints.map((endPoint) => axios.get(endPoint)))
      .then((response) => {
        //console.log(response);
        setDowJones(response[0]['data']);
        setSP500(response[1]['data']);
        setNasdaq(response[2]['data']);
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
  }, []);

  if (isLoading) {
    return (
      <LoadingIcon message={errorMessage} />
    )
  }

  if ((dowJones && sp500 && nasdaq) && 
       Object.keys(dowJones).length > 0 &&
       Object.keys(sp500).length > 0 &&
       Object.keys(nasdaq).length > 0) {
    return (
      <section className="fade-in">
        <div className="flex flex-col font-custom font-semibold text-center p-3 mb-10 text-white">
          <div className="sm:text-5xl md:text-5xl lg:text-5xl xl:text-7xl mt-4 font-bold">
            INDEXES
          </div>
          <div className="sm:text-5xl md:text-5xl lg:text-5xl xl:text-7xl mt-4 font-bold">
            <div className="flex flex-row gap-7 items-center justify-center m-auto sm:mt-2 xl:mt-4 sm:mb-12 xl:mb-12">
              <Button name="dowjones" displayText="DOW" onClick={onClick} active={displayType === 'dowjones' ? 'yes' : 'no'} />
              <Button name="sp500" displayText="S&P" onClick={onClick} active={displayType === 'sp500' ? 'yes' : 'no'} />
              <Button name="nasdaq" displayText="NASDAQ" onClick={onClick} active={displayType === 'nasdaq' ? 'yes' : 'no'} />
            </div>
            <TableContainer sx={{ margin: '0 auto', width: '90%' }} component={Paper}>
              <Table sx={{ minWidth: '88vw' }} aria-label="simple table">
                <StyledTableHead>
                  <TableRow>
                    <StyledTableCell>Ticker</StyledTableCell>
                    <StyledTableCell>Company</StyledTableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody sx={{ border: '2px solid rgba(50, 50, 50, 0.5)' }}>
                  {rows.map((row) => (
                    <StyledTableRow
                      key={row.symbol}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <StyledTableCell sx={{ minWidth: 80, fontWeight: 600 }} onClick={() => OnClickSymbolHandler(row.symbol)}>
                        <a href='/company'>{row.symbol}</a>
                      </StyledTableCell>
                      <StyledTableCell sx={{ maxWidth: 200 }} onClick={() => OnClickSymbolHandler(row.symbol)}>
                        <a href='/company'>{row.name}</a>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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

export default Indexes;