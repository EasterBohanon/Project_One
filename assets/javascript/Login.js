// Initialize Firebase
var config = {
    apiKey: "AIzaSyC2ofFoahSCG7naJIyo7txw0rGVKKxOq5o",
    authDomain: "driven-copilot-227601.firebaseapp.com",
    databaseURL: "https://driven-copilot-227601.firebaseio.com",
    projectId: "driven-copilot-227601",
    storageBucket: "driven-copilot-227601.appspot.com",
    messagingSenderId: "973237957612"
  };
  firebase.initializeApp(config);

  
    var uiConfig = {  
     signInSuccessUrl: 'index.html',  
     signInOptions: [  
      // Specify providers you want to offer your users.  
    //   firebase.auth.GoogleAuthProvider.PROVIDER_ID,  
      firebase.auth.EmailAuthProvider.PROVIDER_ID  
     ],  
       
    };  
    // Initialize the FirebaseUI Widget using Firebase.  
    var ui = new firebaseui.auth.AuthUI(firebase.auth());  
    // The start method will wait until the DOM is loaded.  
    ui.start('#firebaseui-auth-container', uiConfig);  