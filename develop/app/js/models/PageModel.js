var Backbone = require("backbone"),
    ErrorsManager = require('../modules/errors_manager');

var PageModel = Backbone.Model.extend({
    url: function() {
        return Norton.Constants.getDetailPageUrl + "sitecode=" + Norton.siteCode + "&siteversion=" + Norton.version+ "&pname=" + this.id;
    },

    defaults: {
        "siteVersion":"",
        "mode":"",
        "data":{
            "title":"",
            "metaKeyword":"",
            "metaDescription":"",
            "publishDate":"",
            "sunsetDate":"",
            "excerpt":"",
            "publicationDate":"",
            "ebookLink":"",
            "pageNumber": null,
            "readingNumber": null,
            "author": [
                {
                    "authorBio": "",
                    "authorFirstName": "",
                    "authorMiddleName": "",
                    "authorLastName": ""
                }
            ],

            "website":" ",
            "filters":[
                {
                    "type":"",
                    "value":""
                }
            ]
        }
    },
    parse: function(response) {
        'use strict';
        if (response.code !== 200) {
            console.debug('Search return code is" ' + response.code);
            
            //ErrorsManager.showGeneric();
            return;
        }

        return response.data;
    },

    initialize: function () {
        'use strict';
        //this.url = this.urlRoot + this.id;
    }
});

module.exports = PageModel;

