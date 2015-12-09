;(function () {
  'use strict';

  angular
    .module('newsModule')
    .controller('NewsController', NewsController);

  NewsController.$inject = [
    '$scope',
    '$modal',
    'NewsService',
    'NotificationService'
  ];

  function NewsController($scope, $modal, NewsService, NotificationService) {

    console.log('... NoticiasController');

    $scope.news = [];
    $scope.currentPage = 1;

    var loadNews = function (page) {
      NewsService.getNews(null, page).then(function (data) {
        $scope.news = data.data;
      });
    };

    loadNews();

    $scope.changePage = function () {
      loadNews($scope.currentPage);
    };

    $scope.convertDate = function (date) {
      return new Date(date);
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
  }
})();
