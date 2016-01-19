;(function () {
  'use strict';

  angular.module('newsModule')
    .controller('NewsEditController', NewsEditController);

  NewsEditController.$inject = [
    '$scope',
    '$routeParams',
    '$location',
    '$timeout',
    '$uibModal',
    '$window',
    'NewsService',
    'NotificationService',
    'StatusService',
    'MediaService',
    'DateTimeHelper',
  ];

  /**
   * @param $scope
   * @param $routeParams
   * @param $location
   * @param $timeout
   * @param $uibModal
   * @param $window
   * @param NewsService
   * @param NotificationService
   * @param StatusService
   * @param MediaService
   * @param DateTimeHelper
   *
   * @constructor
   */
  function NewsEditController($scope,
                              $routeParams,
                              $location,
                              $timeout,
                              $uibModal,
                              $window,
                              NewsService,
                              NotificationService,
                              StatusService,
                              MediaService,
                              DateTimeHelper) {
    console.log('... NoticiasEditController');

    $scope.news = {};
    $scope.categories = [];
    $scope.status = [];
    $scope.types = [];

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

    NewsService.getNews($routeParams.id).then(function (data) {
      $scope.news = {
        id: data.data.id,
        title: data.data.title || '',
        subtitle: data.data.subtitle || '',
        author: data.data.author_name || '',
        category: data.data.category ? data.data.category.id : '',
        text: data.data.text || '',
        status: data.data.status || '',
        type: data.data.type ? data.data.type.id : '',
        thumb: data.data.thumb ? data.data.thumb.id : '',
        thumb_name: data.data.thumb ? data.data.thumb.title : '',
        highlight_ufmg: data.data.highlight_ufmg,
        news_url: data.data.news_url
      };

      var scheduled_at = DateTimeHelper.toBrStandard(data.data.scheduled_at, true, true);

      $scope.news.scheduled_date = scheduled_at.date;
      $scope.news.scheduled_time = scheduled_at.time;

      $scope.news.tags = [];

      angular.forEach(data.data.tags, function (tag) {
        $scope.news.tags.push(tag.name);
      });

      $scope.title = 'Editar "' + $scope.news.title + '"';
      $scope.breadcrumb_active = $scope.news.title;
    });

    var removeConfirmationModal;

    /**
     * @param size
     * @param title
     */
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

      removeConfirmationModal.result.then(function () {
          NewsService.removeNews($routeParams.id).then(function () {
            NotificationService.success('Notícia removida com sucesso.');
            $location.path('/news');
          });
      });
    };

    /**
     * @param $scope
     * @param $uibModalInstance
     * @param title
     *
     * @constructor
     */
    var ConfirmationModalCtrl = function ($scope, $uibModalInstance, title) {
      $scope.modal_title = title;

      $scope.ok = function () {
        $uibModalInstance.close();
      };
      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    };

    $scope.remove = function () {
      $scope.confirmationModal('md', 'Você deseja excluir esta notícia?');
    };

    /**
     * @param data
     * @param preview
     */
    $scope.publish = function (data, preview) {
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
        highlight_ufmg: data.highlight_ufmg
      };


      if (_obj.status == 'scheduled') {
        _obj.scheduled_at = data.scheduled_date + ' ' + data.scheduled_time;
      }

      NewsService.updateNews(data.id, _obj).then(function (news) {
        NotificationService.success('Notícia atualizada com sucesso.');

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
      plugins: ['imagencrop']
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

    /**
     * @param files
     */
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
  }
})();
