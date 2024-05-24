const jsonServer = require('json-server');
const low = require('lowdb');
const Memory = require('lowdb/adapters/Memory');

const adapter = new Memory();
const db = low(adapter);

// Adicione seus dados ao banco de dados em memória, incluindo vídeos
db.defaults({ posts: [], videos: [
    {
        "id": 1,
        "titulo": "Conhecendo a linguagem Go | Hipsters.Talks",
        "descricao": "3 mil visualizações",
        "url": "https://www.youtube.com/embed/y8FeZMv37WU",
        "imagem": "https://github.com/MonicaHillman/aluraplay-requisicoes/blob/main/img/logo.png?raw=true"
      },
      {
        "id": 2,
        "titulo": "Desmistificando mobile - Linguagens e Frameworks",
        "descricao": "1,5 mil visualizações",
        "url": "https://www.youtube.com/embed/fmu1LQvZhms",
        "imagem": "https://github.com/MonicaHillman/aluraplay-requisicoes/blob/main/img/logo.png?raw=true"
      }
  // Adicione mais vídeos conforme necessário
]}).write();

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Defina o roteador corretamente
const router = jsonServer.router(db);

// Adicione uma rota personalizada para /videos
router.db._.mixin({
  videos: function () {
    return db.get('videos').value()
  }
});

server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  req.db = db; // Adicione o objeto de banco de dados ao objeto de solicitação
  next();
});
server.use(router);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
