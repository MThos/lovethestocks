import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingIcon from './LoadingIcon.js';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const News = () => {
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const OnClickSymbolHandler = (symbol) => {
    localStorage.setItem('active', symbol.toUpperCase());
  };

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

  return (
    <section className="fade-in">
      <div className="flex flex-col text-center font-custom font-semibold text-white">
        <div className="text-5xl font-bold mt-4">NEWS</div>
        { NewsList(newsData) }
      </div>
    </section>
  )  
}

export default News;

const NewsList = (newsData) => {
  const news = [];
  let counter = 0;

  newsData.map((key) => (
    news.push(
      <Card key={counter++} className="m-auto mt-10" sx={{ border: '2px solid #8B5CF6', maxWidth: 350 }}>
        <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image={`${key['image']}`}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" color="text.main" sx={{ fontWeight: 700 }}>
            {key['symbol']}
          </Typography>
          <Typography gutterBottom component="div" color="text.main">
            {key['publishedDate']}
          </Typography>
          <br/>
          <Typography variant="body1" color="text.main" sx={{ fontWeight: 700, lineHeight: 1.5 }}>
            {key['title']}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="large" sx={{ color: '#F6CFFC', fontSize: '1rem', fontWeight: 700, margin: 'auto' }}>
            <a href={`${key['url']}`} target="_blank" rel="noopener noreferrer">Read Full Article</a>
          </Button>
        </CardActions>
      </Card>
    )
  ))

  return news;
}