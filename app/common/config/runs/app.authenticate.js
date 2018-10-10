(function() {
    'use strict';

    angular.module('app')
        .run(Authenticate);

    /** ngInject */
    function Authenticate($rootScope, ModalService, $window, $log, $location,
        authService, NotificationService, sessionService, PermissionService, $timeout) {

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
                                $log.info(res);
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

        function _checkTermUse() {
            var isTermSigned = $rootScope.User.term_signed;
            if(!isTermSigned) {
                $location.path('/use-term');
            }
        }

        function getActionModule() {
            var path = $location.path();
            var lastElement = getLastElement(path);
            var isNotNumberLastElement = typeof parseFloat(lastElement) !== 'number';
            var isEditions = lastElement === 'editions';
            var isActionNew = lastElement === 'new';
            var isNews = path.match(new RegExp('news'));

            if (isActionNew) {
                return 'new';
            }
            if (isNotNumberLastElement || isEditions) {
                return false;
            }

            var actionView = path.match(new RegExp('view'));

            if (actionView) {
                return actionView.toString();
            }

            var actionEdit = path.match(new RegExp('edit'));

            if (actionEdit) {
                return actionEdit.toString();
            }
            if (isNews) {
                return false;
            }
            return false;
        }

        function getLastElement(value) {
            if (typeof value === 'string') {
                var array = value.split('/');
                var lastIndex = array.length - 1;
                return array[lastIndex];
            }
        }

        function getId(context) {
            var hash = $location.path();
            var id = '';
            var lastElement = getLastElement(hash);
            if (context === 'edit') {
                return parseInt(lastElement);
            }
            if (typeof lastElement === 'string') {
                var numberOfHash = hash.match(/\d+/g);
                id = numberOfHash ? parseInt(numberOfHash.toString()) : false;
                if (typeof id === 'number') {
                    return id;
                }
            }
            return false;
        }

        function getModule(hash) {
            var pathThree = hash.split('/')[3];
            if (
                pathThree === 'editions'
            ) {
                return pathThree === 'editions' ? pathThree : 'course_' + pathThree;
            }

            if (pathThree === ':type') {
                pathThree = $location.path().split('/')[3];
                if (
                    pathThree === 'doctorate' ||
                    pathThree === 'graduation' ||
                    pathThree === 'master' ||
                    pathThree === 'specialization'
                ) {
                    return 'course_' + pathThree;
                }
            }

            var pathTwo = hash.split('/')[2];

            if (pathTwo === ':typeNews') {
                pathTwo = $location.path().split('/')[2];
                if (
                    pathTwo === 'news_agencia_de_agencia' ||
                    pathTwo === 'news_fique_atento' ||
                    pathTwo === 'news_tv' ||
                    pathTwo === 'news_radio'
                ) {
                    return pathTwo;
                }
            }

            var pathOne = hash.split('/')[1];
            let pages = [
                'calendar', 'clipping', 'events', 'faq', 'gallery', 'tags', 'highlighted_press',
                'menu', 'page', 'periodical', 'release', 'user', 'radio_thumb',
                'radio_programming_grid', 'radio_programming', 'radio_genre', 'radio_category'];
            let idx = pages.indexOf(pathOne);
            if (idx !== -1) {
                return pathOne;
            }
            return;
        }

        function verifyPermission(event, next, current) {
            $rootScope.viewOnly = false;
            widgetButtonRemove(); //jshint ignore: line
            var hash = next.originalPath || $location.path();
            var module = getModule(hash);
            if (module) {
                var noHasPermissionModule = !PermissionService.hasPermission(module);
                var idModule = module ? getId(module) : false;
                if (module === 'periodical' && noHasPermissionModule) {
                    noHasPermissionModule = !PermissionService.hasPermission('editions');
                }
                $rootScope.moduleCurrent = module;
                $log.info('MODULE', module);
                $log.info('MODULE ID', idModule);
                $log.info('MODULE PERMISSION', !noHasPermissionModule);

                if (noPermissionAction(event, current, noHasPermissionModule)) {
                    return;
                }

                if (idModule) {
                    var noHasPermissionId = !PermissionService.hasPermissionId(module, idModule);
                    if (noPermissionAction(event, current, noHasPermissionId)) {
                        console.log('ROLE ACCESS');
                        return;
                    }
                }

                var action = getActionModule();
                var idAction = action ? getId(action) : false;
                $log.info('ACTION', action);
                $log.info('ACTION ID', idAction);
                var noHasPermissionCustom;
                if (action && action === 'new') {
                    noHasPermissionCustom = !PermissionService.canPost(module, idAction);
                } else if (action && action === 'edit') {
                    if (module === 'editions') {
                        noHasPermissionCustom = !PermissionService.canPut(module, idModule);
                    } else if(module === 'page') {
                        noHasPermissionCustom = false;
                    } else {
                        noHasPermissionCustom = !PermissionService.canPut(module, idAction);
                    }
                } else if (action && action === 'view') {
                    noHasPermissionCustom = !PermissionService.canGet(module, idAction);
                    $rootScope.viewOnly = true;
                    NotificationService.warn('Você não tem permissão para editar e executar ações.', 'Acesso negado');
                }
                if (noHasPermissionCustom) {
                    $log.info('ACTION PERMISSION', !noHasPermissionCustom);
                    noPermissionAction(event, current, noHasPermissionCustom);
                }
            }
        }

        function noPermissionAction(event, current, noPermission) {
            if (sessionService.getIsLogged() && noPermission) {
                NotificationService.warn('ATENÇÃO', 'Você não possui acesso a está página.');
                if (current) {
                    event.preventDefault();
                } else {
                    $location.path('/');
                }
                return true;
            }
            return false;
        }

        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            if (!sessionService.getIsLogged()) {
                $location.path('/login');
                return;
            }
            if ($rootScope.User) {
                verifyPermission(event, next, current);
                _checkTermUse();
            }
            $rootScope.$on('PERMISSION_ROUTER', function () {
                verifyPermission(event, next, current);
                _checkTermUse();
            });
        });

        $rootScope.$on('AuthenticateResponseError', function () {
            if ($location.path() !== '/login' && $rootScope.modalLoginIsDisabled) {
                $log.info('Erro 401 Request auth');
                get(true);
            }
        });

        $rootScope.$on('Error403', function () {
            if ($location.path() !== '/login') {
                ModalService.dialog('Acesso negado', 'Você não tem permissão para executar esta ação');
            }
        });

        $rootScope.$on('Error5xx', function (data, response) {
            let dataModal = {
                title: 'Servidor com problemas',
                text: 'Erro interno no servidor, por favor tente mais tarde',
                detail: response.detail
            };
            ModalService.dialogErrorDetails(dataModal);
        });

        $rootScope.$on('ErrorUnknown', function () {
            ModalService.dialog('Erro desconhecido', 'Erro ao acessar o servidor, por favor tente mais tarde');
        });

        getAuth();
    }
})();
