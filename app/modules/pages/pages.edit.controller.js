(function () {
    'use strict';

    angular
        .module('pagesModule')
        .controller('PagesEditController', PagesEditController);

    /** ngInject */
    function PagesEditController($scope,
        $uibModal,
        $location,
        $routeParams,
        $timeout,
        $window,
        NotificationService,
        PagesService,
        WidgetsService,
        StatusService,
        DateTimeHelper,
        $q,
        ModalService,
        $rootScope,
        TagsService,
        validationService,
        Util,
        $log) {
        $rootScope.shownavbar = true;
        $log.info('PaginasEditarController');
        var allTags = [];
        var ConfirmationModalCtrl = _ConfirmationModalCtrl;
        var hasRequest = false;
        var countPage = 1;
        var vm = $scope;
        vm.pagesParent = [];

        onInit();

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
        }

        TagsService.getTags().then(function (data) {
            allTags = data.data.items[0];
        });

        vm.widgets = [];
        vm.status = [];
        vm.columns = PagesService.COLUMNS;

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

        vm.remove = function () {
            ModalService
                .confirm('Você deseja excluir a página <b>' + vm.page.title + '</b>?',
                    ModalService.MODAL_MEDIUM)
                .result
                .then(function () {
                    PagesService.removePage($routeParams.id).then(function () {
                        NotificationService.success('Página removida com sucesso.');
                        $location.path('/pages');
                    });
                });
        };

        vm.publish = function (page, preview) {
            if (!validationService.isValid(vm.formData.$invalid)) {
                return false;
            }

            PagesService
                .updatePage($routeParams.id, page)
                .then(function (page) {
                    NotificationService.success('Página atualizada com sucesso.');

                    if (!preview) {
                        $location.path('/pages');
                    } else {
                        $window.open(page.data.page_url, '_black');
                    }
                });
        };

        // Cover Image - Upload
        vm.page_image = null;

        vm.$watch('page_image', function () {
            if (vm.page_image) {
                vm.upload([vm.page_image]);
            }
        });

        /**
         * Cover Image - Upload
         */
        vm.uploadCover = function () {
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
                vm.page.image = {
                    url: data.url,
                    id: data.id
                };
            });
        };

        /**
         * Cover Image - Remove
         */
        vm.removeCover = function () {
            $timeout(function () {
                vm.page.image = '';
                vm.$apply();
            });
        };

        // Modal - Add/Edit Module
        vm.handleModule = function (column, idx) {
            return PagesService.module().handle($scope, column, idx);
        };

        vm.removeModule = function (column, idx) {
            vm.confirmationModal('md', 'Você deseja excluir este módulo?');
            vm.removeConfirmationModal.result.then(function () {
                vm.page.widgets[column].splice(idx, 1);
            });
        };

        vm.confirmationModal = function (size, title) {
            vm.removeConfirmationModal = $uibModal.open({
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

        function _ConfirmationModalCtrl($scope, $uibModalInstance, title) {
            vm.modal_title = title;

            vm.ok = function () {
                $uibModalInstance.close();
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }

        // Get Page
        PagesService.getPage(parseInt($routeParams.id)).then(function (data) {
            var page = data.data;
            var tags = page.tags;

            page.tags = [];

            vm.title = 'Editar ' + page.title;
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

        WidgetsService.getWidgets().then(function (data) {
            vm.widgets = data.data;
        });


        vm.findTags = function ($query) {
            return TagsService.findTags($query, allTags);
        };

    }
})();
