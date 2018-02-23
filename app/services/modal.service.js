(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('ModalService', ModalService);

    /** ngInject */
    function ModalService($uibModal) {

        function openModal(templateUrl, controller, resolve, size, backdrop) {
            return $uibModal.open({
                templateUrl: templateUrl,
                controller: controller,
                backdrop: backdrop || 'static',
                size: size || 'md',
                resolve: resolve
            });
        }

        function inputModal(title, label, value, size, options) {
            size = size || ModalService.MODAL_MEDIUM;
            return $uibModal.open({
                templateUrl: 'components/modal/input.modal.template.html',
                controller: InputModalCtrl,
                backdrop: 'static',
                size: size,
                resolve: {
                    title: function () { return title; },
                    label: function () { return label; },
                    value: function () { return value; },
                    options: function () { return options; }
                }
            });
            
            function InputModalCtrl($scope, $uibModalInstance, NotificationService, title, label, value, options) {
                let vm = $scope;
                vm.title = title;
                vm.label = label;
                vm.value = value;
                vm.options = options || { };

                vm.confirm = function() {
                    if(options.required && !vm.value) {
                        NotificationService.warning('O campo ' + label + ' é obrigatório.');
                    } else {
                        $uibModalInstance.close(vm.value);
                    }
                };

                vm.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }
        }

        function dialog(title, text, size) {
            size = size || ModalService.MODAL_MEDIUM;

            return $uibModal.open({
                templateUrl: 'components/modal/dialog.modal.template.html',
                controller: DialogCtrl,
                backdrop: 'static',
                size: size,
                resolve: {
                    title: function () {
                        return title;
                    },
                    text: function () {
                        return text;
                    }
                }
            });

            function DialogCtrl($scope, $uibModalInstance, title, text) {

                $scope.title = title;
                $scope.text = text;

                $scope.confirm = function () {
                    $uibModalInstance.close();
                };
            }
        }

        function confirm(title, size, options) {
            size = size || ModalService.MODAL_MEDIUM;

            var ConfirmationModalController = function ($scope, $uibModalInstance, title, options) {
                $scope.modal_title = title;
                $scope.options = options;

                $scope.ok = function () {
                    $uibModalInstance.close();
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };

            return $uibModal.open({
                templateUrl: 'components/modal/confirmation.modal.template.html',
                controller: ConfirmationModalController,
                backdrop: 'static',
                size: size,
                resolve: {
                    title: function () {
                        return title;
                    },
                    options: function() {
                        return options;
                    }
                }
            });
        }

        var _uploadImage = function (resolve) {
            resolve = angular.extend({
                formats: function () {
                    return null;
                }
            }, resolve);

            return $uibModal.open({
                templateUrl: 'components/modal/upload-component.template.html',
                controller: 'UploadComponentController as vm',
                backdrop: 'static',
                size: 'xl',
                resolve: resolve
            });
        };

        var _uploadAudio = function () {
            return $uibModal.open({
                templateUrl: 'components/modal/audio-upload-component.template.html',
                controller: 'AudioUploadComponentController as vm',
                backdrop: 'static',
                size: 'xl'
            });
        };

        var _uploadFiles = function () {
            return $uibModal.open({
                templateUrl: 'components/modal/file-upload-component.template.html',
                controller: 'FileUploadComponentController as vm',
                backdrop: 'static',
                size: 'xl'
            });
        };

        function _loginChangePassword() {
            _changePassword(true);
        }

        function _changePassword(isLogin) {
            return $uibModal.open({
                templateUrl: 'components/modal/message-password-change.template.html',
                controller: changePasswordController,
                backdrop: false,
                keyboard: false,
                size: 'md'
            });

            function changePasswordController(accountService, $scope, $uibModalInstance, authService, $log, NotificationService) {
                var vm = $scope;
                vm.save = save;
                vm.cancel = cancel;
                vm.password = '';
                vm.passwordCheck = '';
                vm.isLogin = isLogin;
                var user = {};

                function onInit() {
                    $log.info('changePasswordController');
                    authService.account()
                        .then(function (res) {
                            user = res.data;
                        });
                }

                function cancel() {
                    $uibModalInstance.dismiss('cancel');
                }

                function save(isValid) {
                    if (isValid) {
                        var data = {
                            password: vm.password,
                        };
                        accountService
                            .edit(data, user.id)
                            .then(function () {
                                NotificationService.success('Senha atualizado com sucesso!');
                                $uibModalInstance.dismiss('close');
                            });
                    }
                }
                onInit();
            }
        }

        function _login() {
            return $uibModal.open({
                templateUrl: 'components/modal/login.modal.template.html',
                controller: LoginModalController,
                controllerAs: 'vm',
                backdrop: false,
                keyboard: false,
                size: 'md'
            });

            function LoginModalController(
                $log,
                NotificationService,
                $rootScope,
                sessionService,
                authService,
                PermissionService,
                ENV,
                $uibModalInstance
            ) {
                var vm = this;
                $log.info('LoginModalController');
                vm.ENV = ENV;
                vm.desenvMode = (ENV === 'development' || ENV === 'test');
                vm.credentials = {};
                vm.rememberMe = false;
                vm.login = _login;

                $rootScope.$uibModalInstance = $uibModalInstance;

                if (vm.desenvMode) {
                    vm.credentials.username = 'portal@portal';
                    vm.credentials.password = '12345';
                }

                function _login(isValid) {
                    if (isValid) {
                        authService
                            .autenticate(vm.credentials)
                            .then(function (res) {
                                sessionService.saveData(res.data, vm.rememberMe);
                                authService
                                    .get()
                                    .then(function (res1) {
                                        var dataUser = res1;
                                        var user = dataUser.data;
                                        if (user.status) {
                                            $rootScope.dataUser = dataUser;
                                            PermissionService.initService(user);
                                            sessionService.setIsLogged();
                                            changePassword(user);
                                            $rootScope.modalLoginIsDisabled = true;
                                            $uibModalInstance.close();
                                        } else {
                                            NotificationService.error('Usuário desativado, entrar em contato com CEDECOM/WEB');
                                        }
                                    });
                            }, function (err) {
                                NotificationService.error('Usuário ou senha inválidos, tente novamente.');
                                vm.credentials.password = '';
                                $log.error(err);
                            });
                    }
                }

                function changePassword(user) {
                    if (user.required_password_change) {
                        _changePassword();
                    }
                }
            }
        }

        return {
            MODAL_SMALL: 'sm',
            MODAL_MEDIUM: 'md',
            MODAL_LARGE: 'lg',
            FULL_SCREEN: 'full',
            openModal: openModal,
            inputModal: inputModal,
            confirm: confirm,
            dialog: dialog,
            uploadImage: _uploadImage,
            uploadAudio: _uploadAudio,
            uploadFiles: _uploadFiles,
            changePassword: _changePassword,
            loginChangePassword: _loginChangePassword,
            login: _login
        };
    }
})();
