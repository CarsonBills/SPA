var Backbone = require("backbone");

var ArticleModel = Backbone.Model.extend({

    defaults: {
        "availableNavigation": [
            {
                "name": "",
                "displayName": "",
                "refinements": [
                    {
                        "type": "",
                        "count": null,
                        "value": ""
                    }
                ]
            }
        ],
        "totalRecordCount":null,
        "pageInfo":{
            "recordStart":null,
            "recordEnd":null
        },
        "records":[
            {
                "allMeta":{
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
                },
                "_id":''
            }
        ]
    }
});


module.exports = ArticleModel;
