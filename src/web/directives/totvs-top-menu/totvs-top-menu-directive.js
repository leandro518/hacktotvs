(function () {
    'use strict';
    angular
        .module('totvsTopMenuDirective')
        .directive('totvsTopMenu', Directive);

    function Directive( ) {

        var directiveController = ['$rootScope', '$scope', '$document',  function($rootScope, $scope, $document) {
            $document.on('click', function(){
                $scope.hideHeader();
            });

            $scope.hideHeader = function (){
        		$("#myNavbar").collapse('hide');
        	};

            $scope.backB = function() {
                $scope.back();
            }

            $scope.actionB = function() {
                $scope.topaction();
            }
        }];

        return {
            templateUrl : 'directives/totvs-top-menu/totvs-top-menu-template.html',
            restrict: 'EA',
            scope: {
                title: '=',
                backButton : '=',
                back : '=',
                topaction : '='
            },
            link : link,
            controller : directiveController
        }
    }

    function link(scope, element, attrs, controller) {
    }
}());
