const Twit = require('twit');
const config = require('./config');
const T = new Twit(config);
    
// start stream and track tweets
const stream = T.stream('statuses/filter', {track: '#JavaScript'});

function responseCallback (err, data, response) {  
   console.log(err);
}
  // event handler
  stream.on('tweet', tweet => {
     // retweet
    T.post('statuses/retweet/:id', {id: tweet.id_str}, responseCallback);
    // like
    T.post('favorites/create', {id: tweet.id_str}, responseCallback);
  });
  
  
