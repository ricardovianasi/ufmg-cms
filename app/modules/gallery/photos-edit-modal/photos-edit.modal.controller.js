(function() {
    'use strict';

    angular
        .module('galleryModule')
        .controller('PhotosEditModalController', PhotosEditModalController);

        /** ngInject */
    function PhotosEditModalController($scope, $uibModalInstance, photos, NotificationService, index) {
        var vm = this;
        
        vm.nextPhoto = nextPhoto;
        vm.previousPhoto = previousPhoto;
        vm.ok = ok;
        vm.cancel = cancel;

        activate();

        ////////////////

        function nextPhoto(index) {
            // não é o último
            if (index !== vm.photos.length - 1) {
                vm.currentPhoto = vm.photos[index + 1];
                vm.currentPhotoIdx = index + 1;
                setTimeout(function () {
                    $scope.$apply();
                }, 0);
            }
        }

        function previousPhoto(index) {
            if (index !== 0) {
                vm.currentPhoto = vm.photos[index - 1];
                vm.currentPhotoIdx = index - 1;
                setTimeout(function () {
                    $scope.$apply();
                });
            }
        }

        function ok() {
            $uibModalInstance.close(vm.photos);
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }

        function _initVariables() {
            vm.photos = photos;
            vm.currentPhotoIdx = index;
            vm.currentPhoto = vm.photos[vm.currentPhotoIdx];
        }

        function activate() {
            _initVariables()
        }
    }
})();