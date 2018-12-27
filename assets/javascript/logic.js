$(document).ready(function () {

    // Initialize database
    // Chris's Firebase 
    var config = {
        apiKey: "AIzaSyDcivjtLR1cf14Z7z1EiGaIThJ4qwWZKMQ",
        authDomain: "healthapp-fc0e3.firebaseapp.com",
        databaseURL: "https://healthapp-fc0e3.firebaseio.com",
        projectId: "healthapp-fc0e3",
        storageBucket: "",
        messagingSenderId: "153355736177"
    };
    firebase.initializeApp(config);




    // Global variables
    var key = '6c1aa41e76cc55600f7a88e531724d23'; // Chris's Yummly API key
    var appID = '992846dd' // Chris's Yummly API ID
    var searchURL = 'http://api.yummly.com/v1/api/recipes?_app_id=992846dd&_app_key=6c1aa41e76cc55600f7a88e531724d23&'



    

    function getJSONp (json) {
        console.log(json)
    }


    // AJAX call for search
    $.ajax({
        url: 'http://api.yummly.com/v1/api/metadata/ingredient?_app_id=992846dd&_app_key=6c1aa41e76cc55600f7a88e531724d23&',
        type: 'GET',
        dataType: 'jsonp',
        jsonpCallback: getJSONp
    });


    











    /*
    
    All below code are just for testing purposes
    
    */



    // $('input.autocomplete').autocomplete({
    //     data: {
    //         "Apple": null,
    //         "Microsoft": null,
    //         "Google": 'https://placehold.it/250x250'
    //     },
    //     limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
    //     onAutocomplete: function (val) { // Callback function when value is autcompleted.



    //     },
    //     minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
    // });





    // $(function () {
    //     $.ajax({
    //         type: 'GET',
    //         url: '',
    //         success: function (response) {
    //             var countryArray = response;
    //             var dataCountry = {};
    //             for (var i = 0; i < countryArray.length; i++) {
    //                 //console.log(countryArray[i].name);
    //                 dataCountry[countryArray[i].name] = countryArray[i].flag; //countryArray[i].flag or null
    //             }
    //             $('input.autocomplete').autocomplete({
    //                 data: dataCountry,
    //                 limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
    //             });
    //         }
    //     });
    // });




    /******* Reference to URL encoding
     * https://stackoverflow.com/questions/75980/when-are-you-supposed-to-use-escape-instead-of-encodeuri-encodeuricomponent
     * 
     * For each parameter value that can be appended to the query URL in order
     * to filter a search after a user chooses a filter, encodeURIComponent() needs to be used on that value to prevent white space/prevent incorrect URL query
     * 
     * This needs to be done for every value
     * 
     */
})