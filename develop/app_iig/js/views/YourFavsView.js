var Backbone = require('backbone'),
    _ = require('underscore'),
    $ = require('jquery'),
    ModalManager = require('../modules/modal_manager'),
    ErrorsManager = require('../modules/errors_manager'),
    TrackManager = require('../modules/track_manager');

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

        //this.collection.on('remove', this.render, this);
        this.collection.on('remove', function (e) {
            that.render(false);
        });

        this.getSavedFavs();
    },

    events: {
        "click .savelist-lnk": "toggleYourFavs",
        "click #navYourFavs": "showYourFavs",
        "click .download-favs": "downloadYourFavs",
        "click .list-format .remove": "removeYourFavs",
    },

    render: function(redraw) {
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
            module: this.MODULE,
            redraw: redraw
        });

        yourFavsDragNDrop('#yourFavs');
        return this;
    },

    removeItem: function (model) {
        'use strict'; 

        if (model) {
            this.collection.remove(model);
            this.updateCount();
            this.likeOrUnlikeYourFavs(id, 'unlike');
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
        $('#yourFavsCtr').text(this.collection.length);
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
        setTimeout(function () {
            $('.popover').popover('destroy');
        }, 1000);
    },

    toggleYourFavs: function(e) {
        'use strict';

        // Add item to yourFavsList collection
        var $target = $(e.currentTarget),
            id = $target.data('item-id'),
            favsData = {},
            article = this.articles.getModelByAttribute("pname", id),
            articleData = article.attributes.allMeta,
            model = this.collection.getModelByAttribute("pname", id);
        // Don't add again
        if ( model !== undefined) {
            this.showPopover($target, "Item Removed");
            this.removeItem(model);
            return false;
        }

        this.showPopover($target, "Item Added");

        favsData.pname = articleData.pname;
        favsData.abstract = articleData.abstract;
        favsData.title = articleData.title;
        //favsData.authorLastName = articleData.primaryAuthor.authorLastName;
        //favsData.authorFirstName = articleData.primaryAuthor.authorFirstName;
        //favsData.authorMiddleName = articleData.primaryAuthor.authorMiddleName;
        //favsData.ebookNode = articleData.ebookNode;
        favsData.id = articleData.id;
        this.collection.add(new NortonApp.Models.YourFavs(favsData));

        this.updateCount();
        //this.likeOrUnlikeYourFavs(id, 'like');
        TrackManager.save(id);

        return false;
    },

    showYourFavs: function() {
        'use strict';
        this.render();

        return false;
    },

    downloadYourFavs: function() {
        'use strict';
        var data = $('#yourFavsTitle').text() + '\t\t\n' +
            'Title\tAuthor\tExtract\n';
        this.collection.each(function(article) {
            data += article.attributes.title + '\t' +
                article.attributes.authorFirstName + " " + article.attributes.authorLastName + '\t' +
                article.attributes.abstract + '\n';
        }, this);

        /**
         * Maybe a better way to do this? This simulates a clickable link of the page.
         * Create a blob of the data, create a link element and populate it with the blob,
         * then click the link to open a SAVE dialog box, then remove the link.
         */
        // Create a Blob with the data, thlink element populated, click it, then remove it.
        var blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var lnk = document.createElement('a');
        var filename = ($("#yourFavsTitle").html() !== "") ? $("#yourFavsTitle").html() + ".csv" : "my_items.csv";
        lnk.setAttribute('href', url);
        lnk.setAttribute('download', filename);
        lnk.style.visibility = 'hidden';
        document.body.appendChild(lnk);
        lnk.click();
        document.body.removeChild(lnk);

        return false;
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
    likeOrUnlikeYourFavs: function (id, mode) {
        'use strict';
        var model = this.collection.getModelByAttribute("id", id);
        var data = {
            sitecode: Norton.siteCode,
            asset: id,
            abstract: model.abstract.substr(0, 250),
            title: model.title,
            downloadAsset: model.downloadAsset,
            pname: model.pname
        }

        var postdata = {
            asset: id,
            asset_data: data
        };

        $.ajax({
            type:'POST',
            url: (mode == 'like') ? Norton.Constants.likeAssetUrl : Norton.Constants.unlikeAssetUrl,
            data: JSON.stringify(postdata),
            dataType: "json",
            success: function(response) {
                // eventually, update some popularity indicator somewhere on the site; for now, do nothing
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                Logger.error("Like-Unlike Assets request failed.");
            }
        });
    },
    getSavedFavs: function (id, mode) {
        'use strict';
        var that = this;

        $.ajax({
            type:'POST',
            url: Norton.Constants.getSavedFavsUrl,
            data: null,
            dataType: "json",
            success: function(response) {
                if (response.code !== 200) {
                    Logger.error("Get Favorites request failed.");
                    return;
                }
                if (response.data.length < 1) {
//       return; // User had no saved favorites
                }
                that.buildSavedFavs(response.data);
                if (this.app.dataReady) {
                    this.updateCount();
                } else {
                    this.app.deferred.promise().done(function () {
                        that.updateCount();
                    });
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                Logger.error("Get Favorites request failed.");
            }
        });
    },
    buildSavedFavs: function(records) {
        'use strict';
        var favsData;

        for (var i=0; i<records.length; i++) {
            favsData = JSON.parse(records[i].assetData);
            favsData.id = records[i].assetId;
            this.collection.add(new NortonApp.Models.YourFavs(favsData));
        }
    }
});

module.exports = YourFavsView;
