(function () {
    'use strict';

    angular.module('serviceModule')
        .service('NavigationService',
            /** ngInject */
            function ($log, PermissionService, authService, $q) {
                $log.info('NavigationService');

                var hasPermissionCalendar;
                var hasPermissionClipping;
                var hasPermissionCourseDoc;
                var hasPermissionCourseGra;
                var hasPermissionCourseMas;
                var hasPermissionCourseSpe;
                var hasPermissionEditions;
                var hasPermissionEvents;
                var hasPermissionFaq;
                var hasPermissionTags;
                var hasPermissionGallery;
                var hasPermissionGlossary;
                var hasPermissionHighlightedPress;
                var hasPermissionMenu;
                var hasPermissionNewsAgencia;
                var hasPermissionNewsFiqueAtento;
                var hasPermissionNewsTv;
                var hasPermissionNewsRadio;
                var hasPermissionPage;
                var hasPermissionRector;
                var hasPermissionRelease;
                var hasPermissionUser;

                function loadPermission() {
                    hasPermissionCalendar = hasPermission('calendar');
                    hasPermissionClipping = hasPermission('clipping');
                    hasPermissionCourseDoc = hasPermission('course_doctorate');
                    hasPermissionCourseGra = hasPermission('course_graduation');
                    hasPermissionCourseMas = hasPermission('course_master');
                    hasPermissionCourseSpe = hasPermission('course_specialization');
                    hasPermissionEditions = hasPermission('editions');
                    hasPermissionEvents = hasPermission('events');
                    hasPermissionFaq = hasPermission('faq');
                    hasPermissionTags = hasPermission('tags');
                    hasPermissionGallery = hasPermission('gallery');
                    hasPermissionGlossary = hasPermission('glossary');
                    hasPermissionHighlightedPress = hasPermission('highlighted_press');
                    hasPermissionMenu = hasPermission('menu');
                    hasPermissionNewsAgencia = hasPermission('news_agencia_de_agencia');
                    hasPermissionNewsFiqueAtento = hasPermission('news_fique_atento');
                    hasPermissionNewsTv = hasPermission('news_tv');
                    hasPermissionNewsRadio = hasPermission('news_radio');
                    hasPermissionPage = hasPermission('page');
                    hasPermissionRector = hasPermission('rector');
                    hasPermissionRelease = hasPermission('release');
                    hasPermissionUser = hasPermission('user');
                }

                function hasPermissionCourse() {
                    return hasPermissionCourseDoc ||
                        hasPermissionCourseGra ||
                        hasPermissionCourseMas ||
                        hasPermissionCourseSpe;
                }

                function hasPermissionPeriodical() {
                    return hasPermission('periodical') ||
                        hasPermissionEditions;
                }

                function hasPermission(context) {
                    return PermissionService.hasPermission(context);
                }

                function hasPermissionNews() {
                    return hasPermissionNewsAgencia ||
                        hasPermissionNewsFiqueAtento ||
                        hasPermissionNewsTv ||
                        hasPermissionNewsRadio;
                }

                function hasPermissionAccessory() {
                    return hasPermissionRelease ||
                        hasPermissionClipping ||
                        hasPermissionHighlightedPress;
                }

                function get() {
                    var defer = $q.defer();
                    authService
                        .account()
                        .then(function () {
                            loadPermission();
                            defer.resolve([{
                                icon: 'fa fa-file-o',
                                name: 'Páginas',
                                location: 'page',
                                isActive: false,
                                isOpen: false,
                                enabled: hasPermissionPage
                            }, {
                                icon: 'fa fa-book',
                                name: 'Publicações Jornalísticas',
                                location: 'periodical',
                                isActive: false,
                                isOpen: false,
                                enabled: hasPermissionPeriodical()
                            }, {
                                icon: 'fa fa-group',
                                name: 'Assessoria',
                                location: false,
                                isActive: false,
                                isOpen: false,
                                enabled: hasPermissionAccessory(),
                                menuItems: [{
                                    icon: 'fa fa-bullhorn',
                                    name: 'Releases',
                                    location: 'release',
                                    isActive: false,
                                    isOpen: false,
                                    enabled: hasPermissionRelease
                                }, {
                                    icon: 'fa fa-thumb-tack',
                                    name: 'Clippings',
                                    location: 'clipping',
                                    isActive: false,
                                    isOpen: false,
                                    enabled: hasPermissionClipping
                                }, {
                                    icon: 'fa fa-star',
                                    name: 'Destaque',
                                    location: 'highlighted_press',
                                    isActive: false,
                                    isOpen: false,
                                    enabled: hasPermissionHighlightedPress
                                }]
                            }, {
                                icon: 'fa fa-newspaper-o',
                                name: 'Notícias',
                                location: false,
                                isActive: false,
                                isOpen: false,
                                enabled: hasPermissionNews(),
                                menuItems: [{
                                    icon: 'fa fa-file-text',
                                    name: 'Agência',
                                    location: 'news/news_agencia_de_agencia',
                                    isActive: false,
                                    isOpen: false,
                                    enabled: hasPermissionNewsAgencia,
                                }, {
                                    icon: 'fa fa-eye',
                                    name: 'Fique Atento',
                                    location: 'news/news_fique_atento',
                                    isActive: false,
                                    isOpen: false,
                                    enabled: hasPermissionNewsFiqueAtento,
                                }, {
                                    icon: 'fa fa-play-circle-o',
                                    name: 'TV',
                                    location: 'news/news_tv',
                                    isActive: false,
                                    isOpen: false,
                                    enabled: hasPermissionNewsTv
                                }, {
                                    icon: 'fa fa-volume-up',
                                    name: 'Radio',
                                    location: 'news/news_radio',
                                    isActive: false,
                                    isOpen: false,
                                    enabled: hasPermissionNewsRadio
                                }]
                            }, {
                                icon: 'fa fa-circle-o',
                                name: 'Cursos',
                                location: 'course',
                                isActive: false,
                                isOpen: false,
                                enabled: hasPermissionCourse()
                            }, {
                                icon: 'glyphicon glyphicon-time',
                                name: 'Eventos',
                                location: 'events',
                                isActive: false,
                                isOpen: false,
                                enabled: hasPermissionEvents
                            }, {
                                icon: 'fa fa-picture-o',
                                name: 'Galerias',
                                location: 'gallery',
                                isActive: false,
                                isOpen: false,
                                enabled: hasPermissionGallery
                            }, {
                                icon: 'fa fa-calendar',
                                name: 'Calendário Acadêmico',
                                location: 'calendar',
                                isActive: false,
                                isOpen: false,
                                enabled: hasPermissionCalendar
                            }, {
                                icon: 'fa fa-bars',
                                name: 'Novo Menu',
                                location: 'new-menu',
                                isActive: false,
                                isOpen: false,
                                enabled: hasPermissionMenu
                            }, {
                                icon: 'fa fa-bars',
                                name: 'Antigo Menu',
                                location: 'menu',
                                isActive: false,
                                isOpen: false,
                                enabled: hasPermissionMenu
                            }, {
                                icon: 'fa fa-question-circle',
                                name: 'FAQ',
                                location: 'faq',
                                isActive: false,
                                isOpen: false,
                                enabled: hasPermissionTags
                            }, {
                                icon: 'fa fa-tag',
                                name: 'Tags',
                                location: 'tags',
                                isActive: false,
                                isOpen: false,
                                enabled: hasPermissionFaq
                            }, {
                                icon: 'fa fa-users',
                                name: 'Usuários',
                                location: 'user',
                                isActive: false,
                                isOpen: false,
                                enabled: hasPermissionUser
                            }]);
                        });
                    return defer.promise;
                }
                return {
                    get: get
                };
            });
})();
