(function () {
    'use strict';

    angular.module('periodicalModule')
        .controller('PeriodicalEditionEditController', PeriodicalEditionEditController);

    /** ngInject */
    function PeriodicalEditionEditController($scope,
        $uibModal,
        $routeParams,
        $location,
        $timeout,
        PeriodicalService,
        StatusService,
        ManagerFileService,
        NotificationService,
        MediaService,
        DateTimeHelper,
        $rootScope,
        $window,
        $log,
        validationService) {
        $rootScope.shownavbar = true;
        $log.info('PeriodicalEditionEditController');

        var removeConfirmationModal = {};
        var ConfirmationModalCtrl = _ConfirmationModalCtrl;
        var vm = $scope;
        vm.vm = $scope;

        vm.getYear = _getYear;


        vm.edition = {};
        vm.highlight_ufmg_visible = false;

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
            PeriodicalService
                .getEdition($routeParams.id, $routeParams.edition)
                .then(function (res) {
                    setEdition(res);
                });
        }

        function _getYear() {
            vm.edition.year = new Date(vm.edition.publish_date).getFullYear();
        }

        function setEdition(res) {
            vm.periodical = res.data.periodical;
            vm.edition.slug = res.data.slug.slug;
            vm.edition.id = res.data.id;
            vm.edition.theme = res.data.theme;
            vm.edition.resume = res.data.resume;
            vm.edition.year = res.data.year;
            vm.edition.number = parseFloat(res.data.number);
            vm.edition.publish_date = DateTimeHelper.dateToStr(res.data.publish_date);
            vm.edition.file = res.data.file ? res.data.file.id : '';
            vm.edition.cover = res.data.cover ? res.data.cover.id : '';
            vm.edition.background = res.data.background ? res.data.background.id : '';
            vm.edition.status = res.data.status;
            vm.edition.articles = [];
            vm.edition.slug = res.data.slug;
            vm.edition.post_date = res.data.post_date;
            vm.edition.publish_date = res.data.publish_date;
            vm.edition.legend = res.data.file.legend;

            _getAllArticles(vm.edition.id);

            vm.edition.cover_url = res.data.cover ? res.data.cover.url : '';
            vm.edition.background_url = res.data.background ? res.data.background.url : '';
            vm.edition.file_name = res.data.file ? res.data.file.title : '';

            vm.edition.pdf = res.data.file ? res.data.file : '';
            vm.edition.pdf_url = res.data.file ? res.data.file.url : '';

            vm.edition.scheduled_date = moment(res.data.post_date, 'YYYY-DD-MM').format('DD/MM/YYYY');
            vm.edition.scheduled_time = moment(res.data.post_date, 'YYYY-DD-MM hh:mm').format('hh:mm');
        }

        function _getAllArticles(id) {
            PeriodicalService.getEditionArticles(id).then(function (result) {
                angular.forEach(result.data.items, function (article) {
                    var obj = {
                        title: article.title,
                        subtitle: article.subtitle,
                        author_name: article.author_name,
                        page_number: article.page_number,
                        cover: article.cover ? article.cover.id : '',
                        thumb: article.thumb ? article.thumb.id : '',
                        cover_url: article.cover ? article.cover.url : '',
                        thumb_url: article.thumb ? article.thumb.url : '',
                        content: article.content,
                        slug: article.slug.slug
                    };

                    obj.tags = [];

                    angular.forEach(article.tags, function (tag) {
                        obj.tags.push(tag.name);
                    });

                    vm.edition.articles.push(obj);
                });
            });
        }

        vm.publish = function (data, preview) {
            if (!validationService.isValid(vm.formData.$invalid)) {
                return false;
            }

            var tags = [];

            angular.forEach(data.articles, function (v, k) {
                angular.forEach(data.articles[k].tags, function (val, key) {
                    if (data.articles[k].tags[key].hasOwnProperty('text')) {
                        tags.push(data.articles[k].tags[key].text);
                    }
                });

                if (tags.length > 0) {
                    data.articles[k].tags = tags;
                }

                tags = [];
            });

            PeriodicalService
                .updateEdition($routeParams.id, $routeParams.edition, data)
                .then(function (res) {
                    NotificationService.success('Edição atualizada com sucesso.');

                    if (!preview) {
                        $location.path('/periodicals/' + $routeParams.id + '/editions');
                    } else {
                        $window.open(res.data.edition_url);
                    }
                });
        };

        vm.handleArticle = function (self) {
            PeriodicalService.handleArticle(self);
        };

        vm.openArticle = function (self, idx, article) {
            PeriodicalService.handleArticle(self, idx, article);
        };

        vm.sortableOptions = {
            accept: function (sourceItemHandleScope, destSortableScope) {
                return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
            },
            containment: '#sort-main'
        };

        vm.removeArticle = function (idx) {
            vm.confirmationModal('md', 'Você deseja excluir este artigo?');
            removeConfirmationModal
                .result
                .then(function () {
                    vm.edition.articles.splice(idx, 1);
                    vm.dtInstance.DataTable.draw();
                    $timeout(function () {
                        vm.$apply();
                    });
                });
        };

        vm.confirmationModal = function (size, title) {
            removeConfirmationModal = $uibModal.open({
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
        }

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
