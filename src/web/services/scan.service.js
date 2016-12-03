(function () {
    'use strict';
    angular
        .module(global.config.APP_NAME)
        .service('ScanService', Service);

    Service.$inject = [];

    function Service() {

        var service = this;

        service.scan = function()
        {

           console.log('scan function got called.');

           return channel.getPicture().then(function(result)
           {

           });

        }

        return service;
    }
}());
