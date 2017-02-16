(function () {
    'use strict';

    angular.module('app')
        .config(Router)
        .config(Translator)
        .config(Tags)
        .config(Debug)
        .config(http);


    Debug.$inject = ['$logProvider'];

    function Debug($logProvider) {
        $logProvider.debugEnabled(false);
    }

    http.$inject = ['$httpProvider'];

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

    function Translator($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'lang/',
            suffix: '.json',
        });

        $translateProvider.preferredLanguage('pt-br');
    }

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
