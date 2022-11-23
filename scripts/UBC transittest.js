
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var email = user.email;
        console.log(email, "is signed in");
        $("#loginBtn").hide();
        displayCards("Buses")
        // ...
    } else {
        console.log("No user is signed in");
        $("#logoutBtn").hide();
        // User is signed out
        // ...
    }
});


function displayCards(collection) {
    let cardTemplate = document.getElementById("transitCardTemplate");

    db.collection(collection).get()
        .then(snap => {
            snap.forEach(doc => { //iterate thru each doc
                var title = doc.data().BusID;        // get value of the "BusIDs" key
                var RouteHour = doc.data().RouteHour;   // get value of the "RouteHour" key
                var stop = doc.data().StopIDs; // get value of the "StopIDs" key
                var transitID = doc.data().Code; // get value of the "Code" key
                let newcard = cardTemplate.content.cloneNode(true);
                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-RouteHour').innerHTML = RouteHour;
                newcard.querySelector('.card-stop').innerHTML = stop;
                newcard.querySelector('.card-image').src = `../images/ubc_transit/${transitID}.jpeg`; //Example: NV01.jpg
                newcard.querySelector('.detailbtn').href = "UBC_transit_template.html?title=" + title + "&id=" + transitID;
                //give unique ids to all elements for future use
                document.getElementById(collection + "-go-here").appendChild(newcard); // populate card with data
            })
        })
}


$("logoutBtn").click(function () {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        console.log("User signed out");
    }).catch(function (error) {
        // An error happened.
        console.log("Error signing out");
    });
});