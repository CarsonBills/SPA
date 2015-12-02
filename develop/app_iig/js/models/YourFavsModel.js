var Backbone = require('backbone');

var YourFavsModel = Backbone.Model.extend({
    defaults: {
        "pname":'',
        "abstract":'',
        "title":'',
        "id":'',
        "download_src":'',
        "doanload_fmt":'',
        "chapter_id":''
    }
});

module.exports = YourFavsModel;
