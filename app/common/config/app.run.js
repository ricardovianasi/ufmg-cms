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
        NotificationService,
        sessionService,
        $timeout
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
                        if (!sessionService.getIsLogged()) {
                            $location.path('/login');
                            return;
                        }
                        sessionService.setIsLogged(false);
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
            var timeTokenInSegunds = sessionService.getTokenTime();
            var timeInMillisegunds = timeTokenInSegunds / 0.001;
            $log.info('Escutando Auth a cada: ' + timeTokenInSegunds + ' segundos');
            $timeout(function () {
                get(false);
            }, timeInMillisegunds);
        }

        $rootScope.$on('$routeChangeSuccess', function () {
            if (!sessionService.getIsLogged()) {
                $location.path('/login');
                return;
            }
        });

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
        ModalService,
        DTDefaultOptions,
        $timeout,
        $location
        ) {

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
