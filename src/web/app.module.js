(function () {
    'use strict';
    angular
        .module(global.config.APP_NAME, [
            'ui.router',
            'ui.bootstrap',
            'ngAnimate',
            'anim-in-out',
            'totvsTopMenuDirective',
            'pascalprecht.translate',
            'ngMask',
            'kendo.directives' //Kendo UI
        ]);
}());
