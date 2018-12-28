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
    var state = {};
    var key = '6c1aa41e76cc55600f7a88e531724d23'; // Chris's Yummly API key
    var appID = '992846dd' // Chris's Yummly API ID
    var searchURL = 'http://api.yummly.com/v1/api/recipes?_app_id=992846dd&_app_key=6c1aa41e76cc55600f7a88e531724d23'
    var recipeURL = 'http://api.yummly.com/v1/api/recipe/recipe-id?_app_id=992846dd&_app_key=6c1aa41e76cc55600f7a88e531724d23'




    class Search {
        constructor(query) {
            this.query = query;
        }
        getResult() {

            return $.get(`http://api.yummly.com/v1/api/recipes?_app_id=${appID}&_app_key=${key}&q=${this.query}&requirePictures=true`, function (response) {

                // response.matches.forEach()


                this.results = response.matches;

            }.bind(this));
        }
    };



    const searchController = function () {

        const search = new Search(query);

        search.getResult(query).done(function () {

            console.log(search.results);

        });
    }



    var getSearch = function (query) {

        search.getResult(query).done(function () {
            console.log()
        });
    }


    var encodeSearch = function (query) {
        var params = encodeURIComponent(query);
    }


    $('.submit').on('click', function (e) {
        e.preventDefault();
        var query = $('#textarea1').val();
        
        if (query.length > 1) {
            encodeSearch(query);
        }
        
    })




    // for (i = 0; 0 < response.matches.length; i++) {
    //     var img = response.matches[i].smallImageUrls[0]
    //     var largeImg = img.replace('=s90', '=l90')
    //     var newImg = $('<img>')
    //     newImg.attr('src', largeImg)
    //     $('.container').append(largeImg);
    // }














    /*
    
    All below code are just for testing purposes
    
    */



    /*********************** Search Recipe GET request
     * ********* The below options will produce whatever is needed after making an AJAX query * ****** *****Search request ('response' is the JSON object returned)
     * 
     * 
     * 1) All matched recipes depending on search query input (array) - response.matches
     * 2) ID for that particular recipe (string) - response.matches[i].id
     * 2) Ingredients in one recipe (array) - response.matches[i].ingredients
     * 3) Name of recipe(string) - response.matches[i].recipeName
     * 4) Total Time in seconds(number) - response.matches[i].totalTimeInSeconds
     * 5) Flavors for that recipe (object) - response.matches[i].flavors
     * 6) Rating for that recipe (number)  - response.matches[i].rating
     * 7) Types of courses associated with recipe (array) - response.matches[i].attributes.course[i]
     * 8) Types of cuisine associated with recipe (array) - response.matches[i].attributes.cuisine[i]
     * 9) Total Matched results - response.totalMatchCount (number)
     * 
     * 10) This states the query parameters for the result set (object) - response.criteria
     * ^ see same at bottom of page for what is in criteria https://developer.yummly.com/documentation/search-recipes-response-sample
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     * ****************GET Recipe Request
     * **** The below will produce details on a given recipe using the GET Recipe request
     * *** Response = JSON object
     * 
     * 
     * 
     * 
     */








    /*********************  Below are Possible methods for autocomplete when a user enters in ingredients to include / exclude
     * 
     */


    // jquery search autocomplete reference
    // https://github.com/devbridge/jQuery-Autocomplete



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




    /************ Reference to URL encoding
     * https://stackoverflow.com/questions/75980/when-are-you-supposed-to-use-escape-instead-of-encodeuri-encodeuricomponent
     * 
     * For each parameter value that can be appended to the query URL, in order
     * to filter a search after a user chooses a filter, encodeURIComponent() needs to be used on that value to prevent white space/prevent an incorrect URL query
     * 
     * This needs to be done for every value that is a paramter in the recipe search API call
     * 
     */

});