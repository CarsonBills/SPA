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

    initialize: function(params) {
        'use strict';
        this.app = params.app;
        this.articles = params.articles;
        this.$content = this.$(this.modal + " " + this.content);

        this.collection.on('remove', this.render, this);
    },

    events: {
        "click .savelist-lnk": "addYourFavs",
        "click #navYourFavs": "showYourFavs",
        "click .download-favs": "downloadYourFavs",
        "click .list-format .remove": "removeItem"
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

        yourFavsDragNDrop('#yourFavs');
        return this;
    },

    removeItem: function (e) {
        'use strict';

        var id = $(e.currentTarget).parent().data('id'),
            model = this.collection.getModelByAttribute("id", id);

        if (model) {
            this.collection.remove(model);
            this.updateCount();
        }

        this.likeOrUnlikeYourFavs(id, "del");

        return false;
    },

    updateCount: function () {
        'use strict';
        // show item counter
        $('#yourFavsCtr').html(' (' + this.collection.length + ')');
    },

    showPopover: function ($target) {
        'use strict';
        var direction = "left";
        if (this.articles.showGrid()) {
            direction = "right";
        }
        $target.popover({
            content: "Item added",
            placement: direction,
            container: '.content'
        });
        $target.popover('show');
            setTimeout(function () {
                $target.popover('destroy');
            }, 1000);
    },

    addYourFavs: function(e) {
        'use strict';

        // Add item to yourFavsList collection
        var $target = $(e.currentTarget),
            id = $target.data('item-id'),
            favsData = {},
            model = this.articles.getModelByAttribute("pname", id),
            articleData = model.attributes.allMeta;
        // Don't add again
        if ( this.collection.getModelByAttribute("pname", id) !== undefined) {
            return false;
        }

        favsData.pname = articleData.pname;
        favsData.abstract = articleData.abstract;
        favsData.title = articleData.title;
        favsData.authorLastName = articleData.primaryAuthor.authorLastName;
        favsData.authorFirstName = articleData.primaryAuthor.authorFirstName;
        favsData.authorMiddleName = articleData.primaryAuthor.authorMiddleName;
        favsData.ebookNode = articleData.ebookNode;
        favsData.id = articleData.id;
        this.collection.add(new NortonApp.Models.YourFavs(favsData));

        this.likeOrUnlikeYourFavs(articleData.id, "add");

        this.showPopover($target);

        this.updateCount();
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
                article.attributes.fullName + '\t' +
                article.attributes.shortExtract + '\n';
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
        lnk.setAttribute('href', url);
        lnk.setAttribute('download', 'my_items.csv');
        lnk.style.visibility = 'hidden';
        document.body.appendChild(lnk);
        lnk.click();
        document.body.removeChild(lnk);

        return false;
    },
    likeOrUnlikeYourFavs: function (id, mode) {
        'use strict';

        var postdata = {
            sitecode: Norton.siteCode,
            asset: id
        };

        $.ajax({
            type:'POST',
            url: (mode == 'add') ? Norton.Constants.likeAssetUrl : Norton.Constants.unlikeAssetUrl,
            data: JSON.stringify(postdata),
            dataType: "json",
            success: function(response) {
// eventually, update some popularity indicator somewhere on the site; for now, do nothing
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.debug("Like-Unlike Assets request failed.");
            }
        });
    }
});

module.exports = YourFavsView;
