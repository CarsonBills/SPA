var Backbone = require('backbone');

var YourFavsModel = Backbone.Model.extend({
    defaults: {
        anchor: '',
        content: 'content',
        selector: 'span[data-rel=tooltip]',
        container: '.search',
        placement: 'auto bottom'
    }
});

module.exports = YourFavsModel;
