;(function () {
  'use strict';

  angular.module('pagesModule')
    .controller('PagesController', PagesController);

  PagesController.$inject = [
    '$scope',
    '$uibModal',
    'PagesService',
    'NotificationService',
    'StatusService',
    'dataTableConfigService'
  ];

  function PagesController($scope, $uibModal, PagesService, NotificationService, StatusService, dataTableConfigService) {
    console.log('... PagesController');

    $scope.status = [];
    $scope.pages = [];
    $scope.currentPage = 1;

    StatusService.getStatus().then(function (data) {
      $scope.status = data.data;
      $scope.dtOptions = dataTableConfigService.init();
    });

    /**
     * @param page
     */
    var loadPages = function (page) {
      PagesService.getPages(page).then(function (data) {
        $scope.pages = data.data;
      });
    };

    loadPages();

    $scope.changePage = function () {
      loadPages($scope.currentPage);
    };

    $scope.convertDate = function (date) {
      return new Date(date);
    };

    $scope.removePage = function (id, description) {
      $scope.confirmationModal('md', 'Você deseja excluir a página ' + description + '?');
      removeConfirmationModal.result.then(function (data) {
        PagesService.removePage(id).then(function (data) {
          NotificationService.success('Página removida com sucesso.');
          loadPages();
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
