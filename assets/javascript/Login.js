$(document).ready(function () {


  // Initialize Firebase
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyDcivjtLR1cf14Z7z1EiGaIThJ4qwWZKMQ",
      authDomain: "healthapp-fc0e3.firebaseapp.com",
      databaseURL: "https://healthapp-fc0e3.firebaseio.com",
      projectId: "healthapp-fc0e3",
      storageBucket: "healthapp-fc0e3.appspot.com",
      messagingSenderId: "153355736177"
    };
    firebase.initializeApp(config);


  var uiConfig = {
    // signInFlow: 'popup',
    signInSuccessUrl: 'index.html',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      // firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
  };
  // Initialize the FirebaseUI Widget using Firebase.  
  var ui = new firebaseui.auth.AuthUI(firebase.auth());  
  // The start method will wait until the DOM is loaded.  
  ui.start('#firebaseui-auth-container', uiConfig);  
})
