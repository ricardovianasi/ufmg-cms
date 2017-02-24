(function () {
    'use strict';

    angular.module('app')
        .run(Debug)
        .run(Run);


    /** ngInject */
    function Debug($log, ENV) {
        var enabled = (ENV === 'development' || ENV === 'test');
        $log.debugEnabled(enabled);
    }

    /** ngInject */
    function Run($rootScope,
        dataTableConfigService,
        sessionService,
        $window,
        $log,
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
            $log.info('logout');
            $rootScope.dataUser = null;
            $rootScope.currentUser = null;
            $rootScope.isRequiredAccount = false;
            sessionService.removeToken();
            sessionService.removeIsLogged();
            $window.location.reload();
        };

        DTDefaultOptions.setLoadingTemplate('<img src="assets/img/loading.gif">');

    }
})();
