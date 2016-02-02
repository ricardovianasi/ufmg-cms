;(function () {
  'use strict';

  angular.module('componentsModule')
    .controller('ArticleModalController', ArticleModalController);

  ArticleModalController.$inject = [
    '$scope',
    '$uibModalInstance',
    '$uibModal',
    '$timeout',
    'article',
    'MediaService',
  ];

  /**
   * @param $scope
   * @param $uibModalInstance
   * @param $uibModal
   * @param $timeout
   * @param article
   * @param MediaService
   *
   * @constructor
   */
  function ArticleModalController($scope, $uibModalInstance, $uibModal, $timeout, article, MediaService) {
    console.log('... ArticleModalController');

    $scope.article = {};
    $scope.article.tags = [];

    if (article) {
      $scope.article.id = article.id;
      $scope.article.title = article.title;
      $scope.article.subtitle = article.subtitle;
      $scope.article.author_name = article.author_name;
      $scope.article.page_number = article.page_number;
      $scope.article.cover = article.cover;
      $scope.article.thumb = article.thumb;
      $scope.article.content = article.content;
      $scope.article.cover_url = article.cover_url;
      $scope.article.thumb_url = article.thumb_url;

      angular.forEach(article.tags, function (tag) {
        $scope.article.tags.push(tag);
      });
    }

    $scope.redactorOptions = {
      plugins: ['imagencrop', 'audioUpload']
    };

    $scope.imagencropOptions = {
      /**
       * @param redactor
       * @param data
       */
      callback: function (redactor, data) {
        var cropped = function (size, data) {
          var html = _.template($('#figure-' + size).html());

          redactor.selection.restore();
          redactor.insert.raw(html(data));
        };

        var croppedObj = {
          url: data.url,
          legend: data.legend ? data.legend : '',
          author: data.author ? data.author : ''
        };

        cropped(data.type, croppedObj);
      },
    };

    $scope.audioUploadOptions = {
      /**
       * @param redactor
       * @param data
       */
      callback: function (redactor, data) {
        var html = _.template($('#audio').html());

        redactor.selection.restore();
        redactor.insert.raw(html(data));
      }
    };

    $scope.article_thumb = null;

    // Upload
    // Cover Image - Upload
    $scope.$watch('article_thumb', function () {
      if ($scope.article_thumb) {
        $scope.upload($scope.article_thumb);
      }
    });

    /**
     * @param file
     */
    $scope.upload = function (file) {
      MediaService.newFile(file).then(function (data) {
        $scope.article.thumb = data.id;
        $scope.article.thumb_url = data.url;
      });
    };

    /**
     *
     */
    $scope.uploadImage = function () {
      var moduleModal = $uibModal.open({
        templateUrl: 'components/modal/upload-component.template.html',
        controller: 'UploadComponentController as vm',
        backdrop: 'static',
        size: 'xl',
        resolve: {
          formats: function () {
            return ['bigPageCover'];
          }
        }
      });

      moduleModal.result.then(function (data) {
        $scope.article.cover = data.id;
        $scope.article.cover_url = data.url;
      });
    };

    $scope.removeImage = function (type) {
      $timeout(function () {
        $scope.article[type] = '';
        $scope.article[type + '_url'] = '';

        $scope.$apply();
      });
    };

    $scope.ok = function () {
      $uibModalInstance.close($scope.article);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
})();
