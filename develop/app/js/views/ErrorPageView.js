var Backbone = require("backbone");
var $ = require('jquery');

var ErrorPageView = Backbone.View.extend({
    el: "#errorPage",
    template: require("../../templates/ErrorPageTemplate.hbs"),
    initialize: function() {
        "use strict";
        this.on('change', this.render, this);
    },
    render: function () {
        "use strict";
        var ErrorPageTemplate = this.template();
        console.log(ErrorPageTemplate);
        this.$el.append(ErrorPageTemplate);
    }
});

module.exports = ErrorPageView;


