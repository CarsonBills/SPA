var Backbone = require('backbone');

var YourFavsModel = Backbone.Model.extend({
    defaults: {
        "pname":'',
        "abstract":'',
        "title":'',
        "authorLastName":'',
        "authorFirstName":'',
        "authorMiddleName":'',
        "ebookNode":'',
        "id":''
    }
});

module.exports = YourFavsModel;
