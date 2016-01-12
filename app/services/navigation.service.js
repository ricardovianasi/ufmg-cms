;(function () {
  'use strict';

  angular.module('serviceModule')
    .factory('NavigationService', [
      function () {
        clog('... NavigationService');

        var menu = [
          {
            icon: 'pages',
            name: 'Páginas',
            location: 'pages',
            enabled: true
          },
          {
            icon: 'periodicals',
            name: 'Periódicos Jornalísticos',
            location: 'periodicals',
            enabled: true
          },
          {
            icon: 'modules',
            name: 'Assessoria/Releases',
            location: 'releases',
            enabled: true
          },
          {
            icon: 'modules',
            name: 'Assessoria/Clippings',
            location: 'clippings',
            enabled: true
          },
          {
            icon: 'news',
            name: 'Notícias',
            location: 'news',
            enabled: true
          },
          {
            icon: 'courses',
            name: 'Cursos',
            location: 'course',
            enabled: true
          },
          {
            icon: 'events',
            name: 'Eventos',
            location: 'events',
            enabled: true
          },
          {
            icon: 'calendar',
            name: 'Galerias',
            location: 'galleries',
            enabled: true
          },
          {
            icon: 'calendar',
            name: 'Calendário Acadêmico',
            location: 'calendar',
            enabled: true
          },
          {
            icon: 'talk',
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
