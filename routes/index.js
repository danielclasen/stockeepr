var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {

    req.getConnection(function(err,connection){
        connection.query('SELECT * FROM Stocks', function(err,rows){

            if(err)
                console.log("Error Selecting : %s ",err );

            res.render('index', {
                title: 'StockeepR',
                partials: {
                    welcome: 'welcome',
                    layout: 'layout'
                },
                data : rows
            });

        });

    });


});

router.get('/check', function (req, res) {
    res.send({status:200});
});

module.exports = router;
