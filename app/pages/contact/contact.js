require('./contact.scss');

angular
    .module(BUILD.MAIN_MODULE_NAME)
    .controller('ContactController', ContactController);

function ContactController (
    $scope,
) {
    $scope.message = 'This is contact baby!';
}
