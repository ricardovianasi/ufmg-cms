(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('NavigationService',
            /** ngInject */
            function ($log, PermissionService, authService, $q) {
                $log.info('NavigationService');

                function get() {
                    var defer = $q.defer();
                    authService
                        .account()
                        .then(function () {
                            var hasPermissionUser = PermissionService.hasPermission('user');
                            var hasPermissionMenu = PermissionService.hasPermission('menu');
                            var hasPermissionNewsAgency = PermissionService.hasPermission('news_agencia_de_agencia');
                            var hasPermissionNewsTV = PermissionService.hasPermission('news_tv');
                            var hasPermissionNewsRadio = PermissionService.hasPermission('news_radio');
                            defer.resolve([{
                                icon: 'fa fa-file-o',
                                name: 'Páginas',
                                location: 'pages',
                                isActive: false,
                                isOpen: false,
                                enabled: true
                            }, {
                                icon: 'fa fa-book',
                                name: 'Publicações Jornalísticas',
                                location: 'periodicals',
                                isActive: false,
                                isOpen: false,
                                enabled: true
                            }, {
                                icon: 'fa fa-group',
                                name: 'Assessoria',
                                location: false,
                                isActive: false,
                                isOpen: false,
                                enabled: true,
                                menuItems: [{
                                    icon: 'fa fa-bullhorn',
                                    name: 'Releases',
                                    location: 'releases',
                                    isActive: false,
                                    isOpen: false,
                                    enabled: true
                                }, {
                                    icon: 'fa fa-thumb-tack',
                                    name: 'Clippings',
                                    location: 'clippings',
                                    isActive: false,
                                    isOpen: false,
                                    enabled: true
                                }, {
                                    icon: 'fa fa-star',
                                    name: 'Destaque',
                                    location: 'featured',
                                    isActive: false,
                                    isOpen: false,
                                    enabled: true
                                }]
                            }, {
                                icon: 'fa fa-newspaper-o',
                                name: 'Notícias',
                                location: false,
                                isActive: false,
                                isOpen: false,
                                enabled: hasPermissionNewsAgency || hasPermissionNewsTV || hasPermissionNewsRadio,
                                menuItems: [{
                                    icon: 'fa fa-file-text',
                                    name: 'Agência',
                                    location: 'news/news_agencia_de_agencia',
                                    isActive: false,
                                    isOpen: false,
                                    enabled: hasPermissionNewsAgency,
                                }, {
                                    icon: 'fa fa-play-circle-o',
                                    name: 'TV',
                                    location: 'news/news_tv',
                                    isActive: false,
                                    isOpen: false,
                                    enabled: hasPermissionNewsTV
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
                                enabled: true
                            }, {
                                icon: 'glyphicon glyphicon-time',
                                name: 'Eventos',
                                location: 'events',
                                isActive: false,
                                isOpen: false,
                                enabled: true
                            }, {
                                icon: 'fa fa-picture-o',
                                name: 'Galerias',
                                location: 'galleries',
                                isActive: false,
                                isOpen: false,
                                enabled: true
                            }, {
                                icon: 'fa fa-calendar',
                                name: 'Calendário Acadêmico',
                                location: 'calendar',
                                isActive: false,
                                isOpen: false,
                                enabled: true
                            }, {
                                icon: 'fa fa-film',
                                name: 'Mídia',
                                location: 'media',
                                isActive: false,
                                isOpen: false,
                                enabled: true
                            }, {
                                icon: 'fa fa-bars',
                                name: 'Menu',
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
                                enabled: true
                            }, {
                                icon: 'fa fa-users',
                                name: 'Usuários',
                                location: 'users',
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
