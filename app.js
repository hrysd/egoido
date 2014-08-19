var ntwitter = require('ntwitter'),
    request  = require('request');

var parts    = process.env.TWITTER_AUTH.split(':'),
    endpoint = process.env.HOOK_ENDPOINT;

twitter = new ntwitter({
  consumer_key:        parts[0],
  consumer_secret:     parts[1],
  access_token_key:    parts[2],
  access_token_secret: parts[3]
});

function build_source(data) {
  var screen_name = data.user.screen_name;

  // TODO data.user.name をエスケープ data.text はすでにエスケープ済み
  var source =  '<img height="16" width="16" src="' + data.user.profile_image_url_https + '">';
      source += ' <b>' + data.user.name + '</b>';
      source += ' (<a href="https://twitter.com/' + screen_name + '">@' + screen_name + '</a>)<br>';
      source += '<p>' + data.text;
      source += ' (<a href="https://twitter.com/' + screen_name + '/status/' + data.id_str + '">show</a>)</p>';

  return source;
}

function notify(data) {
  var source = build_source(data);

  request.post(endpoint, {
    form: {
      source: source,
      format: 'html'
    }
  }, function(error, response, body){
    // do nothing...
  });
}

twitter.stream('statuses/filter', {follow: '4558871'}, function(stream) {
  stream.on('data', function(data) {
    if (data.retweeted_status) return;

    notify(data);
  });

  stream.on('error', function(error, data) {
    console.log(error, data);
  });
});
