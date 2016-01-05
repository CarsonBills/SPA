
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

            input = function (params) {

                var pn,
                    favs;
                pn = _.find(params.data.pageNumber, function(item) {
                    return (item.version === params.version);
                });

                pn = (pn === undefined) ? 0: pn.pageNumber;
                favs = {
                    pname : params.data.pname,
                    pageNumber : pn,
                    abstract : params.data.abstract,
                    title : params.data.title,
                    authorLastName : params.data.primaryAuthor.authorLastName,
                    authorFirstName : params.data.primaryAuthor.authorFirstName,
                    authorMiddleName : params.data.primaryAuthor.authorMiddleName,
                    ebookNode : params.data.ebookNode,
                    baseUrl : Norton.baseUrl,
                    id : params.data.id
                };
                return new NortonApp.Models.YourFavs(favs);
            },

            inputCurrentPage = function (data) {
                if (data.pageNumber === "" || data.pageNumber === undefined) {
                    data.pageNumber = 0;
                }

                var favs = {
                    pname : data.pname,
                    pageNumber : data.pageNumber,
                    abstract : data.excerpt,
                    title : data.title,
                    authorLastName : data.author[0].authorLastName,
                    authorFirstName : data.author[0].authorFirstName,
                    authorMiddleName : data.author[0].authorMiddleName,
                    ebookNode : data.ebookLink,
                    baseUrl : Norton.baseUrl,
                    id : data.id
                };
                favs = new NortonApp.Models.YourFavs(favs);

                return favs;
            };


        return {
            output: output,
            input: input,
            inputCurrentPage: inputCurrentPage
        };
    }());

module.exports = FavoritesData;
