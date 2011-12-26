var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , path = require('path')
  , buffer = "";

app.listen(8080);

function handler (request, response) {
  
  var filePath = '.' + request.url;
  console.log(filePath);
  if (filePath === './'){
  	filePath = './index.html';
  }
  console.log(filePath);
  var extName = path.extname(filePath),
  	  contentType = 'text/html';
  switch (extName) {
    case '.js':
    	contentType = 'text/javascript';
        break;
    case '.css':
        contentType = 'text/css';
        break;
  }
  
  path.exists(filePath, function(exists) {
	console.log(exists);
  	if (exists) {
		console.log(filePath);
  		fs.readFile(filePath, function(error, content) {
			console.log(content);
  			if (error) {
				console.log(error);
		    	response.writeHead(500);
      		  	response.end();
  			} else {
				console.log(contentType);
  				response.writeHead(200, { 'Content-Type' : contentType });
  				response.end(content, 'utf-8');  			
  			}
  		});
  	} else {
  		response.writeHead(404);
  		response.end();
  	}
  });
}

io.sockets.on('connection', function (socket) {
  socket.on('sendWitness', function (data) {
    console.log(data.d);
    buffer = data.d;
    io.sockets.emit('responseWitness', { d: buffer });
  });
});
