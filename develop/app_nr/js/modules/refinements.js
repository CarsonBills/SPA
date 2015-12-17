
// Data constructor
var NavigationCollection = require('../collections/NavigationCollection'),
    $ = require('jquery'),
    ErrorsManager = require('../modules/errors_manager'),

    Navigation = function (options) {
        "use strict";
        this.initialize();
    };

Navigation.prototype = {
    MODULE: 'refinement',
    collection: null,
    url: Norton.Constants.searchUrl,
    deferred: $.Deferred(),

    initialize: function () {
        "use strict";
        this.collection = new NavigationCollection();
    },
    fetch: function () {
        "use strict";
        var that = this;
        var postdata = {
            sitecode: Norton.siteCode,
            siteversion: Norton.version,
            skip: 0,
            pageSize: 1,
            fields: ["availableNavigation"]
        };
        // .NET services want post data as a string, not as key-val object
        if (Norton.Constants.siteConfigUrl.indexOf("ars.svc") > 0) {
            postdata = JSON.stringify(postdata);
        }
        this.collection.fetch({
            data: postdata,
            method: "POST",
            datatype: "json",
            url: this.url,
            success: function(data) {
                if (that.collection.status !== ErrorsManager.FAIL_STATE) {
                    that.deferred.resolve(data);
                } else {
                    that.deferred.reject(ErrorsManager.FAIL_STATE);
                }
            },
            error: function(xhr, response, error) {
                Logger.get(that.MODULE).error(error);
                that.deferred.reject(error);
            }
        });

        return this.deferred.promise();

    },
    compare: function (collection) {
        /**
         * Technique is to match 2 onjects (the original navigation) with what the refinement query returned.
         * Assumptions: Refinement query always returns the same categories as the original.
         * Indexes in refinement query will differ from original so we need to crawl both matching category and refinement name.
         */
        "use strict";
        var filteredNav = collection,
            originalNav = this.collection.availNav,
            activeFilter,   // this filter has counts in the filteredNax
            selectedFilter, // this filter was "checked" in the navigation
            fIdx = 0;  // filterNav index which may need not be in sync with originalNav index

        for(var i=0; i<originalNav.length; i++) {
            /**
             * Need to handle the publishDate and sunsetDate in filteredNav which wouldn't have been in the originalNav
             * They might appear in-between categories so we have to increment filteredNav index and decrement originalNav index.
             */
            // TODO There is a mismatch here

           /* if (filteredNav[fIdx].name === "sunsetDate" || filteredNav[fIdx].name === "publishDate") {
                fIdx++;
                i--;
                continue;
            }*/

            for (var j=0; j<originalNav[i].refinements.length; j++) {
                activeFilter = false;
                selectedFilter = false;
                /**
                 * Save filteredNav length because
                 */

                for (var k=0; k<filteredNav[fIdx].refinements.length; k++) {
                    if (filteredNav[fIdx].refinements[k].value === originalNav[i].refinements[j].value) {
                        originalNav[i].refinements[j].count = filteredNav[fIdx].refinements[k].count;
                        activeFilter = true;
                        // If a filter is checked, the filtered navigation MUST contain that filter so we can do the checkbox thing here.
                        if (Norton.savedRefinements != undefined) {
                            for (var m=0; m < Norton.savedRefinements.length; m++) {
                                if (filteredNav[fIdx].name === Norton.savedRefinements[m].navigationName &&
                                    filteredNav[fIdx].refinements[k].value === Norton.savedRefinements[m].value
                                ) {
                                    selectedFilter = true;
                                }
                            }
                        }
                        break;
                    }
                }

                if (!activeFilter) {
                    originalNav[i].refinements[j].count = 0;
                }
                if (selectedFilter) {
                    originalNav[i].refinements[j].checked = "checked";
                } else {
                    originalNav[i].refinements[j].checked = "";
                }
            }

            fIdx++; // increment filteredNav index
        }

        return originalNav;

    }
};

var Refinements = (function() {
    'use strict';
        var navigation;

        return {
            getInstance: function() {
                if (navigation === undefined) {
                    navigation = new Navigation();
                }
                return navigation;
            }
        };
}());

module.exports = Refinements;