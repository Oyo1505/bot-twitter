const Twit = require('twit');
require('dotenv').config();

const T = new Twit({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_KEY_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
 });

 function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}

tweetId()
setInterval(tweetId, 3600000);
function tweetId(){
  
  T.get('users/show', { id: getRandomInt(12, 99999999999) },  function (err, data, response) {
    if(err){
      console.log(err);
      tweetId()
    }else{
      console.log('Hey I found ' + data.screen_name)
      var tweet = {status: 'Bonjour @' + data.screen_name +' ! 🙂'}
      T.post('statuses/update', tweet, tweeted);
        function tweeted(err, data, response){
      if(err){
        console.log('ERROR' + err)
        }
      }
    }
   
   })
}

  
