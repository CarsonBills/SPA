var Backbone = require('backbone'),
    _ = require('underscore');

var ArticlesCollection = Backbone.Collection.extend({
    model: NortonApp.Models.Article,
    url: '/php/searchandiser.php',
    totalRecords: 0,
    recordStart: 0,
    recordEnd: 0,

    parse: function(response) {
        'use strict';

        var that = this;
        // Inject return data to collection for later use in view
        this.totalRecords = response.totalRecordCount;
        this.recordStart = response.pageInfo.recordStart;
        this.recordEnd = response.pageInfo.recordEnd;


        _.each(response.records, function(record) {
            // Keep track of last record loaded to place focus on record previous to new page request - for accessibility
            // Norton.lastArticleLoaded = record.attributes.allMeta.id;

            record.prevId = that.prev(record);
            record.nextId = that.next(record);
            record.baseUrl = Norton.baseUrl;
            /**
             * Next/prev links
             */

            /*Record.attributes.prevId = that.prev(record);
            record.attributes.nextId = that.next(record);
            record.attributes.baseUrl = Norton.baseUrl;*/

            // Temp value
            //record.attributes.pname = "on-going-home";

        });

        return response.records;
    },
    /**
     * For next/prev, index comes from the data so it may not be sequential
     */
    prev: function(model) {
        'use strict';
        var idx = this.curr(model);
        if (idx > 0) {
            return this.at(idx - 1).attributes.allMeta.id;
        }

        return null;
    },
    next: function(model) {
        'use strict';
        var idx = this.curr(model);
        if (idx < (this.length - 1)) {
            return this.at(idx + 1).attributes.allMeta.id;
        }

        return null;
    },
    curr: function(model) {
        'use strict';
        return this.indexOf(model);
    },
});

module.exports = ArticlesCollection;
