var Backbone = require("backbone");

var PageModel = Backbone.Model.extend({
    //urlRoot: "/php/get_page2.php/?",
    urlRoot: Norton.Constants.getDetailPageUrl + "sitecode=" + Norton.siteCode + "&siteversion=" + Norton.version+ "&pname=",

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
        if (response.code != 200) {
            console.log('Search return code is" ' + response.code);
            Norton.Utils.genericError('config');
            return;
        }

        return response;
    },
    setUrlId: function(id){
        // "this" is now our Model instance declared from the router
        this.url = this.urlRoot + id;
    }
});

module.exports = PageModel;

