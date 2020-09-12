const Twit = require('twit');
const T = new Twit({
  consumer_key: 'DvzmgYk4k9ObQaL24lX5OrWDu',
  consumer_secret: 'MolxvFvFYJkIzaoclA97rM4L3010w2CX2imIqewhMik6bpr0p4',
  access_token: '1082338592121327616-rHFB3pa6hZBmDmKFMRj9IpejGXCghI',
  access_token_secret: 'yvGeXibZzVEaSlQnZHVflQEXPCboSpJnm3snqY27JZGuH'
});
    
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
  
  
