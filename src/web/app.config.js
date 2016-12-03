(function () {
    'use strict';
    angular
        .module(global.config.APP_NAME)
        .config(Config);

    Config.$inject = ['$translateProvider', '$translateStaticFilesLoaderProvider', '$urlRouterProvider', '$stateProvider'];

    function Config($translateProvider, $translateStaticFilesLoaderProvider, $urlRouterProvider, $stateProvider) {
        var config = this;

        $urlRouterProvider.otherwise('/tasks');

        $stateProvider
            .state('tasks', {
                url: '/tasks',
                cache: false,
                views: {
                    'pageContent@':{templateUrl: 'views/tasks/tasks.html'}
                }
            })

            .state('tasks.detail', {
                url: '/:salesId, /:totVenda, /:totComis',
                cache: false,
                views: {
                    'pageContent@':{templateUrl: 'views/tasks-detail/tasks-detail.html'}
                }
            })

            .state('tasks.ranking', {
                url: '/ranking/:salesId',
                cache: false,
                views: {
                    'pageContent@':{templateUrl: 'views/ranking-detail/ranking-detail.html'}
                }
            })

            .state('mensagens', {
                url: '/settings',
                cache: false,
                views: {
                    'pageContent@':{templateUrl: 'views/settings/settings.html'}
                }
            });

        var language = navigator.language.substr(0, 2);

        $translateProvider.useStaticFilesLoader({
            prefix: 'locales/',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage(language);
        $translateProvider.fallbackLanguage('pt');
        $translateProvider.useSanitizeValueStrategy('escaped');
    }
}());
