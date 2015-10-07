var Backbone = require('backbone');

var PageModel = Backbone.Model.extend({
    urlRoot: '/get_page.php',
    defaults: {
        id: null,
        title: '',
        authorFirst: '',
        authorLast: '',
        imgUrl: '',
        ebookUrl: '',
        fullText: '',
    },
});

module.exports = PageModel;

