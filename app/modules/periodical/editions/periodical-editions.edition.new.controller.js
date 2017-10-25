(function () {
    'use strict';

    angular.module('periodicalModule')
        .controller('PeriodicalEditionNewController', PeriodicalEditionNewController);

    /** ngInject */
    function PeriodicalEditionNewController($scope,
        $uibModal,
        $routeParams,
        $location,
        $timeout,
        DateTimeHelper,
        PeriodicalService,
        StatusService,
        NotificationService,
        ManagerFileService,
        MediaService,
        ModalService,
        $rootScope,
        $window,
        $log,
        validationService) {
        var vm = $scope;
        vm.vm = $scope;
        vm.getYear = _getYear;

        $log.info('PeriodicalEditionNewController');

        vm.edition = {};
        vm.status = [];

        onInit();


        vm.openArticle = function (self, idx, article) {
            PeriodicalService.handleArticle(self, idx, article);
        };

        function onInit() {
            vm.datepickerOpt = {
                initDate: DateTimeHelper.getDatepickerOpt()
            };

            vm.datepickerOpt.initDate.status = {
                opened: false
            };

            vm.timepickerOpt = {
                initTime: DateTimeHelper.getTimepickerOpt()
            };
        }

        function _getYear() {
            vm.edition.year = new Date(vm.edition.publish_date).getFullYear();
        }


        StatusService.getStatus().then(function (data) {
            vm.status = data.data;
        });

        PeriodicalService.getPeriodicals($routeParams.id).then(function (data) {
            vm.periodical = data.data;
        });

        vm.edition.theme = '';
        vm.edition.resume = '';
        vm.edition.publish_date = '';
        vm.edition.file = '';
        vm.edition.cover = '';
        vm.edition.background = '';
        vm.edition.status = StatusService.STATUS_DRAFT;
        vm.edition.articles = [];

        vm.publish = function (data) {
            if (!validationService.isValid(vm.formData.$invalid)) {
                return false;
            }

            if (data.status === 'scheduled') {
                data.post_date = data.scheduled_date + ' ' + data.scheduled_time;
            }

            PeriodicalService
                .newEdition($routeParams.id, data)
                .then(function (edition) {
                    NotificationService.success('Edição criada com sucesso.');
                    $location.path('/periodical/' + $routeParams.id + '/editions/edit/' + edition.data.id);
                });
        };

        vm.handleArticle = PeriodicalService.handleArticle;

        vm.sortableOptions = {
            accept: function (sourceItemHandleScope, destSortableScope) {
                return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
            },
            containment: '#sort-main'
        };

        vm.removeArticle = function (idx) {
            ModalService
                .confirm('Você deseja excluir este artigo?')
                .result
                .then(function () {
                    vm.edition.articles.splice(idx, 1);

                    $timeout(function () {
                        vm.$apply();
                    });
                });
        };

        vm.uploadPDF = function () {
            ManagerFileService.pdfFiles();
            ManagerFileService
                .open('pdf')
                .then(function (data) {
                    vm.edition.pdf = data.id;
                    vm.edition.file = data.id;
                    vm.edition.pdf_url = data.url;
                    vm.edition.legend = data.legend;
                });
        };

        vm.uploadImage = function (type) {
            var formats = {
                background: 'pageCover',
                cover: 'digitalizedCover'
            };
            ManagerFileService.imageFiles();
            ManagerFileService
                .open(formats[type])
                .then(function (image) {
                    vm.edition[type] = image.id;
                    vm.edition[type + '_url'] = image.url;
                });
        };

        vm.removeImage = function (type) {
            $timeout(function () {
                vm.edition[type] = '';
                vm.edition[type + '_url'] = '';

                vm.$apply();
            });
        };
    }
})();
