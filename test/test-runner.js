/* global window */
'use strict';

require(['require', 'config'], function(require) {

    require(['spec/app.spec.js'], function()
    {
        (window.mochaPhantomJS || window.mocha).run();
    });

});
