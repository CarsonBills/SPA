var Backbone = require("backbone");

var ArticleModel = Backbone.Model.extend({
    defaults: {
        id: null,
        title: '',
        authorFirst: '',
        authorLast: '',
        extract: '',
        imgUrl: '',
        ebookUrl: '',
        shortExtract: '',
        fullName: ''
    },
    initialize: function() {
        this.set({
            "shortExtract": this.get("extract").substr(0,100),
            "fullName": this.get("authorFirst") + " " + this.get("authorLast")
        });
    }
});

module.exports = ArticleModel;
