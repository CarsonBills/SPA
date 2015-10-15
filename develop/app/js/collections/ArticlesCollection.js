var Backbone = require("backbone");

var ArticlesCollection = Backbone.Collection.extend({
    model: NortonApp.Models.Article,
    url: '/php/searchandiser.php',
    totalRecords: 0,
    recordStart: 0,
    recordEnd: 0,

    parse: function(response) {
        "use strict";

        // inject return data to collection for later use in view
        this.totalRecords = response.totalRecordCount;
        this.recordStart = response.pageInfo.recordStart;
        this.recordEnd = response.pageInfo.recordEnd;

        return response.records;
    },
    /**
     * For next/prev, index comes from the data so it may not be sequential
     */
    prev: function (model) {
        "use strict";
        var idx = this.curr(model);
        if (idx > 0) {
            return this.at(idx - 1).attributes.allMeta.id;
        }

        return null;
    },
    next: function (model) {
        "use strict";
        var idx = this.curr(model);
        if (idx < (this.length - 1)) {
            return this.at(idx + 1).attributes.allMeta.id;
        }

        return null;
    },
    curr: function(model) {
        "use strict";
        return this.indexOf(model);
    }
});

module.exports = ArticlesCollection;
