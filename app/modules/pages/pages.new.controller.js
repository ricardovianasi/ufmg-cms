(function () {
    'use strict';

    angular.module('pagesModule')
        .controller('PagesNewController', PagesNewController);
    /** ngInject */
    function PagesNewController($scope,
        $uibModal,
        $location,
        $timeout,
        $window,
        NotificationService,
        PagesService,
        WidgetsService,
        StatusService,
        ModalService,
        DateTimeHelper,
        $rootScope,
        TagsService,
        Util,
        validationService,
        $log) {
        $rootScope.shownavbar = true;
        $log.info('PagesNewController');
        var allTags = [];

        $scope.publish = _publish;
        $scope.findTags = _findTags;
        $scope.uploadCover = _uploadCover;
        $scope.removeCover = _removeCover;
        $scope.handleModule = _handleModule;
        $scope.removeModule = _removeModule;

        var hasRequest = false;
        var countPage = 1;
        $scope.pagesParent = [];
        $scope.loadMore = function (search) {
            if (search) {
                countPage = 1;
                $scope.pagesParent = [];
                _getPages(search);
                return;
            }
            if (!hasRequest) {
                if (countPage === 1) {
                    $scope.pagesParent = [];
                }
                hasRequest = true;
                _getPages();
            }
        };

        function _getPages(search) {
            var params = {
                page: countPage,
                page_size: 15,
                order_by: {
                    field: 'postDate',
                    direction: 'DESC'
                },
                search: search
            };

            PagesService
                .getPages(Util.getParams(params, 'title'))
                .then(function (res) {
                    countPage++;
                    for (var index = 0; index < res.data.items.length; index++) {
                        var element = res.data.items[index];
                        $scope.pagesParent.push(element);
                    }
                    $scope.currentElement = $scope.pagesParent.length;
                    if (res.data.total >= $scope.currentElement && 15 >= res.data.items.length) {
                        hasRequest = false;
                    }
                });
        }


        function onInit() {
            _getPages();
            $scope.pagesParent.push({
                id: null,
                title: '- Página Normal -'
            });

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
                parent: null,
                title: null,
                widgets: {
                    main: [],
                    side: []
                }
            };

            TagsService
                .getTags()
                .then(function (data) {
                    allTags = data.data.items[0];
                });
        }

        function _findTags($query) {
            return TagsService.findTags($query, allTags);
        }

        function _publish(page, preview) {
            if (!validationService.isValid($scope.formPage.$invalid)) {
                return false;
            }

            PagesService
                .addPage(page)
                .then(function (page) {
                    NotificationService.success('Página criada com sucesso.');
                    if (!preview) {
                        $location.path('/pages');
                    } else {
                        $window.open(page.data.page_url, '_black');
                        $location.path('/pages/edit/' + page.data.id);
                    }
                });
        }

        function _uploadCover() {
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

            moduleModal.result.then(function (data) {
                $scope.page.image = {
                    url: data.url,
                    id: data.id
                };
            });
        }

        function _removeCover() {
            $timeout(function () {
                $scope.page.image = '';
                $scope.$apply();
            });
        }

        function _handleModule(column, idx) {
            return PagesService
                .module()
                .handle($scope, column, idx);
        }

        function _removeModule(column, idx) {
            ModalService
                .confirm('Você deseja excluir este módulo?')
                .result
                .then(function () {
                    $scope.page.widgets[column].splice(idx, 1);
                });
        }

        onInit();
    }
})();
