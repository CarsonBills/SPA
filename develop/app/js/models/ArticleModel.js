var Backbone = require("backbone");

//"query":"Goode","fields":["categories"],"skip":0,"pageSize":50}
var ArticleModel = Backbone.Model.extend({
    defaults: {
        "totalRecordCount":null,
        "pageInfo":{
            "recordStart":null,
            "recordEnd":null
        },
        "records":[
            {
                "allMeta":{
                    "author_first":'',
                    "chapter":'',
                    "site_code":'',
                    "abstract":'',
                    "title":'',
                    "mode":'',
                    "category_id":'',
                    "author_last":'',
                    "ebook_node":'',
                    "genre":'',
                    "theme":'',
                    "categories":[

                    ],
                    "id":'',
                    "keyword":'',
                    "fullName": ""
                },
                "_id":''
            }
        ],
        "recordData": [],
        searchandiserID: null
    },

    initialize: function() {
        "use strict";
        this.set({
            "recordData.fullName": this.get("author_first") + " " + this.get("author_last")
        });
    }
});

module.exports = ArticleModel;
