const Twit = require('twit');
const fetch = require('node-fetch');
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
setInterval(tweetId, 21600000);
function tweetId(){
T.get('followers/ids', { id: usersArray[getRandomInt(0,usersArray.length)] },  function (err, data, response) {
  var followersIds = data.ids;
    T.get('users/show', { id: followersIds[getRandomInt(0,followersIds.length)] },  function (err, data, response) {
      if(err){
        tweetId()
      }else{
        console.log('Hey I found ' + data.screen_name)
        var tweet = {status: 'Bonjour @' + data.screen_name +', tu veux une blague  ? 🙂 #bonjour #getajoke '}
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
var stream = T.stream('statuses/filter', {track: "bjr_le_monde"});

stream.on('tweet', tweetEvent)

function tweetEvent (eventMsg) {
  var replyTo = eventMsg.in_reply_to_screen_name; 
  var text = eventMsg.text;
  var id = eventMsg.id_str;
  var from = eventMsg.user.screen_name;

  if(replyTo === 'bjr_le_monde'){
   // Get rid of the @ mention
   text = text.replace(/@bjr_le_monde/g,'');

  /*Get a joke*/

  fetch('https://www.blagues-api.fr/api/random', {
  headers: {
    'Authorization' : `Bearer ${process.env.JOKE_TOKEN}`
   } 
  }).then( response => response.json())
    .then(data=>{
      // Start a reply back to the sender
      var replyText = '@'+from +' '+ data.joke +' '+ data.answer +' '+ "#getajoke";
      T.post('statuses/update', { status: replyText, in_reply_to_status_id: id}, replied);
      function replied(err, data, response){
      if(err){
        console.log('ERROR' + err)
        }
      } 
    })
  }
}

/*Twitch live tweet*/

setInterval(getLiveInformationUser, 60000)
var onStreaming = false;
//check live status user 
async function getLiveInformationUser(){
  var url = 'https://api.twitch.tv/helix/streams?user_login=soiaok';
 return fetch(url, {
      headers: {
        'client-id' : process.env.CLIENT_ID,
        'Authorization' :`Bearer ${process.env.TWITCH_OAUTH_TOKEN}`
       } 
      })
  .then(res => res.json())
  .then(data => {
  
    if(data.data[0] && data.data[0].type === "live" && !onStreaming){
      console.log(data)
      var txt = "Hello mon créateur est en live sur #twitch! Venez  https://www.twitch.tv/oyo1505 "; 
      onStreaming = true;
      T.post('statuses/update', { status: txt}, replied);
      function replied(err, data, response){
      if(err){
        console.log('ERROR' + err)
        }
      } 
     }else if(data.data[0] && data.data[0].type === "live" && onStreaming ){
       return
     }
     else if(!data.data[0]){
       return
     }
  })
}

