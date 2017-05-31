(function () {
    'use strict';

    angular.module('newsModule')
        .controller('NewsEditController', NewsEditController);

    /**ngInject */
    function NewsEditController($scope,
        $routeParams,
        $location,
        $timeout,
        $window,
        NewsService,
        NotificationService,
        StatusService,
        MediaService,
        DateTimeHelper,
        ModalService,
        RedactorPluginService,
        $rootScope,
        TagsService,
        GalleryService,
        PermissionService,
        $log,
        validationService) {
        $rootScope.shownavbar = true;
        $log.info('NoticiasEditController');

        var allTags = [];
        var vm = $scope;
        vm.typeNews = $routeParams.typeNews;

        $scope.news = {};
        $scope.categories = [];
        $scope.status = [];
        $scope.types = [];
        $scope.highlight_ufmg_visible = true;

        /**
         * Datepicker options
         */
        $scope.datepickerOpt = {
            initDate: DateTimeHelper.getDatepickerOpt(),
            endDate: DateTimeHelper.getDatepickerOpt()
        };

        $scope.datepickerOpt.initDate.status = {
            opened: false
        };
        $scope.datepickerOpt.endDate.status = {
            opened: false
        };

        NewsService.getNewsCategories().then(function (data) {
            $scope.categories = data.data;
        });

        NewsService.getNewsTypes().then(function (data) {
            $scope.types = data.data;
        });

        StatusService.getStatus().then(function (data) {
            $scope.status = data.data;
        });

        NewsService.getNew($routeParams.id).then(function (data) {
            $scope.canPermission = PermissionService.canPut('news', $routeParams.id);

            $scope.obj = {};

            $scope.news = {
                id: data.data.id,
                title: data.data.title || '',
                subtitle: data.data.subtitle || '',
                author: data.data.author_name || '',
                category: data.data.category ? data.data.category.id : '',
                text: data.data.text || '',
                status: data.data.status || '',
                type: data.data.type ? data.data.type.id : '',
                thumb: data.data.thumb ? data.data.thumb.id : '',
                thumb_name: data.data.thumb ? data.data.thumb.title : '',
                highlight: data.data.highlight,
                highlight_ufmg: data.data.highlight_ufmg,
                news_url: data.data.news_url,
                has_video: data.data.has_video,
                /* jshint ignore:start */
                tv_program: data.data.tv_program === null ? data.data.tv_program : data.data.tv_program.id,
                gallery: data.data.gallery === null ? '' : data.data.gallery.id,
                /* jshint ignore:end */
                slug: {
                    slug: data.data.slug.slug
                }
            };


            var scheduled_at = DateTimeHelper.toBrStandard(data.data.scheduled_at, true, true);

            $scope.news.scheduled_date = scheduled_at.date;
            $scope.news.scheduled_time = scheduled_at.time;

            $scope.news.tags = [];

            angular.forEach(data.data.tags, function (tag) {
                $scope.news.tags.push(tag.name);
            });

            $scope.title = 'Editar "' + $scope.news.title + '"';
            $scope.breadcrumb_active = $scope.news.title;

            $scope.news.scheduled_date = moment(data.data.post_date, 'YYYY-DD-MM').format('DD/MM/YYYY');
            $scope.news.scheduled_time = moment(data.data.post_date, 'YYYY-DD-MM hh:mm').format('hh:mm');
        });

        NewsService.getTvProgram().then(function (data) {
            $scope.tvPrograms = data.data.items;
        });

        GalleryService.getGalleries().then(function (data) {
            $scope.galleries = data.data.items;
            $scope.galleries.splice(0, 0, {
                id: '',
                title: 'Nenhuma'
            });
        });

        $scope.back = function () {
            $location.path('/news/' + vm.typeNews);
        };

        $scope.remove = function () {
            ModalService
                .confirm('Você deseja excluir esta notícia?')
                .result
                .then(function () {
                    NewsService.removeNews($routeParams.id).then(function () {
                        NotificationService.success('Notícia removida com sucesso.');
                        $location.path('/news/' + vm.typeNews);
                    });
                });
        };

        $scope.publish = function (data, preview) {
            if (!validationService.isValid($scope.formNews.$invalid)) {
                return false;
            }

            if (!data.saveDraftClicked && data.status !== 'scheduled') {
                data.status = 'published';
            }

            var slug = typeof data.slug !== 'undefined' ? data.slug.slug : '';

            var _obj = {
                title: data.title,
                subtitle: data.subtitle,
                author_name: data.author,
                category: data.category,
                text: data.text,
                status: data.status,
                type: data.type,
                tags: data.tags,
                thumb: data.thumb,
                highlight: data.highlight,
                highlight_ufmg: data.highlight_ufmg || false,
                has_video: data.has_video,
                /* jshint ignore:start */
                tv_program: data.tv_program,
                /* jshint ignore:end */
                gallery: data.gallery,
                slug: slug
            };

            _obj.tags = _.map(_obj.tags, 'text'); // jshint ignore: line

            if (_obj.status === 'scheduled') {
                _obj.post_date = data.scheduled_date + ' ' + data.scheduled_time;
            }

            NewsService.updateNews(data.id, _obj).then(function (news) {
                NotificationService.success('Notícia atualizada com sucesso.');

                if (!preview) {
                    $location.path('/news/' + vm.typeNews);
                } else {
                    $window.open(news.data.news_url);
                }
            });
        };

        // Cover Image - Upload
        $scope.news_thumb = null;

        $scope.$watch('news_thumb', function () {
            if ($scope.news_thumb) {
                $scope.upload($scope.news_thumb);
            }
        });

        $scope.upload = function (file) {
            MediaService.newFile(file).then(function (data) {
                $scope.news.thumb = data.id;
                $scope.news.thumb_name = data.title;
            });
        };

        $scope.removeImage = function () {
            $timeout(function () {
                $scope.news.thumb = '';
                $scope.news.thumb_name = '';
                $scope.$apply();
            });
        };

        $scope.imagencropOptions = angular.extend({
            formats: ['vertical', 'medium']
        }, RedactorPluginService.getOptions('imagencrop'));

        $scope.audioUploadOptions = RedactorPluginService.getOptions('audioUpload');
        $scope.uploadfilesOptions = RedactorPluginService.getOptions('uploadfiles');

        TagsService.getTags().then(function (data) {
            allTags = data.data.items[0];
        });

        $scope.findTags = function ($query) {
            return TagsService.findTags($query, allTags);
        };
    }
})();
