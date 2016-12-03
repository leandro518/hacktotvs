(function () {
    'use strict';
    angular
    .module(global.config.APP_NAME)
    .controller('SettingsController', Controller);

    Controller.$inject = [
        '$scope',
        '$filter',
        '$state',
        'NotificationService',
        'TaskService'
    ];

    function Controller($scope, $filter, $state, NotificationService, TaskService) {
        var controller = this;

        var IdVend = '01';

        TaskService.getMsg(IdVend, function(data)
        {
          controller.msg = data;
        });

    }
}());
