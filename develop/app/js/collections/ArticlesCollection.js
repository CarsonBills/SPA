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
    initialize: function() {
    },
    parse: function(res) {
        'use strict';

        var response = res.data,
            that = this;

        if (res.code !== 200) {
            console.log('Search return code is" ' + res.code);
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
            record.prevId = that.getPName({
                inc: -1,
                records: response.records,
                record: record
            })
            record.nextId = that.getPName({
                inc: 1,
                records: response.records,
                record: record
            })
            record.baseUrl = Norton.baseUrl;


        });

        return response.records;
    },
    /**
     * For next/prev, index comes from the data so it may not be sequential
     */
    getPName: function (params) {
        'use strict';

        var idx = _.indexOf(params.records, params.record);
        idx += params.inc;

        if (idx >= 0 && idx < params.records.length) {
            return params.records[idx].allMeta.pname;
        }
        return null;
    },

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
    },
    cleanupAndReset: function() {
        this.reset(null, { silent: true });
        this.recordEnd = 0;
    }
});

module.exports = ArticlesCollection;
