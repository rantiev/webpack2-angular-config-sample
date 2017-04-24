require('./contact.scss');

angular
    .module(BUILD.MAIN_MODULE_NAME)
    .controller('ContactController', ContactController);

function ContactController (
    $scope,
    logger1,
    logger2,
) {
    $scope.message = 'This is contact baby!';

    logger1.log();
    logger2.log();
}
