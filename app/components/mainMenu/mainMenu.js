require('./mainMenu.scss');

const template = require('./mainMenu.html');

angular
    .module(BUILD.MAIN_MODULE_NAME)
    .component('mainMenu', {
        template,
        controller: MainMenuController,
    });

function MainMenuController () {
    this.links = [
        {
            name: 'Home',
            state: 'home',
        },
        {
            name: 'Contact',
            state: 'contact',
        },
    ];
}
