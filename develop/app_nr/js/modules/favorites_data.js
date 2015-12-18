
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

                var favs = {
                    pname : data.pname,
                    pageNumber : data.pageNumber,
                    abstract : data.abstract,
                    title : data.title,
                    authorLastName : data.primaryAuthor.authorLastName,
                    authorFirstName : data.primaryAuthor.authorFirstName,
                    authorMiddleName : data.primaryAuthor.authorMiddleName,
                    ebookNode : data.ebookNode,
                    baseUrl : Norton.baseUrl,
                    id : data.id
                };
                return new NortonApp.Models.YourFavs(favs);
            },

            inputCurrentPage = function (data) {
                console.log(data)

                var favs = {
                    // This pname id thing is confusing
                    pname : data.id,
                    pageNumber : data.attributes.data.pageNumber,
                    abstract : data.attributes.data.excerpt,
                    title : data.attributes.data.title,
                    authorLastName : data.attributes.data.author[0].authorLastName,
                    authorFirstName : data.attributes.data.author[0].authorFirstName,
                    authorMiddleName : data.attributes.data.author[0].authorMiddleName,
                    ebookNode : data.attributes.data.ebookLink,
                    baseUrl : Norton.baseUrl,
                    id : data.attributes.data.id
                };
                favsData = new NortonApp.Models.YourFavs(favs);

                return favsData;
            };


        return {
            output: output,
            input: input,
            inputCurrentPage: inputCurrentPage
        };
    }());

module.exports = FavoritesData;
