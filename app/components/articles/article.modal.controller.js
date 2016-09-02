/* jshint -W100 */

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
    'RedactorPluginService',
    'TagsService',
    'validationService'
  ];

  /**
   * @param $scope
   * @param $uibModalInstance
   * @param $uibModal
   * @param $timeout
   * @param article
   * @param MediaService
   * @param RedactorPluginService
   *
   * @constructor
   */
  function ArticleModalController($scope,
                                  $uibModalInstance,
                                  $uibModal,
                                  $timeout,
                                  article,
                                  MediaService,
                                  RedactorPluginService,
                                  TagsService,
                                  validationService) {
    console.log('... ArticleModalController');


    var allTags = [];

   TagsService.getTags().then(function(data){ 
         allTags = data.data.items[0];
 });

    $scope.findTags = function($query) { 
      return TagsService.findTags($query, allTags);
 };

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

    $scope.imagencropOptions = RedactorPluginService.getOptions('imagencrop');

    $scope.audioUploadOptions = RedactorPluginService.getOptions('audioUpload');

    $scope.uploadfilesOptions = RedactorPluginService.getOptions('uploadfiles');

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
      if(!validationService.isValid($scope.formArticle.$invalid))
        return false;

      $uibModalInstance.close($scope.article);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
})();
