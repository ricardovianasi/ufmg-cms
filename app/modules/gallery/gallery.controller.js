;(function () {
  'use strict';

  angular.module('galleryModule')
    .controller('GalleryController', GalleryController);

  GalleryController.$inject = [
    '$scope',
    '$uibModal',
    'dataTableConfigService',
    'GalleryService',
    'StatusService',
    'NotificationService'
  ];

  function GalleryController($scope,
                            $uibModal,
                            dataTableConfigService,
                            GalleryService,
                            StatusService,
                            NotificationService) {
    console.log('... GaleriasController');

    $scope.galleries = [];
    $scope.status = [];
    $scope.currentPage = 1;

    var loadGalleries = function (page) {
      GalleryService.getGalleries(page).then(function (data) {
        $scope.galleries = data.data;
        $scope.dtOptions = dataTableConfigService.init();
      });
    };

    loadGalleries();

    $scope.changePage = function () {
      loadGalleries($scope.currentPage);
    };

    StatusService.getStatus().then(function (data) {
      $scope.status = data.data;
    });

    $scope.removeGallery = function (id, description) {
      $scope.confirmationModal('md', 'Você deseja excluir a galeria "' + description + '"?');
      removeConfirmationModal.result.then(function (data) {
        GalleryService.removeGallery(id).then(function (data) {
          NotificationService.success('Galeria removida com sucesso.');
          loadGalleries();
        });
      });
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
