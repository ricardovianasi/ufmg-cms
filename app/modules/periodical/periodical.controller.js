;(function () {
  'use strict';

  angular.module('periodicalModule')
    .controller('PeriodicalController', PeriodicalController);

  PeriodicalController.$inject = [
    '$scope',
    'PeriodicalService',
    'DateTimeHelper',
    '$uibModal',
    'NotificationService'
  ];

  function PeriodicalController($scope, PeriodicalService, DateTimeHelper, $modal, NotificationService) {

    console.log('... PeriodicalController');

    $scope.periodicals = [];
    $scope.currentPage = 1;

    $scope.convertDate = function (data) {
      return DateTimeHelper.dateToStr(data);
    };

    /**
     * @param page
     */
    var loadPeriodicals = function (page) {
      PeriodicalService.getPeriodicals(null, page).then(function (data) {
        $scope.periodicals = data.data;
        console.log(data.data);
      });
    };

    loadPeriodicals();

    $scope.changePage = function () {
      loadPeriodicals($scope.currentPage);
    };

    $scope.removePeriodical = function (id, description) {
      $scope.confirmationModal('md', 'Você deseja excluir o periódico "' + description + '"?');
      removeConfirmationModal.result.then(function (data) {
        PeriodicalService.removePeriodical(id).then(function (data) {
          NotificationService.success('Periódico removida com sucesso.');
          loadPeriodicals();
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
