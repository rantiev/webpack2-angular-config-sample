angular
    .module(BUILD.MAIN_MODULE_NAME)
    .service('logger2', loggerService);

function loggerService ($timeout) {
    return {
        log,
    };

    function log () {
        $timeout(() => {
            console.log(`some log ${Date.now()} from logger 2`);
        });
    }
}
