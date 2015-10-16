var Backbone = require('backbone');

var PageModel = Backbone.Model.extend({
    urlRoot: '/php/get_page2.php/?',
    //UrlRoot: Norton.Constants.getDetailPageUrl + Norton.siteCode + "/" + Norton.version+ "?pname=",

    defaults: {
        siteVersion: '',
        mode: '',
        data: {
            title: '',
            metaKeyword: '',
            metaDescription: '',
            publishDate: '',
            sunsetDate: '',
            excerpt: '',
            publicationDate: '',
            ebookLink: '',
            pageNumber: null,
            readingNumber: null,
            authorFirstName: '',
            authorMiddleName: '',
            authorLastName: '',
            authorBio: '',
            website: ' ',
            filters: [
                {
                    type: '',
                    value: '',
                },
            ],
        },
    },
    setUrlId: function(id) {
        // "this" is now our Model instance declared from the router
        this.url = this.urlRoot + id;
    },
});

module.exports = PageModel;

