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


        $scope.edition = {};
        $scope.highlight_ufmg_visible = false;

        onInit();

        function onInit() {
            PeriodicalService
                .getEdition($routeParams.id, $routeParams.edition)
                .then(function (res) {
                    setEdition(res);
                });
        }

        function setEdition(res) {
            $scope.periodical = res.data.periodical;
            $scope.edition.slug = res.data.slug.slug;
            $scope.edition.id = res.data.id;
            $scope.edition.theme = res.data.theme;
            $scope.edition.resume = res.data.resume;
            $scope.edition.year = res.data.year;
            $scope.edition.number = parseFloat(res.data.number);
            $scope.edition.publish_date = DateTimeHelper.dateToStr(res.data.publish_date);
            $scope.edition.file = res.data.file ? res.data.file.id : '';
            $scope.edition.cover = res.data.cover ? res.data.cover.id : '';
            $scope.edition.background = res.data.background ? res.data.background.id : '';
            $scope.edition.status = res.data.status;
            $scope.edition.articles = [];
            $scope.edition.slug = res.data.slug;

            _getAllArticles($scope.edition.id);

            $scope.edition.cover_url = res.data.cover ? res.data.cover.url : '';
            $scope.edition.background_url = res.data.background ? res.data.background.url : '';
            $scope.edition.file_name = res.data.file ? res.data.file.title : '';

            $scope.edition.pdf = res.data.file ? res.data.file : '';
            $scope.edition.pdf_url = res.data.file ? res.data.file.url : '';

            $scope.edition.scheduled_date = moment(res.data.post_date, 'YYYY-DD-MM').format('DD/MM/YYYY');
            $scope.edition.scheduled_time = moment(res.data.post_date, 'YYYY-DD-MM hh:mm').format('hh:mm');
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

                    $scope.edition.articles.push(obj);
                });
            });
        }

        $scope.publish = function (data, preview) {
            if (!validationService.isValid($scope.formEditions.$invalid)) {
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


        $scope.handleArticle = function (self) {
            PeriodicalService.handleArticle(self);
        };

        $scope.openArticle = function (self, idx, article) {
            PeriodicalService.handleArticle(self, idx, article);
        };

        $scope.sortableOptions = {
            accept: function (sourceItemHandleScope, destSortableScope) {
                return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
            },
            containment: '#sort-main'
        };

        $scope.removeArticle = function (idx) {
            $scope.confirmationModal('md', 'Você deseja excluir este artigo?');
            removeConfirmationModal
                .result
                .then(function () {
                    $scope.edition.articles.splice(idx, 1);
                    $scope.dtInstance.DataTable.draw();
                    $timeout(function () {
                        $scope.$apply();
                    });
                });
        };

        $scope.confirmationModal = function (size, title) {
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
            $scope.modal_title = title;

            $scope.ok = function () {
                $uibModalInstance.close();
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }

        // Upload
        // PDF
        $scope.edition_file = null;

        $scope.$watch('edition_file', function () {
            if ($scope.edition_file) {
                $scope.uploadFile($scope.edition_file);
            }
        });

        $scope.uploadFile = function (file) {
            MediaService.newFile(file).then(function (data) {
                $scope.edition.pdf = data.id;
                $scope.edition.file = data.id;
                $scope.edition.pdf_url = data.url;
            });
        };

        $scope.uploadImage = function (type) {
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
                $scope.edition[type] = data.id;
                $scope.edition[type + '_url'] = data.url;
            });
        };

        $scope.removeImage = function (type) {
            $timeout(function () {
                $scope.edition[type] = '';
                $scope.edition[type + '_url'] = '';

                $scope.$apply();
            });
        };
    }
})();
