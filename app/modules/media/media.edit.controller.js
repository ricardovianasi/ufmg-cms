(function () {
    'use strict';

    angular.module('mediaModule')
        .controller('MediaEditController', MediaEditController);

    /** ngInject */
    function MediaEditController(
        $scope,
        $uibModal,
        $log,
        $location,
        $document,
        $routeParams,
        $timeout,
        StatusService,
        MediaService
    ) {
        $log.info('GalleryEditController');
        var removeConfirmationModal = {};
        var EditPhotosModal = {};
        var EditPhotosModalCtrl = _EditPhotosModalCtrl;
        var ConfirmationModalCtrl = _ConfirmationModalCtrl;

        $scope.status = [];
        $scope.file = {};

        MediaService.getFile($routeParams.id).then(function (data) {
            $scope.file = data.data;
            $scope.file.url = data.data.url;
        });

        StatusService.getStatus().then(function (data) {
            $scope.status = data.data;
        });

        $scope.$watch('add_photos', function () {
            if ($scope.add_photos) {
                MediaService.newFile($scope.add_photos).then(function (data) {
                    $scope.file.url = data.url;
                    $scope.file.id = data.id;
                });
            }
        });

        $scope.publish = function (file) {
            var obj = {
                legend: file.legend ? file.legend : '',
                author_name: file.author_name ? file.author_name : ''
            };
            MediaService.updateFile(file.id, obj).then(function () {
                $location.path('/media');
            });
        };

        $scope.confirmationModal = function (size, title) {
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
        };

        function _ConfirmationModalCtrl($scope, $uibModalInstance, title) {
            $scope.modal_title = title;

            $scope.ok = function () {
                $uibModalInstance.close();
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }

        $scope.removePhoto = function (id) {
            var idx = _.findIndex($scope.gallery.photos, { // jshint ignore: line
                id: id
            });

            $scope.confirmationModal('md', 'Você deseja excluir esta foto?');
            removeConfirmationModal.result.then(function () {
                $scope.gallery.photos.splice(idx, 1);
            });
        };

        $scope.confirmationModal = function (size, title) {
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
        };

        $scope.editPhoto = function (id) {
            EditPhotosModal = $uibModal.open({
                templateUrl: 'components/modal/photos-edit.modal.template.html',
                controller: EditPhotosModalCtrl,
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    photos: function () {
                        return $scope.gallery.photos;
                    },
                    id: function () {
                        return id;
                    }
                }
            });

            EditPhotosModal.result.then(function (data) {
                $scope.gallery.photos = data;
            });
        };

        function _EditPhotosModalCtrl($scope, $uibModalInstance, photos, id) {
            $scope.photos = angular.copy(photos);

            var index = _.findIndex($scope.photos, { // jshint ignore: line
                id: id
            });

            $scope.currentPhoto = $scope.photos[index];

            $scope.ok = function () {
                $uibModalInstance.close($scope.photos);
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }

        $scope.removeMidia = function () {
            $timeout(function () {
                $scope.file.url = '';
                $scope.file.type = '';
                $scope.$apply();
            });
        };
    }
})();
