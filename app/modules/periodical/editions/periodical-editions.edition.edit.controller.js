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
        PermissionService,
        $window,
        $log,
        validationService) {
        $rootScope.shownavbar = true;
        $log.info('PeriodicalEditionEditController');

        $scope.edition = {};
        $scope.status = [];
        $scope.highlight_ufmg_visible = false;

        StatusService.getStatus().then(function (data) {
            $scope.status = data.data;
        });

        PeriodicalService.getEdition($routeParams.id, $routeParams.edition).then(function (data) {
            $scope.canPermission = PermissionService.canPost('periodical');
            $scope.periodical = data.data.periodical;
            $scope.edition.slug = data.data.slug.slug;
            $scope.edition.id = data.data.id;
            $scope.edition.theme = data.data.theme;
            $scope.edition.resume = data.data.resume;
            $scope.edition.year = data.data.year;
            $scope.edition.number = parseFloat(data.data.number);
            $scope.edition.publish_date = DateTimeHelper.dateToStr(data.data.publish_date);
            $scope.edition.file = data.data.file ? data.data.file.id : '';
            $scope.edition.cover = data.data.cover ? data.data.cover.id : '';
            $scope.edition.background = data.data.background ? data.data.background.id : '';
            $scope.edition.status = data.data.status;
            $scope.edition.articles = [];
            $scope.edition.slug = data.data.slug;

            _getAllArticles($scope.edition.id);

            $scope.edition.cover_url = data.data.cover ? data.data.cover.url : '';
            $scope.edition.background_url = data.data.background ? data.data.background.url : '';
            $scope.edition.file_name = data.data.file ? data.data.file.title : '';

            $scope.edition.pdf = data.data.file ? data.data.file : '';
            $scope.edition.pdf_url = data.data.file ? data.data.file.url : '';

            $scope.edition.scheduled_date = moment(data.data.post_date, "YYYY-DD-MM").format('DD/MM/YYYY');
            $scope.edition.scheduled_time = moment(data.data.post_date, "YYYY-DD-MM hh:mm").format('hh:mm');
        });

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

                if (tags.length > 0)
                    data.articles[k].tags = tags;

                tags = [];
            });

            PeriodicalService.updateEdition($routeParams.id, $routeParams.edition, data).then(function (data) {
                NotificationService.success('Edição atualizada com sucesso.');

                if (!preview) {
                    $location.path('/periodicals/' + $routeParams.id + '/editions');
                } else {
                    $window.open(data.data.edition_url);
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
            removeConfirmationModal.result.then(function (data) {
                $scope.edition.articles.splice(idx, 1);

                $timeout(function () {
                    $scope.$apply();
                });
            });
        };

        var removeConfirmationModal;

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

        var ConfirmationModalCtrl = function ($scope, $uibModalInstance, title) {
            $scope.modal_title = title;

            $scope.ok = function () {
                $uibModalInstance.close();
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        };

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
