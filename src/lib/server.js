
const jsonServer = require('json-server');
const middleware = require('./middleware');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));

server.use(jsonServer.defaults({
  static: path.join(__dirname, '../../public')
}));

server.use(middleware);
server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running on port 3000');
});
