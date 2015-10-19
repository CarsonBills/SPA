var Backbone = require('backbone');

var YourFavsModel = Backbone.Model.extend({
    defaults: {
        id: null,
        title: '',
        authorFirst: '',
        authorLast: '',
        extract: '',
        imgUrl: '',
        ebookUrl: '',
        shortExtract: '',
        fullName: '',
    },
    initialize: function() {
        'use strict';
        this.set({
            shortExtract: this.get('extract').substr(0,100),
            fullName: this.get('authorFirst') + ' ' + this.get('authorLast'),
        });
    },
});

module.exports = YourFavsModel;
