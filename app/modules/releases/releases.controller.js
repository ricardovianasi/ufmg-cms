;(function(){

  'use strict';

  angular
    .module('releasesModule')
    .controller('ReleasesController', ReleasesController);

    ReleasesController.$inject = [
      '$scope',
      '$uibModal',
      '$filter',
      'NotificationService',
      'ReleasesService',
      'DateTimeHelper'
    ];

    function ReleasesController($scope, $modal, $filter, NotificationService, ReleasesService, DateTimeHelper) {
        console.log('... ReleasesController');

        $scope.title = 'Releases';
        $scope.releases = [];
        $scope.DateTimeHelper = DateTimeHelper;
        $scope.currentPage = 1;

        var loadReleases = function (page) {
          ReleasesService.getReleases(page).then(function (data) {
            $scope.releases = data.data;
          });
        };

        loadReleases();

        $scope.changePage = function () {
          loadReleases($scope.currentPage);
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

        $scope.removeRelease = function (id, title) {
          $scope.confirmationModal('md', $filter('format')('Você deseja excluir o release "{0}"?', title));

          removeConfirmationModal.result.then(function () {
            ReleasesService.destroy(id).then(function () {
              NotificationService.success('Release removido com sucesso.');
              loadReleases();
            });
          });
        };
      }
})();
