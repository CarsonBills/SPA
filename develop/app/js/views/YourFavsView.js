var Backbone = require('backbone'),
    _ = require('underscore'),
    $ = require('jquery');

var YourFavsView = Backbone.View.extend({
    templateHdr: require('../../templates/YourFavsHeaderTemplate.hbs'),
    template: require('../../templates/YourFavsTemplate.hbs'),
    modal: '#modalContainer',
    content: '.modal-content',
    $content: null,
    app: null,
    articles: null,
    yourFavsCtr: 0,

    initialize: function(params) {
        'use strict';
        this.app = params.app;
        this.articles = params.articles;
        this.$content = this.$(this.modal + " " + this.content);

        this.initModal();
    },

    events: {
        "click .savelist-lnk": "addYourFavs",
        "click #navYourFavs": "showYourFavs",
        "click .download-favs": "downloadYourFavs"
    },

    render: function() {
        'use strict';
        var that = this,
            $div = $('<div></div>'),
            yourFavsTemplate = this.templateHdr();

        $div.html(yourFavsTemplate);
        console.log(this.collection.length);
        if (this.collection.length > 0) {
            _.each(this.collection, function(article) {
                yourFavsTemplate = that.template(article.toJSON());
                $div.find('.modal-body').append(yourFavsTemplate);
            });
        } else {
            $div.append(Norton.Constants.noMyItems);
        }
        $div.find('.modal-container').unwrap().appendTo(this.$content);

        this.$(this.modal).modal('show');

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

    addYourFavs: function(e) {
        'use strict';

        // Add item to yourFavsList collection
        var id = $(e.target).data('item-id');
        
        // Don't add again
        if (this.articles.getModelById(id) !== undefined) {
            return;
        }

        //this.collection.add(this.articles.get(id));
        _.each(this.collection, function(record) {
            console.log(record);
            if (record.attributes.allMeta.pname === id) {
                this.collection.add(record.attributes.allMeta);
            }
        });

        // Increment and show item counter
        this.yourFavsCtr++;
        $('#yourFavsCtr').html(' (' + this.yourFavsCtr + ')');

        this.app.saveTracking(id);

        return false;
    },



    showYourFavs: function() {
        'use strict';
        /*$('#filters').css({"display":"none"});
        $('#articles').css({"display":"none"});
        $('.your-favs-view-section').css({"display":"inline"});*/

        //this.$el = this.$("#yourFavs");
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
