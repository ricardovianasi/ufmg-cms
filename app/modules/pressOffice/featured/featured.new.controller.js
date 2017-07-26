(function () {
    'use strict';

    angular
        .module('featuredModule')
        .controller('featuredNewController', featuredNewController);

    /** ngInject */
    function featuredNewController($scope,
        PermissionService,
        ReleasesService,
        MediaService,
        featuredService,
        $timeout,
        NotificationService,
        ManagerFileService,
        $location,
        $log,
        $rootScope,
        validationService) {
        $log.info('featuredNewController');
        $rootScope.shownavbar = true;

        var vm = $scope;
        vm.removeImage = _removeImage;
        vm.addSpecialist = _addSpecialist;
        vm.removeSpecialist = _removeSpecialist;
        vm.saveFeatured = _saveFeatured;
        vm.featured = {};
        vm.releases = {};
        vm.saveEspecialist = _saveEspecialist;
        vm.canPermission = PermissionService.canPost('highlighted_press');
        vm.upload = _upload;

        ReleasesService.getReleases().then(function (data) {
            vm.releases = data.data;
        });

        function _upload() {
            ManagerFileService.imageFiles();
            ManagerFileService
                .open('digitalizedCover')
                .then(function (image) {
                    vm.featured.photo = {
                        url: image.url,
                        id: image.id
                    };
                });
        }

        function _removeImage() {
            $timeout(function () {
                vm.featured.photo = '';
                vm.$apply();
            });
        }

        function _addSpecialist() {
            if (vm.featured.specialists) {
                vm.featured.specialists.push({
                    name: '',
                    phone: '',
                    office: '',
                    email: '',
                    opened: true
                });
            } else {
                vm.featured.specialists = [];
                vm.featured.specialists.push({
                    name: '',
                    phone: '',
                    office: '',
                    email: '',
                    opened: true
                });
            }

            $timeout(function () {
                vm.$apply();
            });
        }

        function _removeSpecialist(idx) {
            vm.featured.specialists.splice(idx, 1);
        }

        function _saveFeatured() {
            if (!validationService.isValid(vm.formFeatured.$invalid)) {
                return false;
            }

            if (!vm.featured.photo) {
                validationService.isValid(true);
                return false;
            }

            _parseToSave();
            featuredService.save(vm.featured).then(function () {
                NotificationService.success('Destaque salvo com sucesso!');
                $location.path('/featured');
            });
        }

        function _parseToSave() {
            vm.featured.photo = vm.featured.photo.id;
            // vm.featured.releases = vm.featured.releases.id;
        }

        function _saveEspecialist(index) {
            if (!validationService.isValid(vm.formEspecialist.$invalid)) {
                return false;
            }
            vm.featured.specialists[index].opened = false;
        }
    }
})();
