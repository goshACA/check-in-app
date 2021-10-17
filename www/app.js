var database = null;

var table = null;

var nextUser = 0;

function initDatabase() {
  database = window.sqlitePlugin.openDatabase({ name: 'test.db', location: 'default' });

  database.transaction(function (transaction) {
    transaction.executeSql('CREATE TABLE TestTable (id, date, address, number, mail)');
  });


  /*SqlServer.init("192.168.43.175", "localhost", "root", "berlin", "berlindb", function(event) {
 alert(JSON.stringify(event));
 SqlServer.testConnection(function(event) {
   alert(JSON.stringify(event));
 }, function(error) {
   alert("Error : " + JSON.stringify(error));
 });
 SqlServer.executeQuery("SELECT count(*) FROM mytable", function(event) {
   alert(JSON.stringify(event));
 }, function(error) {
   alert("Error : " + JSON.stringify(error));
 });	
}, function(error) {
 alert(JSON.stringify(error));
});*/

}

function echoTest() {
  window.sqlitePlugin.echoTest(function () {
    showMessage('Echo test OK');
  }, function (error) {
    showMessage('Echo test ERROR: ' + error.message);
  });
}

function selfTest() {
  window.sqlitePlugin.selfTest(function () {
    showMessage('Self test OK');
  }, function (error) {
    showMessage('Self test ERROR: ' + error.message);
  });
}

function reload() {
  location.reload();
}


function showCount() {

  database.transaction(function (transaction) {
    transaction.executeSql('SELECT count(*) AS recordCount FROM TestTable', [], function (ignored, resultSet) {
      showMessage('RECORD COUNT: ' + recordCount);
    });
  }, function (error) {
    showMessage('SELECT count error: ' + error.message);
  });
}

function showAll() {
  table = document.getElementById("checkintable");
  table.style.visibility = "visible";
  table.innerHTML = table.rows[0].innerHTML;
  database.transaction(function (transaction) {
    transaction.executeSql('SELECT *  FROM TestTable', [], function (tx, results) {
      var len = results.rows.length, i;
      for (i = 0; i < len; i++) {
        insertString(table, [results.rows.item(i).date, results.rows.item(i).address, results.rows.item(i).number, results.rows.item(i).mail]);
      }
    });
  }, function (error) {
    showMessage('SELECT count error: ' + error.message);
  });
}

function insertString(table, str) {
  var tr = document.createElement('tr');
  var i;
  for (i = 0; i < str.length; ++i) {
    var td = document.createElement('td');
    var text = document.createTextNode(str[i]);
    td.appendChild(text);
    tr.appendChild(td);
  }
  table.appendChild(tr);
}

function addCheckIn() {
  var numb = document.getElementById("chnumber").value;
  var date = new Date(document.getElementById("chdate").value).toLocaleDateString();
  var address = document.getElementById("chaddress").value;
  var mail = document.getElementById("chmail").value;
  database.transaction(function (transaction) {
    transaction.executeSql('INSERT INTO TestTable VALUES (?,?,?,?,?)', ['Restaurant: ' + nextUser, date, address, numb, mail]);
  }, function (error) {
    showMessage('INSERT error: ' + error.message);
  }, function () {
    showMessage('INSERT OK');
    ++nextUser;
  });

}


function hideTable() {
  table = document.getElementById("checkintable");
  table.style.visibility = "hidden";
  table.innerHTML = table.rows[0].innerHTML;
}

function showMessage(message) {
  //alert(message);
}


document.addEventListener('deviceready', function () {
  $('#showcheckin').click(showAll);
  $('#pindex').click(hideTable);
  $('#check').click(addCheckIn);


  initDatabase();

  window.onhashchange = function () {
    hideTable();
  }
});
