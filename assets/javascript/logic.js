$(document).ready(function () {

    // Initialize database
    // Firebase 
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
    var search = {};
    var key = '4d7d57aa09b888bc12e36f57b76129bc'; // Chris's Yummly API key
    var appID = 'fa6a5b04' // Aimes' Yummly API ID
    var searchURL = 'http://api.yummly.com/v1/api/recipes?_app_id=992846dd&_app_key=6c1aa41e76cc55600f7a88e531724d23'
    var recipeURL = 'http://api.yummly.com/v1/api/recipe/recipe-id?_app_id=992846dd&_app_key=6c1aa41e76cc55600f7a88e531724d23'
    // var search;



    /***
     * Class will construct a new object for every search
     * Less API calls for data and easier saved locally
     */
    class Search {
        constructor(query) {
            this.query = query;
        }

        // Protos
        getResult() {

            // GET request
            return $.get(`http://api.yummly.com/v1/api/recipes?_app_id=${appID}&_app_key=${key}&${this.query}requirePictures=true`, function (response) {

                var arr = response.matches;
                console.log(arr);

                // Search API request does not contain larger images
                // Loop array of recipes
                for (var i = 0; i < arr.length; i++) {
                    var largeImg = null
                    var html = '';
                    var img;

                    // change to large image URL
                    if (arr[i].smallImageUrls[0] !== -1) {
                        largeImg = arr[i].smallImageUrls[0].replace('=s90', '=l90');
                        html = `<img src="${largeImg}">`;
                        arr[i].smallImageUrls[0] = html;
                    } else if (arr[i].imageUrlsBySize['90']) {
                        img = arr[i].imageUrlsBySize['90'];
                        largeImg = img.replace('=s90', '=l90');
                        arr[i].imageUrlsBySize['90'].largeImg;
                    }
                }
                // Assign results property as array of recipes
                this.results = arr;

            }.bind(this));
        }
    };



    // Controls all searching tasks
    const searchController = function (query) {

        // 1) Assign new search object
        search = new Search(query);

        // 2) Prepare UI for recipes
        $('#recipes_view').empty()

        // Add preloader gif

        // 3) 
        search.getResult(query)

            // If API request successful
            .done(function () {
                console.log(search.results);

                // 4) Render results to UI
                renderResults(search.results);

                // Add a method to create pagination buttons
                // https://materializecss.com/pagination.html

            })

            // If API returns error
            .fail(function (error) {
                console.log(error)
            });
    };



    // Renders results and appends to recipes class in DOM
    var renderResults = function (recipes) {
        // var name = `<div class="recipe_name">${recipes.recipeName}</div>`


        recipes.forEach(function (el) {
            var name = $("<div class='recipe_name'>" + el.recipeName + "</div>");
            var largeImg;
            if (el.smallImageUrls[0] !== -1) {
                name.append(el.smallImageUrls[0])
                $('#recipes_view').append(name);
            } else {
            
                largeImg = $('<img>').attr('src', imageUrlsBySize['90'])
                name.append(largeImg)
                $('#recipes_view').append(name);
            }
            // el[0];
            // name.append(recipeImg);
        })
    };




    // Prevents white space in URL
    var encodeSearch = function (param, query) {
        var enQuery = encodeURIComponent(query);
        var enParams = param + enQuery + '&'

        searchController(enParams);
    }



    // Search submit button listener
    $('.submit').on('click', function (e) {
        e.preventDefault();
        var query = $('#textarea1').val();

        if (query.length > 1) {
            encodeSearch('q=', query);
        }
        $('#textarea1').val('')
        console.log(submit);

    })



















    /********************
     * All below code are just 
     * for testing
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
     */








    /*****************  Below are Possible methods for autocomplete 
     * 
     * when a user enters in ingredients to include / exclude
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

        // })

      });

      

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
// });