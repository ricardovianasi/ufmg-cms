;(function () {
  'use strict';

  angular.module('pagesModule')
    .controller('PagesNewController', PagesNewController);

  PagesNewController.$inject = [
    '$scope',
    '$uibModal',
    '$location',
    '$timeout',
    'MediaService',
    'NotificationService',
    'PagesService',
    'WidgetsService',
    'StatusService',
    'DateTimeHelper'
  ];

  function PagesNewController($scope,
                              $uibModal,
                              $location,
                              $timeout,
                              MediaService,
                              NotificationService,
                              PagesService,
                              WidgetsService,
                              StatusService,
                              DateTimeHelper) {
    console.log('... PagesNewController');

    WidgetsService.getWidgets().then(function (data) {
      $scope.widgets = data.data;
    });

    $scope.title = 'Nova Página';
    $scope.breadcrumb_active = $scope.title;

    $scope.publishment = StatusService.STATUS_PUBLISHED;
    $scope.widgets = [];
    $scope.columns = PagesService.COLUMNS;

    $scope.time_days = DateTimeHelper.getDays();
    $scope.time_months = DateTimeHelper.getMonths();
    $scope.time_years = ['2015', '2016', '2017'];
    $scope.time_hours = DateTimeHelper.getHours();
    $scope.time_minutes = DateTimeHelper.getMinutes();

    $scope.sortableOptions = {
      accept: function (sourceItemHandleScope, destSortableScope) {
        return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
      },
      containment: '#sort-main'
    };

    $scope.page_cover = null;
    $scope.page = {
      image: null,
      scheduled_at: {},
      status: StatusService.STATUS_PUBLISHED,
      columns: 2,
      tags: [],
      title: null,
      widgets: {
        main: [],
        side: []
      }
    };

    /**
     * Publish
     *
     * @param page
     */
    $scope.publish = function (page) {
      PagesService.addPage(page).then(function () {
        NotificationService.success('Página criada com sucesso.');
        $location.path('/pages');
      });
    };

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

    /**
     * Modal - Add/Edit Module
     *
     * @param column
     * @param idx
     *
     * @returns {*}
     */
    $scope.handleModule = function (column, idx) {
      return PagesService.module().handle($scope, column, idx);
    };

    /**
     * @param column
     * @param idx
     */
    $scope.removeModule = function (column, idx) {
      $scope.confirmationModal('md', 'Você deseja excluir este módulo?');
      removeConfirmationModal.result.then(function () {
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
  }
})();
