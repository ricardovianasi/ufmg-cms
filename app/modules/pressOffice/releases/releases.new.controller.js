(function () {
    'use strict';

    angular.module('releasesModule')
        .controller('ReleasesNewController', ReleasesNewController);

    /** ngInject */
    function ReleasesNewController(
        $scope,
        $timeout,
        $location,
        $uibModal,
        ReleasesService,
        MediaService,
        ManagerFileService,
        NotificationService,
        StatusService,
        DateTimeHelper,
        PermissionService,
        validationService
    ) {
        var vm = $scope;
        var removeConfirmationModal = {};
        var confirmationModal = _confirmationModal;
        var ConfirmationModalCtrl = _ConfirmationModalCtrl;

        vm.upload = _upload;

        vm.title = 'Novo Release';
        vm.breadcrumb = vm.title;
        vm.release = {
            status: StatusService.STATUS_PUBLISHED,
            source: {},
            service: {},
            files: []
        };

        vm.redactorOptions = {
            plugins: false,
        };

        // Time and Date
        vm.time_days = DateTimeHelper.getDays();
        vm.time_months = DateTimeHelper.getMonths();
        vm.time_years = ['2015', '2016', '2017'];
        vm.time_hours = DateTimeHelper.getHours();
        vm.time_minutes = DateTimeHelper.getMinutes();

        vm.addFile = _addFile;

        function _addFile(idx) {
            ManagerFileService.allFiles();
            ManagerFileService
                .open('free')
                .then(function (file) {
                    vm.release.files[idx] = file;
                    vm.release.files[idx].external_url = file.url;
                    vm.release.files[idx].file = file.url;
                    vm.release.files[idx].title = file.legend;
                    vm.release.files[idx].isFile = true;
                });
        }

        var _addWatcher = function (idx) {

            var watchee = 'release.files[' + idx + '].file';

            vm.$watch(watchee, function () {
                if (vm.release.files[idx].file && vm.release.files[idx].file instanceof File) {
                    vm.release.files[idx].external_url = '';
                    vm.fileHandler.uploadFile(idx, [
                        vm.release.files[idx].file
                    ]);
                }
            });
        };

        /**
         * Handle img upload
         */
        vm.imgHandler = {
            upload: function (elem, files) {
                angular.forEach(files, function (file) {
                    MediaService.newFile(file).then(function (data) {
                        var x = 0;
                        var y = 0;
                        var width = data.width;
                        var height = data.height;

                        if (data.width !== data.height) {
                            x = (data.width / 2) - (256 / 2);
                            y = (data.height / 2) - (256 / 2);
                            width = 256;
                            height = 256;
                        }

                        var obj = {
                            x: x,
                            y: y,
                            width: width,
                            height: height,
                            resize_width: 256,
                            resize_height: 256,
                        };

                        MediaService.cropImage(data.id, obj).then(function (data) {
                            var resp = data.data;

                            vm.release[elem] = {
                                url: resp.url,
                                id: resp.id
                            };
                        });
                    });
                });
            },
            removeImage: function (elem) {
                $timeout(function () {
                    vm.release[elem] = '';
                    vm.$apply();
                });
            }
        };

        vm.fileHandler = {
            addItem: function () {
                var idx = vm.release.files.push({
                    external_url: '',
                    file: '',
                    opened: true,
                    isFile: true
                });
                idx = idx - 1;

                _addWatcher(idx);
            },
            removeItem: function (idx) {
                if (vm.release.files[idx].external_url !== '' || vm.release.files[idx].file !== '') {
                    confirmationModal('md', 'Você deseja excluir este arquivo?');

                    removeConfirmationModal.result.then(function () {
                        vm.release.files.splice(idx, 1);
                    });

                    return;
                }

                vm.release.files.splice(idx, 1);
            },
            saveItem: function (idx) {
                vm.release.files[idx].opened = false;
            },
            uploadFile: function (idx, files) {
                angular.forEach(files, function (file) {
                    MediaService.newFile(file).then(function (data) {
                        vm.release.files[idx].file = data.url;
                        vm.release.files[idx].id = data.id;
                    });
                });
            },
            removeFile: function (idx) {
                $timeout(function () {
                    delete vm.release.files[idx].id;

                    vm.release.files[idx].file = '';
                    vm.$apply();
                });
            }
        };

        function _confirmationModal(size, title) {
            removeConfirmationModal = $uibModal.open({
                templateUrl: 'components/modal/confirmation.modal.template.html',
                controller: ConfirmationModalCtrl,
                backdrop: 'static',
                size: size,
                resolve: {
                    title: function () {
                        return title;
                    }
                }
            });
        }

        function _ConfirmationModalCtrl($scope, $uibModalInstance, title) {
            vm.modal_title = title;

            vm.ok = function () {
                $uibModalInstance.close();
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }

        function _upload() {
            ManagerFileService
                .imageFiles()
                .open(['logo', 'free'])
                .then(function (image) {
                    vm.release.thumb = {
                        url: image.url,
                        id: image.id
                    };
                });
        }

        vm.publish = function (data) {
            if (!validationService.isValid(vm.formData.$invalid)) {
                return false;
            }
            vm.isLoading = true;
            ReleasesService
                .store(data)
                .then(function (release) {
                    NotificationService.success('Release criado com sucesso.');
                    $location.path('/release/edit/' + release.data.id);
                }).catch(console.error)
                .then(function () {
                    vm.isLoading = false;
                });
        };

        vm.removeReleasesFiles = function (idx) {
            vm.release.files[idx].file = '';
        };
    }
})();
