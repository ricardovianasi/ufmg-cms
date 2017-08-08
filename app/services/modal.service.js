(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('ModalService', ModalService);

    /** ngInject */
    function ModalService($uibModal) {
        function _confirm(title, size) {
            size = size || ModalService.MODAL_MEDIUM;

            var ConfirmationModalController = function ($scope, $uibModalInstance, title) {
                $scope.modal_title = title;

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

        function _changePassword() {
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
                        ModalService.changePassword();
                    }
                }
            }
        }

        return {
            MODAL_SMALL: 'sm',
            MODAL_MEDIUM: 'md',
            MODAL_LARGE: 'lg',
            FULL_SCREEN: 'full',
            confirm: _confirm,
            uploadImage: _uploadImage,
            uploadAudio: _uploadAudio,
            uploadFiles: _uploadFiles,
            changePassword: _changePassword,
            login: _login
        };
    }
})();
