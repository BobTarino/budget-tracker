// create variable to hold db connection
let db;
// establish a connection to IndexedDB database called 'budget_tracker' and set it to version 1
const request = indexedDB.open('budget_tracker', 1);
// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
    // save a reference to the database 
    const db = event.target.result;
    // create an object store (table) called `new_transaction', set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('new_transaction', { autoIncrement: true });
};
// upon a successful 
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;
  
    // check if app is online, if yes run uploadTransaction() function to send all local db data to api
    if (navigator.onLine) {
      // uploadTransaction();
    }
  };
  
request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
};

// This function will be executed if we attempt to submit a new Transaction and there's no internet connection
function saveRecord(record) {
    // open a new transaction ((not to be confused with transaction model)) with the database with read and write permissions 
    const dbTransaction = db.dbTransaction(['new_Transaction'], 'readwrite');
  
    // access the object store for `new_Transaction`
    const TransactionObjectStore = dbTransaction.objectStore('new_Transaction');
  
    // add record to your store with add method
    TransactionObjectStore.add(record);
}