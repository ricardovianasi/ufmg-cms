(function () {
    'use strict';

    angular.module('app')
        .run(Debug)
        .run(Authenticate)
        .run(Run);

    /** ngInject */
    function Debug($log, ENV) {
        var enabled = (ENV === 'development' || ENV === 'test');
        $log.debugEnabled(enabled);
    }

    /** ngInject */
    function Authenticate(
        $rootScope,
        ModalService,
        $window,
        $log,
        $location,
        authService,
        PermissionService,
        NotificationService,
        sessionService,
        $timeout,
        $route
    ) {
        var hasRequired = true;
        $rootScope.modalLoginIsDisabled = true;

        function get(reload) {
            if (hasRequired) {
                var refreshToken = sessionService.getTokenRefresh();
                if ($rootScope.modalLoginIsDisabled && $location.path() !== '/login') {
                    hasRequired = false;
                    $rootScope.modalLoginIsDisabled = false;
                    if (refreshToken) {
                        return authService
                            .refresh(refreshToken)
                            .then(function (res) {
                                if (reload) {
                                    $window.location.reload();
                                }
                                sessionService.saveData(res.data, true);
                                sessionService.setIsLogged();
                                $rootScope.modalLoginIsDisabled = true;
                                hasRequired = true;
                                getAuth();
                            });
                    } else {
                        return ModalService
                            .login()
                            .result
                            .then(function () {
                                if (reload) {
                                    $window.location.reload();
                                }
                                getAuth();
                                hasRequired = true;
                            });
                    }
                }
                getAuth();
            }
        }

        function getAuth() {
            var timeToken = sessionService.getTokenTime();
            var listenLoginTime = 20 / 0.001;
            var timeTokenInMs = timeToken / 0.001;
            var time = timeToken ? timeTokenInMs : listenLoginTime;
            $log.info('Escutando Auth a cada: ' + time * 0.001 + ' segundos');
            $timeout(function () {
                get(false);
            }, time);
        }

        $rootScope.$on('AuthenticateResponseError', function () {
            if ($location.path() !== '/login' && $rootScope.modalLoginIsDisabled) {
                $log.info('Erro 401 | 403 Request auth');
                get(true);
            }
        });

        getAuth();
    }

    /** ngInject */
    function Run($rootScope,
        dataTableConfigService,
        sessionService,
        $window,
        $log,
        Util,
        ModalService,
        DTDefaultOptions,
        $timeout,
        PermissionService) {
        var startPermission = false;

        $rootScope.ngScrollbarsConfig = {
            autoHideScrollbar: false,
            theme: 'light-thin',
            advanced: {
                updateOnContentResize: true
            },
            scrollInertia: 0
        };
        Util.hiddenOverflow();


        $rootScope.dtOptions = dataTableConfigService.init();

        $rootScope.$on("$routeChangeSuccess", function (event, next, current) {
            if (!startPermission) {
                PermissionService.initService();
                startPermission = true;
            }
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
            $rootScope.currentUser = null;
            $rootScope.isRequiredAccount = false;
            sessionService.removeToken();
            sessionService.removeTokenRefresh();
            sessionService.removeIsLogged();
            $window.location.reload();
        };

        DTDefaultOptions.setLoadingTemplate('<img src="assets/img/loading.gif">');

    }
})();
