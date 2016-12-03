(function () {
    'use strict';
    angular
        .module(global.config.APP_NAME)
        .service('DeviceService', Service);

    Service.$inject = ['$q'];

    function Service($q) {
        var service = this;
        service.initialized = false;

        service.ready = function() {
            return service.initialized;
        }

        service.getLocation = function () {
            var deferred = $q.defer();

            if( window.navigator.platform == "Win32" ) {
                deferred.resolve("no location - browser testing");
            } else {
                channel.getCurrentPosition().then(
                    function(result) {
                        deferred.resolve(result);
                    },
                    function(error) {
                        deferred.reject(error);
                    }
                );
            }
            return deferred.promise;
        }

        service.getPicture = function () {
            return channel.getPicture();
        }

    }
}());
