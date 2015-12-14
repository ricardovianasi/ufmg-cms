;(function () {
  'use strict';

  angular.module('mediaModule')
    .controller('MediaController', MediaController);

  MediaController.$inject = [
    '$scope',
    '$uibModal',
    'MediaService',
    'StatusService',
    'NotificationService'
  ];

  function MediaController($scope, $uibModal, MediaService, StatusService, NotificationService) {
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

    $scope.removeMedia = function (id, description) {
      MediaService.removeMedia(id).then(function (data) {
        NotificationService.success('Mídia removida com sucesso.');
        loadMedia();
      }, function(error){
        NotificationService.error('A imagem esta vinculada a alguma postagem, por este motivo nao e possivel exclui-la.');
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
  }
})();
