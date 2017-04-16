(function() {
    'use strict';

    require('./style.scss');

    require('angular');
    require('angular-resource');
    require('angular-ui-router');

    const moduleName = BUILD.MAIN_MODULE_NAME;

    const appDependencies = [
        'ngResource',
        'ui.router'
    ];

    angular
        .module(moduleName, appDependencies)
        .config(config);

    config.$inject = [
        '$resourceProvider'
    ];

    function config (
        $resourceProvider
    ) {
        $resourceProvider.defaults.stripTrailingSlashes = false;
    }

    require('./appConfig.js');
    require('./appRouting.js');
    require('./appRun.js');

    require('./components/mainMenu/mainMenu.js');

    angular.element(function() {
        angular.bootstrap(document, [moduleName]);
    });

    const appVersion = BUILD.VERSION;
    const apiUrl = BUILD.API_URL;
    const googleId = BUILD.GOOGLE_ANALYTICS_ID;
    const googleAPIKey = BUILD.GOOGLE_API_KEY;
    const isProd = BUILD.IS_ENV_PROD;
    const isQA = BUILD.IS_ENV_QA;
    const isDev = BUILD.IS_ENV_DEV;

    const Informer = require('./components/informer/informer.js');

    new Informer(`APP version is: ${appVersion}`);
    new Informer(`API URL is: ${apiUrl}`);
    new Informer(`Google ID is: ${googleId}`);
    new Informer(`Google API KEY is: ${googleAPIKey}`);
    new Informer(`Environment is production: ${isProd}`);
    new Informer(`Environment is QA: ${isQA}`);
    new Informer(`Environment is development: ${isDev}`);

})();
