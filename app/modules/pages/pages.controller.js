;(function () {
  'use strict';

  angular.module('pagesModule')
    .controller('PagesController', PagesController);

    PagesController.$inject = [
      '$scope',
      '$modal',
      'PagesService',
      'NotificationService',
      'StatusService'
    ];

    function  PagesController($scope, $modal, PagesService, NotificationService, StatusService) {
        console.log('... PagesController');

        $scope.status = [];
        $scope.pages = [];
        $scope.currentPage = 1;

        StatusService.getStatus().then(function (data) {
          $scope.status = data.data;
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
          $scope.confirmationModal('md', 'Você deseja excluir a página '+description+'?');
          removeConfirmationModal.result.then(function (data) {
            PagesService.removePage(id).then(function (data) {
              NotificationService.success('Página removida com sucesso.');
              loadPages();
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
      };
})();
