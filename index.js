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
var usersArray = [500128681, 544902207, 243247158, 63729150, 861320851, 1008682832120696833]
setInterval(tweetId, 3600000);
function tweetId(){
T.get('followers/ids', { id: usersArray[getRandomInt(0,usersArray.length)] },  function (err, data, response) {
  var followersIds = data.ids;
  console.log(data)
    T.get('users/show', { id: followersIds[getRandomInt(0,followersIds.length)] },  function (err, data, response) {
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
})
}


  
