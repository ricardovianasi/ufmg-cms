;(function () {
  'use strict';

  angular.module('periodicalModule')
    .controller('PeriodicalEditionNewController', PeriodicalEditionNewController);

  PeriodicalEditionNewController.$inject = [
    '$scope',
    '$uibModal',
    '$routeParams',
    '$location',
    '$timeout',
    'PeriodicalService',
    'StatusService',
    'NotificationService',
    'MediaService',
    'ModalService',
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
   * @param ModalService
   *
   * @constructor
   */
  function PeriodicalEditionNewController($scope,
                                          $uibModal,
                                          $routeParams,
                                          $location,
                                          $timeout,
                                          PeriodicalService,
                                          StatusService,
                                          NotificationService,
                                          MediaService,
                                          ModalService) {
    console.log('... PeriodicalEditionNewController');

    $scope.edition = {};
    $scope.status = [];

    StatusService.getStatus().then(function (data) {
      $scope.status = data.data;
    });

    PeriodicalService.getPeriodicals($routeParams.id).then(function (data) {
      $scope.periodical = data.data;
    });

    $scope.edition.theme = '';
    $scope.edition.number = '';
    $scope.edition.publish_date = '';
    $scope.edition.file = '';
    $scope.edition.cover = '';
    $scope.edition.background = '';
    $scope.edition.status = StatusService.STATUS_DRAFT;
    $scope.edition.articles = [];

    $scope.publish = function (data, preview) {
      PeriodicalService.newEdition($routeParams.id, data).then(function (data) {
        NotificationService.success('Edição criada com sucesso.');

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
      ModalService
        .confirm('Você deseja excluir este artigo?')
        .result
        .then(function () {
          $scope.edition.articles.splice(idx, 1);

          $timeout(function () {
            $scope.$apply();
          });
        });
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

    $scope.removeImage = function (type) {
      $timeout(function () {
        $scope.edition[type] = '';
        $scope.edition[type + '_url'] = '';

        $scope.$apply();
      });
    };
  }
})();
