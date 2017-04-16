(function () {
    'use strict';

    require('./pages/home/home.js');
    require('./pages/contact/contact.js');

    angular
        .module(BUILD.MAIN_MODULE_NAME)
        .config(config);

    config.$inject = [
        '$locationProvider',
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config (
        $locationProvider,
        $stateProvider,
        $urlRouterProvider
    ) {
        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('home');

        $stateProvider
            .state('home', {
                url: '/home',
                template: require('./pages/home/home.html'),
                controller: 'HomeController'
            })
            .state('contact', {
                url: '/contact',
                template: require('./pages/contact/contact.html'),
                controller: 'ContactController'
            })
    }

})();