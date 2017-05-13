import { mf1 } from '../../common/modules/megaModule';

require('./home.scss');

angular
    .module(BUILD.MAIN_MODULE_NAME)
    .controller('HomeController', HomeController);

function HomeController (
    $scope,
    $translate,
) {
    $scope.message = 'This is homepage baby!';

    $scope.translate = function translate () {
        $translate.use('de_CH');
    };
}

mf1();
