;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('NavigationService', [
      function () {
        console.log('... NavigationService');

        var menu = [
          {
            icon: 'fa fa-file-o',
            name: 'Páginas',
            location: 'pages',
            enabled: true
          },
          {
            icon: 'fa fa-book',
            name: 'Publicações Jornalísticas',
            location: 'periodicals',
            enabled: true
          },
          {
            icon: 'fa fa-bullhorn',
            name: 'Assessoria/Releases',
            location: 'releases',
            enabled: true
          },
          {
            icon: 'fa fa-bullhorn',
            name: 'Assessoria/Clippings',
            location: 'clippings',
            enabled: true
          },
          {
            icon: 'fa fa-bullhorn',
            name: 'Assessoria/Destaque',
            location: 'featured',
            enabled: true
          },
          {
            icon: 'fa fa-newspaper-o',
            name: 'Notícias',
            location: 'news',
            enabled: true
          },
          {
            icon: 'fa fa-circle-o',
            name: 'Cursos',
            location: 'course',
            enabled: true
          },
          {
            icon: 'fa fa-thumb-tack',
            name: 'Eventos',
            location: 'events',
            enabled: true
          },
          {
            icon: 'fa fa-picture-o',
            name: 'Galerias',
            location: 'galleries',
            enabled: true
          },
          {
            icon: 'fa fa-calendar',
            name: 'Calendário Acadêmico',
            location: 'calendar',
            enabled: true
          },
          {
            icon: 'fa fa-film',
            name: 'Mídia',
            location: 'media',
            enabled: true
          }
        ];

        return {
          get: function () {
            return menu;
          }
        };
      }
    ]);
})();
