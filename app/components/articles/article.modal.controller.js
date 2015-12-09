;(function () {
  'use strict';

  angular.module('componentsModule')
    .controller('ArticleModalController', ArticleModalController);

  ArticleModalController.$inject = [
    '$scope',
    '$modalInstance',
    'article',
    'MediaService',
    '$timeout'
  ];

  function ArticleModalController($scope, $modalInstance, article, MediaService, $timeout) {
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

    $scope.redactorConfig = {
      lang: 'pt_br',
      replaceDivs: false,
      plugins: ['imagencrop'],
      buttons: [
        'html',
        'formatting',
        'bold',
        'italic',
        'deleted',
        'unorderedlist',
        'orderedlist',
        'outdent',
        'indent',
        'image',
        'file',
        'link',
        'alignment',
        'horizontalrule',
        'imagencrop'
      ],
      allowedAttr: [
        ['section', 'class'],
        ['div', 'class'],
        ['img', ['src', 'alt']],
        ['figure', 'class'],
        ['a', ['href', 'title']]
      ]
    };

    // Upload
    // Cover Image - Upload
    var watchCover = $scope.$watch('article_cover', function () {
      if ($scope.article_cover) {
        $scope.upload([$scope.article_cover], 'cover');
      }
    });

    var watchThumb = $scope.$watch('article_thumb', function () {
      if ($scope.article_thumb) {
        $scope.upload([$scope.article_thumb], 'thumb');
      }
    });

    $scope.upload = function (files, type) {
      angular.forEach(files, function (file) {
        var obj = {
          title: file.title ? file.title : '',
          description: file.description ? file.description : '',
          altText: file.alt_text ? file.alt_text : '',
          legend: file.legend ? file.legend : ''
        };

        MediaService.newFile(file).then(function (data) {
          if (type == 'cover') {
            $scope.article.cover = data.id;
            $scope.article.cover_url = data.url;
          } else if (type == 'thumb') {
            $scope.article.thumb = data.id;
            $scope.article.thumb_url = data.url;
          }
        });
      });
    };

    $scope.removeImage = function (type) {
      $timeout(function () {
        if (type == 'cover') {
          $scope.article.cover = '';
          $scope.article.cover_url = '';
        } else if (type == 'thumb') {
          $scope.article.thumb = '';
          $scope.article.thumb_url = '';
        }

        $scope.$apply();
      });
    };

    $scope.ok = function () {
      $modalInstance.close($scope.article);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
})();
