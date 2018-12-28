const http = require("http");
const app = require("./app");
const port = process.env.port || 3000;
// if(!process.env.gameID){
//     process.env.gameID = "";    
// }


const server = http.createServer(app);
server.listen(port);