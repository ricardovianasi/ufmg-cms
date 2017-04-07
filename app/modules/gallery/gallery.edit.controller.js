  (function () {
      'use strict';

      angular.module('galleryModule')
          .controller('GalleryEditController', GalleryEditController);

      /** ngInject */
      function GalleryEditController($scope,
          $uibModal,
          $location,
          $routeParams,
          StatusService,
          GalleryService,
          MediaService,
          NotificationService,
          $rootScope,
          $log,
          Util,
          VIEWER,
          PermissionService) {
          $rootScope.shownavbar = true;
          $log.info('GalleryEditController');

          $scope.categories = [];

          Util.restoreOverflow();
          GalleryService.getGallery(parseInt($routeParams.id)).then(function (data) {
              $scope.canPermission = !VIEWER ? VIEWER : PermissionService.canPut('gallery', $routeParams.id);
              $scope.gallery = data.data;
              $scope.gallery.category = '' + data.data.category.id + '';
          });

          GalleryService.getCategories().then(function (data) {
              $scope.categories = data.data.items;
          });

          $scope.publish = function (gallery) {
              var _photos = [];

              angular.forEach($scope.gallery.photos, function (photo) {
                  _photos.push(photo.file.id);
              });

              var obj = {
                  title: $scope.gallery.title,
                  category: parseInt($scope.gallery.category),
                  photos: _photos,
                  status: $scope.gallery.status
              };

              GalleryService.updateGallery($scope.gallery.id, obj).then(function (data) {
                  NotificationService.success('Galeria atualizada com sucesso!');
                  $location.path('/galleries');
              });
          };

          var removeConfirmationModal, EditPhotosModal;

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
              var idx = _.findIndex($scope.gallery.photos, function (files) {
                  return files.file.id == id ? id : '';
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

          $scope.editPhotos = function (index) {
              EditPhotosModal = $uibModal.open({
                  templateUrl: 'components/modal/photos-edit.modal.template.html',
                  controller: EditPhotosModalCtrl,
                  backdrop: 'static',
                  size: 'lg',
                  resolve: {
                      photos: function () {
                          return $scope.gallery.photos;
                      },
                      index: function () {
                          return index;
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

          var EditPhotosModalCtrl = function ($scope, $uibModalInstance, photos, NotificationService, index) {
              $scope.photos = photos;
              $scope.currentPhotoIdx = index;
              $scope.currentPhoto = $scope.photos[$scope.currentPhotoIdx];

              $scope.nextPhoto = function (index) {
                  // não é o último
                  if (index != $scope.photos.length - 1) {
                      $scope.currentPhoto = $scope.photos[index + 1];
                      $scope.currentPhotoIdx = index + 1;
                      setTimeout(function () {
                          $scope.$apply();
                      }, 0);
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


          $scope.sortableOptions = {
              containment: '#gallery-list' //optional param.
          };

          $scope.remove = function (id) {
              $scope.confirmationModal('md', 'Tem certeza que deseja excluir a galeria ?');
              removeConfirmationModal.result.then(function (data) {
                  GalleryService.removeGallery(id).then(function (data) {
                      NotificationService.success('Galeria removida com sucesso.');
                      $location.path('/galleries');
                  });
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
