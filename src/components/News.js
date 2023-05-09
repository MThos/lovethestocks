import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingIcon from './LoadingIcon.js';
import NoData from './NoData.js';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const News = () => {
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const options = {
        method: 'GET',
        url: 'http://localhost:8000/news'
      };
  
      axios.request(options).then((response) => {
        //console.log(response.data);
        setNewsData(response.data);
        setLoading(false);
      }).catch((error) => {
        console.log(error);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (isLoading) {
    return (
      <LoadingIcon />
    )
  }

  if (newsData && Object.keys(newsData).length > 0) {
    return (
      <section className="fade-in">
        <div className="flex flex-col text-center font-custom font-semibold text-white">
          <div className="text-5xl font-bold mt-4">NEWS</div>
          <div className="flex flex-row flex-wrap gap-4 justify-center mb-20">
            { NewsList(newsData) }
          </div>
        </div>
      </section>
    )
  } else {
    <NoData />
  }
}

export default News;

const NewsList = (newsData) => {
  const news = [];
  let counter = 0;

  const OnClickSymbolHandler = (symbol) => {
    localStorage.setItem('active', symbol.toUpperCase());
  };

  newsData.map((key) => (
    news.push(
      <div key={counter++} className="grow shrink sm:basis-full md:basis-1/2 lg:basis-1/2 xl:basis-1/4 max-w-sm mt-10">
        <Card className="m-5" sx={{ background: '#3709A1', border: '4px solid #fff', height: '100%' }}>
          <CardMedia
          component="img"
          alt={key['title']}
          height="140"
          image={`${key['image']}`}
          />
          <CardContent>
            <Link to={'/company'}>
              <Typography onClick={() => OnClickSymbolHandler(key['symbol']) } gutterBottom variant="h4" component="div" color="text.main" sx={{ fontWeight: 700 }}>
                {key['symbol']}
              </Typography>
            </Link>
            <Typography variant="body1" color="text.main" sx={{ fontSize: 18}}>
              {key['title']}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="large" sx={{ color: '#F6CFFC', fontSize: 18, fontWeight: 500, margin: 'auto' }}>
              <a href={`${key['url']}`} target="_blank" rel="noopener noreferrer">Read Full Article</a>
            </Button>
          </CardActions>
          <Typography component="div" color="text.main" sx={{  }}>
            {key['publishedDate']}
          </Typography>
        </Card>
      </div>      
    )
  ))

  return news;
}