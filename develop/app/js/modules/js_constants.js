var JSConstants = {
    noMyItems: '<div class="empty-list">You have not added any items to your List yet.</div>',
    loginUrl: '//books.wwnorton.com/books//ssl/WebLogin.aspx',
    invalidSiteCodeUrl: '//books.wwnorton.com/books/index.aspx',
      //siteConfigUrl: 'http://dev-books.wwnorton.com:2999/api/getsiteconfig/',
    siteConfigUrl: 'http://dusty:822/ars.svc/v1/getsiteconfig?',
      //searchUrl: '/php/searchandiser.php',
    searchUrl: 'http://dusty:822/ars.svc/v1/search',
      //getDetailPageUrl: 'http://localhost:2999/api/getdetailpage/',
    getDetailPageUrl: 'http://dusty:822/ars.svc/v1/getpagedetail?',
    saveTrackingUrl: 'http://dusty:822/Ars.svc/v1/SaveTracking',
    getTrackingUrl: 'http://dusty:822/Ars.svc/v1/trackingbyasset',
    defaultPageSize: 10
};

module.exports = JSConstants;
