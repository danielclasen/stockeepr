var express = require('express');
var router = express.Router();

/* GET home page. */
//http://localhost:3000/ {get|html}
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

//http://localhost:3000/check {get|json}
router.get('/check', function (req, res) {
    res.send({status:200});
});

module.exports = router;
