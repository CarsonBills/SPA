var JSConstants = {
    noMyItems: '<div class="empty-list">You have not added any items to your List yet.</div>',
    emptySeach: 'Please put in search query',
    creditsUrl: '/json/credits.json',
    loginUrl: '//books.wwnorton.com/books/ssl/WebLogin.aspx',
    invalidSiteCodeUrl: '//books.wwnorton.com/books/index.aspx',
    // to start services on EC2, navigate to /var/www/html/repo/projects/norton-reader/webapp, then >nohup node app &
    // Do the same for /var/www/html/repo/projects/instructor-resources/webapp
    //siteConfigUrl: '//dev-services.wwnorton.com/ars.svc/v1/getsiteconfig?',
    //searchUrl: '//dev-services.wwnorton.com/ars.svc/v1//search',
    //getDetailPageUrl: '//dev-services.wwnorton.com/ars.svc/v1/getpagedetail?',
    siteConfigUrl: '//ec2-52-91-226-102.compute-1.amazonaws.com/getsiteconfig.php?',
    searchUrl: '//ec2-52-91-226-102.compute-1.amazonaws.com/search.php',
    getDetailPageUrl: '//ec2-52-91-226-102.compute-1.amazonaws.com/getpagedetail.php?',
    saveTrackingUrl: '//dev-services.wwnorton.com/Ars.svc/v1/SaveTracking',
    getTrackingUrl: '//dev-services.wwnorton.com/Ars.svc/v1/trackingbyasset',
    likeAssetUrl: '//dev-services.wwnorton.com/Ars.svc/v1/LikeAsset ',
    unlikeAssetUrl: '//dev-services.wwnorton.com/Ars.svc/v1/UnLikeAsset ',
    getSavedFavsUrl: '//dev-services.wwnorton.com/Ars.svc/v1/getfavorites',
    awsContentUrl: '//dev-services.wwnorton.com/awsOutput.aspx?',
    tabletLandspaceWidth: 1024,
    tabletPortaitWidth: 768,
    mobileWidth: 480,
    mobileWidthSM: 320,

//getDetailPageUrl: 'http://localhost:2999/api/getdetailpage/',
//searchUrl: '/php/searchandiser.php',
    defaultPageSize: 10
};

module.exports = JSConstants;