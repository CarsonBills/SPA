
module.exports = function(Handlebars) {
    Handlebars.registerHelper('trimString', function(passedString) {
        var theString = passedString.substring(0,100);
        return new Handlebars.SafeString(theString)
    });
}
