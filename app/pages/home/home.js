(function () {
    'use strict';

    require('./home.scss');

    angular
        .module(BUILD.MAIN_MODULE_NAME)
        .controller('HomeController', HomeController);

    HomeController.$inject = [
        '$scope'
    ];

    function HomeController (
        $scope
    ) {
        $scope.message = 'This is homepage baby!';
    }

})();