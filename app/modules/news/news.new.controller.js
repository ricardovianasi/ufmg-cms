(function () {
    'use strict';

    angular.module('newsModule')
        .controller('NewsNewController', NewsNewController);

    /** ngInject */
    function NewsNewController($scope,
        $location,
        $window,
        MediaService,
        NewsService,
        $routeParams,
        NotificationService,
        StatusService,
        $timeout,
        DateTimeHelper,
        RedactorPluginService,
        $rootScope,
        TagsService,
        GalleryService,
        PermissionService,
        $log,
        validationService) {
        var vm = $scope;
        vm.typeNews = $routeParams.typeNews;


        $rootScope.shownavbar = true;
        $log.info('NoticiasNovoController');
        $scope.canPermission = PermissionService.canPost('news');

        var allTags = [];

        $scope.title = 'Nova Notícia';
        $scope.breadcrumb = 'Nova Notícia';

        $scope.news = {};
        $scope.news.status = StatusService.STATUS_PUBLISHED;
        $scope.news.tags = [];

        $scope.categories = [];
        $scope.status = [];
        $scope.types = [];
        $scope.highlight_ufmg_visible = true;

        onInit();

        function onInit() {
            if (vm.typeNews === 'agencia-de-noticias') {
                $scope.news.highlight_ufmg = 1;
            }
        }

        NewsService.getTvProgram().then(function (data) {
            $scope.tvPrograms = data.data.items;
        });

        GalleryService.getGalleries().then(function (data) {
            $scope.galleries = data.data.items;
        });

        /**
         * Datepicker options
         */
        $scope.datepickerOpt = {
            initDate: DateTimeHelper.getDatepickerOpt(),
            endDate: DateTimeHelper.getDatepickerOpt()
        };

        /**
         * Add status 'on the fly', according to requirements
         */
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
            for (var k = 0; k < data.data.items.length; k++) {
                var element = data.data.items[k];
                if (element.slug === vm.typeNews) {
                    $scope.news.type = element.id;
                }
            }
        });

        StatusService.getStatus().then(function (data) {
            $scope.status = data.data;
        });

        $scope.publish = function (data, preview) {
            if (!validationService.isValid($scope.formNews.$invalid)) {
                return false;
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
                tv_program: data.tv_program,
                gallery: data.gallery,
                slug: slug
            };

            _obj.tags = _.map(_obj.tags, 'text'); // jshint ignore: line


            if (_obj.status === 'scheduled') {
                _obj.post_date = data.scheduled_date + ' ' + data.scheduled_time;
            }
            NewsService.postNews(_obj).then(function (news) {
                NotificationService.success('Notícia criada com sucesso.');
                $log.info('Objeto salvo', news);
                if (!preview) {
                    $location.path('/news/' + vm.typeNews);
                } else {
                    $window.open(news.data.news_url);
                }
            });
        };

        // Cover Image - Upload
        $scope.$watch('news_thumb', function () {
            if ($scope.news_thumb) {
                $scope.upload([$scope.news_thumb]);
            }
        });

        $scope.imagencropOptions = angular.extend({
            formats: ['vertical', 'medium']
        }, RedactorPluginService.getOptions('imagencrop'));

        $scope.audioUploadOptions = RedactorPluginService.getOptions('audioUpload');
        $scope.uploadfilesOptions = RedactorPluginService.getOptions('uploadfiles');

        $scope.upload = function (files) {
            angular.forEach(files, function (file) {
                MediaService.newFile(file).then(function (data) {
                    $scope.news.thumb = data.id;
                    $scope.news.thumb_name = data.title;
                });
            });
        };

        $scope.removeImage = function () {
            $timeout(function () {
                $scope.news.thumb = '';
                $scope.news.thumb_name = '';
                $scope.$apply();
            });
        };

        TagsService.getTags().then(function (data) {
            allTags = data.data.items[0];
        });

        $scope.findTags = function ($query) {
            return TagsService.findTags($query, allTags);
        };
    }
})();
