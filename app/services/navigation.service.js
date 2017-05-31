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
                        .then(function (res) {
                            var hasPermissionUser = PermissionService.hasPermission('user');
                            var hasPermissionMenu = PermissionService.hasPermission('menu');
                            var hasPermissionNewsAgency = PermissionService.hasPermission('news_agencia_de_agencia');
                            var hasPermissionNewsTV = PermissionService.hasPermission('news_tv');
                            var hasPermissionNewsRadio = PermissionService.hasPermission('news_radio');
                            defer.resolve([{
                                icon: 'fa fa-file-o',
                                name: 'Páginas',
                                location: 'pages',
                                enabled: true
                            }, {
                                icon: 'fa fa-book',
                                name: 'Publicações Jornalísticas',
                                location: 'periodicals',
                                enabled: true
                            }, {
                                icon: 'fa fa-bullhorn',
                                name: 'Assessoria/Releases',
                                location: 'releases',
                                enabled: true
                            }, {
                                icon: 'fa fa-bullhorn',
                                name: 'Assessoria/Clippings',
                                location: 'clippings',
                                enabled: true
                            }, {
                                icon: 'fa fa-bullhorn',
                                name: 'Assessoria/Destaque',
                                location: 'featured',
                                enabled: true
                            }, {
                                icon: 'fa fa-newspaper-o',
                                name: 'Notícias',
                                location: 'news',
                                enabled: true
                            }, {
                                icon: 'fa fa-circle-o',
                                name: 'Cursos',
                                location: 'course',
                                enabled: true
                            }, {
                                icon: 'fa fa-thumb-tack',
                                name: 'Eventos',
                                location: 'events',
                                enabled: true
                            }, {
                                icon: 'fa fa-picture-o',
                                name: 'Galerias',
                                location: 'galleries',
                                enabled: true
                            }, {
                                icon: 'fa fa-calendar',
                                name: 'Calendário Acadêmico',
                                location: 'calendar',
                                enabled: true
                            }, {
                                icon: 'fa fa-film',
                                name: 'Mídia',
                                location: 'media',
                                enabled: true
                            }, {
                                icon: 'fa fa-bars',
                                name: 'Menu',
                                location: 'menu',
                                enabled: hasPermissionMenu
                            }, {
                                icon: 'fa fa-question-circle',
                                name: 'FAQ',
                                location: 'faq',
                                enabled: true
                            }, {
                                icon: 'fa fa-users',
                                name: 'Usuários',
                                location: 'users',
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
