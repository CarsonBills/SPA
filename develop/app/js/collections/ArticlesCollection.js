var Backbone = require('backbone'),
    _ = require('underscore');

var ArticlesCollection = Backbone.Collection.extend({
    model: NortonApp.Models.Article,
    url: Norton.Constants.searchUrl,
    totalRecords: 0,
    recordStart: 0,
    recordEnd: 0,
    filters: null,
    showGridView: false,
    parse: function(res) {
        'use strict';

        var response = res,
            that = this;

        console.log(response);
        if (response.code !== 200) {
            console.log('Search return code is" ' + response.code);
            Norton.Utils.genericError('config');
            return;
        }

        // Inject return data to collection for later use in view
        this.totalRecords = response.totalRecordCount;
        this.recordStart = response.pageInfo.recordStart;
        this.recordEnd = response.pageInfo.recordEnd;
        this.filters = response.availableNavigation;

        _.each(response.records, function(record) {
            // Keep track of last record loaded to place focus on record previous to new page request - for accessibility
            // Norton.lastArticleLoaded = record.attributes.allMeta.pname;

            /**
             * Next/prev links
             */
            record.prevId = that.prev(record);
            record.nextId = that.next(record);
            record.baseUrl = Norton.baseUrl;

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
            return this.at(idx - 1).attributes.allMeta.pname;
        }

        return null;
    },
    next: function(model) {
        'use strict';
        var idx = this.curr(model);
        if (idx < (this.length - 1)) {
            return this.at(idx + 1).attributes.allMeta.pname;
        }

        return null;
    },
    curr: function(model) {
        'use strict';
        return this.indexOf(model);
    },

    setShowGrid: function (bool) {
        'use strict';
        this.showGridView = bool;
    },

    showGrid: function () {
        'use strict';
        return this.showGridView;
    },
    hasMore: function () {
        'use strict';
        var bool = false;

        if (this.totalRecords !== 0 && this.recordEnd < this.totalRecords) {
            bool = true;
        }
        return bool;
    }
});

module.exports = ArticlesCollection;
