var Backbone = require('backbone');

var YourFavsModel = Backbone.Model.extend({
    defaults: {
        "pname":'',
        "abstract":'',
        "title":'',
        "id":'',
        "downloads":'',
        "chapter_id":''
    }
});

module.exports = YourFavsModel;
