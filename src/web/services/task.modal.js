(function () {
    'use strict';
    angular
        .module(global.config.APP_NAME)
        .service('TaskModal', Service);

    Service.$inject = ['$q', '$uibModal'];

    function Service($q, $uibModal) {
        var service = this;

        service.show = function(pMsg, pType) {
            var controller = ['$scope', '$uibModalInstance', '$timeout', 'options', function($scope, $uibModalInstance, $timeout, options){

                $scope.newTask = null;

                $scope.select = function(){
                    if( !$scope.newTask )
                        return;

                    if( !$scope.newTask.name )
                        return;

                    if( !$scope.newTask.date )
                        $scope.newTask.date = new Date();

                    $uibModalInstance.close($scope.newTask);
                }

                $scope.cancel = function(){
                    $uibModalInstance.close();
                }

                $scope.nameKeyPress = function(keyEvent) {
                    if (keyEvent.which === 13) {
                        $scope.select();
                    }
                };
                $timeout(function(){angular.element('#name').focus();},0);
            }];

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: './templates/task-modal-template.html',
                controller: controller,
                size: 'lg',
                backdrop: true,
                //windowClass: 'totvs-notification-modal',
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
