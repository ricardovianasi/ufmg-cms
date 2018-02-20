(function () {
    'use strict';

    angular.module('pagesModule')
        .controller('PagesNewController', PagesNewController);
    /** ngInject */
    function PagesNewController($scope, $uibModal, $location, $timeout, $window, NotificationService, PagesService,
        ManagerFileService, WidgetsService, StatusService, ModalService, DateTimeHelper, $rootScope,
        Util, $q, HandleChangeService, validationService, UsersService) {

        var vm = $scope;
        var hasRequest = false;
        var countPage = 1;

        vm.pagesParent = [];
        vm.title = 'Nova página';

        vm.publish = _publish;
        vm.uploadCover = _uploadCover;
        vm.removeImage = _removeImage;
        vm.handleModule = handleModule;
        vm.removeModule = _removeModule;
        vm.loadMorePage = _loadMorePage;
        vm.removeModuleMain = _removeModuleMain;
        vm.removeModuleSide = _removeModuleSide;

        function onInit() {

            vm.pagesParent.push({
                id: null,
                title: '- Página Normal -'
            });

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

            _getType();

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

            HandleChangeService.registerHandleChange('/page', ['POST'], $scope, ['page'], _evenedObj);
        }

        function _evenedObj(obj) {
            return HandleChangeService.removePropsCommon(obj);
        }

        function _getType() {
            PagesService.getType()
                .then(function (res) {
                    vm.typesData = res.data;
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

        function _handleWidgetsToSave(page) {
            let widgets = {
                main: WidgetsService.parseListWidgetsToSave(page.widgets.main),
                side: WidgetsService.parseListWidgetsToSave(page.widgets.side)
            };
            return widgets;
        }

        function _publish(page) {
            if (!validationService.isValid(vm.formData.$invalid)) {
                return false;
            }
            vm.isLoading = true; 
            page.widgetsSave = _handleWidgetsToSave(page);
            PagesService
                .addPage(page)
                .then(function (page) {
                    NotificationService.success('Página criada com sucesso.');
                    $location.path('/page/edit/' + page.data.id);
                })
                .catch(function(error) { console.error(error); })
                .then(function() {vm.isLoading = false;});
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

        function handleModule(column, idx) {
            let widgetSelected = vm.page.widgets[column][idx];
            WidgetsService.openWidgetModal(widgetSelected)
                .then(function (data) {
                    _updateModule(data, column, idx);
                });
        }

        function _updateModule(data, column, idx) {
            if (typeof idx !== 'undefined') {
                vm.page.widgets[column][idx] = data;
            } else {
                vm.page.widgets[column].push(data);
            }
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
