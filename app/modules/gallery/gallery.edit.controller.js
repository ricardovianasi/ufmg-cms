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
          ManagerFileService,
          $rootScope,
          $log,
          Util,
          VIEWER,
          PermissionService) {
          $rootScope.shownavbar = true;
          $log.info('GalleryEditController');

          $scope.categories = [];
          var ConfirmationModalCtrl = _ConfirmationModalCtrl;
          var EditPhotosModalCtrl = _EditPhotosModalCtrl;


          GalleryService.getGallery(parseInt($routeParams.id)).then(function (data) {
              $scope.canPermission = !VIEWER ? VIEWER : PermissionService.canPut('gallery', $routeParams.id);
              $scope.gallery = data.data;
              $scope.gallery.category = '' + data.data.category.id + '';
          });

          GalleryService.getCategories().then(function (res) {
              $scope.categories = res.data.items;
          });

          $scope.publish = function () {
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

              GalleryService.updateGallery($scope.gallery.id, obj).then(function () {
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
              var idx = _.findIndex($scope.gallery.photos, function (files) { // jshint ignore: line
                  return files.file.id === id ? id : '';
              });

              $scope.confirmationModal('md', 'Você deseja remover esta imagem da galeria?');
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
                            author_name: files.file.author_name ? files.file.author_name : '',
                            description: files.file.description ? files.file.description : '',
                            altText: files.file.alt_text ? files.file.alt_text : '',
                            legend: files.file.legend ? files.file.legend : ''
                        };

                        MediaService.updateFile(files.file.id, obj);
                  });

                  NotificationService.success('Ediçao realizada com sucesso!');
              });
          };

          function _EditPhotosModalCtrl($scope, $uibModalInstance, photos, NotificationService, index) {
              $scope.photos = photos;
              $scope.currentPhotoIdx = index;
              $scope.currentPhoto = $scope.photos[$scope.currentPhotoIdx];

              $scope.nextPhoto = function (index) {
                  // não é o último
                  if (index !== $scope.photos.length - 1) {
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
          }


          $scope.sortableOptions = {
              containment: '#gallery-list' //optional param.
          };

          $scope.remove = function (id) {
              $scope.confirmationModal('md', 'Tem certeza que deseja excluir a galeria ?');
              removeConfirmationModal.result.then(function () {
                  GalleryService.removeGallery(id).then(function () {
                      NotificationService.success('Galeria removida com sucesso.');
                      $location.path('/galleries');
                  });
              });
          };

          $scope.uploadImage = function () {
              ManagerFileService.imageFiles();
              ManagerFileService
                  .open('galleryImage')
                  .then(function (data) {
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
