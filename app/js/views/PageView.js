/**
 * PageView is the detail view of an article. It is instantiated in AppView.showDetailPage() and the model is populated in the same method.
 *
 * Its template is shown in a Bootstrap Modal
 *
 * @type {exports|module.exports}
 */
var Backbone = require("backbone");
var $ = require('jquery');
Backbone.$ = $;

var PageView = Backbone.View.extend({
    el: $('#detailPage'),
    template: require("../../templates/PageTemplate.hbs"),
    initialize: function(){
        this.model.on('change', this.render, this);
    },
    render: function () {
        /**
         * The next block will get next/prev links only if a next/prev link was clicked; else it uses next/prev from the article list.
         */
        if (Norton.pageClick == "page") {
            this.getNextPrevIds();
        }
        this.model.attributes.prevId = Norton.prevArticle;
        this.model.attributes.nextId = Norton.nextArticle;

        var pageTemplate = this.template(this.model.toJSON());
        if (Norton.pageClick == "page") {
            //pageTemplate = pageTemplate.replace('<div id="pageContainer" class="modal fade" role="dialog">', '<div id="pageContainer">');
        }

        this.$el.append(pageTemplate);
        Norton.currArticle = this.model.attributes.id;

        return this;
    },
    getNextPrevIds: function() {
        //window.history.pushState(null,null,"#/page/"+this.model.attributes.id);
        var mdl = NortonApp.articlesList.get(this.model.attributes.id);
        Norton.prevArticle = NortonApp.articlesList.prev(mdl);
        Norton.nextArticle = NortonApp.articlesList.next(mdl);
    }
});

module.exports = PageView;
