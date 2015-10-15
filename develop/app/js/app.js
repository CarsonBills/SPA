/* jshint -W030 */
/* declare here to build into bundle */

window.$ = require('jquery');
window.jQuery = $;

var Backbone = require('backbone'),
	fastClick = require('fastclick'),
	jQuery_UI = require('jquery-ui'),
    Handlebars = require('handlebars/runtime'),
    hb_helpers = require('./hb_helpers/handlebars_helpers'),
	bootstrap = require('bootstrap-sass'),
	jQuery_UI_Touch = require('jquery-ui-touch-punch'),
	_ = require('underscore'),

	// settings
	namespace = require('./modules/namespace');

Backbone.$ = $;

Norton.Constants = require('./modules/js_constants');
Norton.Utils = require('./modules/js_utils');

$(function() {
    "use strict";
	/**
     * Global primitives
     */
    //Norton.toggleGridFormat = true;
    Norton.yourFavsCtr = 0;
    Norton.perPage = Norton.Constants.defaultPageSize;
    Norton.totalRecords = 0;
    Norton.recordStart = 0;
    Norton.recordEnd = 0;
    Norton.lastArticleLoaded = 0;
    Norton.currArticle = null;
    Norton.prevArticle = null;
    Norton.nextArticle = null;
    Norton.pageClick = null;
    Norton.saveUrl = null;
    Norton.scrollTrigger = false;
    Norton.siteCode = null;
    Norton.version = null;

    /**
     * Authentication setup
     */
    // get rid of before moving to wwnorton.com environment...
document.cookie = "IISPROTECTLOGIN=User=pdietrich@wwnorton.com";

    Norton.isLoggedIn = (Norton.Utils.getCookie('IISPROTECTLOGIN')) ? true : false;

    Norton.baseUrl = $(location).attr("href");

    /**
     * Get Site Code and version
     */
    var paths = window.location.pathname.split("/");
    if ($(location).attr("href").indexOf("nortonreader.dev") >= 0) {
        Norton.siteCode = "nortonreader";
        Norton.version = paths[1];
    } else {
        Norton.siteCode = paths[1];
        Norton.version = paths[2];
    }

    // Can't allow IIG URL without a site code and version.
    if (!Norton.siteCode || !Norton.version) {
       window.location.href = Norton.Constants.invalidSiteCodeUrl;
    }

    /**
    *   General
    */

    NortonApp.evtMgr = require('./modules/eventManager');

    /**
     * Models
     */
    NortonApp.Models.Filter = require('./models/FilterModel.js');
    NortonApp.Models.Article = require('./models/ArticleModel.js');
    NortonApp.Models.YourFavs = require("./models/YourFavsModel.js");
    NortonApp.Models.Page = require("./models/PageModel.js");
    NortonApp.Models.HeaderConfig = require("./models/HeaderConfigModel.js");

    /**
     * Collections
     */
    NortonApp.Collections.Articles = require("./collections/ArticlesCollection.js");
    NortonApp.Collections.Filters = require("./collections/FiltersCollection.js");
    NortonApp.Collections.YourFavs = require("./collections/YourFavsCollection.js");

    /**
     * Views
     */
    NortonApp.Views.TopNav = require("./views/TopNavView.js");
    NortonApp.Views.Article = require("./views/ArticleView.js");
    NortonApp.Views.Filters = require("./views/FiltersView.js");
    NortonApp.Views.YourFavs = require("./views/YourFavsView.js");
    NortonApp.Views.Page = require("./views/PageView.js");
    NortonApp.Views.HeaderConfig = require("./views/HeaderConfigView.js");
    NortonApp.Views.IntroPanel = require("./views/IntroPanelView.js");
    NortonApp.Views.App = require("./views/AppView.js");

    /**
     * Initializers
     */
    NortonApp.evtMgr.getInstance();

    NortonApp.articlesList = new NortonApp.Collections.Articles();
    NortonApp.articleItem = new NortonApp.Models.Article();
    NortonApp.filtersList = new NortonApp.Collections.Filters();
    NortonApp.filterItem = new NortonApp.Models.Filter();
    NortonApp.yourFavsList = new NortonApp.Collections.YourFavs();
    NortonApp.yourFavsItem = new NortonApp.Models.YourFavs();
    NortonApp.pageItem = new NortonApp.Models.Page();
    NortonApp.headerConfigItem = new NortonApp.Models.HeaderConfig();
    NortonApp.pageView;
    NortonApp.introPanelView;

    NortonApp.AppRouter = require("./routes/router.js");
    NortonApp.router = new NortonApp.AppRouter();

	

	fastClick(document.body);
    $(window).scroll(scrollHandler);
    stickyRelocate();

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
    "use strict";
    $(elem).sortable();
};

/**
 * handle window scroll events for Sticky and for Load-More
 */
window.scrollHandler = function() {
    "use strict";
    stickyRelocate();

/*    if(!Norton.scrollTrigger && $(window).scrollTop() > ($(document).height() - $(window).height() - 50)) {
        Norton.scrollTrigger = true;
        $("#loadMore").click();
        Norton.scrollTrigger = false;

        var scroll_to_new = (Norton.lastArticleLoaded + 1);
        $("[data-id="+scroll_to_new+"]").focus();
    }
*/
};

/**
 * Sticky for navbar to remain at top when scrolling
 */
window.stickyRelocate = function() {
    "use strict";
    var window_top = $(window).scrollTop();
    var div_top = $('#sticky-anchor').offset().top;
    if (window_top > div_top) {
        $('.container').addClass('stick');
    } else {
        $('.container').removeClass('stick');
    }
};


