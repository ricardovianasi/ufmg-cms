;(function(){

"use strict";

angular
  .module("newsModule")
  .controller("NewsNewController", NewsNewController);

  NewsNewController.$inject = [
    '$scope',
    'MediaService',
    '$modal',
    'NewsService',
    'NotificationService',
    'StatusService',
    '$location'
  ];

  function NewsNewController($scope, MediaService, $modal, NewsService, NotificationService, StatusService, $location) {
      console.log('... NoticiasNovoController');

      $scope.title = 'Nova Notícia';
      $scope.breadcrumb = 'Nova Notícia';

      $scope.news = {};
      $scope.news.tags = [];

      $scope.categories = [];
      $scope.status = [];
      $scope.types = [];

      NewsService.getNewsCategories().then(function (data) {
        $scope.categories = data.data;
      });

      NewsService.getNewsTypes().then(function (data) {
        $scope.types = data.data;
      });

      StatusService.getStatus().then(function(data){
        $scope.status = data.data;
      });

      $scope.publish = function (data) {
        var _obj = {
          title: data.title,
          subtitle: data.subtitle,
          author_name: data.author,
          category: data.category,
          text: data.text,
          status: data.status,
          type: data.type,
          tags: data.tags,
          thumb: data.thumb
        };

        NewsService.postNews(_obj).then(function (data) {
          NotificationService.success('Notícia criada com sucesso.');
          $location.path('/news');
        });
      };

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
          ['a', ['href', 'title']],
          ['p', ['style']]
        ]
      };

      // Cover Image - Upload

      $scope.$watch('news_thumb', function () {
        if ($scope.news_thumb) {
          $scope.upload([$scope.news_thumb]);
        }
      });

      $scope.upload = function (files) {
        angular.forEach(files, function (file) {
          var obj = {
            title: file.title ? file.title : '',
            description: file.description ? file.description : '',
            altText: file.alt_text ? file.alt_text : '',
            legend: file.legend ? file.legend : ''
          };
          MediaService.newFile(file).then(function (data) {
              $scope.news.thumb = data.id;
              $scope.news.thumb_name = data.title;
          });
        });
      };

      $scope.removeImage = function () {
        $timeout(function () {
          $scope.news.thumb = '';
          $scope.news.thumb_name = '';
          $scope.$apply();
        });
      };

    };
})();
