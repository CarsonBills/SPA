
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
            },

            inputCurrentPage = function (data) {

                var custom = (data.customIcon === undefined) ? '' : data.customIcon,
                    favs =  {
                        id: data.id,
                        abstract: data.attributes.data.introCopy,
                        title: data.attributes.data.title,
                        downloads: data.attributes.data.downloads,
                        pname: data.id,
                        customIcon: data.customIcon,
                        chapter_id: ""
                    },
                    favsData = new NortonApp.Models.YourFavs(favs);
                    favsData.tagLabel = data.tagLabel;

           /*         favsData.pname = currentPage.id;
                    favsData.pageNumber = currentPage.attributes.data.pageNumber;
                    favsData.abstract = currentPage.attributes.data.excerpt;
                    favsData.title = currentPage.attributes.data.title;
                    favsData.authorLastName = currentPage.attributes.data.author[0].authorLastName;
                    favsData.authorFirstName = currentPage.attributes.data.author[0].authorFirstName;
                    favsData.authorMiddleName = currentPage.attributes.data.author[0].authorMiddleName;
                    favsData.ebookNode = currentPage.attributes.data.ebookLink;
                    favsData.baseUrl = Norton.baseUrl;
                    favsData.id = currentPage.attributes.data.id;*/

                return favsData;
            };


        return {
            output: output,
            input: input,
            inputCurrentPage: inputCurrentPage
        };
    }());

module.exports = FavoritesData;
