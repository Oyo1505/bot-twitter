const Twit = require('twit');
require('dotenv').config();
//const config = require('./config');
const T = new Twit({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_KEY_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
 });
tweetId()
setInterval(tweetId, 1000*20)
// start stream and track tweets
function tweetId(){
  var r = Math.floor(Math.random()* 100);
  var tweet = {status: 'random' + r +'test'}
  T.post('statuses/update', tweet, tweeted);
function tweeted(err, data, response){
  if(err){
    console.log(err)
  }else{
    console.log('yay')
  }
}
}

/*const stream = T.stream('statuses/filter', {track: '#JavaScript'});

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
  */
  
