(function () {
    'use strict';

    angular.module('app')
        .config(Debug)
        .config(Router)
        .config(Translator)
        .config(Tags)
        .config(httpInterceptor);

    Debug.$inject = ['$logProvider', '$provide'];

    function Debug($logProvider, $provide) {

        $provide.decorator('$log', ['$delegate',
            function ($delegate) {
                var $log = {};
                var enabled = true;
                $log = {
                    debugEnabled: function (flag) {
                        enabled = !!flag;
                    }
                };

                ['log', 'warn', 'info', 'error'].forEach(function (methodName) {
                    $log[methodName] = function () {
                        if (!enabled) {
                            return;
                        }

                        var logger = $delegate;
                        logger[methodName].apply(logger, arguments);
                    };
                });
                return $log;
            }
        ]);
        $logProvider.debugEnabled(false);
    }

    httpInterceptor.$inject = ['$httpProvider'];

    function httpInterceptor($httpProvider) {
        $httpProvider
            .interceptors
            .push('authInterceptorService');
    }

    Router.$inject = ['$routeProvider', '$locationProvider'];

    function Router($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        $routeProvider.otherwise({
            redirectTo: '/page-not-found'
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
                placeholder: 'Selecionar tag',
                replaceSpacesWithDashes: false
            })
            .setDefaults('autoComplete', {
                selectFirstMatch: false,
                maxResultsToShow: 50
            });
    }
})();
