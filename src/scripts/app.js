/* global define */

'use strict';

define(function(require) {

    var $ = require('jquery');

    return {
        start: function() {
            var $h1 = $('#app > h1');
            $h1.text('Romani ite domum');
        }
    };
});