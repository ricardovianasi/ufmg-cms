(function () {
    'use strict';

    angular.module('app')
        .config(Debug)
        .config(Router)
        .config(Translator)
        .config(Tags)
        .config(http);



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

    http.$inject = ['$httpProvider'];

    function http($httpProvider) {
        $httpProvider
            .interceptors
            .push('authInterceptorService');
    }

    Router.$inject = ['$routeProvider', '$locationProvider'];

    function Router($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        $routeProvider.otherwise({
            redirectTo: '/'
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
