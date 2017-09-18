(function () {
    'use strict';

    angular
        .module('pagesModule')
        .controller('PagesEditController', PagesEditController);

    /** ngInject */
    function PagesEditController(
        $scope,
        $uibModal,
        $location,
        $routeParams,
        $timeout,
        $window,
        NotificationService,
        PagesService,
        ManagerFileService,
        WidgetsService,
        StatusService,
        DateTimeHelper,
        $q,
        ModalService,
        $rootScope,
        TagsService,
        validationService,
        Util,
        $log
    ) {

        var allTags = [];
        var hasRequest = false;
        var countPage = 1;
        var vm = $scope;

        vm.pagesParent = [];
        vm.typesData = {};

        vm.loadMorePage = _loadMorePage;
        vm.findTags = _findTags;
        vm.remove = _remove;
        vm.publish = _publish;
        vm.uploadCover = _uploadCover;
        vm.removeImage = _removeImage;
        vm.handleModule = _handleModule;
        vm.removeModuleMain = _removeModuleMain;
        vm.removeModuleSide = _removeModuleSide;

        onInit();

        function onInit() {
            $log.info('PaginasEditarController');

            vm.widgets = [];
            vm.status = [];
            vm.columns = PagesService.COLUMNS;
            vm.title = 'Edição de página';

            vm.page = {
                image: null,
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
            vm.time_days = DateTimeHelper.getDays();
            vm.time_months = DateTimeHelper.getMonths();
            vm.time_years = DateTimeHelper.yearRange();
            vm.time_hours = DateTimeHelper.getHours();
            vm.time_minutes = DateTimeHelper.getMinutes();
            vm.sortableOptions = {
                accept: function (sourceItemHandleScope, destSortableScope) {
                    return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
                },
                containment: '#sort-main'
            };
            _getPage();
            _getTags();
            _getWidgets();
            _getType();
        }

        function _getType() {
            PagesService.getType()
                .then(function (res) {
                    vm.typesData = res.data;
                });
        }

        function _getTags() {
            TagsService
                .getTags()
                .then(function (data) {
                    allTags = data.data.items[0];
                });
        }

        function _loadMore(dataTemp, search) {
            var defer = $q.defer();
            var searchQuery = 'title';
            if (search || !hasRequest) {
                if (search) {
                    countPage = 1;
                    dataTemp = [];
                    dataTemp[0] = {
                        id: null,
                        title: '- Página Normal -'
                    };
                } else {
                    if (countPage === 1) {
                        dataTemp = [];
                        dataTemp[0] = {
                            id: null,
                            title: '- Página Normal -'
                        };
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
                    .getPages(Util.getParams(params, searchQuery), true)
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

        function _loadMorePage(search) {
            _reset(vm.pagesParent);
            _loadMore(vm.pagesParent, search)
                .then(function (data) {
                    vm.pagesParent = Object.assign(vm.pagesParent, data);
                });
        }

        function _reset(data) {
            if (angular.isUndefined(data[0])) {
                countPage = 1;
                vm.currentElement = 0;
            }
        }

        function _remove() {
            ModalService
                .confirm('Você deseja excluir a página <b>' + vm.page.title + '</b>?',
                    ModalService.MODAL_MEDIUM)
                .result
                .then(function () {
                    PagesService
                        .removePage($routeParams.id)
                        .then(function () {
                            NotificationService.success('Página removida com sucesso.');
                            $location.path('/page');
                        });
                });
        }

        function _publish(page, preview) {
            if (!validationService.isValid(vm.formData.$invalid)) {
                return false;
            }
            PagesService
                .updatePage($routeParams.id, page)
                .then(function (page) {
                    if (preview) {
                        NotificationService.success('Página salva como rascunho.');
                        $window.open(page.data.page_url, '_black');
                    } else {
                        NotificationService.success('Página atualizada com sucesso.');
                        $location.path('/page');
                    }
                });
        }

        function _uploadCover() {
            ManagerFileService
                .imageFiles()
                .open('pageCover')
                .then(function (image) {
                    vm.page.image = {
                        url: image.url,
                        id: image.id
                    };
                });
        }

        function _removeImage() {
            $timeout(function () {
                vm.page.image = '';
                vm.$apply();
            });
        }

        function _handleModule(column, index) {
            return PagesService
                .module()
                .handle($scope, column, index);
        }

        function _removeModule(column, index) {
            ModalService
                .confirm('Você deseja excluir o modulo <b>' +
                    vm.page.widgets[column][index].title + '</b>?',
                    ModalService.MODAL_MEDIUM)
                .result
                .then(function () {
                    vm.page.widgets[column].splice(index, 1);
                    NotificationService.success('Modulo removido com sucesso.');
                });
        }

        function _removeModuleMain(index) {
            _removeModule('main', index);
        }

        function _removeModuleSide(index) {
            _removeModule('side', index);
        }

        function _getPage() {
            PagesService
                .getPage(parseInt($routeParams.id))
                .then(function (data) {
                    var page = data.data;
                    var tags = page.tags;

                    page.tags = [];

                    vm.title = page.title;
                    vm.breadcrumb_active = page.title;


                    angular.forEach(tags, function (tag) {
                        page.tags.push(tag.name);
                    });

                    if (!page.widgets.side.length) {
                        page.columns = 1;
                    }

                    page.scheduled_date = moment(data.data.post_date, 'YYYY-DD-MM').format('DD/MM/YYYY');
                    page.scheduled_time = moment(data.data.post_date, 'YYYY-DD-MM hh:mm').format('hh:mm');

                    angular.extend(vm.page, page);
                });
        }

        function _getWidgets() {
            WidgetsService.getWidgets().then(function (data) {
                vm.widgets = data.data;
            });
        }

        function _findTags($query) {
            return TagsService.findTags($query, allTags);
        }

    }
})();
