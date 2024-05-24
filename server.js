const jsonServer = require('json-server');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync'); // Importe o FileSync adapter

// Use o adapter FileSync para ler e gravar dados em um arquivo
const adapter = new FileSync('db.json');
const db = low(adapter);

// Adicione seus dados iniciais ao banco de dados se necessário
db.defaults({ videos: [] }).write();

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const router = jsonServer.router(db);

server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  req.db = db;
  next();
});
server.use(router);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
