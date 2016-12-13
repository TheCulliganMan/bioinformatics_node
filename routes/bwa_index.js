var express = require('express');
var router = express.Router();
var path = require('path');
const assert = require('assert');
const fs = require('fs');
const child_process = require('child_process');
const fasta_dir = './public/fastas';

router.get('/', function(req, res, next){
  res.render('bwa_index', { title: 'BWA Index' });
})

router.post('/', function(req, res, next) {
  console.log(req.body);
  if (! 'fasta_file' in req.body) {
    resp.render('bwa_index', { title: 'BWA Index' });
  } else {
    var file_name = req.body.fasta_file;
    var fasta_path = path.join(fasta_dir, file_name);

    if (!(fs.existsSync(fasta_path))) {

      res.send("Fasta file does not exist.");

    } else {

      var child = child_process.spawn('bwa', ['index', fasta_path], {
          stdio: [
            0, // Use parents stdin for child
            fs.openSync('out.out', 'w'), // Pipe child's stdout to parent
            fs.openSync('err.out', 'w') // Direct child's stderr to a file
          ]
      });

      assert.equal(child.stdio[0], null);
      assert.equal(child.stdio[0], child.stdin);

      assert.equal(child.stdio[1], null);
      assert.equal(child.stdio[1], child.stdout);

      assert.equal(child.stdio[2], null);
      assert.equal(child.stdio[2], child.stderr);

      res.send(JSON.stringify(
        {'file': fasta_path,
        'indexed':true
      }));
    }
  }
});

module.exports = router;
