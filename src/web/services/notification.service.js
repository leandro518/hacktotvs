(function () {
    'use strict';
    angular
        .module(global.config.APP_NAME)
        .service('NotificationService', Service);

    Service.$inject = ['$q', '$uibModal'];

    function Service($q, $uibModal) {
        var service = this;

        service.types = {
            DEFAULT : 0,
            SUCCESS : 1,
            ERROR : 2,
            WARNING : 3
        }

        service.show = function(pMsg, pType) {
            var controller = ['$scope', '$uibModalInstance', '$timeout', 'options', function($scope, $uibModalInstance, $timeout, options){
                $scope.msg = options.msg;
                $scope.detail = '';

                switch( options.type ) {
                    case service.types.SUCCESS:
                        $scope.detail = 'is-success';
                        break;
                    case service.types.ERROR:
                        $scope.detail = 'is-error';
                        break;
                    case service.types.WARNING:
                        $scope.detail = 'is-warning';
                        break;
                }

                $timeout(function(){
                    $uibModalInstance.close();
                }, 5000);

                $scope.click = function(){
                    $uibModalInstance.close();
                }
            }];

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: './templates/notification-template.html',
                controller: controller,
                size: 'lg',
                backdrop: false,
                windowClass: 'totvs-notification-modal',
                resolve: {
                    options : function() {
                        return {
                            msg : pMsg,
                            type : pType
                        }
                    }
                }
            });

            return modalInstance.result;
        }
        return service;
    }
}());
