(function () {
    'use strict';


    angular
        .module('featuredModule')
        .controller('featuredEditController', featuredEditController);

    /** ngInject */
    function featuredEditController(
        $scope,
        ReleasesService,
        PermissionService,
        MediaService,
        ManagerFileService,
        featuredService,
        $timeout,
        NotificationService,
        $location,
        $routeParams,
        $log
    ) {
        $log.info('featuredEditController');

        var vm = $scope;
        vm.removeImage = _removeImage;
        vm.addSpecialist = _addSpecialist;
        vm.removeSpecialist = _removeSpecialist;
        vm.saveFeatured = _saveFeatured;
        vm.featured = {};
        vm.releases = {};
        var _updateFeatured = {};
        vm.upload = _upload;

        vm.canPermission = PermissionService.canPut('highlighted_press', $routeParams.id);
        featuredService.getFeatured($routeParams.id).then(function (res) {
            vm.featured = res.data;
        });

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
        }

        function _removeSpecialist(idx) {
            vm.featured.specialists.splice(idx, 1);
        }

        function _saveFeatured() {
            _parseToSave();

            featuredService.update(vm.featured.id, _updateFeatured).then(function () {
                NotificationService.success('Destaque alterado com sucesso!');
                $location.path('/highlighted_press');
            });
        }

        function _parseToSave() {
            _updateFeatured = {
                title: vm.featured.title,
                description: vm.featured.description,
                specialists: vm.featured.specialists,
                photo: vm.featured.photo.id,
                release: vm.featured.release.id
            };
        }
    }
})();
