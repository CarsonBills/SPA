/**
 * This is the "driver" script for the app. It pulls in node.js modules, all css files, and all app javascript files.
 * Use browserify to compile this file into one js file called bundle.js, which becomes the main script source in the
 * index.html file.
 *
 * TO create the bundle.js use:
 * ****************************
 * Install all node modules locally
 *
 * npm install --save-dev backbone {underscore.js is a dependency so it's also installed}
 * npm install --save-dev browserify-css
 * npm install --save-dev handlebars
 * npm install --save-dev jquery jquery-ui
 * npm install --save-dev jquery-ui-touch-punch@0.2.3
 * npm install --save-dev hbsfy
 * npm install --save-dev fastclick
 * npm install --save-dev uglifyify

 * ************************************************************************************************************************
 * >>>>>>>>>>>          sudo browserify -t hbsfy -t [browserify-css --minify=true] -t uglifyify app.js -o bundle.js
 * ************************************************************************************************************************
 *
 * @type {*|exports|module.exports}
 */

//"use strict" - jquery-ui and jquery-ui-touch-punch do not like this

window.$ = require('jquery');
window.jQuery = $;
require('jquery-ui');
require('jquery-ui-touch-punch');

/**
 * Effects JS libraries
 */
window.FastClick = require('fastclick');

// Bootstrap
window.bootstrap = require('bootstrap');

// Backbone and underscore
window.Backbone = require('backbone');
Backbone.$ = $;

// Underscore
window._ = require('backbone/node_modules/underscore');

//Handlebars
window.Handlebars = require('handlebars');
/**
 * Could not figure out how to register helpers at runtime - so basically cannot use handelbars custom helpers until we do!
 */
//require("./app/js/handlebars_helpers.js")(Handlebars);

// All stylesheets to get compiled into bundle.js
var css = require('./app.css');

// Define Namespaces
window.Norton = {};

window.NortonApp = {
    Models: {},
    Collections: {},
    Views: {}
};

// Get constants file
Norton.Constants = require("./app/js/constants.js")

$(function() {
    /**
     * Global primitives
     */
    Norton.toggleGridFormat = true;
    Norton.yourFavsCtr = 0;
    Norton.perPage = 0;
    Norton.pageNbr = 0;
    Norton.nbrRecords = 0;
    Norton.lastArticleLoaded = 0;
    Norton.currArticle = null;
    Norton.prevArticle = null;
    Norton.nextArticle = null;
    Norton.pageClick = null;
    Norton.saveUrl = null;
    Norton.scrollTrigger = false;

    Norton.baseUrl = $(location).attr("href");

    /**
     * Models
     */
    NortonApp.Models.Filter = require('./app/js/models/FilterModel.js');
    NortonApp.Models.Article = require('./app/js/models/ArticleModel.js');
    NortonApp.Models.YourFavs = require("./app/js/models/YourFavsModel.js");
    NortonApp.Models.Page = require("./app/js/models/PageModel.js");
    NortonApp.Models.HeaderConfig = require("./app/js/models/HeaderConfigModel.js");

    /**
     * Collections
     */
    NortonApp.Collections.Articles = require("./app/js/collections/ArticlesCollection.js");
    NortonApp.Collections.Filters = require("./app/js/collections/FiltersCollection.js");
    NortonApp.Collections.YourFavs = require("./app/js/collections/YourFavsCollection.js");

    /**
     * Views
     */
    NortonApp.Views.TopNav = require("./app/js/views/TopNavView.js");
    NortonApp.Views.Article = require("./app/js/views/ArticleView.js");
    NortonApp.Views.Filters = require("./app/js/views/FiltersView.js");
    NortonApp.Views.YourFavs = require("./app/js/views/YourFavsView.js");
    NortonApp.Views.Page = require("./app/js/views/PageView.js");
    NortonApp.Views.App = require("./app/js/views/AppView.js");

    /**
     * Initializers
     */
    NortonApp.articlesList = new NortonApp.Collections.Articles();
    NortonApp.articleItem = new NortonApp.Models.Article();
    NortonApp.filtersList = new NortonApp.Collections.Filters();
    NortonApp.filterItem = new NortonApp.Models.Filter();
    NortonApp.yourFavsList = new NortonApp.Collections.YourFavs();
    NortonApp.yourFavsItem = new NortonApp.Models.YourFavs();
    NortonApp.pageItem = new NortonApp.Models.Page();
    NortonApp.headerConfigItem = new NortonApp.Models.HeaderConfig();
    NortonApp.pageView;

    NortonApp.AppRouter = require("./app/js/routes/router.js");
    NortonApp.router = new NortonApp.AppRouter();
});

/**
 * Launch NERD in a sliding iframe
 * @param url - Ebook URL
 * @param title - Book title

window.launchEbookIframe = function (url, title) {
    $('#ebookTitle').html(title);
    $(".cd-panel-content").empty(); // clear out the iframe container before loading a new book

    var ifr = document.createElement('iframe');
    ifr.style.cssText ='margin:0; padding:0; width:100%; height:100%;';
    ifr.src = url;
    $(".cd-panel-content").append(ifr);
    $('.cd-panel').addClass('is-visible');
};
 */

/**
 * re-order My Items
 * @param elem
 */
window.yourFavsDragNDrop = function (elem) {
    $( elem ).sortable();
};

/**
 * handle window scroll events for Sticky and for Load-More
 */
window.scrollHandler = function() {
    stickyRelocate();

    if(!Norton.scrollTrigger && $(window).scrollTop() > ($(document).height() - $(window).height() - 50)) {
        Norton.scrollTrigger = true;
        $("#loadMore").click();
        Norton.scrollTrigger = false;

        var scroll_to_new = (Norton.lastArticleLoaded + 1);
        $("[data-id="+scroll_to_new+"]").focus();


       /* this will make a LoadMore event scroll to the first article of the new set. In a SetTimeout so there is enough
        time for Backbone to render the next set.

       setTimeout(
            function() {
                $('html, body').animate({
                    scrollTop: $("[data-id="+scroll_to_new+"]").offset().top
                    }, 700);
            }, 100
        );*/
    }
}

/**
 * Sticky for navbar to remain at top when scrolling
 */
window.stickyRelocate = function() {
    var window_top = $(window).scrollTop();
    var div_top = $('#sticky-anchor').offset().top;
    if (window_top > div_top) {
        $('.container').addClass('stick');
    } else {
        $('.container').removeClass('stick');
    }
}
