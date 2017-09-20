(function () {
    'use strict';

    angular.module('releasesModule')
        .controller('ReleasesEditController', ReleasesEditController);

    /** ngInject */
    function ReleasesEditController(
        $scope,
        $timeout,
        $location,
        $routeParams,
        $filter,
        $uibModal,
        $window,
        ReleasesService,
        MediaService,
        NotificationService,
        ManagerFileService,
        DateTimeHelper,
        $rootScope,
        PermissionService,
        $log,
        validationService
    ) {
        $log.info('ReleasesEditController');
        var vm = $scope;
        var removeConfirmationModal = {};
        var ConfirmationModalCtrl = _ConfirmationModalCtrl;
        var confirmationModal = _confirmationModal;

        vm.upload = _upload;

        vm.title = 'Editar Release: ';
        vm.breadcrumb = vm.title;
        vm.release = {};

        // Time and Date
        vm.time_days = DateTimeHelper.getDays();
        vm.time_months = DateTimeHelper.getMonths();
        vm.time_years = DateTimeHelper.yearRange(5);
        vm.time_hours = DateTimeHelper.getHours();
        vm.time_minutes = DateTimeHelper.getMinutes();

        vm.redactorOptions = {
            plugins: false,
        };

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

        vm.removeReleasesFiles = function (idx) {
            vm.release.files[idx].file = '';
        };

        var _addWatcher = function (idx) {
            var watchee = $filter('format')('release.files[{0}].file', idx);

            vm.$watch(watchee, function () {
                if (vm.release.files[idx] && vm.release.files[idx].file instanceof File) {
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
                            resize_height: 256
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
                    url: '',
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

        vm.publish = function (data, preview) {
            if (!validationService.isValid(vm.formData.$invalid)) {
                return false;
            }

            ReleasesService.update(data, $routeParams.id).then(function (release) {
                NotificationService.success('Release salvo com sucesso.');

                if (!preview) {
                    $location.path('/release');
                } else {
                    $window.open(release.data.release_url);
                }
            });
        };

        vm.remove = function () {
            confirmationModal('md', 'Você deseja excluir este release?');

            removeConfirmationModal.result.then(function () {
                ReleasesService.destroy($routeParams.id).then(function () {
                    NotificationService.success('Release removido com sucesso.');
                    $location.path('/release');
                });
            });
        };

        ReleasesService.getRelease($routeParams.id).then(function (data) {
            var release = data.data;
            release.authorName = release.author_name;

            var files = [];

            angular.forEach(release.files, function (file) {
                var fl = {
                    external_url: file.external_url,
                    file: '',
                    isFile: false,
                    type: 'video',
                    title: file.title
                };

                if (file.file !== null) {
                    fl.id = file.file.id;
                    fl.file = file.file.url;
                    fl.isFile = true;
                    fl.type = file.file.type;
                    fl.thumb = file.file.thumb;
                    fl.title = file.file.legend;
                }

                files.push(fl);
            });

            release.files = files;

            delete release.author;
            delete release.author_name;

            release.scheduled_date = moment(data.data.post_date, 'YYYY-DD-MM').format('DD/MM/YYYY');
            release.scheduled_time = moment(data.data.post_date, 'YYYY-DD-MM hh:mm').format('hh:mm');

            vm.release = release;
            vm.title = vm.title + release.name;
            vm.breadcrumb = vm.title;

            angular.forEach('vm.release.files', function (value, key) {
                _addWatcher(key);
            });

            $timeout(function () {
                var html = $.parseHTML(vm.release.content);
                $('#redactor-only').append(html);
            }, 300);

        });
    }

})();
