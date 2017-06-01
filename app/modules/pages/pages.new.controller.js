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
        $q,
        validationService,
        UsersService,
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


        $scope.loadMorePage = function (search) {
            reset($scope.pagesParent);
            loadMore($scope.pagesParent, search)
                .then(function (data) {
                    $scope.pagesParent = Object.assign($scope.pagesParent, data);
                });
        };

        function reset(data) {
            if (angular.isUndefined(data[0])) {
                countPage = 1;
                $scope.currentElement = 0;
                $scope.pagesParent.push({
                    id: null,
                    title: '- Página Normal -'
                });
            }
        }

        function loadMore(dataTemp, search) {
            var defer = $q.defer();
            var searchQuery = 'title';
            if (search || !hasRequest) {
                if (search) {
                    countPage = 1;
                    dataTemp = [];
                } else {
                    if (countPage === 1) {
                        dataTemp = [];
                    }
                    hasRequest = true;
                }
                var params = {
                    page: countPage,
                    page_size: 15,
                    order_by: {
                        field: 'title',
                        direction: 'ASC'
                    },
                    search: search
                };
                if (!params.search && countPage === 1) {
                    $scope.currentElement = 0;
                }
                UsersService
                    .getUsers(Util.getParams(params, searchQuery))
                    .then(function (res) {
                        countPage++;
                        $scope.currentElement += res.data.items.length;
                        if (res.data.total > $scope.currentElement && 15 >= res.data.items.length) {
                            $timeout(function () {
                                hasRequest = false;
                            }, 100);
                        }
                        for (var index = 0; index < res.data.items.length; index++) {
                            dataTemp.push(res.data.items[index]);
                        }
                        defer.resolve(dataTemp);
                    });
            }
            return defer.promise;
        }

        function onInit() {
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
