;(function () {
  'use strict';

  angular.module('pagesModule')
    .controller('PagesNewController', PagesNewController);

  PagesNewController.$inject = [
    '$scope',
    '$uibModal',
    '$location',
    '$timeout',
    'EventsService',
    'GalleryService',
    'MediaService',
    'NewsService',
    'NotificationService',
    'PagesService',
    'StatusService',
    'TagsService',
    'WidgetsService',
    'DateTimeHelper'
  ];

  function PagesNewController($scope,
                              $uibModal,
                              $location,
                              $timeout,
                              EventsService,
                              GalleryService,
                              MediaService,
                              NewsService,
                              NotificationService,
                              PagesService,
                              StatusService,
                              TagsService,
                              WidgetsService,
                              DateTimeHelper) {
    console.log('... PaginasNovoController');

    $scope.title = 'Nova Página';
    $scope.breadcrumb_active = $scope.title;

    $scope.publishment = 'published';
    $scope.widgets = [];
    $scope.status = [];
    $scope.galleries = [];
    $scope.categories = [];
    $scope.news = [];
    $scope.pages = [];
    $scope.events = [];
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

    $scope.page_image = null;
    $scope.page = {
      image: null,
      scheduled_at: {},
      status: 'published',
      columns: 2,
      tags: [],
      title: null,
      widgets: {
        main: [],
        side: []
      }
    };

    // Publish
    $scope.publish = function (page) {
      PagesService.addPage(page).then(function () {
        NotificationService.success('Página criada com sucesso.');
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
          $scope.page.image = {url: data.url, id: data.id};
        });
      });
    };

    $scope.removeImage = function () {
      $timeout(function () {
        $scope.page.image = '';
        $scope.$apply();
      });
    };

    // Modal - Add/Edit Module
    // Modals
    $scope.addModule = function (column) {
      var moduleModal = $uibModal.open({
        templateUrl: '/components/modal/module.modal.template.html',
        controller: 'ModuleModalController',
        backdrop: 'static',
        size: 'lg',
        resolve: {
          module: function () {
            return false;
          },
          widgets: function () {
            return $scope.widgets;
          }
          //extraContent: function () {
          //  return {
          //    icons: $scope.icons,
          //    events: $scope.events,
          //    pages: $scope.pages,
          //    news: $scope.news,
          //    tags: $scope.tags,
          //    news_types: $scope.news_types,
          //    galleries: $scope.galleries,
          //    categories: $scope.categories
          //  };
          //}
        }
      });

      moduleModal.result.then(function (data) {
        $scope.page.widgets[column].push(data);
      });
    };

    var editModuleModal;

    $scope.editModule = function (column, idx) {
      editModuleModal = $uibModal.open({
        templateUrl: '/components/modal/module.modal.template.html',
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
              categories: $scope.categories
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
      removeConfirmationModal.result.then(function () {
        $scope.page.widgets[column].splice(idx, 1);
      });
    };

    var removeConfirmationModal;

    $scope.confirmationModal = function (size, title) {
      removeConfirmationModal = $uibModal.open({
        templateUrl: '/components/modal/confirmation.modal.template.html',
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

    WidgetsService.getWidgets().then(function (data) {
      $scope.widgets = data.data;
    });

    //StatusService.getStatus().then(function (data) {
    //  $scope.status = data.data;
    //});
    //
    //GalleryService.getGalleries().then(function (data) {
    //  $scope.galleries = data.data;
    //});
    //
    //GalleryService.getCategories().then(function (data) {
    //  $scope.categories = data.data;
    //});
    //
    //PagesService.getPages().then(function (data) {
    //  $scope.pages = data.data;
    //});
    //
    //EventsService.getEvents().then(function (data) {
    //  $scope.events = data.data;
    //});
    //
    //NewsService.getNews().then(function (data) {
    //  $scope.news = data.data;
    //});
  }
})();
