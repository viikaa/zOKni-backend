const fs = require("fs");
const path = require('path');
const multer =require("multer");
const { v4: uuidv4 } = require("uuid");

const DB_FILE = "./zokniDb.json";

module.exports = {
  readData: () => {
    let dbContent;
    try {
      dbContent = JSON.parse(fs.readFileSync(DB_FILE));
    } catch (error) {
      dbContent = [];
      fs.writeFileSync(DB_FILE, JSON.stringify(dbContent));
    } 
    return dbContent;
  },

  getSocks: () => {
    const socks = module.exports.readData();
    return socks;
  },

  getSockById: sockId => {
    const socks = module.exports.readData();
    const sock = socks.filter(s => s.id === sockId)[0];
    return sock;
  },

  updateImageSource: (sockId, newSource) => {
    const socks = module.exports.readData();
    const newSocks = socks.map(s => s.id === sockId ? {...s, imgSrc: newSource} : s);
    fs.writeFileSync(DB_FILE, JSON.stringify(newSocks));
  },

  updateSock: sock => {
    const socks = module.exports.readData();  
    const newSocks = socks.map(s => s.id === sock.id ? sock : s);
    fs.writeFileSync(DB_FILE, JSON.stringify(newSocks));
  },
  
  addSock: sock => {
    const socks = module.exports.readData();
    const newSock = {...sock, id: uuidv4()}
    socks.push(newSock);
    fs.writeFileSync(DB_FILE, JSON.stringify(socks));
    return newSock;
  },

  removeSock: sockId => {
    const socks = module.exports.readData();
    module.exports.removeImage(sockId);
    const newSocks = socks.filter(s => s.id !== sockId);
    fs.writeFileSync(DB_FILE, JSON.stringify(newSocks));
  },

  saveImage: file =>{
    const tempPath = file.path;
    const ext = path.extname(file.originalname);
    const fileName = `${uuidv4()}${ext}`;
    const targetPath = path.join(__dirname, `./public/${fileName}`);
    fs.rename(tempPath, targetPath, err => err && console.log(err));
    return fileName;
  },
  
  removeImage: sockId => {
    const socks = module.exports.readData();
    const sock = socks.filter(s => s.id === sockId)[0];
    const imgName = sock.imgSrc;
    if(imgName !== null){
      const imgPath = path.join(__dirname, `./public/${imgName}`);
      module.exports.updateImageSource(sockId, null);
      fs.unlink(imgPath, err => err && console.log(err));
    }
  },

  exists: path => {
    return fs.existsSync(path);
  },

  upload: multer({dest:'./public'})

};
