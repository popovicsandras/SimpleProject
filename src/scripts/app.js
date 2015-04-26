/* global define */

'use strict';

define(function(require) {

    var $ = require('jquery'),
        appTemplate = require('text!templates/app.html');

    return {
        start: function() {
            $('#app').append(appTemplate);

            var $h1 = $('#app h1');
            $h1.text('Romani ite domum');
        }
    };
});