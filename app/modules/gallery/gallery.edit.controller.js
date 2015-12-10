;(function () {
  'use strict';

  angular.module('galleryModule')
    .controller('GalleryEditController', GalleryEditController);

  GalleryEditController.$inject = [
    '$scope',
    '$uibModal',
    '$location',
    '$routeParams',
    'StatusService',
    'GalleryService',
    'MediaService',
    'NotificationService'
  ];

  function GalleryEditController($scope,
                                 $uibModal,
                                 $location,
                                 $routeParams,
                                 StatusService,
                                 GalleryService,
                                 MediaService,
                                 NotificationService) {
    console.log('... GalleryEditController');

    $scope.status = [];
    $scope.categories = [];

    GalleryService.getGallery(parseInt($routeParams.id)).then(function (data) {
      $scope.gallery = data.data;
      $scope.gallery.category = '' + data.data.category.id + '';
    });

    GalleryService.getCategories().then(function (data) {
      $scope.categories = data.data;
    });

    StatusService.getStatus().then(function (data) {
      $scope.status = data.data;
    });

    $scope.$watch('add_photos', function () {
      if ($scope.add_photos) {
        angular.forEach($scope.add_photos, function (file, idx) {
          MediaService.newFile(file).then(function (data) {
            var _file = {
              file: {
                url: data.url,
                id: data.id
              }
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

    $scope.publish = function (gallery) {
      var _photos = [];
      console.log(gallery);

      angular.forEach(gallery.photos, function (photo) {

        _photos.push({id: photo.file.id});
      });

      var obj = {
        title: gallery.title,
        category: parseInt(gallery.category),
        photos: _photos,
        status: gallery.status
      };

      GalleryService.updateGallery(gallery.id, obj).then(function (data) {
        NotificationService.success('Galeria atualizada com sucesso!');
        $location.path('/galleries');
      });
    };

    var removeConfirmationModal, EditPhotosModal;

    $scope.confirmationModal = function (size, title) {
      removeConfirmationModal = $uibModal.open({
        templateUrl: '/components/modal/confirmation.modal.template.html',
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

    var ConfirmationModalCtrl = function ($scope, $uibModalInstance, title) {
      $scope.modal_title = title;
      $scope.ok = function () {
        $uibModalInstance.close();
      };
      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    };

    $scope.removePhoto = function (id) {
      console.log($scope.gallery.photos, id);
      var idx = _.findIndex($scope.gallery.photos, function(files){
        return files.file.id == id ? id : '';
      });

      $scope.confirmationModal('md', 'Você deseja remover esta imagem da galeria?');
      removeConfirmationModal.result.then(function (data) {
        $scope.gallery.photos.splice(idx, 1);
      });
    };

    $scope.confirmationModal = function (size, title) {
      removeConfirmationModal = $uibModal.open({
        templateUrl: '/components/modal/confirmation.modal.template.html',
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

    $scope.editPhotos = function () {
      EditPhotosModal = $uibModal.open({
        templateUrl: '/components/modal/photos-edit.modal.template.html',
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
        angular.forEach(data, function (files) {
          var obj = {
            title: files.file.title ? files.file.title : '',
            description: files.file.description ? files.file.description : '',
            altText: files.file.alt_text ? files.file.alt_text : '',
            legend: files.file.legend ? files.file.legend : ''
          };

            MediaService.updateFile(files.file.id, obj);
        });

        NotificationService.success('Ediçao realizada com sucesso!');
      });
    };

    var EditPhotosModalCtrl = function ($scope, $uibModalInstance, photos, NotificationService) {
      $scope.photos = photos;

      $scope.currentPhotoIdx = photos.length - 1;
      $scope.currentPhoto = $scope.photos[$scope.currentPhotoIdx];
      console.log($scope.currentPhoto);
      console.log($scope.photos);

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
        $scope.photos.pop();
        $uibModalInstance.dismiss();
      };
    };

    var MediaLibraryModal;

    $scope.openMediaLibrary = function () {
      MediaLibraryModal = $uibModal.open({
        templateUrl: '/components/modal/media-library.modal.template.html',
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
