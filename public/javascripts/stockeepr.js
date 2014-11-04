/**
 * Created by Daniel on 02.11.2014.
 */

var _ONLINE = false;

function deleteReport(inventoryId){
    $.ajax({
        url : "/inventory/api/delete/" + inventoryId,
        dataType: "json",
        success:function(){
            $('#inventory-' + inventoryId).hide("slow");
        }
    });
}

function checkPendingSync(){

    var openRequest = indexedDB.open("stockeepr",3);
    openRequest.onsuccess = function(e) {
        console.log("Success READ!");
        var db = e.target.result;
        var transaction = db.transaction(["reports"], "readonly");
        var objectStore = transaction.objectStore("reports");

        var cursor = objectStore.openCursor();

        cursor.onsuccess = function(e) {
            var res = e.target.result;
            if(res) {
                showPendingSync(res.value.stock,res.key);
                res.continue();
            }
        }
    };
}

function showPendingSync(stockID,key){
    if ($('#syncState-' + key).length == 0)
        $('#bodyStock-' + stockID).append($('<p>New Report<span class="label label-warning pull-right" id="syncState-' + key + '">Need Sync</span></p>'))
}

function commitPendingSync(key){
    $('#syncState-' + key).removeClass('label-warning').addClass('label-info').text('In Sync');
}

function collectReportData(){
    var data = {
        stock : $('#StockID').val(),
        inventory: new Array()
    };

    $('.reportData').each(function(){
        if ($(this).val() == "")
            var amount = 0;
        else
            var amount = $(this).val();
       data.inventory.push({ProductID:$(this).attr('id'),Value:amount});

       console.log($(this).attr('id') + " = " + amount);
    });
    return data;
}

function saveReport(reportData){
    if (reportData == null)
        reportData = collectReportData();

    var openRequest = indexedDB.open("stockeepr",3);

    openRequest.onupgradeneeded = function(e) {
        console.log("Upgrading...");
        var thisDB = e.target.result;

        if(!thisDB.objectStoreNames.contains("reports")) {
            thisDB.createObjectStore("reports",{autoIncrement:true});
        }
    };

    openRequest.onsuccess = function(e) {
        console.log("Success!");
        db = e.target.result;

        var transaction = db.transaction(["reports"],"readwrite");
        var store = transaction.objectStore("reports",{autoIncrement:true});
        var request = store.add(reportData);

        location.href = "http://localhost:3000/";

        request.onerror = function(e) {
            console.log("Error",e.target.error.name);
            //some type of error handler
        }

        request.onsuccess = function(e) {
            console.log("Woot! Did it");
        }
    };

    openRequest.onerror = function(e) {
        console.log("Error");
        console.dir(e);
    };

}

function synchronize(){

    var openRequest = indexedDB.open("stockeepr",3);
    openRequest.onupgradeneeded = function(e) {
        console.log("Upgrading...");
        var thisDB = e.target.result;

        if(!thisDB.objectStoreNames.contains("reports")) {
            thisDB.createObjectStore("reports",{autoIncrement:true});
        }
    };
    openRequest.onsuccess = function(e) {
        console.log("Success READ!");
        var db = e.target.result;
        var transaction = db.transaction(["reports"], "readonly");
        var objectStore = transaction.objectStore("reports");

        var cursor = objectStore.openCursor();

        cursor.onsuccess = function(e) {
            var res = e.target.result;
            if(res) {
                console.log("Key", res.key);
                console.debug("Data", res.value);
                pushToRemote(res.key,res.value);
                res.continue();
            }
        }
    };

    function pushToRemote(key,data){
        $.ajax({
            url : "/inventory/api/save",
            type: "post",
            data: {json:JSON.stringify(data)},
            dataType : "json",
            cache:false,
            success:function(){
                deleteRow(key);
                commitPendingSync(key);
            }
        });
    }

    function deleteRow(key){
        console.log("Deleting row " + key);
        var openRequest = indexedDB.open("stockeepr",3);
        openRequest.onsuccess = function(e) {
            console.log("Success!");
            db = e.target.result;

            var transaction = db.transaction(["reports"], "readwrite");
            var store = transaction.objectStore("reports", {autoIncrement: true});
            var request = store.delete(key);

        }
    }
}

function toggleOnline(online){
    $('#onlineLoading').hide();
    if (online){
        $('#onlineIndicator').removeClass('label-info').addClass('label-success');
        $('#onlineIndicatorText').text("Online");
        console.log("online");
        _ONLINE = online;
        synchronize();
    }else{
        $('#onlineIndicator').removeClass('label-info').addClass('label-danger');
        $('#onlineIndicatorText').text("Offline");
        console.log("offline");
        _ONLINE = online;
    }
}

function pingOnline(){
    $('#onlineLoading').show();
    $('#onlineIndicator').removeClass('label-danger label-success').addClass('label-info');
    $('#onlineIndicatorText').text("Checking...");
    $.ajax({
        url : "/check",
        dataType:"text"
    }).success(function(data, textStatus, xhr) {
        if (navigator.onLine)
            toggleOnline(true);
        else
            toggleOnline(false);
    }).error(function() {
        toggleOnline(false);
    });

}

$( document ).ready(function() {
    pingOnline();
    window.setInterval(function(){
        pingOnline();
    },10000);
});
