angular
    .module(BUILD.MAIN_MODULE_NAME)
    .constant('appConfig', {
        apiPath: BUILD.API_URL,
        apiKeyGoogle: BUILD.GOOGLE_API_KEY,
    });
