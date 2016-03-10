;(function () {
  'use strict';

  angular.module('pagesModule')
    .controller('PagesEditController', PagesEditController);

  PagesEditController.$inject = [
    '$scope',
    '$uibModal',
    '$location',
    '$routeParams',
    '$timeout',
    '$filter',
    '$window',
    'NotificationService',
    'PagesService',
    'WidgetsService',
    'StatusService',
    'DateTimeHelper',
    'ModalService',
    '$rootScope'
  ];

  /**
   * @param $scope
   * @param $uibModal
   * @param $location
   * @param $routeParams
   * @param $timeout
   * @param $filter
   * @param $window
   * @param NotificationService
   * @param PagesService
   * @param WidgetsService
   * @param StatusService
   * @param DateTimeHelper
   * @param ModalService
   *
   * @constructor
   */
  function PagesEditController($scope,
                               $uibModal,
                               $location,
                               $routeParams,
                               $timeout,
                               $filter,
                               $window,
                               NotificationService,
                               PagesService,
                               WidgetsService,
                               StatusService,
                               DateTimeHelper,
                               ModalService,
                               $rootScope) {
     $rootScope.shownavbar = true;
    console.log('... PaginasEditarController');

    PagesService.getPages().then(function(data){
      $scope.pagesParent = data.data.items;
      console.log($scope.pagesParent);
    });

    $scope.widgets = [];
    $scope.status = [];
    $scope.columns = PagesService.COLUMNS;

    $scope.page = {
      image: null,
      status: StatusService.STATUS_PUBLISHED,
      columns: 2,
      tags: [],
      title: null,
      widgets: {
        main: [],
        side: []
      }
    };

    $scope.time_days = DateTimeHelper.getDays();
    $scope.time_months = DateTimeHelper.getMonths();
    $scope.time_years = DateTimeHelper.yearRange();
    $scope.time_hours = DateTimeHelper.getHours();
    $scope.time_minutes = DateTimeHelper.getMinutes();

    $scope.sortableOptions = {
      accept: function (sourceItemHandleScope, destSortableScope) {
        return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
      },
      containment: '#sort-main'
    };

    /**
     *
     */
    $scope.remove = function () {
      ModalService
        .confirm('Você deseja excluir a página <b>' + $scope.page.title + '</b>?', ModalService.MODAL_MEDIUM)
        .result
        .then(function () {
          PagesService.removePage($routeParams.id).then(function () {
            NotificationService.success('Página removida com sucesso.');
            $location.path('/pages');
          });
        });
    };

    /**
     * @param page
     * @param preview
     */
    $scope.publish = function (page, preview) {
      PagesService.updatePage($routeParams.id, page).then(function (page) {
        NotificationService.success('Página atualizada com sucesso.');

        if (!preview) {
          $location.path('/pages');
        } else {
          $window.open(page.data.page_url);
        }
      });
    };

    // Cover Image - Upload
    $scope.page_image = null;

    $scope.$watch('page_image', function () {
      if ($scope.page_image) {
        $scope.upload([$scope.page_image]);
      }
    });

    /**
     * Cover Image - Upload
     */
    $scope.uploadCover = function () {
      var moduleModal = $uibModal.open({
        templateUrl: 'components/modal/upload-component.template.html',
        controller: 'UploadComponentController as vm',
        backdrop: 'static',
        size: 'xl',
        resolve: {
          formats: function () {
            return ['pageCover'];
          }
        }
      });

      // Insert into textarea
      moduleModal.result.then(function (data) {
        $scope.page.image = {
          url: data.url,
          id: data.id
        };
      });
    };

    /**
     * Cover Image - Remove
     */
    $scope.removeCover = function () {
      $timeout(function () {
        $scope.page.image = '';
        $scope.$apply();
      });
    };

    // Modal - Add/Edit Module
    $scope.handleModule = function (column, idx) {
      return PagesService.module().handle($scope, column, idx);
    };

    /**
     * @param column
     * @param idx
     */
    $scope.removeModule = function (column, idx) {
      $scope.confirmationModal('md', 'Você deseja excluir este módulo?');
      removeConfirmationModal.result.then(function (data) {
        $scope.page.widgets[column].splice(idx, 1);
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

    // Get Page
    PagesService.getPage(parseInt($routeParams.id)).then(function (data) {
console.log(data.data);
      var page = data.data;
      var tags = page.tags;

      page.tags = [];

      $scope.title = $filter('format')('Editar "{0}"', page.title);
      $scope.breadcrumb_active = page.title;

      var scheduledAt = DateTimeHelper.toBrStandard(page.scheduled_at, true, true);

      page.scheduled_date = scheduledAt.date;
      page.scheduled_time = scheduledAt.time;

      angular.forEach(tags, function (tag) {
        page.tags.push(tag.name);
      });

      if (!page.widgets.side.length) {
        page.columns = 1;
      }

      angular.extend($scope.page, page);
    });

    WidgetsService.getWidgets().then(function (data) {
      $scope.widgets = data.data;
    });
  }
})();
