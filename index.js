const Twit = require('twit');
require('dotenv').config();

const T = new Twit({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_KEY_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
 });
 var id = Math.floor(Math.random() * 15);

 T.get('users/show', { id: 251624859 },  function (err, data, response) {
  console.log(data)
})
 //tweetId()
// start stream and track tweets
/*function tweetId(){
  var tweet = {status: 'Bonjour ' + r +' test'}
  T.post('statuses/update', tweet, tweeted);
function tweeted(err, data, response){
  if(err){
    console.log('ERROR' + err)
    }
  } 
}*/

  
