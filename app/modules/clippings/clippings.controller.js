;(function(){
'use strict';

angular
  .module('clippingsModule')
  .controller('ClippingsController', ClippingsController);

  ClippingsController.$inject = [
    '$scope',
    '$modal',
    '$filter',
    'ClippingsService',
    'DateTimeHelper',
    'NotificationService'
  ];

  function ClippingsController($scope, $modal, $filter, ClippingsService, DateTimeHelper, NotificationService) {
      console.log('... ClippingsController');

      $scope.title = 'Clippings';
      $scope.clippings = [];
      $scope.DateTimeHelper = DateTimeHelper;
      $scope.currentPage = 1;

      var loadClippings = function (page) {
        ClippingsService.getClippings(page).then(function (data) {
          $scope.clippings = data.data;
        });
      };

      loadClippings();

      $scope.changePage = function () {
        loadClippings($scope.currentPage);
      };

      // Confirmation to remove
      var removeConfirmationModal;

      var ConfirmationModalCtrl = function ($scope, $modalInstance, title) {
        $scope.modal_title = title;

        $scope.ok = function () {
          $modalInstance.close();
        };

        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
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

      $scope.removeClipping = function (id, description) {
        $scope.confirmationModal('md', $filter('format')('Você deseja excluir o clipping "{0}"?', description));

        removeConfirmationModal.result.then(function () {
          ClippingsService.destroy(id).then(function () {
            NotificationService.success('Clipping removido com sucesso.');
            loadClippings();
          });
        });
      };
    };
})();
