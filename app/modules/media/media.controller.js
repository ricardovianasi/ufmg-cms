;(function () {
  'use strict';

  angular
    .module("mediaModule")
    .controller("MediaController", MediaController);

  MediaController.$inject = [
    '$scope',
    'MediaService',
    'StatusService',
    'NotificationService',
    '$uibModal'
  ];

  function MediaController($scope, MediaService, StatusService, NotificationService, $modal) {
    console.log('... MediaController');

    $scope.media = [];
    $scope.status = [];
    $scope.currentPage = 1;

    var loadMedia = function (page) {
      MediaService.getMedia(page).then(function (data) {
        $scope.media = data.data;
      });
    };

    loadMedia();

    $scope.changePage = function () {
      loadMedia($scope.currentPage);
    };

    StatusService.getStatus().then(function (data) {
      $scope.status = data.data;
    });

    $scope.convertDate = function (date) {
      return new Date(date);
    };

    var removeConfirmationModal;

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

    $scope.removeMedia = function (id, description) {
      MediaService.removeMedia(id).then(function (data) {
        NotificationService.success('Mídia removida com sucesso.');
        loadMedia();
      });
      // $scope.confirmationModal('md', 'Você deseja excluir a mídia "'+description+'"?');
      // removeConfirmationModal.result.then(function(data){
      //     MediaService.removeMedia(id).then(function(data){
      //         NotificationService.success('Mídia removida com sucesso.');
      //         loadMedia();
      //     });
      // });
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
  }
})();
