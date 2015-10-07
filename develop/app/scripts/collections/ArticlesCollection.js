var Backbone = require('backbone');

var ArticlesCollection = Backbone.Collection.extend({
    model: NortonApp.Models.Article,
    url: '/json/articles.json',
    parse: function(response) {
        'use strict';
        Norton.perPage = response.per_page;
        Norton.pageNbr = response.page;
        Norton.nbrRecords = response.total;

        return response.articles;
    },
    /**
     * For next/prev, we USUALLY would expect the index to be sequential but it doesn't have to be (if we add/delete from collection)
     * SO here we will play it safe.
     * @returns {*}
     */
    prev: function(model) {
        'use strict';
        var idx = this.curr(model);
        if (idx > 0) {
            return this.at(idx - 1).id;
        }

        return null;
    },
    next: function(model) {
        'use strict';
        var idx = this.curr(model);
        if (idx < (this.length - 1)) {
            return this.at(idx + 1).id;
        }

        return null;
    },
    curr: function(model) {
        'use strict';
        return this.indexOf(model);
    },
});

module.exports = ArticlesCollection;
