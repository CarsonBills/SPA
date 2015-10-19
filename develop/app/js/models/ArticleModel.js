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
    },

    /**
     * First object is always incomplete with no data (why????) so we need to trap it to ignore it.
     */
    initialize: function() {
        "use strict";
/*        try {

            var pn = this.get("allMeta").title.toLowerCase();
            pn = pn.replace(/ /g, "-");

            console.log(this.get("allMeta"));

            this.set("allMeta.pname", pname);

            console.log(this.get("allMeta"));

            var rd = this.set("recordData");
            rd.push(pname);

            this.set("recordData", rd);

            console.log(this.get("allMeta").pname);
        }catch(e){
            //console.log(this);
        }


console.log(this.attributes);
 */
    }

});


module.exports = ArticleModel;
