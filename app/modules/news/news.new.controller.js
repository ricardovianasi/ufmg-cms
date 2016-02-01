;(function () {
  'use strict';

  angular.module('newsModule')
    .controller('NewsNewController', NewsNewController);

  NewsNewController.$inject = [
    '$scope',
    '$location',
    '$window',
    'MediaService',
    'NewsService',
    'NotificationService',
    'StatusService',
    'DateTimeHelper'
  ];

  /**
   * @param $scope
   * @param $location
   * @param $window
   * @param MediaService
   * @param NewsService
   * @param NotificationService
   * @param StatusService
   * @param DateTimeHelper
   *
   * @constructor
   */
  function NewsNewController($scope,
                             $location,
                             $window,
                             MediaService,
                             NewsService,
                             NotificationService,
                             StatusService,
                             DateTimeHelper) {
    console.log('... NoticiasNovoController');

    $scope.title = 'Nova Notícia';
    $scope.breadcrumb = 'Nova Notícia';

    $scope.news = {};
    $scope.news.status = StatusService.STATUS_PUBLISHED;
    $scope.news.tags = [];

    $scope.categories = [];
    $scope.status = [];
    $scope.types = [];
    $scope.highlight_ufmg_visible = true;

    /**
     * Datepicker options
     */
    $scope.datepickerOpt = {
      initDate: DateTimeHelper.getDatepickerOpt(),
      endDate: DateTimeHelper.getDatepickerOpt()
    };

    /**
     * Add status 'on the fly', according to requirements
     *
     * @type {{opened: boolean}}
     */
    $scope.datepickerOpt.initDate.status = {
      opened: false
    };
    $scope.datepickerOpt.endDate.status = {
      opened: false
    };

    NewsService.getNewsCategories().then(function (data) {
      $scope.categories = data.data;
    });

    NewsService.getNewsTypes().then(function (data) {
      $scope.types = data.data;
    });

    StatusService.getStatus().then(function (data) {
      $scope.status = data.data;
    });

    $scope.publish = function (data, preview) {
      if (typeof data.highlight_ufmg == 'undefined') {
        data.highlight_ufmg = false;
      }

      var _obj = {
        title: data.title,
        subtitle: data.subtitle,
        author_name: data.author,
        category: data.category,
        text: data.text,
        status: data.status,
        type: data.type,
        tags: data.tags,
        thumb: data.thumb,
        highlight_ufmg: data.highlight_ufmg || false
      };

      _obj.tags = _.map(_obj.tags, 'text');

      NewsService.postNews(_obj).then(function (news) {
        NotificationService.success('Notícia criada com sucesso.');

        if (!preview) {
          $location.path('/news');
        } else {
          $window.open(news.data.news_url);
        }
      });
    };

    // Cover Image - Upload
    $scope.$watch('news_thumb', function () {
      if ($scope.news_thumb) {
        $scope.upload([$scope.news_thumb]);
      }
    });

    $scope.redactorOptions = {
      plugins: ['video','soundcloud', 'uploadfiles', 'imagencrop', 'audioUpload']
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

    $scope.upload = function (files) {
      angular.forEach(files, function (file) {
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
  }
})();
