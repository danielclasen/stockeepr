var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    var date = new Date();
            res.contentType("text/cache-manifest");
            res.render('cache', {
                /*date: date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " " + date.getHours() + ":" + "00",*/
                date: date,
                version: "v1.0.4"
            });

});

module.exports = router;
