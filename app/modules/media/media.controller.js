;(function () {
  'use strict';

  angular.module('mediaModule')
    .controller('MediaController', MediaController);

  MediaController.$inject = [
    '$scope',
    '$uibModal',
    'MediaService',
    'dataTableConfigService',
    'StatusService',
    'NotificationService'
  ];

  function MediaController($scope, $uibModal, MediaService, dataTableConfigService, StatusService, NotificationService) {
    console.log('... MediaController');

    $scope.media = [];
    $scope.status = [];
    $scope.currentPage = 1;

    var loadMedia = function (page) {
      MediaService.getMedia(page).then(function (data) {
        $scope.media = data.data;
        $scope.dtOptions = dataTableConfigService.init();
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

    $scope.removeMedia = function (id, description) {
      MediaService.removeMedia(id).then(function (data) {
        NotificationService.success('Mídia removida com sucesso.');
        loadMedia($scope.currentPage);
      }, function(error){
        NotificationService.error('A imagem está vinculada a alguma postagem, por este motivo não é possível exclui-la.');
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
