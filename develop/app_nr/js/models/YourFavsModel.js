var Backbone = require('backbone');

var YourFavsModel = Backbone.Model.extend({
    defaults: {
        "authorFirst":'',
        "chapter":'',
        "pname":'',
        "siteCode":'',
        "abstract":'',
        "title":'',
        "mode":[ ],
        //"category_id":[ ],
        "authorLast":'',
        "ebookNode":'',
        "genre":[ ],
        "theme":[ ],
        //"categories":[ ],
        "id":'',
        "keyword":''
    }
});

module.exports = YourFavsModel;
