var Backbone = require("backbone"),
    ErrorsManager = require('../modules/errors_manager');

var PageModel = Backbone.Model.extend({

    MODULE: 'PageModel',
    url: function() {
        'use strict';
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
        },
        mainAuthorName: "",
        mainAuthorBio: ""
    },
    parse: function(response) {
        'use strict';
        if (response.code !== 200) {
            Logger.get(this.MODULE).error('Search return code is" ' + response.code);
            this.status = ErrorsManager.FAIL_STATE;
            ErrorsManager.showGeneric();
            return;
        }

        this.set({
            "mainAuthorName": response.data.data.author[0].authorFirstName + " " +
                response.data.data.author[0].authorMiddleName + " " +
                response.data.data.author[0].authorLastName,
            "mainAuthorBio": response.data.data.author[0].authorBio
        });

        return response.data;
    },

    initialize: function () {
        'use strict';
        //this.url = this.urlRoot + this.id;
    }
});

module.exports = PageModel;

