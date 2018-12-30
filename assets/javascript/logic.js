$(document).ready(function () {

    /********************************* Global Variables *****************************/

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
    var recipe = {};
    var key = '6c1aa41e76cc55600f7a88e531724d23'; // Chris's Yummly API key
    var appID = '992846dd' // Chris's Yummly API ID
    var searchURL = 'http://api.yummly.com/v1/api/recipes?_app_id=992846dd&_app_key=6c1aa41e76cc55600f7a88e531724d23';
    var recipeURL = 'http://api.yummly.com/v1/api/recipe/';





    /********************************** Classes / Dynamic Data ******************************/

    /***
     * Classes will construct a new object for every search
     * Less API calls for data and easier saved locally
     */
    class Search {
        constructor(query) {
            this.query = query;
        }

        // Method to get new search results
        getResult() {

            // returns the GET request
            return $.get(`${searchURL}&${this.query}requirePictures=true`, function (response) {

                var arr = response.matches;

                // Search API request does not contain larger images
                // Loop array of recipes
                for (var i = 0; i < arr.length; i++) {
                    var largeImg = null
                    var img;

                    // change to large image URL
                    if (arr[i].hasOwnProperty('smallImageUrls')) {
                        largeImg = arr[i].smallImageUrls[0].replace('=s90', '=l90');
                        arr[i].smallImageUrls[0] = largeImg;
                    } else if (arr[i].hasOwnProperty('imageUrlsBySize')) {
                        img = arr[i].imageUrlsBySize['90'];
                        largeImg = img.replace('=s90', '=l90');
                        arr[i].imageUrlsBySize['90'] = largeImg;
                    }
                }

                // Contains object of attributions Yummly requires
                this.attribution = response.attribution;

                // Contains number of total matches a user searches for
                this.totalMatchCount = response.totalMatchCount;

                // Contains object of all the facetCounts matching the results of faceField parameter
                this.facetCounts = response.facetCounts;

                // Contains object of all the filters/criteria that a user may select for a search
                this.criteria = response.criteria;

                // Assign results property as array of recipes
                this.results = arr;

            }.bind(this));
        }
    };




    // Class to create an object containing a certain recipe
    class Recipe {
        constructor(id) {
            this.id = id;
        }

        // method to get the recipe API request
        getRecipe() {

            return $.get(`${recipeURL}${this.id}?_app_id=${appID}&_app_key=${key}`, function (response) {

                this.attribution = response.attribution;
                this.nutritionEstimates = response.nutritionEstimates;
                this.totalTime = response.totalTime;
                this.images = response.images;
                this.name = response.name;
                this.source = response.source;
                this.ingredientLines = response.ingredientLines;
                this.numberOfServings = response.numberOfServings;
                this.totalTimeInSeconds = response.totalTimeInSeconds;
                this.attributes = response.attributes;
                this.flavors = response.flavors;
                this.rating = response.rating;

            }.bind(this));
        }
    };






    /******************************* Global APP Controllers *****************************/

    // Controls all searching tasks
    const searchController = function (query) {

        // 1) Assign new search object
        search = new Search(query);

        // 2) Prepare UI for recipes
        $('#recipes_view').empty();
        $('.num_results').empty();

        // Render the preloader
        renderLoader(true);

        // 3) Call getResult method in order to return API response consisting of recipes based on the search query
        search.getResult(query)


            // If API request successful
            .done(function () {
                console.log(search);
                console.log(search.results);

                // Remove preloader
                renderLoader(false);

                // 4) Render results to UI
                renderTotalMatches(search.totalMatchCount);
                renderResults(search.results);

                // Add a method to create pagination buttons
                // 

            })

            // If API returns error
            .fail(function (error) {
                var tag = $('<h4>');
                tag.text('Sorry, something went wrong.');
                $('#recipes_view').append(tag);
            });
    };



    // Controls all recipe tasks
    const recipeController = function (id) {

        if (id) {

            recipe = new Recipe(id);
            $('.recipe_content').empty();

            recipe.getRecipe()

                .done(function () {

                    renderRecipeModal(recipe.images[0].hostedLargeUrl, recipe.name, recipe.ingredientLines);

                })

                .fail(function (error) {
                    var tag = $('<h4>');
                    tag.text('Sorry, something went wrong.');
                    $('#recipes_view').append(tag);
                });

        }
    };






    /********************************** UI / View Functions ******************************/

    // Renders results and appends to recipes class in DOM
    var renderResults = function (recipes) {

        var results = $('<div>');

        // Displays total matched recipes
        $('#num_results').text(search.totalMatchCount);

        recipes.forEach(function (el) {
            var img;
            var name = $("<div class='fadeIn recipe_result recipe_" + el.recipeName + "' data-recipeID='" + el.id + "'>" + el.recipeName + "<br></div>");


            if (el.hasOwnProperty('smallImageUrls')) {
                img = $('<img>').attr('src', el.smallImageUrls[0]).addClass('recipe_result_img');
            } else if (el.hasOwnProperty('imageUrlsBySize')) {
                img = $('<img>').attr('src', el.imageUrlsBySize['90']).addClass('recipe_result_img');
            }

            name.append(img);
            results.append(name);
        });

        $('#recipes_view').append(results);
    };



    // Renders total amount of matches depending on search
    var renderTotalMatches = function (total) {
        el = $("<p>Total Suggested Recipes: " + total + "</p>");
        $('.num_results').append(el);
    };



    // Stil working on this 
    var renderRecipeModal = function (img, name, ing) {

        var modal = document.querySelector('#recipe_modal');

        var recipeName = $("<h4>" + name + "</h4>");
        var recipeImg = $('<img>').attr('src', img);
        var ingredients = $("<p>").text(ing);

        recipeName.append(recipeImg).append(ingredients);

        var instance = M.Modal.init(modal, {
            onOpenStart: function () {
                $('.recipe_content').append(recipeName);
            },
            onCloseEnd: function () {
                $('.recipe_content').empty();
            },
            dismissible: false,
            startingTop: '10%',
            endingTop: '10%'
        });

        instance.open();

    };



    // Prevents white space in URL
    var encodeSearch = function (param, query) {
        var enQuery = encodeURIComponent(query);
        var enParams = param + enQuery + '&';

        searchController(enParams);
    };

    // Renders preloader gif
    var renderLoader = function (e) {
        var loader = $("<img class='preloader'>").attr('src', 'assets/images/preloader.gif');

        if (e) {
            $('#recipes_view').append(loader);
        } else {
            $('.preloader').remove();
        }
    };









    /************************************** Event Listeners ********************************/

    // Search submit button listener
    $('.submit').on('click', function (e) {
        e.preventDefault();
        var query = $('#textarea1').val();

        if (query.length > 1) {
            encodeSearch('q=', query);
        }

        $('#textarea1').val('');
    });


    // Click Listener for when a user clicks a recipe image to display recipe details
    $(document).on('click', '.recipe_result', function () {
        var id = $(this).attr('data-recipeid');
        recipeController(id);
    });


    // Search Keypress Listener
    $('#search_form').keypress((e) => {
        var query = $('#textarea1').val();
        if (e.keyCode === 13 || e.which === 13) {
            e.preventDefault();
            encodeSearch('q=', query);
            $('#textarea1').val('');
            $('#textarea1').blur();
        }
    });


    // Search field listener for when a user clicks on search field or not, slides filters down or up
    $("#textarea1").on({
        focus: function () {
            $('#filters').slideDown('slow');
        },
        blur: function () {
            $('#filters').slideUp('slow');
        }
    });

















    /****** IDEAS
     * 
     * Can possibly utilize tags whenever a user selects a filter
     * 
     */




    /**
     * 
     * On Search API request:
     * 
     * maxResult, start = &maxResult=10&start=10
     *
     * max 5 page items in pagination (use array)
     * 
     * start = page * 10
     * 
     * 
     * 
     */







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
});