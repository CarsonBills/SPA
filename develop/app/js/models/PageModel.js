var Backbone = require("backbone");

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
            "authorFirstName":"",
            "authorMiddleName":"",
            "authorLastName":"",
            "authorBio":"",
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
            Norton.Utils.genericError('config');
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

