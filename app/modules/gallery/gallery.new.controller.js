;(function () {
  'use strict';

  angular.module('galleryModule')
    .controller('GalleryNewController', GalleryNewController);

  GalleryNewController.$inject = [
    '$scope',
    '$location',
    '$uibModal',
    'StatusService',
    'GalleryService',
    'MediaService',
    'NotificationService',
    '$rootScope'
  ];

  function GalleryNewController($scope,
                                $location,
                                $uibModal,
                                StatusService,
                                GalleryService,
                                MediaService,
                                NotificationService,
                                $rootScope) {
    $rootScope.shownavbar = true;
    console.log('... GaleriasNovoController');

    $scope.status = [];
    $scope.categories = [];
    $scope.gallery = {};

    StatusService.getStatus().then(function (data) {
      $scope.status = data.data;
    });

    GalleryService.getCategories().then(function (data) {
      $scope.categories = data.data;
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
      var idx = _.findIndex($scope.gallery.photos, {id: id});

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

      angular.forEach(gallery.photos, function (photo) {
        _photos.push({id: photo.id});
      });

      var obj = {
        title: gallery.title,
        category: parseInt(gallery.category),
        photos: _photos,
        status: gallery.status
      };

      GalleryService.newGallery(obj).then(function (data) {
        $location.path('/galleries');
      });
    };

    var MediaLibraryModal;

    $scope.openMediaLibrary = function () {
      MediaLibraryModal = $uibModal.open({
        templateUrl: 'components/modal/media-library.modal.template.html',
        controller: MediaLibraryModalCtrl,
        backdrop: 'static',
        size: 'lg'
      });

      MediaLibraryModal.result.then(function (data) {
        angular.forEach(data, function (file) {
          var _file = {
            url: file.url,
            id: file.id
          };

          $scope.gallery.photos.push(_file);
        });
      });
    };

    var MediaLibraryModalCtrl = function ($scope, $uibModalInstance, MediaService) {
      $scope.media = [];
      MediaService.getMedia().then(function (data) {
        $scope.media = data.data;
      });

      $scope.ok = function () {
        var selectedPhotos = _.filter($scope.media, function (file) {
          return file.selected === true;
        });

        $uibModalInstance.close(selectedPhotos);
      };
      $scope.cancel = function () {
        $uibModalInstance.dismiss();
      };
    };

    $scope.sortableOptions = {
      containment: '#gallery-list'//optional param.
    };
  }
})();
