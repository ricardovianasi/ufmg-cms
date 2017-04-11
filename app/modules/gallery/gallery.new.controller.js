(function () {
    'use strict';

    angular.module('galleryModule')
        .controller('GalleryNewController', GalleryNewController);

    /** ngInject */
    function GalleryNewController($scope,
        $location,
        $uibModal,
        StatusService,
        VIEWER,
        GalleryService,
        MediaService,
        NotificationService,
        PermissionService,
        $rootScope,
        Util,
        $log) {
        $rootScope.shownavbar = true;
        $log.info('GaleriasNovoController');

        $scope.categories = [];
        $scope.gallery = {};


        GalleryService.getCategories().then(function (res) {
            $scope.categories = res.data.items;
            $scope.canPermission = !VIEWER ? VIEWER : PermissionService.canPost('gallery');
             
        });

        $scope.gallery.title = '';
        $scope.gallery.category = '';
        $scope.gallery.photos = [];

        var EditPhotosModal;
        var removeConfirmationModal;

        $scope.editPhotos = function () {
            EditPhotosModal = $uibModal.open({
                templateUrl: 'components/modal/photos-edit.modal.template.html',
                controller: EditPhotosModalCtrl,
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    photos: function () {
                        return $scope.gallery.photos;
                    }
                }
            });

            EditPhotosModal.result.then(function (data) {
                angular.forEach(data, function (file) {
                    var obj = {
                        title: file.title ? file.title : '',
                        description: file.description ? file.description : '',
                        altText: file.alt_text ? file.alt_text : '',
                        legend: file.legend ? file.legend : ''
                    };

                    MediaService.updateFile(file.id, obj);
                });
            });
        };

        $scope.$watch('add_photos', function () {
            if ($scope.add_photos) {
                angular.forEach($scope.add_photos, function (file, idx) {
                    MediaService.newFile(file).then(function (data) {
                        var _file = {
                            url: data.url,
                            id: data.id
                        };

                        $scope.gallery.photos.push(_file);
                        NotificationService.success('"' + data.title + '"' + ' enviado para Biblioteca de Mídia.');
                    });

                    if (idx + 1 == $scope.add_photos.length) {
                        setTimeout(function () {
                            $scope.editPhotos();
                        }, 250);
                    }
                });
            }
        });

        $scope.removePhoto = function (id) {
            var idx = _.findIndex($scope.gallery.photos, {
                id: id
            });

            $scope.confirmationModal('md', 'Você deseja remover esta imagem da galeria?');
            removeConfirmationModal.result.then(function (data) {
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

        var EditPhotosModalCtrl = function ($scope, $uibModalInstance, photos) {
            $scope.photos = photos;

            $scope.currentPhoto = $scope.photos[0];
            $scope.currentPhotoIdx = 0;

            $scope.nextPhoto = function (index) {
                // não é o último
                if (index != $scope.photos.length - 1) {
                    $scope.currentPhoto = $scope.photos[index + 1];
                    $scope.currentPhotoIdx = index + 1;
                    setTimeout(function () {
                        $scope.$apply();
                    });
                }
            };

            $scope.previousPhoto = function (index) {
                if (index !== 0) {
                    $scope.currentPhoto = $scope.photos[index - 1];
                    $scope.currentPhotoIdx = index - 1;
                    setTimeout(function () {
                        $scope.$apply();
                    });
                }
            };

            $scope.ok = function () {
                $uibModalInstance.close($scope.photos);
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss();
            };
        };

        var ConfirmationModalCtrl = function ($scope, $uibModalInstance, title) {
            $scope.modal_title = title;

            $scope.ok = function () {
                $uibModalInstance.close();
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        };

        $scope.publish = function (gallery) {
            var _photos = [];

            angular.forEach($scope.gallery.photos, function (photo) {
                _photos.push(photo.file.id);
            });

            var obj = {
                title: $scope.gallery.title,
                category: parseInt($scope.gallery.category),
                photos: _photos
            };

            GalleryService.newGallery(obj).then(function (data) {
                $location.path('/galleries');
            });
        };

        $scope.uploadImage = function () {
            var uploadImageModal = $uibModal.open({
                templateUrl: 'components/modal/upload-component.template.html',
                controller: 'UploadComponentController as vm',
                backdrop: 'static',
                size: 'xl',
                resolve: {
                    formats: function () {
                        return ['galleryImage'];
                    }
                }
            });

            // Insert into textarea
            uploadImageModal.result.then(function (data) {

                data.author = {
                    name: data.author
                };

                var obj = {
                    file: data
                };

                $scope.gallery.photos.push(obj);
            });
        };
    }
})();
