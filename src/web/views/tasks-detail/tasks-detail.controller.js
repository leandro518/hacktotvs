(function () {
    'use strict';
    angular
        .module(global.config.APP_NAME)
        .controller('TaskDetailController', Controller);

    Controller.$inject = [
        '$scope',
        '$stateParams',
        '$filter',
        'TaskService',
        '$http',
        '$state',
        '$q'
    ];

    function Controller($scope, $stateParams, $filter, TaskService, $http, $state, $q ) {
        var controller = this;

        // Controle de animação pois esta tela é de detalhes, e deve deslizar do lado, e não fazer o fade padrão.
        controller.anim = 'anim-slide-left';
        $scope.$on('animEnd', function($event, element, speed) {
            controller.anim = 'anim-slide-right';
        });

        controller.IdVend = $stateParams.salesId;
        controller.totalVenda = $stateParams.totVenda;
        controller.totalComis = $stateParams.totComis;

        TaskService.getSales(controller.IdVend, function(data){
          controller.vendas = data;
        });
    }
}());
