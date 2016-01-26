;(function () {
  'use strict';

  angular.module('pagesModule')
    .controller('PagesController', PagesController);

  PagesController.$inject = [
    '$scope',
    'dataTableConfigService',
    'PagesService',
    'NotificationService',
    'StatusService',
    'ModalService',
    'DateTimeHelper'
  ];

  /**
   * @param $scope
   * @param dataTableConfigService
   * @param PagesService
   * @param NotificationService
   * @param StatusService
   * @param ModalService
   * @param DateTimeHelper
   *
   * @constructor
   */
  function PagesController($scope,
                           dataTableConfigService,
                           PagesService,
                           NotificationService,
                           StatusService,
                           ModalService,
                           DateTimeHelper) {
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
        $scope.dtOptions = dataTableConfigService.init();
      });
    };

    loadPages();

    /**
     *
     */
    $scope.changePage = function () {
      loadPages($scope.currentPage);
    };

    $scope.convertDate = DateTimeHelper.convertDate;

    /**
     * @param id
     * @param title
     */
    $scope.remove = function (id, title) {
      ModalService
        .confirm('Você deseja excluir a página <b>' + title + '</b>?', ModalService.MODAL_MEDIUM)
        .result
        .then(function () {
          PagesService.removePage(id).then(function () {
            NotificationService.success('Página removida com sucesso.');
            loadPages();
          });
        });
    };
  }
})();
