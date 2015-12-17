var Backbone = require('backbone'),
    _ = require('underscore'),
    $ = require('jquery'),
    ModalManager = require('../modules/modal_manager'),
    ErrorsManager = require('../modules/errors_manager'),
    TrackManager = require('../modules/track_manager'),
    Favorites = require('../modules/favorites_helper'),
    FavoritesData = require('../modules/favorites_data');

var YourFavsView = Backbone.View.extend({
    MODULE: 'favorites',
    templateHdr: require('../../templates/YourFavsHeaderTemplate.hbs'),
    templateItem: require('../../templates/YourFavsTemplate.hbs'),
    modal: '#modal-container',
    content: '.modal-content',
    body: '.modal-body',
    $content: null,
    app: null,
    articles: null,
    lsMyFavs: 'myfavs_' + Norton.siteCode + "_" + Norton.version,

    initialize: function(params) {
        'use strict';
        var that = this;
        this.app = params.app;
        this.articles = params.articles;
        this.$content = this.$(this.modal + " " + this.content);

        this.collection.on('remove', function (e) {
            // make sure this render process only apply when in favs view
            if (ModalManager.runModule(that.MODULE)) {
                that.render();
            }
        });

        this.loadLocalStorage();
    },

    events: {
        "click .savelist-lnk": "toggleYourFavs",
        "click #navYourFavs": "showYourFavs",
        "click .button-container a": "saveYourFavs",
        "click .list-format .remove": "removeYourFavs"
    },

    render: function() {
        'use strict';
        var that = this,
            $div = $('<div></div>'),
            hasContent = (this.collection.length > 0),
            template;

        template = this.templateHdr({
            hasContent: hasContent
        });

        $div.html(template);

        if (hasContent) {
            _.each(this.collection.models, function(article) {
                template = that.templateItem(article.toJSON());
                $div.find(that.body).append(template);
            });
        } else {
            $div.find(that.body).append(ErrorsManager.NO_FAVORITES);
        }

        ModalManager.show({
            content: $div,
            module: this.MODULE
        });

        this.$("div[data-module=favorites] .modal-body").sortable();
        return this;
    },

    removeItem: function (model) {
        'use strict'; 

        if (model) {
            this.collection.remove(model);
            this.saveLocalStorage();
            this.updateCount();
        }
    },

    removeYourFavs: function (e) {
        'use strict';

        var $target = $(e.currentTarget),
            id = $target.parent().data('id'),
            model = this.collection.getModelByAttribute("id", id);

        if (model !== undefined) {
            this.showPopover($target, "Item Removed");
            this.removeItem(model);
        }
        return false;
    },

    updateCount: function () {
        'use strict';
        // show item counter
        $('#yourFavsCtr').html(' (' + this.collection.length + ')');
    },

    showPopover: function ($target, mesg) {
        'use strict';
        var direction = "left";

        if (this.articles.showGrid()) {
            direction = "right";
        }
        $target.popover({
            content: mesg,
            placement: direction,
            container: '.content'
        });
        $target.popover('show');
        TweenLite.to($('.popover'), 1, {autoAlpha: 0, delay: 1, onComplete: function () {
            $('.popover').popover('destroy');
        }});
    },

    toggleYourFavs: function(e) {
        'use strict';

        // Add item to yourFavsList collection
        var $target = $(e.currentTarget),
            id = $target.data('item-id'),
            favsData = {},
            article = this.articles.getModelByAttribute("pname", id),
            articleData,
            model = this.collection.getModelByAttribute("pname", id);

        // Don't add again
        if ( model !== undefined) {
            this.showPopover($target, "Item Removed");
            this.removeItem(model);
            return false;
        }

        // found already in the collection
        if (article) {
            articleData = article.attributes.allMeta;
            favsData = FavoritesData.input(articleData);

            this.showPopover($target, "Item Added");

        } else {
            // this is triggered from page not in the collection
            articleData = this.articles.getCurrentPageDetail(id);
            favsData = FavoritesData.inputCurrentPage(articleData);
        }
        this.collection.add(favsData);

        this.saveLocalStorage();
        this.updateCount();
        TrackManager.save(id);

        return false;
    },

    showYourFavs: function() {
        'use strict';
        this.render();

        return false;
    },

    strip: function (html) {
        'use strict';
        var tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText;
    },

    saveYourFavs: function (e) {
        'use strict';
        var $target = $(e.currentTarget),
            type = $target.data('type');

        Favorites.save({
            title: $('#yourFavsTitle').text(),
            type: $target.data('type'),
            filename: $target.data('filename'),
            collection: this.collection
        });

        return false;
    },

    saveLocalStorage: function () {
        'use strict';
        // save in localstorage
        try {
            localStorage.setItem(this.lsMyFavs, JSON.stringify(this.collection));
        } catch (e) { }
    },

    loadLocalStorage: function() {
        'use strict';
        var that = this,
            lsTemp = "";
        /**
         * try to load from localstorage - maybe user hit refresh
         */
        try {
            lsTemp = JSON.parse(localStorage.getItem(this.lsMyFavs));
            if (lsTemp) {
                _.each(lsTemp, function(item) {
                    that.collection.add(new NortonApp.Models.YourFavs(item), {silent: true});
                });
            }
            if (this.app.dataReady) {
                this.updateCount();
            } else {
                this.app.deferred.promise().done(function () {
                    that.updateCount();
                });
            }
        } catch(e) {}
    }
});

module.exports = YourFavsView;
