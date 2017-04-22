require('./informer.scss');

function Informer (text) {
    const information = document.createElement('div');
    information.className = 'information';

    const txt = document.createTextNode(text);
    information.appendChild(txt);

    document.documentElement.appendChild(information);
}

module.exports = Informer;
