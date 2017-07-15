import angular from 'angular';

require('./style.scss');
require('./appVendors.js');

const moduleName = BUILD.MAIN_MODULE_NAME;

const appDependencies = [
    'ngResource',
    'ui.router',
    'pascalprecht.translate',
    'tmh.dynamicLocale',
];

angular
    .module(moduleName, appDependencies)
    .config(config);

function config (
    $resourceProvider,
    $translateProvider,
) {
    $resourceProvider.defaults.stripTrailingSlashes = false;

    $translateProvider
        .useSanitizeValueStrategy('escapeParameters')
        .useStaticFilesLoader({
            prefix: `${BUILD.IS_ENV_LOCAL ? 'app/' : ''}translation/locale-`,
            suffix: `${BUILD.IS_ENV_LOCAL ? '' : `.${BUILD.TIMESTAMP}`}.json`,
        })
        .preferredLanguage('en_GB')
        .fallbackLanguage('en_GB');
}

require('./appConfig.js');
require('./appRouting.js');
require('./appRun.js');
require('./appComponents.js');

angular.element(() => {
    angular.bootstrap(document, [moduleName], { strictDi: !BUILD.IS_ENV_LOCAL });
});

/* const appVersion = BUILD.VERSION;
const apiUrl = BUILD.API_URL;
const googleId = BUILD.GOOGLE_ANALYTICS_ID;
const googleAPIKey = BUILD.GOOGLE_API_KEY;
const isProd = BUILD.IS_ENV_PROD;
const isQA = BUILD.IS_ENV_QA;
const isDev = BUILD.IS_ENV_DEV;

const Informer = require('./components/informer/informer.js');*/

/*
const inf1 = new Informer(`APP version is: ${appVersion}`);
const inf2 = new Informer(`API URL is: ${apiUrl}`);
const inf3 = new Informer(`Google ID is: ${googleId}`);
const inf4 = new Informer(`Google API KEY is: ${googleAPIKey}`);
const inf5 = new Informer(`Environment is production: ${isProd}`);
const inf6 = new Informer(`Environment is QA: ${isQA}`);
const inf7 = new Informer(`Environment is development: ${isDev}`);*/
