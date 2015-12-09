
// Data constructor
var NavigationCollection = require('../collections/NavigationCollection'),
    $ = require('jquery'),
    ErrorsManager = require('../modules/errors_manager'),

    Navigation = function (options) {
        "use strict";
        this.initialize();
    };

Navigation.prototype = {
    collection: null,
    MODULE: 'refinements',
    url: Norton.Constants.searchUrl,
    deferred: $.Deferred(),
    refFilters: null,

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

        this.collection.fetch({
            data: postdata,
            method: "POST",
            xhrFields: {
                withCredentials: true
            },
            datatype: "json",
            url: this.url,
            success: function(data) {

                if (that.collection.status !== ErrorsManager.FAIL_STATE) {
                    that.deferred.resolve(data);
                    // Build navFilter list
                    that.buildnewFilters();
                    console.log(that.refFilters);
                } else {
                    that.deferred.reject(ErrorsManager.FAIL_STATE);
                }
            },
            error: function(collection, res, options) {
                Logger.get(that.MODULE).error(res);
                that.deferred.reject(res);
            }
        });

        return this.deferred.promise();

    },


    /**
     * Chapters/Topics and subchapters/substopics come as 2 separate objects in searchandiser json. The only link is a hash-in-common.
     * The hash is part of the refinement title. Also part of the title is a 3 digit order number. We need to order the
     * chapters/topics and subchapters/subtopics using this order, and create an array of objects showing the
     * chapters/topics with subchapters/subtopics in-line so we can easily extract them in order when we want to display them.
     *
     * NOTE: The positioning of the embedded parameters in the value field (hash-id, title, order) are important. If they
     * change, the algorithm will have to change
     *
     * Also, Keep the objects consistent whether for chapters/topics or other categories
     */
    buildnewFilters: function() {
        var newFilters = [],
            chaptersIndex,
            topicsIndex,
            otherIndex,
            idx,
            nameParts,
            order,
            suborder,
            unorderedIndex = 9900;
            filters = this.collection.availNav;

        // Have to do this in 3 passes so we keep get subchapters after chapters and subtopics after topics
        // Handle Chapters and Topics
        for (var i=0; i<filters.length; i++) {
            // ignore any nav that is not a chapter or topic for now
            if (filters[i].name != "dimChapters" && filters[i].name != "dimTopics") {
                continue;
            }

            newFilters[i] = {};
            newFilters[i].catName = filters[i].name;
            newFilters[i].refs = [];

            if (filters[i].name == "dimChapters") {
                chaptersIndex = i;
            } else {
                topicsIndex = i;
            }

            /**
             * For Chapters/Topics, go through refinements and build array with hash ids
             * Use Order as key so it sorts when iterated over
             * Sample Chapter: 010_The Five Foundation of Economics_3b0540f9265bcbff096e
             */
            for (var j = 0; j < filters[i].refinements.length; j++) {
                nameParts = filters[i].refinements[j].value.split("_");
                order = nameParts[0];
                if (!order) {   // item may not be ordered in which case force it to the end of the nav
                    order = unorderedIndex++;
                }
                newFilters[i].refs[order] = {};
                newFilters[i].refs[order].id = nameParts[nameParts.length-1];
                newFilters[i].refs[order].name = nameParts[1];
                newFilters[i].refs[order].count = 0;
                newFilters[i].refs[order].cat_display = filters[i].displayName;
                newFilters[i].refs[order].cat = nameParts[1];
                newFilters[i].refs[order].fullName = filters[i].refinements[j].value;
                newFilters[i].refs[order].subnav = [];
            }
        }

        // Handle SubChapters and SubTopics
        for (var i=0; i<filters.length; i++) {
            // ignore any nav that is not a level 1 subchapter/subtopic
            if (filters[i].name != "dimChaptersL1" && filters[i].name != "dimTopicsL1") {
                continue;
            }

            /**
             * For subchapter/subtopic, go through refinements and find matching chapter, then add the subchapter
             * in an array that is a property of the matching chapter object
             *
             * Sample Subchapter: 3b0540f9265bcbff096e_030_Big Question: What Are the Five Foundations of Economics?
             */

            idx = (filters[i].name == "dimChaptersL1") ? chaptersIndex : topicsIndex;

            for (var j = 0; j < filters[i].refinements.length; j++) {
                nameParts = filters[i].refinements[j].value.split("_");
                suborder = nameParts[1];
                if (!suborder) {    // item may not be ordered in which case force it to the end of the nav
                    suborder = unorderedIndex++;
                }
                for (order in newFilters[idx].refs) {
                    if (newFilters[idx].refs[order].id == nameParts[0]) {
                        newFilters[idx].refs[order].subnav[suborder] = [];
                        newFilters[idx].refs[order].subnav[suborder].id = nameParts[0];
                        newFilters[idx].refs[order].subnav[suborder].name = nameParts.slice(2).join("_"); // handle any underscores in title
                        newFilters[idx].refs[order].subnav[suborder].count = 0;
                        newFilters[idx].refs[order].subnav[suborder].fullName = filters[i].refinements[j].value;
                    }

                }
            }
        }

        // Handle all other nav items
        otherIndex = newFilters.length; // We always do "other" last so this index will be correct no matter the order the nav appears in the json
        for (var i=0; i<filters.length; i++) {
            // ignore any nav that is a chapter, subchapter, topic or subtopic
            if (filters[i].name.substr(0, 11) == "dimChapters" || filters[i].name.substr(0, 9) == "dimTopics") {
                continue;
            }

            newFilters[otherIndex] = {};
            newFilters[otherIndex].catName = filters[i].name;
            newFilters[otherIndex].refs = [];
            /**
             * For Order,use an increment
             */
            for (var j = 0; j < filters[i].refinements.length; j++) {
                newFilters[otherIndex].refs[j] = {};
                newFilters[otherIndex].refs[j].id = filters[i].refinements[j].value;
                newFilters[otherIndex].refs[j].name = filters[i].refinements[j].value;
                newFilters[otherIndex].refs[j].count = 0;
                newFilters[otherIndex].refs[j].cat_display = filters[i].displayName;
                newFilters[otherIndex].refs[j].cat = filters[i].refinements[j].value;
                newFilters[otherIndex].refs[j].fullName = filters[i].refinements[j].value;
                newFilters[otherIndex].refs[j].subnav = [];
            }

            otherIndex++;
        }

        this.refFilters = newFilters;
    },
    /**
     * Take the filtered nav returned by searchandiser and compare it to the
     * refFilters object built in buildnewFilters. When we find a match, update the refFilters count
     */
    compare: function (filteredNav) {
        var originalNav = this.refinements.refFilters,
            idx = 0;       // filterNav index which may need not be in sync with originalNav index

        // iterate over the filteredNav objects
        for(var i=0; i<filteredNav.length; i++) {

            // get index value in originalNav
            for (var oidx = 0; oidx < originalNav.length; oidx++) {
                if (originalNav[oidx].catName == filteredNav[i].name) {
                    idx = oidx;
                    break;
                }
            }

            // Handle chapters and topics
            if (filteredNav[i].name == "dimChapters" || filteredNav[i].name == "dimTopics") {
                // iterate over filteredNav refinements and match counts with originalNav
                for (var j = 0; j < filteredNav[i].refinements.length; j++) {
                    for (order in originalNav[idx].refs) {
                        if (originalNav[idx].refs[order].fullName == filteredNav[i].refinements[j].value) {
                            originalNav[idx].refs[order].count = filteredNav[i].refinements[j].count;
                            break;
                        }
                    }
                }
            }

            // Handle subchapters and subtopics
            if (filteredNav[i].name == "dimChaptersL1" || filteredNav[i].name == "dimTopicsL1") {
                for (var j = 0; j < filteredNav[i].refinements.length; j++) {
                    for (order in originalNav[idx].refs) {
                        for (suborder in originalNav[idx].refs[order].subnav) {
                            if (originalNav[idx].refs[order].subnav[suborder].fullName == filteredNav[i].refinements[j].value) {
                                originalNav[idx].refs[order].subnav[suborder].count = filteredNav[i].refinements[j].count;
                                break;
                            }
                        }
                    }
                }
            }

            // Handle other nav
            if (filters[i].name.substr(0, 11) != "dimChapters" && filters[i].name.substr(0, 9) != "dimTopics") {
                for (var j = 0; j < filteredNav[i].refinements.length; j++) {
                    for (order in originalNav[idx].refs) {
                        if (originalNav[idx].refs[order].fullName == filteredNav[i].refinements[j].value) {
                            originalNav[idx].refs[order].count = filteredNav[i].refinements[j].count;
                        }
                    }
                }
            }

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