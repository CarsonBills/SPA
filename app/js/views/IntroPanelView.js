var Backbone = require("backbone");
var $ = require('jquery');
Backbone.$ = $;

var IntroPanelView = Backbone.View.extend({
    el: "#introPanel",
    template: require("../../templates/IntroPanelTemplate.hbs"),
    initialize: function(){
        this.on('change', this.render, this);
    },
    render: function () {
        console.log('render')
        var introPanelTemplate = this.template(NortonApp.headerConfigItem.toJSON());
        this.$el.append(introPanelTemplate);
    }
});

module.exports = IntroPanelView;

