(function () {
    'use strict';

    angular.module('newsModule')
        .controller('NewsEditController', NewsEditController);

    /**ngInject */
    function NewsEditController($scope, $routeParams, $location, $timeout, $window, NewsService, NotificationService,
        StatusService, MediaService, DateTimeHelper, ModalService, RedactorPluginService, $rootScope,
        GalleryService, PermissionService, HandleChangeService, validationService) {

        var vm = $scope;
        vm.typeNews = $routeParams.typeNews;

        vm.news = {};
        vm.categories = [];
        vm.status = [];
        vm.types = [];
        vm.highlight_ufmg_visible = true;

        HandleChangeService.registerHandleChange('/news', ['PUT', 'DELETE'], $scope, ['news'], _evenedObj, _hasLoaded);

        function _hasLoaded(oldValue) {
            return angular.isDefined(oldValue.id);
        }

        function _evenedObj(obj) {
            obj = HandleChangeService.removePropsCommon(obj);
            obj.tags = _evenedTags(obj.tags);
            return obj;
        }

        function _evenedTags(tags) {
            if(!tags) {
                return [];
            }
            return tags.map(function(tag) {
                if(tag.text) { return tag.text; } 
                else if(tag.name) { return tag.name; } 
                else { return tag; }
            });
        }

        vm.datepickerOpt = {
            initDate: DateTimeHelper.getDatepickerOpt()
        };

        vm.timepickerOpt = {
            initTime: DateTimeHelper.getTimepickerOpt()
        };
        NewsService.getNewsCategories().then(function (data) {
            vm.categories = data.data;
        });

        NewsService.getNewsTypes().then(function (data) {
            vm.types = data.data;
        });

        StatusService.getStatus().then(function (data) {
            vm.status = data.data;
        });

        NewsService
            .getNew($routeParams.id)
            .then(function (data) {

                $timeout(function () {
                    var html = $.parseHTML(vm.news.text);
                    $('#redactor-only').append(html);
                }, 300);

                vm.canPermission = PermissionService.canPut($routeParams.typeNews, $routeParams.id);

                vm.obj = {};

                vm.news = {
                    id: data.data.id,
                    title: data.data.title || '',
                    subtitle: data.data.subtitle || '',
                    author: data.data.author_name || '',
                    category: data.data.category ? data.data.category.id : '',
                    text: data.data.text || '',
                    status: data.data.status || '',
                    type: data.data.type ? data.data.type.id : '',
                    post_date: data.data.post_date,
                    thumb: data.data.thumb ? data.data.thumb.id : '',
                    thumb_name: data.data.thumb ? data.data.thumb.title : '',
                    highlight: data.data.highlight,
                    highlight_ufmg: data.data.highlight_ufmg,
                    highlight_home: angular.isDefined(data.data.highlight_home) ? data.data.highlight_home : false,
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

                vm.news.tags = [];

                angular.forEach(data.data.tags, function (tag) {
                    vm.news.tags.push(tag.name);
                });

                vm.title = 'Editar "' + vm.news.title + '"';
                vm.breadcrumb_active = vm.news.title;

                vm.news.scheduled_date = moment(data.data.post_date, 'YYYY-DD-MM').format('DD/MM/YYYY');
                vm.news.scheduled_time = moment(data.data.post_date, 'YYYY-DD-MM hh:mm').format('hh:mm');
                $scope.$broadcast('objPublishLoaded');
            });

        NewsService.getTvProgram().then(function (data) {
            vm.tvPrograms = data.data.items;
        });

        GalleryService.getGalleries().then(function (data) {
            vm.galleries = data.data.items;
            vm.galleries.splice(0, 0, {
                id: '',
                title: 'Nenhuma'
            });
        });

        vm.back = function () {
            $location.path('/news/' + vm.typeNews);
        };

        vm.remove = function () {
            ModalService
                .confirm('Você deseja excluir esta notícia?', ModalService.MODAL_MEDIUM, { isDanger: true })
                .result
                .then(function () {
                    vm.isLoading = true;
                    NewsService.removeNews($routeParams.id).then(function () {
                        NotificationService.success('Notícia removida com sucesso.');
                        $location.path('/news/' + vm.typeNews);
                    })
                    .catch(console.error)
                    .then(function() {
                        vm.isLoading = false;
                    });
                });
        };

        vm.publish = function (data) {
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
                highlight_home: data.highlight_home || false,
                has_video: data.has_video,
                /* jshint ignore:start */
                tv_program: data.tv_program,
                /* jshint ignore:end */
                scheduled_date: data.scheduled_date,
                scheduled_time: data.scheduled_time,
                gallery: data.gallery,
                slug: slug
            };

            _obj.tags = _.map(_obj.tags, 'text'); // jshint ignore: line

            vm.isLoading = true;
            NewsService
                .updateNews(data.id, _obj)
                .then(function () {
                    NotificationService.success('Notícia atualizada com sucesso.');
                }).catch(console.error)
                .then(function() {
                    vm.isLoading = false;
                });
        };

        // Cover Image - Upload
        vm.news_thumb = null;

        vm.$watch('news_thumb', function () {
            if (vm.news_thumb) {
                vm.upload(vm.news_thumb);
            }
        });

        vm.upload = function (file) {
            MediaService.newFile(file).then(function (data) {
                vm.news.thumb = data.id;
                vm.news.thumb_name = data.title;
            });
        };

        vm.removeImage = function () {
            $timeout(function () {
                vm.news.thumb = '';
                vm.news.thumb_name = '';
                vm.$apply();
            });
        };

        vm.imagencropOptions = angular.extend({
            formats: ['vertical', 'medium']
        }, RedactorPluginService.getOptions('imagencrop'));

        vm.audioUploadOptions = RedactorPluginService.getOptions('audioUpload');
        vm.uploadfilesOptions = RedactorPluginService.getOptions('uploadfiles');
    }
})();
