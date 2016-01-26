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
                          ModalService) {

    console.log('... NoticiasController');

    $scope.news = [];
    $scope.currentPage = 1;

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

    $scope.convertDate = function (date) {
      return DateTimeHelper.dateToStr(date);
    };

    /**
     * @param id
     * @param description
     */
    $scope.removeNews = function (id, description) {
      ModalService
        .confirm('Você deseja excluir a notícia "' + description + '"?', ModalService.MODAL_MEDIUM)
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
