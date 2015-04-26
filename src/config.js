/* global require */
'use strict';

require.config({
    baseUrl: "/scripts",
    waitSeconds: 30,
    wrapShim: true,
    shim: {
        'bootstrap': {
            deps: ['jquery']
        },
        'app': {
            deps: [
                'jquery',
                'bootstrap',
                'text',
                'underscore'
            ]
        }
    },
    paths: {
        'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap',
        'jquery': '../bower_components/jquery/dist/jquery',
        'text': '../bower_components/requirejs-text/text',
        'underscore': '../bower_components/underscore/underscore'
    }
});