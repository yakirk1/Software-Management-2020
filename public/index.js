 var firebaseConfig = {
    apiKey: "AIzaSyADdQp8Z4Wb4coN_XfvrcnnQ6fhV02HE2k",
    authDomain: "logintest-ec7bf.firebaseapp.com",
    databaseURL: "https://logintest-ec7bf.firebaseio.com",
    projectId: "logintest-ec7bf",
    storageBucket: "logintest-ec7bf.appspot.com",
    messagingSenderId: "680989974119",
    appId: "1:680989974119:web:6f5d987df74d3514b47ec2",
    measurementId: "G-291NVE9V64"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
	
const auth= firebase.auth();
	
function signUp(){
  const auth= firebase.auth();
  var email = document.getElementById("email");
  var password = document.getElementById("password");
  alert("before ref test");
  var ref=firebase.database().ref();
  alert("declare test");
  ref.child("name11ded").set("value11dads");
  alert("ref usage test");
  const promise = firebase.auth().createUserWithEmailAndPassword(email.value, password.value);
  promise.catch(e => alert(e.message)); 
  alert("Signed Up");
 }
 
 
 
 function Login(){
  const auth= firebase.auth();
  var email = document.getElementById("email");
  var password = document.getElementById("password");
  
  const promise = auth.signInWithEmailAndPassword(email.value, password.value);
  promise.catch(e => alert(e.message));
  
  
  
  
 }
 
 
 function signOut(){
  
  auth.signOut();
  alert("Signed Out");
  
 }
 
 
 
 auth.onAuthStateChanged(function(user){
  
  if(user){
   
   var email = user.email;
   alert("Active User " + email);
   
   //Take user to a different or home page

   //is signed in
   
  }else{
   
   alert("No Active User");
   //no user is signed in
  }
  
  
  
 });