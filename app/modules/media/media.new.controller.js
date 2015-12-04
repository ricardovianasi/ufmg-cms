;(function(){
  angular
    .module("mediaModule")
    .controller("MediaNewController", MediaNewController)

    MediaNewController.$inject = [
      "$scope",
      "$modal",
      "$location",
      "$routeParams",
      "StatusService",
      "UploadService",
      "MediaService",
      "Upload"];

    function MediaNewController($scope, $modal, $location, $routeParams, StatusService, UploadService, MediaService, Upload) {
      console.log('... GalleryEditController');

      $scope.status = [];
      $scope.file = {};

      // MediaService.getFile($routeParams.id).then(function(data){
      //     $scope.file = data.data;
      // });

      StatusService.getStatus().then(function(data){
          $scope.status = data.data;
      });

      $scope.$watch('add_photos', function () {
          if ($scope.add_photos) {
              MediaService.newFile($scope.add_photos).then(function(data){
                  $scope.file.url = data.url;
                  $scope.file.id = data.id;
              });
          }
      });

      $scope.publish = function (file) {
          var obj = {
              title: file.title ? file.title : '',
              description: file.description ? file.description : '',
              altText: file.alt_text ? file.alt_text : '',
              legend: file.legend ? file.legend : ''
          };
          MediaService.updateFile(file.id, obj).then(function(data){
              $location.path('/media');
          });
      };

      var removeConfirmationModal, EditPhotosModal;

      $scope.confirmationModal = function (size, title) {
          removeConfirmationModal = $modal.open({
              templateUrl: '/views/confirmation.modal.template.html',
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

      var ConfirmationModalCtrl = function ($scope, $modalInstance, title) {
          $scope.modal_title = title;
          $scope.ok = function () {
              $modalInstance.close();
          };
          $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
          };
      };

      $scope.removePhoto = function (id) {
          var idx = _.findIndex($scope.gallery.photos, {id: id});
          $scope.confirmationModal('md', 'Você deseja excluir esta foto?');
          removeConfirmationModal.result.then(function (data) {
              $scope.gallery.photos.splice(idx, 1);
          });
      };

      $scope.confirmationModal = function (size, title) {
          removeConfirmationModal = $modal.open({
              templateUrl: '/views/confirmation.modal.template.html',
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
          EditPhotosModal = $modal.open({
              templateUrl: '/views/photos-edit.modal.template.html',
              controller: EditPhotosModalCtrl,
              backdrop: 'static',
              size: 'lg',
              resolve: {
                  photos: function() {
                      return $scope.gallery.photos;
                  },
                  id: function() {
                      return id;
                  }
              }
          });

          EditPhotosModal.result.then(function (data) {
              $scope.gallery.photos = data;
          });
      };

      var EditPhotosModalCtrl = function($scope, $modalInstance, photos, id) {
          $scope.photos = angular.copy(photos);
          var index = _.findIndex($scope.photos, {id: id});
          $scope.currentPhoto = $scope.photos[index];

          $scope.ok = function() {
              $modalInstance.close($scope.photos);
          };
          $scope.cancel = function() {
              $modalInstance.dismiss();
          };
      };

  };
})();
