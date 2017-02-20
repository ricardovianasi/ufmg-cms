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
        $location,
        $log,
        $rootScope,
        validationService) {
        $log.info('featuredNewController');
        $rootScope.shownavbar = true;

        var vm = this; // jshint ignore:line
        vm.removeImage = _removeImage;
        vm.addSpecialist = _addSpecialist;
        vm.removeSpecialist = _removeSpecialist;
        vm.saveFeatured = _saveFeatured;
        vm.featured = {};
        vm.releases = {};
        vm.saveEspecialist = _saveEspecialist;
        vm.canPermission = PermissionService.canPost('highlighted_press');

        // Cover Image - Upload
        $scope.$watch('vm.featured.photo', function () {
            _upload(vm.featured.photo);
        });

        ReleasesService.getReleases().then(function (data) {
            vm.releases = data.data;
        });

        function _upload(file) {
            MediaService.newFile(file).then(function (data) {
                vm.featured.photo = {
                    url: data.url,
                    id: data.id
                };
            });
        }

        /**
         * remove image function
         */
        function _removeImage() {
            $timeout(function () {
                vm.featured.photo = '';
                $scope.$apply();
            });
        }

        /**
         *
         * add specialists function
         */
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
                $scope.$apply();
            });
        }

        /**
         * _removeSpecialist function
         */
        function _removeSpecialist(idx) {
            vm.featured.specialists.splice(idx, 1);
        }

        /**
         * _saveFeatured function
         */
        function _saveFeatured() {
            if (!validationService.isValid($scope.formFeatured.$invalid))
                return false;

            if (!vm.featured.photo) {
                validationService.isValid(true);
                return false;
            }

            _parseToSave();
            featuredService.save(vm.featured).then(function (res) {
                NotificationService.success('Destaque salvo com sucesso!');
                $location.path('/featured');
            });
        }

        function _parseToSave() {
            vm.featured.photo = vm.featured.photo.id;
            // vm.featured.releases = vm.featured.releases.id;
        }

        function _saveEspecialist(index) {
            if (!validationService.isValid($scope.formEspecialist.$invalid)) {
                return false;
            }

            vm.featured.specialists[index].opened = false;
        }
    }
})();
