var dbPromised = idb.open("footballapps", 2, function(upgradeDb) {
  var teamsOS = upgradeDb.createObjectStore("teams", {
    keyPath: "id"
  });
  teamsOS.createIndex("name", "name", {
    unique: false
  });
});


function saveForLater(data) {
  dbPromised
    .then(function(db) {
      var tx = db.transaction("teams", "readwrite");
      var store = tx.objectStore("teams");
      console.log(data);
      store.add(data);
      return tx.complete;
    })
    .then(function() {
      console.log("Data berhasil di simpan.");
    });
}

function getAll() {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("teams", "readonly");
        var store = tx.objectStore("teams");
        return store.getAll();
      })
      .then(function(data) {
        resolve(data);
      });
  });
}