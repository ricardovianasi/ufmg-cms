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
    'MediaService',
    'NotificationService',
    'PagesService',
    'WidgetsService',
    'StatusService',
    'DateTimeHelper'
  ];

  function PagesEditController($scope,
                               $uibModal,
                               $location,
                               $routeParams,
                               $timeout,
                               $filter,
                               MediaService,
                               NotificationService,
                               PagesService,
                               WidgetsService,
                               StatusService,
                               DateTimeHelper) {
    console.log('... PaginasEditarController');

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
    $scope.time_years = ['2015', '2016', '2017'];
    $scope.time_hours = DateTimeHelper.getHours();
    $scope.time_minutes = DateTimeHelper.getMinutes();

    $scope.sortableOptions = {
      accept: function (sourceItemHandleScope, destSortableScope) {
        return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
      },
      containment: '#sort-main'
    };

    $scope.remove = function () {
      PagesService.removePage($routeParams.id).then(function () {
        NotificationService.success('Página removida com sucesso.');
        $location.path('/pages');
      });
    };

    // Publish
    $scope.publish = function (page) {
      PagesService.updatePage($routeParams.id, page).then(function () {
        NotificationService.success('Página atualizada com sucesso.');
        $location.path('/pages');
      });
    };

    // Cover Image - Upload
    $scope.$watch('page_image', function () {
      if ($scope.page_image) {
        $scope.upload([$scope.page_image]);
      }
    });

    $scope.upload = function (files) {
      angular.forEach(files, function (file) {
        MediaService.newFile(file).then(function (data) {
          $scope.page.image = {
            id: data.id,
            url: data.url
          };
        });
      });
    };

    $scope.removeImage = function () {
      $timeout(function () {
        $scope.page.image = '';
        $scope.$apply();
      });
    };

    // Modals
    $scope.addModule = function (column) {
      var moduleModal = $uibModal.open({
        templateUrl: 'components/modal/module.modal.template.html',
        controller: 'ModuleModalController',
        backdrop: 'static',
        size: 'lg',
        resolve: {
          module: function () {
            return false;
          },
          widgets: function () {
            return $scope.widgets;
          },
          extraContent: function () {
            return {
              icons: $scope.icons,
              events: $scope.events,
              pages: $scope.pages,
              news: $scope.news,
              tags: $scope.tags,
              news_types: $scope.news_types,
              galleries: $scope.galleries,
              categories: $scope.categories,
              media: $scope.media
            };
          }
        }
      });

      moduleModal.result.then(function (data) {
        $scope.page.widgets[column].push(data);
      });
    };

    var editModuleModal;

    $scope.editModule = function (column, idx) {
      editModuleModal = $uibModal.open({
        templateUrl: 'components/modal/module.modal.template.html',
        controller: 'ModuleModalController',
        backdrop: 'static',
        size: 'lg',
        resolve: {
          module: function () {
            return $scope.page.widgets[column][idx];
          },
          widgets: function () {
            return $scope.widgets;
          },
          extraContent: function () {
            return {
              icons: $scope.icons,
              events: $scope.events,
              pages: $scope.pages,
              news: $scope.news,
              tags: $scope.tags,
              news_types: $scope.news_types,
              galleries: $scope.galleries,
              categories: $scope.categories,
              media: $scope.media
            };
          }
        }
      });

      editModuleModal.result.then(function (data) {
        $scope.page.widgets[column][idx] = data;
      });
    };

    $scope.removeModule = function (column, idx) {
      $scope.confirmationModal('md', 'Você deseja excluir este módulo?');
      removeConfirmationModal.result.then(function (data) {
        $scope.page.widgets[column].splice(idx, 1);
      });
    };

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
