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
        var vm = $scope;

        vm.publish = _publish;
        vm.findTags = _findTags;
        vm.uploadCover = _uploadCover;
        vm.removeCover = _removeCover;
        vm.handleModule = _handleModule;
        vm.removeModule = _removeModule;

        var hasRequest = false;
        var countPage = 1;
        vm.pagesParent = [];

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
                    page_size: 10,
                    order_by: {
                        field: 'title',
                        direction: 'ASC'
                    },
                    search: search
                };
                if (!params.search && countPage === 1) {
                    vm.currentElement = 0;
                }
                PagesService
                    .getPages(Util.getParams(params, searchQuery))
                    .then(function (res) {
                        countPage++;
                        vm.currentElement += res.data.items.length;
                        if (res.data.total > vm.currentElement && 10 >= res.data.items.length) {
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

        vm.loadMore = function (search) {
            reset(vm.pagesParent);
            loadMore(vm.pagesParent, search)
                .then(function (data) {
                    vm.pagesParent = Object.assign(vm.pagesParent, data);
                });
        };

        function reset(data) {
            if (angular.isUndefined(data[0])) {
                countPage = 1;
                vm.currentElement = 0;
            }
        }

        function onInit() {
            vm.pagesParent.push({
                id: null,
                title: '- Página Normal -'
            });

            WidgetsService.getWidgets().then(function (data) {
                vm.widgets = data.data;
            });

            vm.title = 'Nova Página';
            vm.breadcrumb_active = vm.title;

            vm.publishment = StatusService.STATUS_PUBLISHED;
            vm.widgets = [];
            vm.columns = PagesService.COLUMNS;

            vm.time_days = DateTimeHelper.getDays();
            vm.time_months = DateTimeHelper.getMonths();
            vm.time_years = ['2015', '2016', '2017'];
            vm.time_hours = DateTimeHelper.getHours();
            vm.time_minutes = DateTimeHelper.getMinutes();

            vm.sortableOptions = {
                accept: function (sourceItemHandleScope, destSortableScope) {
                    return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
                },
                containment: '#sort-main'
            };

            vm.page_cover = null;

            vm.page = {
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
            if (!validationService.isValid(vm.formData.$invalid)) {
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
                vm.page.image = {
                    url: data.url,
                    id: data.id
                };
            });
        }

        function _removeCover() {
            $timeout(function () {
                vm.page.image = '';
                vm.$apply();
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
                    vm.page.widgets[column].splice(idx, 1);
                });
        }

        onInit();
    }
})();
