const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // counter.getNextUniqueId((err, id) => {
  //     //items[id] = text;
  //   fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
  //     if (err) {
  //       callback(new Error('Error'));
  //     }
  //     else {
  //       callback(null, { id, text });
  //     }
  //   } 
  // });
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
      if (err) {
        callback(new Error('Error'));
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, 'utf8', (err, files) => {
    if (err) {
      callback(new Error('Error'));
    } else {
      var data = [];
      files.forEach((ele, i) => {
        var cutChar = ele.slice(0, ele.length - 4);
        var obj = {id: cutChar, text: cutChar};
        data.push(obj);
        //console.log(data)
      });
      callback(null, data);
    // files.forEach(function(ele, index) {
    //   exports.readOne(ele.slice(0, ele.length - 4), (err, value) => {
    //     data.push(value);
    //     console.log(data);  
    //     })
    //   })
      // callback(null,)
    }
  }); 
};

exports.readOne = (id, callback) => {
  // console.log(exports.dataDir + '/' + id + '.txt')
  fs.readFile(exports.dataDir + '/' + id + '.txt', 'utf8' ,(err, text) => {
    //var text = items[id];
    if (err || id === undefined) {
      return callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  exports.readOne(id, function(err) {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, 'utf8', (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          console.log(id);
          callback(null, { id, text });
        }
      });
    }
  });
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  fs.unlink(exports.dataDir + '/' + id + '.txt', (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
