var Backbone = require("backbone");
var $ = require('jquery');
Backbone.$ = $;

var YourFavsView = Backbone.View.extend({
    el: $('#yourFavs'),
    templateHdr: require("../../templates/YourFavsHeaderTemplate.hbs"),
    template: require("../../templates/YourFavsTemplate.hbs"),
    initialize: function(){
        this.on('change', this.render, this);
    },
    render: function () {
        var yourFavsTemplate = this.templateHdr();
        this.$el.append(yourFavsTemplate);
        if (this.model.length > 0) {
            this.model.each(function (article) {
                yourFavsTemplate = this.template(article.toJSON());
                this.$el.append(yourFavsTemplate);
            }, this);
        } else {
            this.$el.append('<h5>You have not added any items to your List yet.</h5>');
        }

        yourFavsDragNDrop('#yourFavs');
        return this;
    },
    downloadYourFavs: function() {
        var data = $("#yourFavsTitle").text() + "\t\t\n" +
            "Title\tAuthor\tExtract\n";
        this.model.each(function (article) {
            data += article.attributes.title + "\t" +
                article.attributes.fullName + "\t" +
                article.attributes.shortExtract + "\n";
        }, this);

        /**
         * Maybe a better way to do this? This simulates a clickable link of the page.
         * Create a blob of the data, create a link element and populate it with the blob,
         * then click the link to open a SAVE dialog box, then remove the link.
         */
        // Create a Blob with the data, thlink element populated, click it, then remove it.
        var blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var lnk = document.createElement("a");
        lnk.setAttribute("href", url);
        lnk.setAttribute("download", "my_items.csv");
        lnk.style.visibility = 'hidden';
        document.body.appendChild(lnk);
        lnk.click();
        document.body.removeChild(lnk);

//        console.log(data);
    }
});

module.exports = YourFavsView;
