


var config = {
    apiKey: "AIzaSyCRnbVACYPfjUQqaU6qUWx59SNF0ZfjnnY",
    authDomain: "test-project-e79f0.firebaseapp.com",
    databaseURL: "https://test-project-e79f0.firebaseio.com",
    projectId: "test-project-e79f0",
    storageBucket: "test-project-e79f0.appspot.com",
    messagingSenderId: "263357981360"
  };



  firebase.initializeApp(config);

  var database = firebase.database();

  var connectionsRef = database.ref("/connections");
  var connectedRef = database.ref(".info/connected");
  connectedRef.on("value", function(snap) {
    if (snap.val()) {
      var con = connectionsRef.push(true);
      con.onDisconnect().remove();
    }
  });

  
$("#submit").on("click", function() {
    event.preventDefault();

  var trainName = $("#trainName").val();
  var destination = $("#destination").val().trim();
  var trainTime = $("#trainTime").val().trim();
  var frequency= $("#frequency").val().trim();


  console.log(trainName);

  console.log(destination);

  console.log(trainTime);

  console.log(frequency);

  database.ref().push({
      name: trainName,
      destination: destination,
      firstTrain: trainTime,
      frequency: frequency,
      date: firebase.database.ServerValue.TIMESTAMP,
    });
    sessionStorage.clear();
});


 


  database.ref().on("child_added", function(childSnapshot) {
    var nextArr;
    var minAway;
    var subtractedFirstTrain = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
    var timeDifference = moment().diff(moment(subtractedFirstTrain), "minutes");
    var remainingTime = timeDifference % childSnapshot.val().frequency;
    var minAway = childSnapshot.val().frequency - remainingTime;
    var trainComing = moment().add(minAway, "minutes");
    trainComing = moment(trainComing).format("hh:mm");

    $("#table").append(
    "<tr><td>" + childSnapshot.val().name +
    "</td><td>" + childSnapshot.val().destination +
    "</td><td>" + childSnapshot.val().frequency +
    "</td><td>" + trainComing + 
    "</td><td>" + minAway + "</td></tr>")}, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
  
  });


