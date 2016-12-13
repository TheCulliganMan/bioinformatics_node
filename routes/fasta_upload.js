var express = require('express');
var router = express.Router();
var http = require('http');
var path = require('path');
var os = require('os');
var fs = require('fs');

var Busboy = require('busboy')

router.get('/', function(req, res, next) {
  res.render('file_upload', { title: 'Fasta Upload' });
});

router.post('/', function(req, res) {
  var busboy = new Busboy({ headers: req.headers });
  var extensions = {'.fa':null, '.fasta':null, '.fna':null};

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    if (mimetype == 'application/octet-stream') {
      var ext = path.extname(filename);
      if ( ext in extensions ) {
        var saveTo = path.join('./public/fastas', path.basename(filename));
        file.pipe(fs.createWriteStream(saveTo));
      } else {
        res.send("Bad File Extension. Extension must be in ('.fa', '.fasta', '.fna')!")
      }
    } else {
      res.send('Bad File Mimetype! Must be application/octet-stream!')
    }
  });

  busboy.on('finish', function() {
    res.render('file_upload', {title: 'Fasta Upload'});
  });

  return req.pipe(busboy);

})


module.exports = router;
