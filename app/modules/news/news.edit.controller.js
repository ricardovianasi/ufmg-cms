;(function(){

'use strict';

angular
  .module("newsModule")
  .controller("NewsEditController", NewsEditController);

  NewsEditController.$inject =  [
    '$scope',
    '$modal',
    'NewsService',
    'NotificationService',
    'StatusService',
    '$routeParams',
    'MediaService',
    '$location',
    '$timeout',
    'DateTimeHelper'
  ];

  function NewsEditController($scope,
              $modal,
              NewsService,
              NotificationService,
              StatusService,
              $routeParams,
              MediaService,
              $location,
              $timeout,
              DateTimeHelper) {

      console.log('... NoticiasEditController');

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

      StatusService.getStatus().then(function (data) {
        $scope.status = data.data;
      });

      NewsService.getNews($routeParams.id).then(function (data) {
        $scope.news.id = data.data.id;
        $scope.news.title = data.data.title ? data.data.title : '';
        $scope.news.subtitle = data.data.subtitle ? data.data.subtitle : '';
        $scope.news.author = data.data.author_name ? data.data.author_name : '';
        $scope.news.category = data.data.category ? data.data.category.id : '';
        $scope.news.text = data.data.text ? data.data.text : '';
        $scope.news.status = data.data.status ? data.data.status : '';
        $scope.news.type = data.data.type ? data.data.type.id : '';
        $scope.news.thumb = data.data.thumb ? data.data.thumb.id : '';
        $scope.news.thumb_name = data.data.thumb ? data.data.thumb.title : '';
        var scheduled_at = DateTimeHelper.toBrStandard(data.data.scheduled_at, true, true);
        $scope.news.scheduled_date = scheduled_at.date;
        $scope.news.scheduled_time = scheduled_at.time;

        angular.forEach(data.data.tags, function (tag) {
          $scope.news.tags.push(tag.name);
        });

        $scope.title = 'Editar "' + $scope.news.title + '"';
        $scope.breadcrumb_active = $scope.news.title;
      });

      $scope.remove = function (id) {
        NewsService.removeNews(id).then(function (data) {
          NotificationService.success('Notícia removida com sucesso.');
          $location.path('/news');
        });
      };

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

        if (_obj.status == 'scheduled') {
          _obj.scheduled_at = data.scheduled_date+' '+data.scheduled_time;
        }

        NewsService.updateNews(data.id, _obj).then(function (data) {
          NotificationService.success('Notícia atualizada com sucesso.');
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
