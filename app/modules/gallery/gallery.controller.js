;(function () {
  'use strict';

  angular
    .module('galleryModule')
    .controller('GalleryController', GalleryController);

  GalleryController.$inject = [
    '$scope',
    'GalleryService',
    'StatusService',
    'NotificationService',
    '$modal'
  ];

  function GalleryController($scope, GalleryService, StatusService, NotificationService, $modal) {
    console.log('... GaleriasController');

    $scope.galleries = [];
    $scope.status = [];
    $scope.currentPage = 1;

    var loadGalleries = function (page) {
      GalleryService.getGalleries(page).then(function (data) {
        $scope.galleries = data.data;
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
  }
})();
