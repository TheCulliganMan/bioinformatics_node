var express = require('express');
var router = express.Router();
const assert = require('assert');
const fs = require('fs');
var path = require('path');
const child_process = require('child_process');

const fasta_dir = './public/fastas';
const index_extensions = {
  '.amb':null,
  '.ann':null,
  '.bwt':null,
  '.pac':null,
  '.sa':null
};
const fasta_extensions = {
  '.fa':null,
  '.fasta':null,
  '.fna':null
}

router.get('/', function(req, res, next) {
  var fastas = {}; // true == indexed false == not indexed
  fs.readdir(fasta_dir, (err, files) => {

    files.forEach(file => {
      var ext = path.extname(file);
      if ( ext in index_extensions ) {

        var fai_wo_ext = file.replace(/\.[^/.]+$/, "");
        var fasta_path = path.join(fasta_dir, fai_wo_ext);
        fastas[fasta_path] = true;

      } else if (ext in fasta_extensions) {
        var fasta_path = path.join(fasta_dir, file);
        fastas[fasta_path] = false;
      }
    });
    // res.send(JSON.stringify(fastas));
    res.render(
      'bwa_check_index',
      {
        title: 'BWA Index',
        fastas:fastas
      });
  })
});

module.exports = router;
