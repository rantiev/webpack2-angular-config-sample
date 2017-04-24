const requireAll = require('../webpack.helpers.js').requireAll;

requireAll(require.context('./common/services', true, /.js$/));

require('./components/mainMenu/mainMenu.js');
