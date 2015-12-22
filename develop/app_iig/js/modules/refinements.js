
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
     * The hash is part of the refinement title. Also part of the title is a 3 digit order number.
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
            jdx,
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
            newFilters[i].displayName = filters[i].displayName;
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
                newFilters[i].refs[j] = {};
                newFilters[i].refs[j].order = order;
                newFilters[i].refs[j].id = nameParts[nameParts.length-1];
                newFilters[i].refs[j].name = nameParts[1];
                newFilters[i].refs[j].count = 0;
                newFilters[i].refs[j].cat_display = filters[i].displayName;
                newFilters[i].refs[j].cat = nameParts[1];
                newFilters[i].refs[j].fullName = filters[i].refinements[j].value;
                newFilters[i].refs[j].subnav = [];
            }
        }

        for (var i=0; i<filters.length; i++) {
            // ignore any nav that is not a level 1 subchapter/subtopic
            if (filters[i].name != "dimChaptersL1" && filters[i].name != "dimTopicsL1") {
                continue;
            }

            idx = (filters[i].name == "dimChaptersL1") ? chaptersIndex : topicsIndex;

            /**
             * For subchapter/subtopic, go through refinements and find matching chapter, then add the subchapter
             * in an array that is a property of the matching chapter object
             *
             * Sample Subchapter: 3b0540f9265bcbff096e_030_Big Question: What Are the Five Foundations of Economics?
             */

            for (var k=0; k < newFilters[idx].refs.length; k++) {
                jdx = 0;
                for (var j = 0; j < filters[i].refinements.length; j++) {
                    nameParts = filters[i].refinements[j].value.split("_");
                    suborder = nameParts[1];
                    if (!suborder) {    // item may not be ordered in which case force it to the end of the nav
                        suborder = unorderedIndex++;
                    }

                    if (newFilters[idx].refs[k].id == nameParts[0]) {
                        newFilters[idx].refs[k].subnav[jdx] = {};
                        newFilters[idx].refs[k].subnav[jdx].suborder = suborder;
                        newFilters[idx].refs[k].subnav[jdx].id = nameParts[0];
                        newFilters[idx].refs[k].subnav[jdx].name = nameParts.slice(2).join("_"); // handle any underscores in title
                        newFilters[idx].refs[k].subnav[jdx].count = 0;
                        newFilters[idx].refs[k].subnav[jdx].subCatName = filters[i].name;
                        newFilters[idx].refs[k].subnav[jdx].fullName = filters[i].refinements[j].value;
                        newFilters[idx].refs[k].subnav[jdx].parent = newFilters[idx].refs[k].fullName;
                        jdx++;
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
            newFilters[otherIndex].displayName = filters[i].displayName;
            newFilters[otherIndex].refs = [];
            /**
             * For Order,use an increment
             */
            for (var j = 0; j < filters[i].refinements.length; j++) {
                nameParts = filters[i].refinements[j].value.split("_");

                newFilters[otherIndex].refs[j] = {};
                newFilters[otherIndex].refs[j].id = filters[i].refinements[j].value;
                newFilters[otherIndex].refs[j].name = filters[i].refinements[j].value;
                newFilters[otherIndex].refs[j].name = nameParts[1];
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
        // NOTE: If your object has functions, they won't be copied using this technique
        // http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object
        var originalNav = JSON.parse(JSON.stringify(this.refFilters)),
            idx = 0,       // filterNav index which may need not be in sync with originalNav index
            savedRefs,
            selectedFilter; // this filter was "checked" in the navigation;

        // do this to eliminate "undefined" check throughout
        savedRefs = (Norton.savedRefinements == undefined) ? [] : Norton.savedRefinements;

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
                for (var j=0; j < originalNav[idx].refs.length; j++) {
                    selectedFilter = false;
                    for (var k = 0; k < filteredNav[i].refinements.length; k++) {
                        if (originalNav[idx].refs[j].fullName == filteredNav[i].refinements[k].value) {
                            originalNav[idx].refs[j].count = filteredNav[i].refinements[k].count;
                            for (var r=0; r < savedRefs.length; r++) {
                                if (filteredNav[i].name === savedRefs[r].navigationName &&
                                    filteredNav[i].refinements[k].value === savedRefs[r].value
                                ) {
                                    selectedFilter = true;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    if (selectedFilter) {
                        originalNav[idx].refs[j].checked = "checked";
                    } else {
                        originalNav[idx].refs[j].checked = "";
                    }
                }
            } else if (filteredNav[i].name == "dimChaptersL1" || filteredNav[i].name == "dimTopicsL1") {
                // subnav is a new array element in the returned nav, but it's the same as it's parent in the save nav.
                idx--;

            // Handle subchapters and subtopics
                for (var j=0; j < originalNav[idx].refs.length; j++) {
                    for (var k=0; k < originalNav[idx].refs[j].subnav.length; k++) {
                        selectedFilter = false;
                        for (var m = 0; m < filteredNav[i].refinements.length; m++) {
                            if (originalNav[idx].refs[j].subnav[k].fullName == filteredNav[i].refinements[m].value) {
                                originalNav[idx].refs[j].subnav[k].count = filteredNav[i].refinements[m].count;
                                for (var r=0; r < savedRefs.length; r++) {
                                    if (filteredNav[i].name === savedRefs[r].navigationName &&
                                        filteredNav[i].refinements[m].value === savedRefs[r].value
                                    ) {
                                        selectedFilter = true;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        if (selectedFilter) {
                            originalNav[idx].refs[j].subnav[k].checked = "checked";
                        } else {
                            originalNav[idx].refs[j].subnav[k].checked = "";
                        }

                    }
                }
            } else  if (filteredNav[i].name.substr(0, 11) != "dimChapters" && filteredNav[i].name.substr(0, 9) != "dimTopics") {
            // Handle other nav
                for (var j=0; j < originalNav[idx].refs.length; j++) {
                    selectedFilter = false;
                    for (var k = 0; k < filteredNav[i].refinements.length; k++) {
                        if (originalNav[idx].refs[j].fullName == filteredNav[i].refinements[k].value) {
                            originalNav[idx].refs[j].count = filteredNav[i].refinements[k].count;
                            for (var r=0; r < savedRefs.length; r++) {
                                if (filteredNav[i].name === savedRefs[r].navigationName &&
                                    filteredNav[i].refinements[k].value === savedRefs[r].value
                                ) {
                                    selectedFilter = true;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    if (selectedFilter) {
                        originalNav[idx].refs[j].checked = "checked";
                    } else {
                        originalNav[idx].refs[j].checked = "";
                    }
                }
            }
            idx++;
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