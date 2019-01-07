const http = require("http");
const app = require("./app");     //app.js wird eingebunden
const port = process.env.port || 3000;  //environment variable, wird genutzt falls vom admin festgelegt

const server = http.createServer(app);  //app.js
server.listen(port);
