const APP_VERSION = '1.0.0';

const ENVS = {
    PROD: 'production',
    QA: 'development',
    DEV: 'sandbox'
};

const buildCfg = {
    APP_VERSION,
    ENVS,
    API_URL: {
        [ENVS.PROD]: 'http://production.hostname.com/api',
        [ENVS.QA]: 'http://development.hostname.com/api',
        [ENVS.DEV]: 'http://sandbox.hostname.com/api'
    },
    GOOGLE: {
        API_KEY: {
            [ENVS.PROD]: 'googleAPIKeyProduction',
            [ENVS.QA]: 'googleAPIKeyDevelopment',
            [ENVS.DEV]: 'googleAPIKeySandbox'
        },
        ANALYTICS_ID: {
            [ENVS.PROD]: 'googleIdProduction',
            [ENVS.QA]: 'googleIdDevelopment',
            [ENVS.DEV]: 'googleIdSandbox'
        }
    },
    ANGULAR: {
        MAIN_MODULE_NAME: 'myApp'
    }
};

module.exports = buildCfg;