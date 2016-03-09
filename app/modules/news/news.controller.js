;(function () {
  'use strict';

  angular.module('newsModule')
    .controller('NewsController', NewsController);

  NewsController.$inject = [
    '$scope',
    'dataTableConfigService',
    'NewsService',
    'NotificationService',
    'DateTimeHelper',
    'ModalService',
    '$rootScope'
  ];

  /**
   * @param $scope
   * @param dataTableConfigService
   * @param NewsService
   * @param NotificationService
   * @param DateTimeHelper
   * @param ModalService
   *
   * @constructor
   */
  function NewsController($scope,
                          dataTableConfigService,
                          NewsService,
                          NotificationService,
                          DateTimeHelper,
                          ModalService,
                          $rootScope) {
    $rootScope.shownavbar = true;
    console.log('... NoticiasController');

    $scope.news = [];
    $scope.currentPage = 1;

    /**
     * @param page
     */
    var loadNews = function (page) {
      NewsService.getNews(null, page).then(function (data) {
        $scope.news = data.data;
        $scope.dtOptions = dataTableConfigService.init();
      });
    };

    loadNews();

    $scope.changePage = function () {
      loadNews($scope.currentPage);
    };

    $scope.convertDate = DateTimeHelper.dateToStr;

    /**
     * @param id
     * @param title
     */
    $scope.removeNews = function (id, title) {
      ModalService
        .confirm('Você deseja excluir a notícia <b>' + title + '</b>?', ModalService.MODAL_MEDIUM)
        .result
        .then(function () {
          NewsService.removeNews(id).then(function () {
            NotificationService.success('Notícia removida com sucesso.');
            loadNews();
          });
        });
    };
  }
})();
