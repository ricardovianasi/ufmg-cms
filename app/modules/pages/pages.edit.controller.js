;(function () {
  'use strict';

  angular.module('PagesEditControllerModule', [
      'EventsServiceModule',
      'GalleryServiceModule',
      'MediaServiceModule',
      'NewsServiceModule',
      'NotificationServiceModule',
      'ModuleServiceModule',
      'PagesServiceModule',
      'StatusServiceModule',
      'TagsServiceModule',
      'WidgetsServiceModule',
      'DateTimeHelperModule',
      'FormatFilterModule',
      'PublishmentDirectiveModule',
      'ngSanitize',
      'ui.select',
      'as.sortable',
      'ngFileUpload',
      'angular-redactor',
      'ngCropper'
    ])
    .controller('PagesEditController', [
      '$scope',
      '$http',
      '$modal',
      '$location',
      '$routeParams',
      '$timeout',
      '$filter',
      'EventsService',
      'GalleryService',
      'MediaService',
      'ModuleService',
      'NewsService',
      'NotificationService',
      'PagesService',
      'StatusService',
      'TagsService',
      'WidgetsService',
      'DateTimeHelper',
      function ($scope,
                $http,
                $modal,
                $location,
                $routeParams,
                $timeout,
                $filter,
                EventsService,
                GalleryService,
                MediaService,
                ModuleService,
                NewsService,
                NotificationService,
                PagesService,
                StatusService,
                TagsService,
                WidgetsService,
                DateTimeHelper) {
        console.log('... PaginasEditarController');

        $scope.widgets = [];
        $scope.status = [];
        $scope.galleries = [];
        $scope.categories = [];
        $scope.news_types = [];
        $scope.tags = [];
        $scope.news = [];
        $scope.pages = [];
        $scope.events = [];
        $scope.icons = [];
        $scope.columns = PagesService.COLUMNS;
        $scope.media = [];

        $scope.page = {
          image: null,
          status: 'published',
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
          var moduleModal = $modal.open({
            templateUrl: '/views/module.modal.template.html',
            controller: ModuleModalCtrl,
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
          editModuleModal = $modal.open({
            templateUrl: '/views/module.modal.template.html',
            controller: ModuleModalCtrl,
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
          removeConfirmationModal = $modal.open({
            templateUrl: '/views/confirmation.modal.template.html',
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

        var ConfirmationModalCtrl = function ($scope, $modalInstance, title) {
          $scope.modal_title = title;

          $scope.ok = function () {
            $modalInstance.close();
          };
          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        };

        var ModuleModalCtrl = ModuleModalController;

        // Pages Service
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

        PagesService.getPages().then(function (data) {
          $scope.pages = data.data;
        });

        // News Service
        NewsService.getNewsTypes().then(function (data) {
          $scope.news_types = data.data;
        });

        NewsService.getNews().then(function (data) {
          $scope.news = data.data;
        });

        // Widgets Service
        WidgetsService.getWidgets().then(function (data) {
          $scope.widgets = data.data;
        });

        // Status Service
        StatusService.getStatus().then(function (data) {
          $scope.status = data.data;
        });

        // Gallery Service
        GalleryService.getGalleries().then(function (data) {
          $scope.galleries = data.data;
        });

        GalleryService.getCategories().then(function (data) {
          $scope.categories = data.data;
        });

        // Tags Service
        TagsService.getTags().then(function (data) {
          $scope.tags = data.data;
        });

        // Events Service
        EventsService.getEvents().then(function (data) {
          $scope.events = data.data;
        });

        // Media Service
        MediaService.getIcons().then(function (data) {
          $scope.icons = data.data;
        });

        MediaService.getMedia().then(function (data) {
          $scope.media = data.data;
        });
      }
    ]);
})();
