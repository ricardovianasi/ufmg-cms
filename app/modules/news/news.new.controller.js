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
        vm.canPermission = PermissionService.canPost(vm.typeNews);

        var allTags = [];

        vm.title = 'Nova Notícia';
        vm.breadcrumb = 'Nova Notícia';

        vm.news = {};
        vm.news.status = StatusService.STATUS_PUBLISHED;
        vm.news.tags = [];

        vm.categories = [];
        vm.status = [];
        vm.types = [];
        vm.highlight_ufmg_visible = true;

        onInit();

        function onInit() {
            if (vm.typeNews === 'news_agencia_de_agencia') {
                vm.news.highlight_ufmg = 1;
            }
        }

        NewsService.getTvProgram().then(function (data) {
            vm.tvPrograms = data.data.items;
        });

        GalleryService.getGalleries().then(function (data) {
            vm.galleries = data.data.items;
        });

        /**
         * Datepicker options
         */


        vm.back = function () {
            $location.path('/news/' + vm.typeNews);
        };

        vm.datepickerOpt = {
            initDate: DateTimeHelper.getDatepickerOpt(),
            endDate: DateTimeHelper.getDatepickerOpt()
        };

        /**
         * Add status 'on the fly', according to requirements
         */
        vm.datepickerOpt.initDate.status = {
            opened: false
        };
        vm.datepickerOpt.endDate.status = {
            opened: false
        };

        NewsService.getNewsCategories().then(function (data) {
            vm.categories = data.data;
        });

        NewsService
            .getNewsTypes()
            .then(function (data) {
                vm.types = data.data;
                for (var k = 0; k < data.data.items.length; k++) {
                    var element = data.data.items[k];
                    if (element.slug === 'radio' && vm.typeNews === 'news_radio') {
                        vm.news.type = element.id;
                        break;
                    }
                    if (element.slug === 'tv' && vm.typeNews === 'news_tv') {
                        vm.news.type = element.id;
                        break;
                    }
                    if (element.slug === 'agencia-de-noticias' && vm.typeNews === 'news_agencia_de_agencia') {
                        vm.news.type = element.id;
                        break;
                    }
                    if (element.slug === 'fique-atento' && vm.typeNews === 'news_fique_atento') {
                        vm.news.type = element.id;
                        break;
                    }
                }
            });

        StatusService.getStatus().then(function (data) {
            vm.status = data.data;
        });

        vm.publish = function (data, preview) {
            if (!validationService.isValid(vm.formData.$invalid)) {
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
        vm.$watch('news_thumb', function () {
            if (vm.news_thumb) {
                vm.upload([vm.news_thumb]);
            }
        });

        vm.imagencropOptions = angular.extend({
            formats: ['vertical', 'medium']
        }, RedactorPluginService.getOptions('imagencrop'));

        vm.audioUploadOptions = RedactorPluginService.getOptions('audioUpload');
        vm.uploadfilesOptions = RedactorPluginService.getOptions('uploadfiles');

        vm.upload = function (files) {
            angular.forEach(files, function (file) {
                MediaService.newFile(file).then(function (data) {
                    vm.news.thumb = data.id;
                    vm.news.thumb_name = data.title;
                });
            });
        };

        vm.removeImage = function () {
            $timeout(function () {
                vm.news.thumb = '';
                vm.news.thumb_name = '';
                vm.$apply();
            });
        };

        TagsService.getTags().then(function (data) {
            allTags = data.data.items[0];
        });

        vm.findTags = function ($query) {
            return TagsService.findTags($query, allTags);
        };
    }
})();
