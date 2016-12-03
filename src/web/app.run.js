(function () {
    'use strict';

    angular
        .module(global.config.APP_NAME)
        .run(Run);

    Run.$inject = [
        '$rootScope',
        '$state',
        'DeviceService',
        'DatabaseService',
        'NotificationService'];

    function Run($rootScope, $state, DeviceService, DatabaseService, NotificationService) {
        var run = this;
        setTimeout(() => {
            // DEBUG: Deixa este timeout aqui atÃ© a TEC criar o evento deviceReady
            DatabaseService.init('WEBSQL')
            .then((result) => {
                $rootScope.$broadcast('appReady');
            })
            .catch((error) => {
                NotificationService.show("l-Houve-um-problema-ao-inicializar-o-app", NotificationService.types.ERROR );
            });
        }, 2000);
    }
}());
