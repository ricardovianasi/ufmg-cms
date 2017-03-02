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
                            .then(function (res) {
                                NotificationService.success('Senha atualizado com sucesso!');
                            });
                    }
                }

                onInit();
            }
        }

        return {
            MODAL_SMALL: 'sm',
            MODAL_MEDIUM: 'md',
            MODAL_LARGE: 'lg',
            confirm: _confirm,
            uploadImage: _uploadImage,
            uploadAudio: _uploadAudio,
            uploadFiles: _uploadFiles,
            changePassword: _changePassword
        };
    }
})();
