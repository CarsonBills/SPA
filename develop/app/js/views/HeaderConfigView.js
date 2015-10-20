var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var HeaderConfigView = Backbone.View.extend({
    el: '#siteHeader',
    templateNR: require('../../templates/NortonReaderHeaderTemplate.hbs'),
    templateIig: require('../../templates/IigHeaderTemplate.hbs'),
    initialize: function() {
        'use strict';
        this.on('change', this.render, this);
    },
    render: function() {
        'use strict';
        var headerConfigTemplate;

        if (Norton.siteCode === 'nortonreader') {
            headerConfigTemplate = this.templateNR(this.model.toJSON());
        } else {
            headerConfigTemplate = this.templateIig(this.model.toJSON());
        }
        this.$el.append(headerConfigTemplate);
    },
});

module.exports = HeaderConfigView;
