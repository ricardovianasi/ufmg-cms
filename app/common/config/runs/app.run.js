(function() {
    'use strict';

    angular.module('app')
        .run(Run);

    /** ngInject */
    function Run($rootScope, dataTableConfigService, sessionService, $window, $log, ModalService, DTDefaultOptions,
        $location, PermissionService) {

        $rootScope.showResponsiveMenu = false;
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

        $rootScope.toggleResponsiveMenu = function (itemMenu) {
            let result = document.getElementsByClassName('menu-mobile');
            result[0].classList.toggle('hidden');
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

        $rootScope.getFormValidation = function (dataForm, field, error) {
            let result = {
                isValid: dataForm[field].$valid,
                error: dataForm[field].$error,
                submitted: dataForm.$submitted,
                isInvalid: dataForm.$submitted && dataForm[field].$invalid
            };
            result.hasError = error ? result.submitted && result.error[error] : false;
            return result;
        };

        DTDefaultOptions.setLoadingTemplate('<img src="assets/img/loading.gif">');
    }
})();
