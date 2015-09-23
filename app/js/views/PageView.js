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
    templateReplace: require("../../templates/PageReplaceTemplate.hbs"),
    initialize: function(){
        this.model.on('change', this.render, this);
    },
    render: function () {
        this.model.attributes.prevId = Norton.prevArticle;
        this.model.attributes.nextId = Norton.nextArticle;

        var pageTemplate = this.template(this.model.toJSON());
        this.$el.append(pageTemplate);

        Norton.currArticle = this.model.attributes.id;

        return this;
    },
    renderReplace: function() {
        this.getNextPrevIds();
        this.model.attributes.prevId = Norton.prevArticle;
        this.model.attributes.nextId = Norton.nextArticle;

        // got this technique from http://stackoverflow.com/questions/14623232/re-rendering-handlebars-partial-from-backbone-view
        // doesn't use partials so maybe we can do that once we figure out how to find Handlebars at runtime...
        var pageReplaceTemplate = this.templateReplace(this.model.toJSON());
        var selector = ".modal-content";
        this.$el.find(selector).replaceWith(pageReplaceTemplate);

        // fade in between new articles load
        $(selector).css("opacity", 0);
        $(selector).fadeTo( "slow" , 1.0);

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
