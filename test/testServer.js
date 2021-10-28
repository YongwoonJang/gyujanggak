const http = require('http');
const ttt = require('../jyu-homepage/api/readDatabase')

const requestListener = function (req, res) {
    
    ttt();
    
}

const server = http.createServer(requestListener);
server.listen(80);