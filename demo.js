var http = require('http');
http.createServer(function(req, res)
{
    res.write('<h1>hello world</h1>');
    res.end();
}).listen(8080);