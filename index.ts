import * as http from 'http';
import {IncomingMessage, ServerResponse} from 'http';

const server = http.createServer();

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  console.log(request.method);
  console.log(request.headers);
  console.log(request.url);

  const array: any = [];
  request.on("data", (data)=>{
    array.push(data);
  });
  request.on('end', ()=>{
    const body = Buffer.concat(array).toString();
    console.log(body);

    response.statusCode = 400;
    response.end('hi');
  });
});

server.listen(8888);