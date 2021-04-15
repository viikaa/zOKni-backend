const express = require("express");
const cors = require("cors");
const util = require("./util");


const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());


app.get('/api/socks', (req, res) => {
  res.send(util.getSocks());
});

app.get('/api/img/:fileName', (req, res) => {
  res.set({'Content-Type': 'image/png'});
  const imagePath = `${__dirname}/public/${req.params.fileName}`;
  if(util.exists(imagePath))
    res.sendFile(imagePath); 
  else
    res.sendStatus(404);
});

app.get('/api/socks/:sockId', (req, res) => { 
  res.send(util.getSockById(req.params.sockId)); 
});

app.post('/api/socks/:sockId/img', util.upload.single('image'), (req, res) => {
  const newImgName = util.saveImage(req.file);
  util.removeImage(req.params.sockId);
  util.updateImageSource(req.params.sockId, newImgName);
  res.send(util.getSockById(req.params.sockId));
});

app.put('/api/socks/:sockId', (req, res) => {
  util.updateSock(req.body);
  res.send(util.getSockById(req.body.id));
});

app.post('/api/socks', (req, res) => {
  const newSockId = util.addSock(req.body);
  res.send(newSockId);
})

app.delete('/api/socks/:sockId', (req, res) => {
  util.removeSock(req.params.sockId);
  res.sendStatus(200);
});

app.delete('/api/socks/:sockId/img', (req, res) =>{
  util.removeImage(req.params.sockId);
  res.send(util.getSockById(req.params.sockId));
})


app.listen(port, () => {
  console.log(`zOKni backand listening at http://localhost:${port}`);
});