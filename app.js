
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
let displayData = {};

const hotdogDocRef = db.doc("samples/sandwichData");
const testDocRef = db.doc("testing/testingData");
const outputHeader = document.querySelector("#hotDogOutput");
const inputTextField = document.querySelector("#latestHotDogStatus");
const setButton = document.querySelector("#setButton");
setButton.addEventListener("click", set, inputTextField.value);
const loadButton = document.querySelector("#loadButton");
loadButton.addEventListener("click", load);
setup();



function setup(){
    console.log("> setup()");
    let dummyData = {
        dummyK_1 : "dummyV_1",
        dummyK_2 : "dummyV_2",
        dummyK_3 : "dummyV_3",
    };
    
    // set db doc to dummyData

    // set local data obj to sync to database

    // Tie dom output to data obj


}
function set(){
    console.log("> set()");
    if(inputTextField.value){
        let textToSet = inputTextField.value;
        console.log("...received value ["+textToSet+"].  Sending to Firestore.");
        try {
            hotdogDocRef.set({
                hotDogStatus: textToSet
            })
            .then((res) => console.log("Status saved!"))
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
            outputHeader.innerText = "Hot dog status: " + myData.hotDogStatus;
        }
    })
    .catch((err) => console.log("Got an error: ", err));
}