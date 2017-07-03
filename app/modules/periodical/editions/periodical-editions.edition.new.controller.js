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
        MediaService,
        ModalService,
        $rootScope,
        $window,
        $log,
        validationService) {
        var vm = $scope;
        vm.vm = $scope;
        vm.getYear = _getYear;

        $rootScope.shownavbar = true;
        $log.info('PeriodicalEditionNewController');

        vm.edition = {};
        vm.status = [];

        onInit();

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

        vm.publish = function (data, preview) {
            if (!validationService.isValid(vm.formData.$invalid)) {
                return false;
            }

            if (data.status === 'scheduled') {
                data.post_date = data.scheduled_date + ' ' + data.scheduled_time;
            }

            PeriodicalService.newEdition($routeParams.id, data).then(function (data) {
                NotificationService.success('Edição criada com sucesso.');

                if (!preview) {
                    $location.path('/periodicals/' + $routeParams.id + '/editions');
                } else {
                    $window.open(data.data.edition_url);
                    $location.path('/periodicals/' + $routeParams.id + '/edition/edit/' + data.data.id);
                }
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

        // Upload
        // PDF
        vm.edition_file = null;

        vm.$watch('edition_file', function () {
            if (vm.edition_file) {
                vm.uploadFile(vm.edition_file);
            }
        });

        /**
         * Upload files like pdf, txt, doc, etc. Not for images
         */
        vm.uploadFile = function (file) {
            MediaService.newFile(file).then(function (data) {
                vm.edition.pdf = data.id;
                vm.edition.file = data.id;
                vm.edition.pdf_url = data.url;
            });
        };

        vm.uploadImage = function (type) {
            var moduleModal = $uibModal.open({
                templateUrl: 'components/modal/upload-component.template.html',
                controller: 'UploadComponentController as vm',
                backdrop: 'static',
                size: 'xl',
                resolve: {
                    formats: function () {
                        var formats = {
                            background: 'pageCover',
                            cover: 'digitalizedCover'
                        };

                        return [formats[type]];
                    }
                }
            });

            moduleModal.result.then(function (data) {
                vm.edition[type] = data.id;
                vm.edition[type + '_url'] = data.url;
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
