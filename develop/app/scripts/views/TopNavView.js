var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var TopNavView = Backbone.View.extend({
    el: '#topNav',
    template: require('../../templates/TopNavTemplate.hbs'),
    initialize: function() {
        this.on('change', this.render, this);
    },
    render: function() {
        var data = {gridView: Norton.toggleGridFormat};

        var topNavTemplate = this.template(data);
        this.$el.append(topNavTemplate);
    },
});

module.exports = TopNavView;
