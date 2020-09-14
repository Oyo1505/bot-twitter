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
var usersArray = [500128681, 544902207, 243247158, 861320851, 1008682832120696833];
setInterval(tweetId, 1800000);
function tweetId(){
T.get('followers/ids', { id: usersArray[getRandomInt(0,usersArray.length)] },  function (err, data, response) {
  var followersIds = data.ids;
    T.get('users/show', { id: followersIds[getRandomInt(0,followersIds.length)] },  function (err, data, response) {
      if(err){
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
/*automated reply*/
/*var stream = T.stream('statuses/filter', { track: '@bjr_le_monde'});

stream.on('tweet', function (twit) {
var reply = {
  status: 'Je ne suis pas un humain voit direct avec mon créateur @Oyo1505',
  in_reply_to_status_id:twit.str_id,
  auto_populate_reply_metadata: true
  }
T.post('statuses/update', reply, replied);
  function replied(err, data, response){
    console.log(data)
  if(err){
    console.log('ERROR' + err)
    }
  }    
})*/
