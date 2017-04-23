require('./home.scss');

angular
    .module(BUILD.MAIN_MODULE_NAME)
    .controller('HomeController', HomeController);

HomeController.$inject = [
    '$scope',
    '$translate',
];

function HomeController (
    $scope,
    $translate,
) {
    $scope.message = 'This is homepage baby!';

    $scope.translate = function translate () {
        $translate.use('de_CH');
    };
}
