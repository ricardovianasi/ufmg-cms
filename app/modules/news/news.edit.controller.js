;(function () {
  'use strict';

  angular
    .module("newsModule")
    .controller("NewsEditController", NewsEditController);

  NewsEditController.$inject = [
    '$scope',
    '$routeParams',
    '$location',
    '$timeout',
    '$uibModal',
    'NewsService',
    'NotificationService',
    'StatusService',
    'MediaService',
    'DateTimeHelper',
  ];

  function NewsEditController($scope,
                              $routeParams,
                              $location,
                              $timeout,
                              $uibModal,
                              NewsService,
                              NotificationService,
                              StatusService,
                              MediaService,
                              DateTimeHelper) {
    console.log('... NoticiasEditController');

    $scope.news = {};
    $scope.news.tags = [];

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
      $scope.news.highlight_ufmg = data.data.highlight_ufmg;
      $scope.news.news_url = data.data.news_url;


      angular.forEach(data.data.tags, function (tag) {
        $scope.news.tags.push(tag.name);
      });

      $scope.title = 'Editar "' + $scope.news.title + '"';
      $scope.breadcrumb_active = $scope.news.title;
    });

       /**
       * @param size
       * @param title
       */

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

    $scope.remove = function (id) {
      $scope.confirmationModal('md', 'Você deseja excluir esta notícia?');
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
        thumb: data.thumb,
        highlight_ufmg: data.highlight_ufmg
      };


      if (_obj.status == 'scheduled') {
        _obj.scheduled_at = data.scheduled_date + ' ' + data.scheduled_time;
      }

      NewsService.updateNews(data.id, _obj).then(function (data) {
        NotificationService.success('Notícia atualizada com sucesso.');
        $location.path('/news');
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
