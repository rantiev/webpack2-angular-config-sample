(function () {
    'use strict';

    require('./contact.scss');

    angular
        .module(BUILD.MAIN_MODULE_NAME)
        .controller('ContactController', ContactController);

    ContactController.$inject = [
        '$scope'
    ];

    function ContactController (
        $scope
    ) {
        $scope.message = 'This is contact baby!';
    }

})();