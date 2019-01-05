$(document).ready(function () {

    /***************************** Global Variables / Initializations *************************/

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



    // Initialize filter tabs
    var filterTabs = document.querySelector('.tabs');
    var instance = M.Tabs.init(filterTabs, {
        onShow: function () {
            // var id = $(this)[0].$content.attr('id')
            // $('#' + id).addClass('slideUptab');
        }
    });

    // Initialize side navbar
    $('.sidenav').sidenav();


    // Global Variables
    var favorite = [];
    var search = {};
    var recipe = {};
    var key = '6c1aa41e76cc55600f7a88e531724d23'; // Chris's Yummly API key
    var appID = '992846dd' // Chris's Yummly API ID
    var searchURL = 'http://api.yummly.com/v1/api/recipes?_app_id=992846dd&_app_key=6c1aa41e76cc55600f7a88e531724d23';
    var recipeURL = 'http://api.yummly.com/v1/api/recipe/';
    var searchQuery = '';
    var newQuery = '';
    var newIncIngredient = '';
    var newExIngredient = '';
    var currentPage;
    var page = 10;
    var ajaxRunning = false;







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
            return $.get(`${searchURL}${this.query}&requirePictures=true`, function (response) {

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

        // Method to get the recipe API request
        getRecipe() {

            return $.get(`${recipeURL}${this.id}?_app_id=${appID}&_app_key=${key}`, function (response) {

                this.attribution = response.attribution;
                this.nutritionEstimates = response.nutritionEstimates;
                this.totalTime = response.totalTime;
                this.images = response.images;
                this.name = response.name;
                this.yield = response.yield;
                this.source = response.source;
                this.ingredientLines = response.ingredientLines; //use this for shopping cart
                this.numberOfServings = response.numberOfServings;
                this.totalTimeInSeconds = response.totalTimeInSeconds;
                this.attributes = response.attributes;
                this.flavors = response.flavors;
                this.rating = response.rating;

            }.bind(this));
        };
    };







    /******************************* Global APP Controllers *****************************/

    // Controls all searching tasks
    const searchController = function (query, bool) {

        // 1) Assign new search object
        search = new Search(query);

        if (!bool) {
            $('#recipes_view').empty();
            $('.num_results').empty();
        }
        // 2) Prepare UI for recipes

        // Render the preloader
        renderLoader(true);

        // 3) Call getResult method to return API response consisting of recipes
        search.getResult(query)

            // If API request successful
            .done(function () {
                console.log(search);
                console.log(search.results);

                // 4) Render results to UI
                renderLoader(false);
                renderTotalMatches(search.totalMatchCount);
                renderResults(search.results);


                // Add a method to create pagination buttons

            })

            // If API returns error
            .fail(function (error) {
                displayNoResults();
            });
    };


    // Controls all recipe tasks
    const recipeController = function (id, fav) {

        if (id) {

            // Create new Recipe object
            recipe = new Recipe(id);
            $('.recipe_content').empty();

            // Call getRecipe method to call API request
            recipe.getRecipe()

                .done(function () {

                    // Render recipe and open modal
                    renderRecipeModal(recipe.images[0].hostedLargeUrl, recipe.name, recipe.ingredientLines);

                    if (fav){

                        favorite = myRecipe(recipe.images[0].hostedLargeUrl, recipe.name, )
                    }
                })

                // If search fails
                .fail(function (error) {
                    displayNoResults();
                });
        }
    };


    // Controls all search filter selections / removals
    const filterController = function (type, param, status) {
        var filter = param + type;
        page = 10;

        if (searchQuery.indexOf('&start=') !== -1) {
            searchQuery = searchQuery.replace('&start=' + currentPage, '');
        }

        // If this search is a query parameter search..
        if (param === '&q=' && newQuery.length > 0) {
            searchQuery = searchQuery.replace(newQuery, filter);
            newQuery = filter;
        } else if (param === '&q=') {
            newQuery = filter;
            searchQuery += filter;
        } else {

            // If this filter is a newly added filter
            if (status) {
                // Combine with current search query
                searchQuery += filter;

                // If user removes filter
            } else if (!status) {

                // Remove filter from search query
                searchQuery = searchQuery.replace(filter, '');
            }
        }
        // Begin new search
        searchController(searchQuery);
    };


    // Closure in order to increment page number by multiples of 10
    var incrementPage = (function (n) {
        return function () {
            if (page === 10) {
                n = 10;
            }
            n += 10;
            return n;
        }
    }(10));






    /********************************** UI / View Functions ******************************/

    // Renders results and appends to recipes class in DOM
    var renderResults = function (recipes) {
        var results = $("<div class='fadeIn'>");

        if (search.totalMatchCount === 0) {
            displayNoResults();
        } else {
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
        }
        // Displays total matched recipes
        $('#num_results').text(search.totalMatchCount);
        $('#recipes_view').append(results);

        // Assign ajaxRunning to false after recipes render in order to 
        // continue displaying more recipes once user scrolls to bottom
        ajaxRunning = false;
    };


    // Renders total amount of matches depending on search
    var renderTotalMatches = function (total) {
        el = $("<p>Total Suggested Recipes: " + total + "</p>");
        $('.num_results').append(el);
    };


    // Still working on this 
    var renderRecipeModal = function (img, name, ing) {

        var modal = document.querySelector('#recipe_modal');

        var recipeName = $("<h4>" + name + "</h4>");
        var recipeImg = $('<img>').attr({
            src: img,
            alt: name
        });

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
            startingTop: '70%',
            endingTop: '60%'
        });

        instance.open();
    };


    // Prevents white space in URL
    var encodeSearch = function (param, query) {
        var enQuery = encodeURIComponent(query);

        if (param == '&allowedIngredient%5B%5D=' || param == '&excludedIngredient%5B%5D=') {

            filterController(enQuery, param, true);
        } else if (param == '&q=') {
            filterController(enQuery, param);
        }
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

    // Displays on UI that no recipe results were found
    var displayNoResults = function () {
        var tag = $('<h4>');
        tag.text('Sorry, no recipes found.');

        $('#recipes_view').append(tag);
    };

    // Displays ingredient filter tag inside ingredients filter
    var displayIngredientFilter = function (type, ingredient, param) {
        var enIngredient = encodeURIComponent(ingredient);
        var html = `<div class="ingredient_tag ingredient_${type}_del" data-ingredient="${enIngredient}" data-ingparam="${param}">${ingredient}<i class="close material-icons ingredient_del">close</i>`
        var selector = `.ingredient_${type}_col`;

        $(selector).append(html);
    };

    var displayCurrentPage = function (page) {
        var p = $('<p>');
        p.text('Current Page: ' + page);
        $('.current_page').empty();
        $('.current_page').append(p);
    };








    /************************************ Event Listeners ********************************/

    // Search submit button listener
    $('.submit').on('click', function (e) {
        e.preventDefault();
        var query = $('#textarea1').val().trim();

        if (query.length > 1) {
            encodeSearch('&q=', query);
        }

        $('#textarea1').val('');
        // $('#filters').slideUp('slow');
    });


    // Click Listener for when a user clicks a recipe image to display recipe details
    $(document).on('click', '.recipe_result', function () {
        var id = $(this).attr('data-recipeid');
        recipeController(id);
    }); 
    
    // favorite recipe button 
    $(document).on('click', '.favButton', function () {
        var id = $(this).attr('data-recipeName');
        recipeController(id, fav);
        // recipe.getRecipe()
        favorite.push(recipe.name);
        for(i = 0; i < favorite.length; i++){
        var favRecipe = recipe.name;
        recipeController(id, fav);
        
        // favRecipe.attr("data-recipeName", favorite[i]);
        // favRecipe.text("#favRecipe");
        $("#favDisplay").append(favRecipe);
    }
        // favorite.push(recipe.name);

        console.log(favorite);
    });

    // Search Keypress Listener
    $('#search_form').keypress((e) => {
        var query = $('#textarea1').val().trim();
        if (e.keyCode === 13 || e.which === 13) {
            e.preventDefault();
            if (query.length > 1) {
                encodeSearch('&q=', query);
                $('#textarea1').val('');
                // $('#filters').slideUp();
            }
        }
    });


    // Search field listener for when a user clicks on search field or not, slides filters down
    $("#textarea1").on({
        focus: function () {
            $('#filters').slideDown('435');
        },
        blur: function () {
            hideOnClickOutside('#filters');
        }
    });


    // Function adds/removes click listener depending on if user clicks inside or outside filter area
    var hideOnClickOutside = function (selector) {
        const outsideClickListener = (event) => {
            if (!$(event.target).closest(selector).length) {
                if ($(selector).is(':visible')) {
                    if ($(event.target).hasClass('ingredient_del')) {
                        event.stopPropagation();
                    } else {
                        $(selector).slideUp('435');
                        removeClickListener();
                    }
                }
            }
        };
        const removeClickListener = () => {
            document.removeEventListener('click', outsideClickListener);
        };
        document.addEventListener('click', outsideClickListener);
    };


    // Check box listener to determine if a certain checkbox is selected or not
    $('input[type=checkbox]').on('change', function () {
        var input = $(this);
        var filterType = input.attr('data-filter');
        var param = input.attr('data-param');

        if (input.is(':checked')) {
            filterController(filterType, param, true);
        } else {
            filterController(filterType, param, false);
        }
    });


    // // Kepress listener for included ingredients search field
    $('.ingredient_inc_form').keypress((e) => {
        var ingredient = $('.ingredient_inc_field').val().trim();
        if (e.keyCode === 13 || e.which === 13) {
            e.preventDefault();
            if (ingredient.length > 1) {
                newIncIngredient = ingredient.toLowerCase();
                encodeSearch('&allowedIngredient%5B%5D=', newIncIngredient);
                displayIngredientFilter('inc', newIncIngredient, '&allowedIngredient%5B%5D=');
                $('.ingredient_inc_field').val('');
            }
        }
    });


    // Keypress listener for excluded ingredients search field
    $('.ingredient_ex_form').keypress((e) => {
        var ingredient = $('.ingredient_ex_field').val().trim();
        if (e.keyCode === 13 || e.which === 13) {
            e.preventDefault();
            if (ingredient.length > 1) {
                newExIngredient = ingredient.toLowerCase();
                encodeSearch('&excludedIngredient%5B%5D=', newExIngredient);
                displayIngredientFilter('ex', newExIngredient, '&excludedIngredient%5B%5D=');
                $('.ingredient_ex_field').val('');
            }
        }
    });


    // Click listener for when user removes a filtered ingredient
    $(document).on('click', '.ingredient_del', function (e) {
        var parentEl = $(this).parent();
        var ingredient = parentEl.attr('data-ingredient');
        var param = parentEl.attr('data-ingparam');
        filterController(ingredient, param, false);
        parentEl.remove();
    });


    // Scroll listener to detect when user scrolls to the bottom of the page
    $(window).scroll(function () {
        if ($(window).scrollTop() == $(document).height() - $(window).height()) {
            if (searchQuery.length > 0) {
                if (searchQuery.indexOf('&start=') !== -1) {
                    searchQuery = searchQuery.replace('&start=' + currentPage, '');
                }
                if (!ajaxRunning) {
                    ajaxRunning = true;
                    currentPage = incrementPage();
                    page = currentPage;
                    queryPage = `${searchQuery}&start=${currentPage}`
                    searchController(queryPage, true);
                    console.log(page);
                }
            }
        }
    });

















    // Sidenav button event listener
    // document.addEventListener('DOMContentLoaded', function () {
    //     var elems = document.querySelectorAll('.sidenav');
    //     var instances = M.Sidenav.init(elems, options);
    // });

    // Initialize collapsible (uncomment the lines below if you use the dropdown variation)
    // var collapsibleElem = document.querySelector('.collapsible');
    // var collapsibleInstance = M.Collapsible.init(collapsibleElem, options);
    // Sidenav event listener
    $(document).ready(function () {
        $('.sidenav').sidenav();
    });



















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
});