;(function () {
  'use strict';

  angular.module('newsModule')
    .controller('NewsController', NewsController);

  NewsController.$inject = [
    '$scope',
    '$uibModal',
    'dataTableConfigService',
    'NewsService',
    'NotificationService',
    'DateTimeHelper'
  ];

  function NewsController($scope,
                          $modal,
                          dataTableConfigService,
                          NewsService,
                          NotificationService,
                          DateTimeHelper) {

    clog('... NoticiasController');

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

    $scope.removeNews = function (id, description) {
      $scope.confirmationModal('md', 'Você deseja excluir a notícia "' + description + '"?');

      removeConfirmationModal.result.then(function () {
        NewsService.removeNews(id).then(function () {
          NotificationService.success('Notícia removida com sucesso.');
          loadNews();
        });
      });
    };

    var removeConfirmationModal;

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
