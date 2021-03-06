/* jshint -W030 */
/* Declare here to build into bundle */


window.$ = require('jquery');
window.jQuery = $;

var Backbone = require('backbone'),
	fastClick = require('fastclick'),
	jQuery_UI = require('jquery-ui'),
    jPlayer = require('jplayer'),
    Handlebars = require('handlebars/runtime'),
    
    // Handlebars helpers and blocks are intialized here
    hb_content = require('./hb_helpers/content_blocks'),
    hb_pagedetails = require('./hb_helpers/pagedetails_blocks'),
    hb_helpers = require('./hb_helpers/handlebars_helpers'),
    hb_partials = require('./hb_helpers/handlebars_partials'),
    // End Handlebars initialization

	bootstrap = require('bootstrap-sass'),
	jQuery_UI_Touch = require('jquery-ui-touch-punch'),
	_ = require('underscore'),

	// Settings
	namespace = require('./modules/namespace');


// dynamically duplicated in gulp
Norton.Constants = require('./dynamic/constants');
Norton.Utils = require('./modules/js_utils');


/* inject:logger */
/* endinject */

$(function() {
    'use strict';
    /**
         * Global primitives
         */
    //Norton.toggleGridFormat = true;
    //Norton.yourFavsCtr = 0;
    Norton.perPage = Norton.Constants.defaultPageSize;
    Norton.lastArticleLoaded = 0;
    Norton.currArticle = null;
    Norton.prevArticle = null;
    Norton.nextArticle = null;
    Norton.pageClick = null;
    Norton.saveUrl = null;
    Norton.scrollTrigger = false;
    Norton.siteCode = null;
    Norton.version = null;
    Norton.searchQuery = "";
    Norton.savedRefinements = [];
    Norton.sortby = {
        field: "pname",
        order: "Ascending"
    };
    Norton.discipline = null;
    Norton.searchRepo = null;
    Norton.navMetadata = null;

    // Filters for Navigation come from ArticlesModel
    Norton.Filters = {};

    /**
     * Authentication setup
     */
    Norton.isLoggedIn = (Norton.Utils.getCookie('ecm2')) ? true : false;

    /**
     * Get Site Code and version
     */
    var paths = window.location.pathname.split("/");

    Norton.siteCode = paths[1];
    Norton.version = paths[2];
    Norton.baseUrl = window.location.protocol + "//" + window.location.host + "/" + Norton.siteCode + "/" + Norton.version;

    // Can't allow IIG URL without a site code and version.
    if (!Norton.siteCode || !Norton.version) {
        window.location.href = Norton.Constants.invalidSiteCodeUrl;
    }

    /**
    *   General
    */
    NortonApp.evtMgr = require('./modules/event_manager');
    NortonApp.GSAPLite = require('./vendor/gsap_lite');

    /**
     * Models
     */
    NortonApp.Models.Article = require('./models/ArticleModel.js');
    NortonApp.Models.YourFavs = require('./models/YourFavsModel.js');
    NortonApp.Models.Page = require('./models/PageModel.js');
    NortonApp.Models.HeaderConfig = require('./models/HeaderConfigModel.js');
    NortonApp.Models.Tour = require('./models/TourModel.js');

    /**
     * Collections
     */
    NortonApp.Collections.Articles = require("./collections/ArticlesCollection.js");
    NortonApp.Collections.YourFavs = require("./collections/YourFavsCollection.js");
    NortonApp.Collections.Tour = require("./collections/TourCollection.js");

    /**
     * Views
     */
    NortonApp.Views.TopNav = require("./views/TopNavView.js");
    NortonApp.Views.Article = require("./views/ArticleView.js");
    NortonApp.Views.Filters = require("./views/FiltersView.js");
    NortonApp.Views.Search = require("./views/SearchView.js");
    NortonApp.Views.YourFavs = require("./views/YourFavsView.js");
    NortonApp.Views.Page = require("./views/PageView.js");
    NortonApp.Views.HeaderConfig = require("./views/HeaderConfigView.js");
    NortonApp.Views.ErrorPage = require("./views/ErrorPageView.js");
    NortonApp.Views.App = require("./views/AppView.js");
    NortonApp.Views.Loading = require("./views/LoadingView.js");
    NortonApp.Views.Footer = require("./views/FooterView.js");

    /**
     * Initializers
     */
    NortonApp.evtMgr.getInstance();

    NortonApp.articlesList = new NortonApp.Collections.Articles();
    NortonApp.articleItem = new NortonApp.Models.Article();
    NortonApp.yourFavsList = new NortonApp.Collections.YourFavs();
    NortonApp.yourFavsItem = new NortonApp.Models.YourFavs();
    //NortonApp.pageItem = new NortonApp.Models.Page();
    NortonApp.headerConfigItem = new NortonApp.Models.HeaderConfig();

    NortonApp.AppRouter = require('./routes/router.js');
    NortonApp.router = new NortonApp.AppRouter();

    fastClick(document.body);
});

/**
 * Re-order My Items
 * @param elem
 */
window.yourFavsDragNDrop = function(elem) {
    'use strict';
    $(elem).sortable();
};
