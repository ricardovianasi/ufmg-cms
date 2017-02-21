(function () {
    'use strict';

    angular.module('app')
        .run(Debug)
        .run(Run);

    /** ngInject */
    function Debug($log) {
        $log.debugEnabled(false);
    }

    /** ngInject */
    function Run($rootScope,
        dataTableConfigService,
        sessionService,
        $route,
        DTDefaultOptions,
        $timeout,
        PermissionService) {
        var startPermission = false;

        $rootScope.dtOptions = dataTableConfigService.init();

        $rootScope.$on("$routeChangeSuccess", function (event, next, current) {
            if (!startPermission) {
                PermissionService.initService();
                startPermission = true;
            }
        });

        $rootScope.logout = function () {
            sessionService.removeToken();
            sessionService.removeIsLogged();
            $route.reload();
        };

        DTDefaultOptions.setLoadingTemplate('<img src="assets/img/loading.gif">');

    }
})();
