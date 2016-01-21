;(function () {
  'use strict';

  angular.module('componentsModule')
    .controller('ArticleModalController', ArticleModalController);

  ArticleModalController.$inject = [
    '$scope',
    '$uibModalInstance',
    'article',
    'MediaService',
    '$timeout'
  ];

  function ArticleModalController($scope, $uibModalInstance, article, MediaService, $timeout) {
    console.log('... ArticleModalController');

    if (article) {
      $scope.article = {
        title: article.title,
        subtitle: article.subtitle,
        author_name: article.author_name,
        page_number: article.page_number,
        tags: [],
        cover: article.cover,
        thumb: article.thumb,
        content: article.content,
        cover_url: article.cover_url,
        thumb_url: article.thumb_url
      };

      angular.forEach(article.tags, function (tag) {
        $scope.article.tags.push(tag);
      });
    } else {
      $scope.article = {
        title: '',
        subtitle: '',
        author_name: '',
        page_number: '',
        tags: [],
        cover: '',
        thumb: '',
        content: '',
        cover_url: '',
        thumb_url: ''
      };
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

          clog('redactor >>>', redactor);

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
      formats: ['vertical', 'medium']
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

    // Upload
    // Cover Image - Upload
    $scope.$watch('article_cover', function () {
      if ($scope.article_cover) {
        $scope.upload([$scope.article_cover], 'cover');
      }
    });

    $scope.$watch('article_thumb', function () {
      if ($scope.article_thumb) {
        $scope.upload([$scope.article_thumb], 'thumb');
      }
    });

    $scope.upload = function (files, type) {
      angular.forEach(files, function (file) {
        MediaService.newFile(file).then(function (data) {
          $scope.article[type] = data.id;
          $scope.article[type+'_url'] = data.url;
        });
      });
    };

    $scope.removeImage = function (type) {
      $timeout(function () {
        $scope.article[type] = '';
        $scope.article[type+'_url'] = '';

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
