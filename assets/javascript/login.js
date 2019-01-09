

 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyBce3_oJFb_y9O6NRAnZft5Ia6dSf3dKL4",
    authDomain: "myfirstproject-9403c.firebaseapp.com",
    databaseURL: "https://myfirstproject-9403c.firebaseio.com",
    projectId: "myfirstproject-9403c",
    storageBucket: "myfirstproject-9403c.appspot.com",
    messagingSenderId: "909828001745"
  };
  firebase.initializeApp(config);



//User Log in
var uiConfig = {  
    signInSuccessUrl: 'index.html',  
    signInOptions: [  
     // Specify providers you want to offer your users.  
    //  firebase.auth.GoogleAuthProvider.PROVIDER_ID,  
     firebase.auth.EmailAuthProvider.PROVIDER_ID  
    ],  
    // Terms of service url can be specified and will show up in the widget.  
    tosUrl: '<your-tos-url>'  
   };  
   // Initialize the FirebaseUI Widget using Firebase.  
   var ui = new firebaseui.auth.AuthUI(firebase.auth());  
   // The start method will wait until the DOM is loaded.  
   ui.start('#firebaseui-auth-container', uiConfig);  