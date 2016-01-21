;(function () {
  'use strict';

  angular.module('periodicalModule')
    .controller('PeriodicalEditionNewController', PeriodicalEditionNewController);

  PeriodicalEditionNewController.$inject = [
    '$scope',
    '$uibModal',
    '$routeParams',
    '$location',
    '$timeout',
    'PeriodicalService',
    'StatusService',
    'NotificationService',
    'MediaService'
  ];

  /**
   * @param $scope
   * @param $uibModal
   * @param $routeParams
   * @param $location
   * @param $timeout
   * @param PeriodicalService
   * @param StatusService
   * @param NotificationService
   * @param MediaService
   *
   * @constructor
   */
  function PeriodicalEditionNewController($scope,
                                          $uibModal,
                                          $routeParams,
                                          $location,
                                          $timeout,
                                          PeriodicalService,
                                          StatusService,
                                          NotificationService,
                                          MediaService) {
    console.log('... PeriodicalEditionNewController');

    $scope.edition = {};
    $scope.status = [];

    StatusService.getStatus().then(function (data) {
      $scope.status = data.data;
    });

    PeriodicalService.getPeriodicals($routeParams.id).then(function (data) {
      $scope.periodical = data.data;
    });

    $scope.edition.theme = '';
    $scope.edition.number = '';
    $scope.edition.publish_date = '';
    $scope.edition.file = '';
    $scope.edition.cover = '';
    $scope.edition.background = '';
    $scope.edition.status = '';
    $scope.edition.articles = [];

    $scope.publish = function (data, preview) {
      var obj = {};
      obj.articles = [];

      angular.forEach(data.articles, function (article) {
        obj.articles.push({
          title: article.title,
          subtitle: article.subtitle,
          author_name: article.author_name,
          page_number: article.page_number,
          cover: article.cover,
          thumb: article.thumb,
          tags: _.map(article.tags, 'text'),
          content: article.content,
        });
      });

      obj.background = data.background;
      obj.cover = data.cover;
      obj.number = data.number;
      obj.file = data.file;
      obj.publish_date = data.publish_date;
      obj.theme = data.theme;
      obj.status = data.status;

      PeriodicalService.newEdition($routeParams.id, obj).then(function (data) {
        NotificationService.success('Edição criada com sucesso.');

        if (!preview) {
          $location.path('/periodicals/' + $routeParams.id + '/editions');
        } else {
          $window.open(data.data.edition_url);
        }
      });
    };

    var ArticleModalCtrl = 'ArticleModalController';

    $scope.addArticle = function () {
      var articleModal = $uibModal.open({
        templateUrl: '/components/modal/article.modal.template.html',
        controller: ArticleModalCtrl,
        backdrop: 'static',
        size: 'lg',
        resolve: {
          article: function () {
            return false;
          }
        }
      });

      articleModal.result.then(function (data) {
        $scope.edition.articles.push(data);
      });
    };

    var editArticleModal;

    $scope.editArticle = function (idx, article) {
      editArticleModal = $uibModal.open({
        templateUrl: '/components/modal/article.modal.template.html',
        controller: ArticleModalCtrl,
        backdrop: 'static',
        size: 'lg',
        resolve: {
          article: function () {
            return article;
          }
        }
      });

      editArticleModal.result.then(function (data) {
        $scope.edition.articles[idx] = data;
      });
    };

    $scope.sortableOptions = {
      accept: function (sourceItemHandleScope, destSortableScope) {
        return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
      },
      containment: '#sort-main'
    };

    $scope.removeArticle = function (idx) {
      $scope.confirmationModal('md', 'Você deseja excluir este artigo?');
      removeConfirmationModal.result.then(function (data) {
        $scope.edition.articles.splice(idx, 1);

        $timeout(function () {
          $scope.$apply();
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

    // Upload
    // PDF
    $scope.edition_file = null;

    $scope.$watch('edition_file', function () {
      if ($scope.edition_file) {
        $scope.uploadFile($scope.edition_file);
      }
    });

    /**
     * Upload files like pdf, txt, doc, etc. Not for images
     *
     * @param file
     */
    $scope.uploadFile = function (file) {
      MediaService.newFile(file).then(function (data) {
        $scope.edition.pdf = data.id;
        $scope.edition.pdf_url = data.url;
      });
    };

    /**
     * @param type
     */
    $scope.uploadImage = function (type) {
      var moduleModal = $uibModal.open({
        templateUrl: 'components/modal/upload-component.template.html',
        controller: 'UploadComponentController as vm',
        backdrop: 'static',
        size: 'xl',
        resolve: {
          formats: function () {
            var formats = {
              background: 'pageCover',
              cover: 'digitalizedCover'
            };

            return [formats[type]];
          }
        }
      });

      moduleModal.result.then(function (data) {
        $scope.edition[type] = data.id;
        $scope.edition[type+'_url'] = data.url;
      });
    };

    $scope.removeImage = function (type) {
      $timeout(function () {
        $scope.edition[type] = '';
        $scope.edition[type+'_url'] = '';

        $scope.$apply();
      });
    };
  }
})();
