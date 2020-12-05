const Twit = require('twit');
const fetch = require('node-fetch');
const fs = require("fs")
var path = require('path');
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
  async function tweetId(){
  var joke = await getAJoke();
   T.get('followers/ids', {screen_name: 'bjr_le_monde' }, function(err,data, response){
    if(err){
      tweetId()
    }else{
      var follerUserAccount =  data.ids;
      T.get('followers/ids', { id: usersArray[getRandomInt(0,usersArray.length)] },  function (err, data, response) {
        var followersIds = data.ids;
        T.get('users/show', { id: followersIds[getRandomInt(0, followersIds.length)] },  function (err, data, response) {
          if(err || follerUserAccount.includes(data.id)){
              tweetId()
            }else{
              console.log('Hey I found ' + data.screen_name)
              var tweet = {status: 'Bonjour @' + data.screen_name +', tiens une blague:'+ joke.joke +'...' + joke.answer +'🙂 #bonjour #getajoke '}
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
  });
}
 async function getAJoke(){
  return fetch('https://www.blagues-api.fr/api/random?disallow=dark&?disallow=limit', {
  headers: {
    'Authorization' : `Bearer ${process.env.JOKE_TOKEN}`
   } 
  }).then( response => response.json())
    .then(data=>data);
}

 async function getGif(){
 return await fetch (`https://api.giphy.com/v1/gifs/random?api_key=${process.env.API_KEY_GLIPHY}&tag=cat&rating=g`)
                .then(res => res.json())
                .then(data => data);
}
//24h = 86400000
setInterval(tweetId, 86400000);

/*automated reply*/
var stream = T.stream('statuses/filter', {track: "bjr_le_monde"});

//stream.on('tweet', tweetEvent)

async function tweetEvent (eventMsg) {
  var replyTo = eventMsg.in_reply_to_screen_name; 
  var text = eventMsg.text;
  var id = eventMsg.id_str;
  var from = eventMsg.user.screen_name;
  var joke = await getAJoke();

  if(replyTo === 'bjr_le_monde'){
   // Get rid of the @ mention
   text = text.replace(/@bjr_le_monde/g,'');
      // Start a reply back to the sender
      var replyText = '@'+from +' '+ joke.joke +' '+ joke.answer +' '+ "#getajoke";
      T.post('statuses/update', { status: replyText, in_reply_to_status_id: id}, replied);
      function replied(err, data, response){
      if(err){
        console.log('ERROR' + err)
        }
      } 
  }
}

/*Twitch live tweet*/
setInterval(getLiveInformationUser, 10000)
var onStreaming = false;
//check live status user 
async function getLiveInformationUser(){
  var gif = await getGif();
 
    var url = 'https://api.twitch.tv/helix/streams?user_login=oyo1505';
  return fetch(url, {
        headers: {
          'client-id' : process.env.CLIENT_ID,
          'Authorization' :`Bearer ${process.env.TWITCH_OAUTH_TOKEN}`
        } 
        })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if(data.data[0] && data.data[0].type === "live" && !onStreaming){
        var img = fs.readFileSync(gif.data.url, { encoding: 'base64' });
        var params = { encoding: 'base64' };
        onStreaming = true;
        
                  T.post("media/upload",{ media_data: img }, function (err, data, response) {
                    console.log( data.media_id_string);  
                    var mediaIdStr = gif.data.id;
                      var altText = "Small flowers in a planter on a sunny balcony, blossoming."
                      var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
                      T.post( 'media/metadata/create',meta_params,
                        function(err3, data3, response3) {
                          var txt = `Hello mon créateur est en live sur #twitch! Follow me ! :)  https://www.twitch.tv/oyo1505 `; 
                          var params = { status: txt, media_ids: [mediaIdStr] }
                          T.post("statuses/update", params, function(
                            err,
                            data4,
                            response
                          ) {
                            if (err) console.log("Something Went wrong", err.message);
                            if (data4.errors) {
                              console.log(
                                "ERROR On Success : ",
                                data4.errors[0].message
                              );
                            } else {
                              console('Success')
                             
                            }
                          });
                        }
                      );
                    }
                  );
        /*T.post('statuses/update', { status: txt}, replied);
        function replied(err, data, response){
        if(err){
            console.log('ERROR' + err)
            }
        } */
        }else if(data.data[0] && data.data[0].type === "live" && onStreaming ){
          console.log("online")
        }else if(!data.data[0]){
          onStreaming = false;
          return;
        }
    }).catch(err => console.log(err));
}
