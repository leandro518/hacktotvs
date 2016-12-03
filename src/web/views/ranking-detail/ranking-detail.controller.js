(function () {
    'use strict';
    angular
        .module(global.config.APP_NAME)
        .controller('RankingController', Controller);

    Controller.$inject = [
        '$scope',
        '$stateParams',
        '$filter',
        'TaskService',
        '$http',
        '$state'
    ];

    function Controller($scope, $stateParams, $filter, TaskService, $http, $state ) {
        var controller = this;
        // Controle de animação pois esta tela é de detalhes, e deve deslizar do lado, e não fazer o fade padrão.
        controller.anim = 'anim-slide-left';
        $scope.$on('animEnd', function($event, element, speed) {
            controller.anim = 'anim-slide-right';
        });

        TaskService.getRanking(controller.IdVend, function(data){
          controller.ranking = data;
        });

    }
}());
