;(function () {
  'use strict';

  angular
    .module('periodicalModule')
    .controller('PeriodicalEditionsController', PeriodicalEditionsController);

  PeriodicalEditionsController.$inject = [
    '$scope',
    '$routeParams',
    '$uibModal',
    'PeriodicalService',
    'NotificationService',
    'DateTimeHelper'
  ];

  function PeriodicalEditionsController($scope,
                                        $routeParams,
                                        $uibModal,
                                        PeriodicalService,
                                        NotificationService,
                                        DateTimeHelper) {
    console.log('... PeriodicalEditionsController');

    $scope.loadEditions = function () {
      PeriodicalService.getPeriodicalEditions($routeParams.id).then(function (data) {
        $scope.editions = data.data;

        if ($scope.editions.items.length) {
          $scope.periodical = {};
          $scope.periodical.id = $scope.editions.items[0].periodical.id;
          $scope.periodical.name = $scope.editions.items[0].periodical.name;
        }
      });
    };

    $scope.loadEditions();

    $scope.convertDate = function (data) {
      return DateTimeHelper.dateToStr(data);
    };

    $scope.removeEdition = function (id, description) {
      $scope.confirmationModal('md', 'Você deseja excluir o periódico "' + description + '"?');
      removeConfirmationModal.result.then(function (data) {
        PeriodicalService.removeEdition($routeParams.id, id).then(function (data) {
          NotificationService.success('Edição removida com sucesso.');
          $scope.loadEditions();
        });
      });
    };

    var removeConfirmationModal;

    $scope.confirmationModal = function (size, title) {
      removeConfirmationModal = $uibModal.open({
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
