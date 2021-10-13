import {IncomingMessage, ServerResponse} from 'http';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';

const server = http.createServer();
const publicDir = path.resolve(__dirname, 'public');
let cacheAge = 3600 * 24 * 365;

server.on('request', (request: IncomingMessage, response: ServerResponse) => {

  // url改名为_url以免于url模块重名导致问题
  const {method, url: _url, headers} = request;
  const {pathname, search} = url.parse(_url as string);

  if (method !== 'GET'){
    response.statusCode = 405;
    response.setHeader("Content-Type","text/html; charset=utf-8");
    response.end(`405 ${method}方法不被允许`);
    return;
  }

  let filename = pathname?.substr(1) as string;
  if (filename === '') {
    filename = 'index.html';
  }
  fs.readFile(path.resolve(publicDir, filename), (error, data)=>{
    if (error) {
      if (error.errno === -2) {
        response.statusCode = 404;
        fs.readFile(path.resolve(publicDir, '404.html'),(error, data)=>{
          response.end(data.toString());
        });
      } else if (error.errno === -21) {
        response.statusCode = 403;
        response.end('403 无权访问');
      } else {
        response.statusCode = 500;
        response.end('500 服务器繁忙');
      }
    } else {
      // 主页不缓存，css和js会缓存
      response.setHeader('Cache-Control', `public, max-age=${cacheAge}`);
      response.end(data);
    }
  })
});

server.listen(8888);