/* global define, describe, it, expect, beforeEach, afterEach */

'use strict';

define(function(require) {

    var app = require('app'),
        $ = require('jquery');

    describe('Application', function() {

        beforeEach(function(){
            var $h1 = $('<h1>Romanes eunt domus</h1>'),
                $appContainer = $('<div id="app"></div>');

            $appContainer.append($h1);
            $('#fixtures').append($appContainer);
        });

        afterEach(function() {
            $('#fixtures').empty();
        });

        it('should correct the mispelled sentence', function() {

            // Arrange
            var $h1 = $('#app > h1');

            // Assert
            expect($h1.text()).to.be.equal('Romanes eunt domus');

            // Act
            app.start();

            // Assert
            expect($h1.text()).to.be.equal('Romani ite domum');
        });
    });
});