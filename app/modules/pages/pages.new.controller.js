(function () {
    'use strict';

    angular.module('pagesModule')
        .controller('PagesNewController', PagesNewController);
    /** ngInject */
    function PagesNewController(
        $scope,
        $uibModal,
        $location,
        $timeout,
        $window,
        NotificationService,
        PagesService,
        ManagerFileService,
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
        $log
    ) {

        var allTags = [];
        var vm = $scope;
        var hasRequest = false;
        var countPage = 1;

        vm.pagesParent = [];
        vm.title = 'Nova página';

        vm.publish = _publish;
        vm.findTags = _findTags;
        vm.uploadCover = _uploadCover;
        vm.removeImage = _removeImage;
        vm.handleModule = _handleModule;
        vm.removeModule = _removeModule;
        vm.loadMorePage = _loadMorePage;
        vm.removeModuleMain = _removeModuleMain;
        vm.removeModuleSide = _removeModuleSide;

        function onInit() {
            $log.info('PagesNewController');
            vm.pagesParent.push({
                id: null,
                title: '- Página Normal -'
            });

            vm.widgets = [];

            vm.title = 'Nova Página';
            vm.breadcrumb_active = vm.title;

            vm.publishment = StatusService.STATUS_PUBLISHED;
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

            WidgetsService
                .getWidgets()
                .then(function (data) {
                    vm.widgets = data.data;
                });

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
            reset(vm.pagesParent);
            loadMore(vm.pagesParent, search)
                .then(function (data) {
                    vm.pagesParent = Object.assign(vm.pagesParent, data);
                });
        }

        function reset(data) {
            if (angular.isUndefined(data[0])) {
                countPage = 1;
                vm.currentElement = 0;
            }
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

        onInit();
    }
})();
