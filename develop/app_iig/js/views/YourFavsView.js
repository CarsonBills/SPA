var Backbone = require('backbone'),
    _ = require('underscore'),
    $ = require('jquery'),
    ModalManager = require('../modules/modal_manager'),
    ErrorsManager = require('../modules/errors_manager'),
    TrackManager = require('../modules/track_manager'),
    FavoritesData = require('../modules/favorites_data'),
    DetailsParser = require('../modules/details_model_parser'),
    TrackManager = require('../modules/track_manager');

var YourFavsView = Backbone.View.extend({
    MODULE: 'favorites',
    SAVE: 'save',
    REMOVE: 'remove',
    templateHdr: require('../../templates/modules/YourFavsHeaderTemplate.hbs'),
    templateItem: require('../../templates/modules/YourFavsTemplate.hbs'),
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

        if (Norton.isLoggedIn) {
            this.getSavedFavs();
        } else {
            this.loadLocalStorage();
        }
    },

    events: {
        "click .savelist-lnk": "toggleYourFavs",
        "click #navYourFavs": "showYourFavs",
        "click .button-container a": "saveYourFavs",
        "click .list-format .remove": "removeYourFavs",
        "click .favs-title a": "triggerPage"
        //"click .remove-all-items": "removeAll"
    },

    render: function() {
        'use strict';
        var that = this,
            $div = $('<div></div>'),
            hasContent = (this.collection.length > 0),
            template,
            tmpObj;

        template = this.templateHdr({
            hasContent: hasContent,
            title: NortonApp.headerConfigItem.get('displayTitle')
        });

        $div.html(template);

        if (hasContent) {
            _.each(this.collection.models, function(article) {
                tmpObj = $.extend({}, article.toJSON());
                if (tmpObj.downloads.src) {
                    tmpObj.downloads.src = DetailsParser.parseUrl(tmpObj.downloads.src);
                }

                tmpObj.baseUrl = Norton.baseUrl;

                template = that.templateItem(tmpObj);
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

    triggerPage: function (e) {
        'use strict';
        var id = $(e.currentTarget).data('id');
        TrackManager.doEvent('openDetailFromSavedList', id);
        NortonApp.router.navigateToID(id);
        return false;
    },

    removeAll: function () {
        'use strict';
        this.collection.reset();

        this.updateCount();
        if (Norton.isLoggedIn) {
            this.likeOrUnlikeYourFavs(cloned, 'unlike');
        } else {
            this.saveLocalStorage();
        }
    },

    removeItem: function (model) {
        'use strict';
        var cloned;

        if (model) {
            cloned = model.clone();
            this.collection.remove(model);

            this.updateCount();
            if (Norton.isLoggedIn) {
                this.likeOrUnlikeYourFavs(cloned, 'unlike');
            } else {
                this.saveLocalStorage();
            }
        }
    },

    removeYourFavs: function (e) {
        'use strict';

        var $target = $(e.currentTarget),
            id = $target.parent().data('id'),
            model = this.collection.getModelByAttribute("id", id);

        if (model !== undefined) {

            TrackManager.doEvent('removeFromSavedList', model.get('pname'));
            this.showPopover($target, "Item Removed");
            this.removeItem(model);
        }
        return false;
    },

    updateCount: function () {
        'use strict';
        // show item counter
        $('#yourFavsCtr').text(this.collection.length);
    },

    showPopover: function ($target, mesg) {
        'use strict';
        var direction = "left";

        /*if (this.articles.showGrid()) {
            direction = "right";
        }*/
        $target.popover({
            content: mesg,
            placement: direction,
            container: '.content'
        });
        $target.popover('show');
        setTimeout(function () {
            $('.popover').popover('destroy');
        }, 1000);
    },

    updateButtonLabel: function ($target, action) {
        'use strict';
        var str = $target.data(action);
        $target.find('.button-label').text(str);
    },

    toggleYourFavs: function(e) {
        'use strict';

        // Add item to yourFavsList collection
        var $target = $(e.currentTarget),
            id = $target.data('item-id'),
            favs,
            article = this.articles.getModelByAttribute("pname", id),
            articleData,
            model = this.collection.getModelByAttribute("pname", id),
            action;

        // Don't add again
        if ( model !== undefined) {

            TrackManager.doEvent('removeFromFavorites', id);
            this.showPopover($target, "Item Removed");
            this.updateButtonLabel($target, this.SAVE);
            this.removeItem(model);
            return false;
        }
        if (article) {
            articleData = article.attributes.allMeta;

            this.showPopover($target, "Item Added");
        } else {
            articleData = this.articles.getCurrentPageDetail(id);
        }
        favs = FavoritesData.input(articleData);

        this.collection.add(favs);
        this.updateButtonLabel($target, this.REMOVE);

        this.updateCount();
        if (Norton.isLoggedIn) {
            this.likeOrUnlikeYourFavs(favs, 'like');
        } else {
            this.saveLocalStorage();
        }

        TrackManager.doEvent('addToFavorites', id);

        TrackManager.save(articleData.id);

        return false;
    },

    showYourFavs: function() {
        'use strict';
        this.render();
        NortonApp.router.navigateToModal();
        TrackManager.doEvent('showFavs', 'on');

        return false;
    },

    saveYourFavs: function (e) {
        'use strict';
        var $target = $(e.currentTarget),
            type = $target.data('type');

        Favorites.save({
            title: $('#yourFavsTitle').text(),
            type: $target.data('type'),
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
    },
    likeOrUnlikeYourFavs: function (model, mode) {
        'use strict';
        var that = this,
            data,
            id = model.get('id'),
            postdata;

        data = FavoritesData.output(model);

        postdata = {
            sitecode: Norton.siteCode,
            siteversion: Norton.version,
            asset_id: id,
            json_str: JSON.stringify(data),
            mode: mode,
            discipline: Norton.discipline
        };

        $.ajax({
            type:'POST',
            url: Norton.Constants.likeUnlikeAssetUrl,
            xhrFields: {
                withCredentials: true
            },
            data: postdata,
            dataType: "json",
            success: function(response) {
                // eventually, update some popularity indicator somewhere on the site; for now, do nothing
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                Logger.get(that.MODULE).error("Like-Unlike Assets request failed.");
            }
        });
    },
    getSavedFavs: function (id, mode) {
        'use strict';
        var that = this,
            postdata = {
                sitecode: Norton.siteCode,
                siteversion: Norton.version
            };

        $.ajax({
            type:'POST',
            url: Norton.Constants.getSavedFavsUrl,
            xhrFields: {
                withCredentials: true
            },
            data: postdata,
            dataType: "json",
            success: function(response) {
                if (response.code !== 200) {
                    Logger.error("Get Favorites request failed.");
                    return;
                }

                if (response.data.length < 1) {
                    return; // User had no saved favorites
                }

                for (var i=0; i<response.data.length; i++) {
                    that.collection.add(new NortonApp.Models.YourFavs(response.data[i]));
                }

                if (that.app.dataReady) {
                    that.updateCount();
                } else {
                    that.app.deferred.promise().done(function () {
                        that.updateCount();
                    });
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                Logger.get(that.MODULE).error("Get Favorites request failed.");
            }
        });
    }
});

module.exports = YourFavsView;
