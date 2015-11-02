var Backbone = require('backbone'),
    _ = require('underscore'),
    $ = require('jquery'),
    modalMgr = require('../modules/modal_manager');

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

        this.initModal();
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

       // this.$content.empty();

        template = this.templateHdr({
            hasContent: hasContent
        })

        $div.html(template);

        if (hasContent) {
            _.each(this.collection.models, function(article) {
                template = that.templateItem(article.toJSON());
                $div.find(that.body).append(template);
            });
        } else {
            $div.find(that.body).append(Norton.Constants.noMyItems);
        }
        //$div.find('.modal-container').unwrap().appendTo(this.$content);

        modalMgr.show({
            content: $div,
            module: this.MODULE
        })
        //this.$(this.modal).modal('show');

        yourFavsDragNDrop('#yourFavs');
        return this;
    },

    initModal: function () {
        'use strict';
        var that = this;

        this.$(this.modal).on('hide.bs.modal', function (e) {
            that.$content.empty();
        });
    },

    removeItem: function (e) {
        'use strict';

        var id = $(e.currentTarget).parent().data('id'),
            model = this.collection.getModelByAttribute("id", id);

        if (model) {
            this.collection.remove(model);
            this.updateCount();
        }

        return false;
    },

    updateCount: function () {
        'use strict';
        // show item counter
        $('#yourFavsCtr').html(' (' + this.collection.length + ')');
    },

    addYourFavs: function(e) {
        'use strict';

        // Add item to yourFavsList collection
        var id = $(e.target).data('item-id'),
            model = this.articles.getModelByAttribute("pname", id);
        
        // Don't add again
        if ( this.collection.getModelByAttribute("pname", id) !== undefined) {
            return false;
        }
        if (model.get('allMeta').pname === id) {
            this.collection.add(model.get('allMeta'));
        }

        this.updateCount();
        this.app.saveTracking(id);

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
});

module.exports = YourFavsView;
