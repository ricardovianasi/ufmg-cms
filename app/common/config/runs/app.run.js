(function() {
    'use strict';

    angular.module('app')
        .run(Run);

    /** ngInject */
    function Run($rootScope, dataTableConfigService, sessionService, $window, $log, ModalService, DTDefaultOptions,
        $timeout, $location, PermissionService, TagsService) {

        console.log('app run');

        TagsService.getTags();

        $rootScope.shownavbar = true;
        $rootScope.viewOnly = false;
        $rootScope.moduleCurrent = false;

        $rootScope.canPost = PermissionService.canPost;
        $rootScope.canPut = PermissionService.canPut;
        $rootScope.canDelete = PermissionService.canDelete;
        $rootScope.canGet = PermissionService.canGet;

        $rootScope.ngScrollbarsConfig = {
            autoHideScrollbar: true,
            theme: 'minimal',
            advanced: {
                updateOnContentResize: true
            },
            scrollInertia: 0
        };

        $rootScope.$on('$routeChangeSuccess', function () {
            // Reset status
            dataTableConfigService.setParamStatus('all');
        });

        $rootScope.changePassword = function () {
            return ModalService.changePassword();
        };

        $rootScope.backHistory = function () {
            $window.history.back();
        };

        $rootScope.logout = function () {
            $log.info('logout');
            $rootScope.dataUser = null;
            $rootScope.User = null;
            $rootScope.isRequiredAccount = false;
            sessionService.removeToken();
            sessionService.removeTokenRefresh();
            sessionService.removeIsLogged();
            $location.path('/login');
        };

        DTDefaultOptions.setLoadingTemplate('<img src="assets/img/loading.gif">');
    }
})();