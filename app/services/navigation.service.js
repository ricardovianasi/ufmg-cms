(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('NavigationService',
            /** ngInject */
            function ($log) {
                $log.info('NavigationService');

                var menu = [{
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
                    enabled: true
                }, {
                    icon: 'fa fa-question-circle',
                    name: 'FAQ',
                    location: 'faq',
                    enabled: true
                }, {
                    icon: 'fa fa-users',
                    name: 'Usuários',
                    location: 'users',
                    enabled: true
                }];

                return {
                    get: function () {
                        return menu;
                    }
                };
            });
})();
