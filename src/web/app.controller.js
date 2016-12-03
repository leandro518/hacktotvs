(function () {
    'use strict';
    angular
        .module(global.config.APP_NAME)
        .controller('appController', Controller);

    Controller.$inject = ['$scope', '$rootScope', '$state', '$element', '$document'];

    function Controller($scope, $rootScope, $state, $element, $document) {
        var controller = this;

        controller.menuTitle = "";
        controller.back_button = false;

        controller.previousState = {
            state: '',
            params : {}
        };

        controller.initialView = 'views/tasks/tasks.html';

        controller.hideHeader = function (){
            $("#myNavbar").collapse('hide');
        };

        $document.on('click', function(){
            controller.hideHeader();
        });

        controller.topaction = function() {
            $rootScope.$broadcast('actionMenuClicked');
        }

        controller.back = function(){
            $state.go(controller.previousState.state, controller.previousState.params);
        }

        controller.tabClick = function(state) {
            $state.go(state);
        }

        $rootScope.$on('$stateChangeStart', function (event, next, toParams, fromState, fromParams) {
            var animated = $element.find("#pageContent");
            animated.removeClass('scrolled');

            var isForward = next.name > fromState.name;
            if (isForward) {
                $element.removeClass('backward');
                controller.anim = 'scrolled';
            } else {
                $element.addClass('backward');
                controller.anim = 'scrolled';
            }
            $element.find("#pageContent").addClass(controller.anim);

            $rootScope.mainScope = $scope;

            controller.menuTitle = 'l-' + next.name.charAt(0).toUpperCase() + next.name.slice(1);;

            controller.previousState.state = fromState.name;
            controller.previousState.params = fromParams;

            var arrState = next.name.split('.');
            controller.rootState = arrState[0];

            // Se não for um state raiz (home, settings e history) deve mostrar o back-button
            if( next.name.indexOf(".") != -1 ) {
                controller.back_button = true;
            } else {
                controller.back_button = false;
            }
        });
    }
}());
