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

        onInit();

        function onInit() {
            _getPages();
            $scope.pagesParent.push({
                id: null,
                title: '- Página Normal -'
            });
        }

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

        TagsService.getTags().then(function (data) {
            allTags = data.data.items[0];
        });

        $scope.widgets = [];
        $scope.status = [];
        $scope.columns = PagesService.COLUMNS;

        $scope.page = {
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

        $scope.time_days = DateTimeHelper.getDays();
        $scope.time_months = DateTimeHelper.getMonths();
        $scope.time_years = DateTimeHelper.yearRange();
        $scope.time_hours = DateTimeHelper.getHours();
        $scope.time_minutes = DateTimeHelper.getMinutes();

        $scope.sortableOptions = {
            accept: function (sourceItemHandleScope, destSortableScope) {
                return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
            },
            containment: '#sort-main'
        };

        $scope.remove = function () {
            ModalService
                .confirm('Você deseja excluir a página <b>' + $scope.page.title + '</b>?',
                    ModalService.MODAL_MEDIUM)
                .result
                .then(function () {
                    PagesService.removePage($routeParams.id).then(function () {
                        NotificationService.success('Página removida com sucesso.');
                        $location.path('/pages');
                    });
                });
        };

        $scope.publish = function (page, preview) {
            if (!validationService.isValid($scope.formPage.$invalid)) {
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
        $scope.page_image = null;

        $scope.$watch('page_image', function () {
            if ($scope.page_image) {
                $scope.upload([$scope.page_image]);
            }
        });

        /**
         * Cover Image - Upload
         */
        $scope.uploadCover = function () {
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
                $scope.page.image = {
                    url: data.url,
                    id: data.id
                };
            });
        };

        /**
         * Cover Image - Remove
         */
        $scope.removeCover = function () {
            $timeout(function () {
                $scope.page.image = '';
                $scope.$apply();
            });
        };

        // Modal - Add/Edit Module
        $scope.handleModule = function (column, idx) {
            return PagesService.module().handle($scope, column, idx);
        };

        $scope.removeModule = function (column, idx) {
            $scope.confirmationModal('md', 'Você deseja excluir este módulo?');
            $scope.removeConfirmationModal.result.then(function () {
                $scope.page.widgets[column].splice(idx, 1);
            });
        };

        $scope.confirmationModal = function (size, title) {
            $scope.removeConfirmationModal = $uibModal.open({
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
            $scope.modal_title = title;

            $scope.ok = function () {
                $uibModalInstance.close();
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }

        // Get Page
        PagesService.getPage(parseInt($routeParams.id)).then(function (data) {
            var page = data.data;
            var tags = page.tags;

            page.tags = [];

            $scope.title = 'Editar ' + page.title;
            $scope.breadcrumb_active = page.title;


            angular.forEach(tags, function (tag) {
                page.tags.push(tag.name);
            });

            if (!page.widgets.side.length) {
                page.columns = 1;
            }

            page.scheduled_date = moment(data.data.post_date, 'YYYY-DD-MM').format('DD/MM/YYYY');
            page.scheduled_time = moment(data.data.post_date, 'YYYY-DD-MM hh:mm').format('hh:mm');

            angular.extend($scope.page, page);
        });

        WidgetsService.getWidgets().then(function (data) {
            $scope.widgets = data.data;
        });


        $scope.findTags = function ($query) {
            return TagsService.findTags($query, allTags);
        };

    }
})();
