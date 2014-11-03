/**
 * Created by Daniel on 02.11.2014.
 */
var express = require('express');
var router = express.Router();

/* GET inventories listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});

router.get('/api/delete/:inventoryId', function(req,res){

    var inventoryID = req.params.inventoryId;
    req.getConnection(function(err, connection) {
        var query = connection.query('DELETE FROM inventory WHERE ?', {InventoryID: inventoryID}, function (err, result) {
            if(err)
                console.log("Error Deleting : %s ",err );
            var query = connection.query('DELETE FROM inventorydata WHERE ?', {InventoryID: inventoryID}, function (err, result) {
                if(err)
                    console.log("Error Deleting : %s ",err );
            });
        });
    });
    res.send({status:200});
});

router.post('/api/save',function(req,res){
    var body = JSON.parse(req.body.json);
    var stockID = body.stock;
    var inventory = body.inventory;

    req.getConnection(function(err, connection){
        var query = connection.query('INSERT INTO inventory SET ?', {StockID:stockID,ReportDate:new Date(),Description:''}, function(err, result) {
            connection.query('SELECT LAST_INSERT_ID() AS ID;', function(err, result) {
                console.log(result);
                var inventoryID = result[0].ID;
                for (var x in inventory){
                    console.log(x + ":" + inventory[x]);
                    var data = {InventoryID : inventoryID, ProductID:inventory[x].ProductID, Value:inventory[x].Value};
                    var query = connection.query('INSERT INTO inventorydata SET ?', data, function(err, result) {
                        console.error(err);
                    });
                    console.log(query.sql);
                    console.error(err);
                }
            });
            console.error(err);
        });

        console.log(query.sql);
    });
    res.send({status:200});
});

router.get('/list/:stockId', function(req,res){

    req.getConnection(function(err,connection){
        if(err)
            console.log("Error Selecting : %s ",err );
        var stockId = req.params.stockId;

        connection.query('SELECT * FROM Stocks WHERE StockID=' + stockId + ' LIMIT 1',function(err,stock) {
            connection.query('SELECT * FROM inventory WHERE StockID=' + stockId, function (err, result) {

                res.header("Cache-Control","no-cache, no-store, must-revalidate");
                res.header("Pragma","no-cache");
                res.header("Expires","0");

                res.render('inventory/list', {
                    title: 'StockeepR - List all Reports for Stock ' + stock.StockName,
                    stockId: stockId,
                    partials: {
                        layout: 'layout'
                    },
                    reports: result,
                    stock : stock
                });



            });

        });


    });

});

router.get('/create/:stockId', function(req, res) {


    req.getConnection(function(err,connection){
        connection.query('SELECT * FROM Products', function(err,rows){

            if(err)
                console.log("Error Selecting : %s ",err );

            var stockId = req.params.stockId;

           connection.query('SELECT * FROM Stocks WHERE StockID=' + stockId + ' LIMIT 1',function(err,stock){

               if(err)
                   console.log("Error Selecting : %s ",err );

               res.render('inventory/create', {
                   title: 'StockeepR - Create new Inventory Report',
                   stockId: stockId,
                   partials: {
                       layout: 'layout'
                   },
                   products : rows,
                   stock : stock
               });

           });



        });

    });

});

module.exports = router;
