;(function () {
  'use strict';

  angular.module('periodicalModule')
    .controller('PeriodicalEditionEditController', PeriodicalEditionEditController);

  PeriodicalEditionEditController.$inject = [
    '$scope',
    '$uibModal',
    '$routeParams',
    '$location',
    '$timeout',
    'PeriodicalService',
    'StatusService',
    'NotificationService',
    'MediaService',
    'DateTimeHelper',
    '$rootScope',
    '$window'
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
   * @param DateTimeHelper
   *
   * @constructor
   */
  function PeriodicalEditionEditController($scope,
                                           $uibModal,
                                           $routeParams,
                                           $location,
                                           $timeout,
                                           PeriodicalService,
                                           StatusService,
                                           NotificationService,
                                           MediaService,
                                           DateTimeHelper,
                                           $rootScope,
                                           $window) {
    $rootScope.shownavbar = true;
    console.log('... PeriodicalEditionEditController');

    $scope.edition = {};
    $scope.status = [];
    $scope.highlight_ufmg_visible = false;

    StatusService.getStatus().then(function (data) {
      $scope.status = data.data;
    });

    PeriodicalService.getEdition($routeParams.id, $routeParams.edition).then(function (data) {
      console.log('get >>>>>>', data);
      $scope.periodical = data.data.periodical;
      $scope.edition.id = data.data.id;
      $scope.edition.theme = data.data.theme;
      $scope.edition.resume = data.data.resume;
      $scope.edition.year = data.data.year;
      $scope.edition.number = data.data.number;
      $scope.edition.publish_date = DateTimeHelper.dateToStr(data.data.publish_date);
      $scope.edition.file = data.data.file ? data.data.file.id : '';
      $scope.edition.cover = data.data.cover ? data.data.cover.id : '';
      $scope.edition.background = data.data.background ? data.data.background.id : '';
      $scope.edition.status = data.data.status;
      $scope.edition.articles = [];

      angular.forEach(data.data.articles, function (article) {
        var obj = {
          title: article.title,
          subtitle: article.subtitle,
          author_name: article.author_name,
          page_number: article.page_number,
          cover: article.cover ? article.cover.id : '',
          thumb: article.thumb ? article.thumb.id : '',
          cover_url: article.cover ? article.cover.url : '',
          thumb_url: article.thumb ? article.thumb.url : '',
          content: article.content
        };

        obj.tags = [];

        angular.forEach(article.tags, function (tag) {
          obj.tags.push(tag.name);
        });

        $scope.edition.articles.push(obj);
      });

      $scope.edition.cover_url = data.data.cover ? data.data.cover.url : '';
      $scope.edition.background_url = data.data.background ? data.data.background.url : '';
      $scope.edition.file_name = data.data.file ? data.data.file.title : '';

      $scope.edition.pdf = data.data.file ? data.data.file: '';
      $scope.edition.pdf_url = data.data.file ? data.data.file.url: '';


      var scheduled_at = DateTimeHelper.toBrStandard(data.data.scheduled_at, true, true);

      $scope.edition.scheduled_date = scheduled_at.date;
      $scope.edition.scheduled_time = scheduled_at.time;
    });

    /**
     * @param data
     * @param preview
     */
    $scope.publish = function (data, preview) {
      console.log('save >>>>>>', data);
      PeriodicalService.updateEdition($routeParams.id, $routeParams.edition, data).then(function (data) {
        NotificationService.success('Edição atualizada com sucesso.');

        if (!preview) {
          $location.path('/periodicals/' + $routeParams.id + '/editions');
        } else {
          $window.open(data.data.edition_url);
        }
      });
    };

    $scope.handleArticle = PeriodicalService.handleArticle;

    $scope.sortableOptions = {
      accept: function (sourceItemHandleScope, destSortableScope) {
        return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
      },
      containment: '#sort-main'
    };

    /**
     * @param idx
     */
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
        $scope.edition.file = data.id;
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
        $scope.edition[type + '_url'] = data.url;
      });
    };

    /**
     * @param type
     */
    $scope.removeImage = function (type) {
      $timeout(function () {
        $scope.edition[type] = '';
        $scope.edition[type + '_url'] = '';

        $scope.$apply();
      });
    };
  }
})();
