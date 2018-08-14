(function () {
    'use strict';

    angular.module('serviceModule')
        .service('NavigationService',
            /** ngInject */
            function ($log, PermissionService, authService, $q) {
                $log.info('NavigationService');
                var permissions = {};

                function loadPermission() {
                    permissions = {
                        hasCalendar: hasPerm('calendar'), hasClipping: hasPerm('clipping'), hasTermsUse: hasPerm('term_of_use'),
                        hasCourseDoc: hasPerm('course_doctorate'), hasCourseGra: hasPerm('course_graduation'),
                        hasCourseMas: hasPerm('course_master'), hasCourseSpe: hasPerm('course_specialization'),
                        hasEditions: hasPerm('editions'), hasEvents: hasPerm('events'),
                        hasFaq: hasPerm('faq'), hasTags: hasPerm('tags'),
                        hasGallery: hasPerm('gallery'), hasGlossary: hasPerm('glossary'),
                        hasHighlightedPress: hasPerm('highlighted_press'), hasMenu: hasPerm('menu'),
                        hasNewsAgencia: hasPerm('news_agencia_de_agencia'), hasNewsFiqueAtento: hasPerm('news_fique_atento'),
                        hasNewsTv: hasPerm('news_tv'), hasNewsRadio: hasPerm('news_radio'),
                        hasPage: hasPerm('page'), hasRector: hasPerm('rector'),
                        hasRelease: hasPerm('release'), hasUser: hasPerm('user'),
                        hasRadioGrid: hasPerm('radio_programming_grid'), hasRadioProgramming: hasPerm('radio_programming'),
                        hasRadioParent: hasPerm('radio_category'), hasRadioGenre: hasPerm('radio_genre'),
                    };
                }

                function hasPermissionRadioProgramming() {
                    return ['radio_programming', 'radio_genre', 'radio_category', 'radio_programming_grid']
                        .reduce(function(result, key) {return result || hasPerm(key); }, false);
                }

                function hasPermissionCourse() {
                    return permissions.hasCourseDoc ||
                        permissions.hasCourseGra ||
                        permissions.hasCourseMas ||
                        permissions.hasCourseSpe;
                }

                function hasPermissionPeriodical() {
                    return hasPerm('periodical') || permissions.hasEditions;
                }

                function hasPerm(context) {
                    return PermissionService.hasPermission(context);
                }

                function hasPermissionNews() {
                    return permissions.hasNewsAgencia ||
                        permissions.hasNewsFiqueAtento ||
                        permissions.hasNewsTv ||
                        permissions.hasNewsRadio;
                }

                function hasPermissionAccessory() {
                    return permissions.hasRelease ||
                        permissions.hasClipping ||
                        permissions.hasHighlightedPress;
                }

                function get() {
                    var defer = $q.defer();
                    authService.account().then(function () {
                        loadPermission();
                        defer.resolve([
                            { icon: 'fa fa-file-o', name: 'Páginas', location: 'page', isActive: false, isOpen: false, enabled: permissions.hasPage }, 
                            { icon: 'fa fa-book', name: 'Publicações Jornalísticas', location: 'periodical', isActive: false, isOpen: false, enabled: hasPermissionPeriodical() }, 
                            {
                                icon: 'fa fa-group',
                                name: 'Assessoria',
                                location: false,
                                isActive: false,
                                isOpen: false,
                                enabled: hasPermissionAccessory(),
                                menuItems: [
                                    { icon: 'fa fa-bullhorn', name: 'Releases', location: 'release', isActive: false, isOpen: false, enabled: permissions.hasRelease },
                                    { icon: 'fa fa-thumb-tack', name: 'Clippings', location: 'clipping', isActive: false, isOpen: false, enabled: permissions.hasClipping }, 
                                    { icon: 'fa fa-star', name: 'Destaque', location: 'highlighted_press', isActive: false, isOpen: false, enabled: permissions.hasHighlightedPress }
                                ]
                            }, {
                                icon: 'fa fa-newspaper-o',
                                name: 'Notícias',
                                location: false,
                                isActive: false,
                                isOpen: false,
                                enabled: hasPermissionNews(),
                                menuItems: [
                                    { icon: 'fa fa-file-text', name: 'Agência', location: 'news/news_agencia_de_agencia', isActive: false, isOpen: false, enabled: permissions.hasNewsAgencia }, 
                                    { icon: 'fa fa-eye', name: 'Fique Atento', location: 'news/news_fique_atento', isActive: false, isOpen: false, enabled: permissions.hasNewsFiqueAtento }, 
                                    { icon: 'fa fa-play-circle-o', name: 'TV', location: 'news/news_tv', isActive: false, isOpen: false, enabled: permissions.hasNewsTv },
                                    { icon: 'fa fa-volume-up', name: 'Radio', location: 'news/news_radio', isActive: false, isOpen: false, enabled: permissions.hasNewsRadio }
                                ]
                            }, {
                                icon: 'fa fa-podcast',
                                name: 'Rádio',
                                location: false,
                                isActive: false,
                                isOpen: false,
                                enabled: hasPermissionRadioProgramming(),
                                menuItems: [
                                    { icon: 'fa fa-television', name: 'Programas', location: 'radio_programming/programs', isActive: false, isOpen: false, enabled: permissions.hasRadioProgramming },
                                    { icon: 'fa fa-picture-o', name: 'Thumbnails', location: 'radio_thumb/program-list', isActive: false, isOpen: false, enabled: permissions.hasRadioProgramming },
                                    { icon: 'fa fa-list-ul', name: 'Blocos', location: 'radio_category/parent-list', isActive: false, isOpen: false, enabled: permissions.hasRadioParent },
                                    { icon: 'fa fa-list-ul', name: 'Grade', location: 'radio_programming_grid/handle', isActive: false, isOpen: false, enabled: permissions.hasRadioGrid },
                                    { icon: 'fa fa-neuter', name: 'Gêneros', location: 'radio_genre/genre-list', isActive: false, isOpen: false, enabled: permissions.hasRadioGenre }
                                ]
                            }, 
                            { icon: 'fa fa-circle-o', name: 'Cursos', location: 'course', isActive: false, isOpen: false, enabled: hasPermissionCourse() }, 
                            { icon: 'glyphicon glyphicon-time', name: 'Eventos', location: 'events', isActive: false, isOpen: false, enabled: permissions.hasEvents }, 
                            { icon: 'fa fa-picture-o', name: 'Galerias', location: 'gallery', isActive: false, isOpen: false, enabled: permissions.hasGallery }, 
                            { icon: 'fa fa-calendar', name: 'Calendário Acadêmico', location: 'calendar', isActive: false, isOpen: false, enabled: permissions.hasCalendar }, 
                            { icon: 'fa fa-bars', name: 'Menu', location: 'new-menu', isActive: false, isOpen: false, enabled: permissions.hasMenu }, 
                            { icon: 'fa fa-question-circle', name: 'FAQ', location: 'faq', isActive: false, isOpen: false, enabled: permissions.hasFaq }, 
                            { icon: 'fa fa-tag', name: 'Tags', location: 'tags-manager', isActive: false, isOpen: false, enabled: permissions.hasTags }, 
                            { icon: 'fa fa-users', name: 'Usuários', location: 'user', isActive: false, isOpen: false, enabled: permissions.hasUser },
                            { icon: 'fa fa-file-text-o', name: 'Termos de uso', location: 'use-term', isActive: false, isOpen: false, enabled: true }
                        ]);
                    });
                    return defer.promise;
                }
                return {
                    get: get
                };
            });
})();
