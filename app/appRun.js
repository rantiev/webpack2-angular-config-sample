(function () {
    'use strict';

    angular
        .module(BUILD.MAIN_MODULE_NAME)
        .run(appRun);

    appRun.$inject = [
        '$rootScope'
    ];

    function appRun (
        $rootScope
    ) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.currentState = toState;
        });
    }

})();