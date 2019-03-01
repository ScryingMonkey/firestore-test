//intilialize firebase
var config = {
  apiKey: "AIzaSyCN4gGC2K4Adi6rKoqfipyAXRoIVBpWm3Y",
  authDomain: "firestore-test-21665.firebaseapp.com",
  databaseURL: "https://firestore-test-21665.firebaseio.com",
  projectId: "firestore-test-21665",
  storageBucket: "firestore-test-21665.appspot.com",
  messagingSenderId: "455825128064"
};
firebase.initializeApp(config);
let db = firebase.firestore();
let displayData = [];

const hotdogDocRef = db.doc("samples/sandwichData");
const hotdogResultsRef = db.collection("samples/sandwichData/results");
const testDocRef = db.doc("testing/testingData");
const outputHeader = document.querySelector("#hotDogOutput");
const inputTextField = document.querySelector("#latestHotDogStatus");
const saveButton = document.querySelector("#saveButton");
saveButton.addEventListener("click", set, inputTextField.value);
// Execute a function when the user releases the enter key on the keyboard
inputTextField.addEventListener("keyup", (event)=>{
  if (event.keyCode === 13) {
    event.preventDefault();
    saveButton.click();
  }
});
const dataTable = document.querySelector("#dataTable");
getRealtimeUpdates();

function set(){
  console.log("> set()");
  if(inputTextField.value){
    let textToSet = inputTextField.value;
    console.log("...received value ["+textToSet+"] from user.  Sending to Firestore.");
    try {
      hotdogDocRef.set({
        hotDogStatus: textToSet
      })
      .then((res) => {
        add();
        console.log("Data set! ["+textToSet+"]")
      })
      .catch((err) => console.log("Got an error: ", err));
    } catch (err){
      console.log("Error when sending to firestore.  ",err.message);
      throw err;
    }
  } else {
    console.log("...text to set is blank.");
  }
}
function add(){
  console.log("> add()");
  if(inputTextField.value){
    let textToSet = inputTextField.value;
    console.log("...received value ["+textToSet+"] from user.  Sending to Firestore.");
    try {
      hotdogResultsRef.add({status:textToSet})
      .then((res) => console.log("Data added to results! ["+textToSet+"]"))
      .catch((err) => console.log("Got an error: ", err));
    } catch (err){
      console.log("Error when sending to firestore.  ",err.message);
      throw err;
    }
  } else {
    console.log("...text to set is blank.");
  }
}
function load() {
  console.log("> load()");
  hotdogDocRef.get()
  .then((doc) => {
    if (doc && doc.exists) {
      const myData = doc.data();
      outputHeader.innerText = "Hot Dog Status: " + myData.hotDogStatus;
    }
  })
  .catch((err) => console.log("Got an error: ", err));
}
function getRealtimeUpdates() {
  // bind outputHeader to hotDogStatus
  hotdogDocRef.onSnapshot((doc)=>{
    if (doc && doc.exists) {
      const myData = doc.data();
      console.log("...outputHeader updated: ["+myData.hotDogStatus+"].");
      outputHeader.innerText = "Hot Dog Status: " + myData.hotDogStatus;
    }
  });
  // bind data to results
  hotdogResultsRef.onSnapshot({includeMetadataChanges:true},res => {
    if (res.docs) {
      displayData = res.docs.map(doc => {
        return {
          id:doc.id,
          status:doc._document.data.internalValue.root.value.internalValue,
          fromCache:doc._fromCache,
          hasPendingWrites:doc._hasPendingWrites,
        }
      });
      console.log("...displayData updated: ");
      console.dir(displayData);
      let tableHtml = buildTableHtml(displayData);
      dataTable.innerText = "";
      dataTable.innerHTML = tableHtml;
    } else {
      console.log("...res did not exist.");
      console.dir(res);
    }
  });
}
function buildTableHtml(displayData){
  let headers = ["number",...Object.keys(displayData[0])];
  let tableHtml = '<tr>';
  headers.forEach(h => {
    tableHtml += "<th>"+h+"</th>";
  });
  tableHtml += "</tr>";
  displayData.forEach((x,i) => {
    tableHtml += "<tr><td>"+i+"</td>";
    for (let k in x){
      tableHtml += "<td>"+x[k]+"</td>";
    }
    tableHtml += "</tr>";
    // console.log("...adding row: ",tableHtml);
  });
  return tableHtml;
}
