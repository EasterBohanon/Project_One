
$(document).ready(function(){

    //Initialize database
    var config = {
        apiKey: "AIzaSyBce3_oJFb_y9O6NRAnZft5Ia6dSf3dKL4",
        authDomain: "myfirstproject-9403c.firebaseapp.com",
        databaseURL: "https://myfirstproject-9403c.firebaseio.com",
        projectId: "myfirstproject-9403c",
        storageBucket: "myfirstproject-9403c.appspot.com",
        messagingSenderId: "909828001745"
      };
      firebase.initializeApp(config);

      //on click of user submit button
      $('button').on('click', function(){


        

        //Perform Ajax Call
        $.ajax({
            url: "http://api.yummly.com/v1/api/recipes?_app_id=fa6a5b04$_app_key=4d7d57aa09b888bc12e36f57b76129bc&" + input,
            method: "GET"
        }).then(function(response){

            var results = response.data;

        })

      })





})