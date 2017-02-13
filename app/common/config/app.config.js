(function () {
    'use strict';

    angular.module('app')
        .config(Router)
        .config(Translator)
        .config(Tags)
        .config(http);

    http.$inject = ['$httpProvider'];

    /**
     *
     * @param $httpProvider
     */
    function http($httpProvider) {
        $httpProvider
            .interceptors
            .push('authInterceptorService');
    }

    Router.$inject = ['$routeProvider'];

    function Router($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/login'
        });
    }

    //Translation
    Translator.$inject = ['$translateProvider'];

    /**
     * @param $translateProvider
     *
     * @constructor
     */
    function Translator($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'lang/',
            suffix: '.json',
        });

        $translateProvider.preferredLanguage('pt-br');
    }

    //Tags
    /**
     * @param tagsInputConfigProvider
     *
     * @constructor
     */
    function Tags(tagsInputConfigProvider) {
        tagsInputConfigProvider
            .setDefaults('tagsInput', {
                placeholder: 'Adicionar tag',
                replaceSpacesWithDashes: false
            })
            .setDefaults('autoComplete', {
                selectFirstMatch: false
            });
    }
})();
