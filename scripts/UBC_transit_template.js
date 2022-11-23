//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyC31Ktxw_RjB0cKuw6Pg0dN0BPOHsIbMR0",
    authDomain: "bcit-dtc05-project.firebaseapp.com",
    projectId: "bcit-dtc05-project",
    storageBucket: "bcit-dtc05-project.appspot.com",
    messagingSenderId: "494917892160",
    appId: "1:494917892160:web:4a4972c9f10060c8c587a5"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function displayCards() {
    let cardTemplate = document.getElementById("transitCardTemplate");
    let params = new URL(window.location.href);
    let transitCode = params.searchParams.get("id");
    let transitTitle = params.searchParams.get("title");
    db.collection("Stops").where("Code", "==", transitCode).get()
        .then(allStops => {
            stops = allStops.docs;
            console.log(stops)
            //var i = 1;  //if you want to use commented out section
            stops.forEach(doc => { //iterate thru each doc
                var title = doc.data().BusIDs;        // get value of the "BusIDs" key
                var LocationName = doc.data().LocationName;   // get value of the "LocationName" key
                var stop = doc.data().StopID;
                var transitID = doc.data().Code;
                var imageID = doc.data().ImageCode;
                let newcard = cardTemplate.content.cloneNode(true);

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-LocationName').innerHTML = LocationName;
                newcard.querySelector('.card-stop').innerHTML = stop;
                newcard.querySelector('.card-image').src = `../images/ubc_transit/${imageID}.jpeg`; //Example: NV01.jpg
                newcard.querySelector('i').id = 'save-' + imageID;  //know which busstop to bookmark based on which busstop was clicked
                newcard.querySelector('i').onclick = () => saveBookmark(imageID); //call a function to save the busstop to the user's document 
                currentUser.get().then(userDoc => {
                    //get the user name
                    var bookmarks = userDoc.data().bookmarks;
                    if (bookmarks.includes(imageID)) {
                        document.getElementById('save-' + imageID).innerText = 'favorite';
                    }
                })
                document.getElementById("Stops" + "-go-here").appendChild(newcard);
                //i++;   //if you want to use commented out section
            })
        })
}

displayCards("Stops");

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var email = user.email;
        console.log(email, "is signed in");
        currentUser = db.collection("users").doc(user.uid);
        console.log(currentUser);
        $("#loginBtn").hide();
        // ...
    } else {
        console.log("No user is signed in");
        $("#logoutBtn").hide();
        // User is signed out
        // ...
    }
});

$("logoutBtn").click(function () {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        console.log("User signed out");
    }).catch(function (error) {
        // An error happened.
        console.log("Error signing out");
    });
});

function saveBookmark(imageID) {
    currentUser.set({
        bookmarks: firebase.firestore.FieldValue.arrayUnion(imageID)
    }, {
        merge: true
    })
        .then(function () {
            console.log("bookmark has been saved for: " + currentUser);
            var iconID = 'save-' + imageID;
            console.log(iconID);
            document.getElementById(iconID).innerText = 'favorite';
        });
}