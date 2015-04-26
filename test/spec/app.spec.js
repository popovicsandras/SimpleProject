/* global define, describe, it, expect, beforeEach, afterEach */

'use strict';

define(function(require) {

    var app = require('app'),
        $ = require('jquery');

    describe('Application', function() {

        beforeEach(function(){
            var $appContainer = $('<div id="app"></div>');
            $('#fixtures').append($appContainer);
        });

        afterEach(function() {
            $('#fixtures').empty();
        });

        it('should correct the mispelled sentence', function() {

            // Act
            app.start();

            // Assert
            var $h1 = $('#app h1');
            expect($h1.text()).to.be.equal('Romani ite domum');
        });
    });
});