const packageJson = require('./package.json');

const MAIN_MODULE_NAME = 'myApp';
const APP_VERSION = packageJson.version;

const ENVS = {
    PROD: 'production',
    QA: 'development',
    DEV: 'sandbox',
    LOCAL: 'local',
};

const buildCfg = {
    APP_VERSION,
    ENVS,
    API_URL: {
        [ENVS.PROD]: 'http://production.hostname.com/api',
        [ENVS.QA]: 'http://development.hostname.com/api',
        [ENVS.DEV]: 'http://sandbox.hostname.com/api',
        [ENVS.LOCAL]: 'http://local.hostname.com/api',
    },
    GOOGLE: {
        API_KEY: {
            [ENVS.PROD]: 'googleAPIKeyProduction',
            [ENVS.QA]: 'googleAPIKeyDevelopment',
            [ENVS.DEV]: 'googleAPIKeySandbox',
            [ENVS.LOCAL]: 'googleAPIKeyLocal',
        },
        ANALYTICS_ID: {
            [ENVS.PROD]: 'googleIdProduction',
            [ENVS.QA]: 'googleIdDevelopment',
            [ENVS.DEV]: 'googleIdSandbox',
            [ENVS.LOCAL]: 'googleIdLocal',
        },
    },
    ANGULAR: {
        MAIN_MODULE_NAME,
    },
};

module.exports = buildCfg;
