angular
    .module(BUILD.MAIN_MODULE_NAME)
    .run(appRun);

function appRun (
    $rootScope,
) {
   /* $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {

    });

    $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
        $rootScope.currentState = toState;
    });*/
}
