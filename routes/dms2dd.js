var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
  res.render('dms2dd', { title: 'DMS2DD' });
})

router.post('/', function(req, res, next) {

  var all_false = true

  var dms_keys = [
    'dlat', 'mlat', 'slat',
    'dlon', 'mlon', 'slon'
  ];
  var dms_obj = {
    dlat:0, mlat:0, slat:0,
    dlon:0, mlon:0, slon:0
  }

  dms_keys.forEach( key => {
    var val = dms_obj[key];
    if ((key in req.body) && (req.body[key])) {
      dms_obj[key] = req.body[key];
      all_false = false;
    }
  });

  if (all_false) {
    console.log(all_false);
    res.render('dms2dd', { title: 'DMS2DD' });
  } else {

    var latsign = 1.;
    var lonsign = 1.;
    var absdlat = 0;
    var absdlon = 0;
    var absmlat = 0;
    var absmlon = 0;
    var absslat = 0;
    var absslon = 0;

    function compareNumber(a, b) {
      if (a < b) return '-';
      else if (a === b) return '=';
      else if (a > b) return '+';
      else return 'z';
    }

    // Latitude Degrees
    if (compareNumber(dms_obj.dlat, 0) == '-' )  {
      latsign = -1.;
    } else {
      latsign = 1.;
    }
    absdlat = Math.abs(Math.round(dms_obj.dlat * 1000000.));

    // Latitude Minutes
    dms_obj.mlat = Math.abs(Math.round(dms_obj.mlat * 1000000.) / 1000000);
    absmlat = Math.abs(Math.round(dms_obj.mlat * 1000000.));

    // Latitude Seconds
    dms_obj.slat = Math.abs(Math.round(dms_obj.slat * 1000000.) / 1000000);
    absslat = Math.abs(Math.round(dms_obj.slat * 1000000.));

    // Longitude Degrees
    if (compareNumber (dms_obj.dlon,  0) == '-' )  {
      lonsign = -1.;
    } else {
      lonsign = 1.;
    }
    absdlon = Math.abs( Math.round(dms_obj.dlon * 1000000.));

    // Longitude Minutes
    dms_obj.mlon = Math.abs(Math.round(dms_obj.mlon * 1000000.) / 1000000);
    absmlon = Math.abs(Math.round(dms_obj.mlon * 1000000));

    // Longitude Seconds
    dms_obj.slon = Math.abs(Math.round(dms_obj.slon * 1000000.) / 1000000);
    absslon = Math.abs(Math.round(dms_obj.slon * 1000000.));

    // Error checking
    if (compareNumber(absdlat, (90 * 1000000)) == '+' )  {
      res.send('Degrees Latitude must be in the range of -90 to 90. ');
    }
    else if (compareNumber(absmlat, (60 * 1000000)) == '+') {
      res.send('Minutes Latitude must be in the range of 0 to 59. ');
    }
    else if (compareNumber(absslat,  (59.99999999 * 1000000)) ==  '+' ) {
      res.send('Seconds Latitude must be 0 or greater \n and less than 60. ');
    }
    else if (compareNumber(absmlon, (60 * 1000000)) == '+')   {
      res.send('Minutes Longitude must be in the range of 0 to 59. ');
    }
    else if (compareNumber(absslon, (59.99999999 * 1000000)) == '+') {
      res.send('Seconds Latitude must be 0 or greater \n and less than 60. ');
    }
    else if (compareNumber(absdlon, (180 * 1000000)) == '+') {
      res.send('Degrees Longitude must be in the range of -180 to 180. ');
    }

    var dd_lat = ((Math.round(absdlat + (absmlat / 60.) + (absslat/3600.)) / 1000000)) * latsign;
    var dd_lon = ((Math.round(absdlon + (absmlon / 60.) + (absslon/3600)) / 1000000)) * lonsign;

    res.send(JSON.stringify({'latitude': dd_lat, 'longitude': dd_lon}));

  }
});

module.exports = router;
