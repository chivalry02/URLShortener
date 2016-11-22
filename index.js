function heredoc(fn) {return fn.toString().split('\n').slice(1,-1).join('\n') +'\n';}

var doc = heredoc(function(){/*
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title></title>
		<script>
		self.location='URL';
		</script> 
	</head>
	<body>
	</body>
</html>
*/});

var index = heredoc(function(){/*
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<link rel="stylesheet" href="http://apps.bdimg.com/libs/bootstrap/3.3.4/css/bootstrap.min.css">
		<title></title>
	</head>
	<body>
		<div class="container">
			<h3>Example creation usage:</h3>
			<code><a href="https://urlshortener1.herokuapp.com/new/https://www.google.com">https://urlshortener1.herokuapp.com/new/https://www.google.com</a></code>
			<br>
			<code><a href="https://urlshortener1.herokuapp.com/new/http://freecodecamp.com/news">https://urlshortener1.herokuapp.com/new/http://freecodecamp.com/news</a></code>
			<br>If you want to pass a site that doesn't exist (or an invalid url) for some reason you can do:<br>
			<code><a href="https://urlshortener1.herokuapp.com/new/invalid?allow=true">https://urlshortener1.herokuapp.com/new/invalid?allow=true</a></code>
			<h3>Example creation output:</h3>
			<code>
				{
					"original_url": "http://freecodecamp.com/news",
					"short_url": "https://urlshortener1.herokuapp.com/4"
				}
			</code>
			<h3>Usage:</h3>
			<code><a href="https://urlshortener1.herokuapp.com/4">https://urlshortener1.herokuapp.com/4</a></code>
			<h3>Will redirect to:</h3>
			<code><a href="http://freecodecamp.com/news">http://freecodecamp.com/news</a></code>
		</div>
	</body>
</html>
*/});

var pathCache = {};

require('http').createServer(function (request, response) {
	var out = '';
	var path = require('url').parse(request.url).pathname;
	if (path === '/') {
		var out = index
	} else if (path !== '/favicon.ico') {
		var url = pathCache[path.slice(1)];
		if (url) {console.log(doc);
			out = doc.replace('URL', url);
		} else {
			var tmp = path.match(/\/new\/([http|https|HTTP|HTTPS].+)/);
			if (tmp) {
				var url = tmp[1];
				var idx = Object.getOwnPropertyNames(pathCache).length%10+1;
				pathCache[idx] = url;
				out = JSON.stringify({
					"original_url":url,
					"short_url":request.headers.host+'/'+idx
				});
			}
		}
	}
	
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.end(out);
}).listen(process.env.PORT || 5000);



