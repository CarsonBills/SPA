
var Backbone = require('backbone'),
    _ = require('underscore');

    FavoritesData = (function() {
        'use strict';

        var LEGEND = ['Title', 'Author', 'Page Number'],
            link,
            type,
            filename,

            output = function (model) {
                return {
                    id: model.attributes.id,
                    abstract: model.attributes.abstract,
                    title: model.attributes.title,
                    downloads: model.attributes.downloads,
                    pname: model.attributes.pname,
                    downloads: model.attributes.downloads,
                    customIcon: model.attributes.customIcon,
                    chapter_id: ""
                };
            },

            input = function (data) {

                var custom = (data.customIcon === undefined) ? '' : data.customIcon,
                    favs =  {
                        id: data.id,
                        abstract: data.abstract,
                        title: data.title,
                        downloads: data.downloads,
                        pname: data.pname,
                        customIcon: data.customIcon,
                        chapter_id: ""
                    }
                return new NortonApp.Models.YourFavs(favs);
            };


        return {
            output: output,
            input: input
        };
    }());

module.exports = FavoritesData;
