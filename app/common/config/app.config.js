;(function () {
  'use strict';

  angular.module('app')
    .config([
      '$routeProvider',
      function ($routeProvider) {
        $routeProvider.otherwise({
          redirectTo: '/'
        });
      }
    ])
    .run([
      '$rootScope',
      function ($rootScope) {
        $rootScope.redactorConfig = {
          lang: 'pt_br',
          plugins: ['imagencrop'],
          linebreaks: false,
          formatting: ['p', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5'],
          buttons: [
            'html',
            'formatting',
            'bold',
            'italic',
            'link',
            //'deleted',
            //'unorderedlist',
            //'orderedlist',
            //'outdent',
            //'indent',
            'imagencrop',
            //'image',
            'file',
            'adasda'
            //'alignment',
            //'horizontalrule',
          ],
          allowedAttr: [
            ['section', 'class'],
            ['div', 'class'],
            ['img', ['src', 'alt', 'title']],
            ['figure', 'class'],
            ['a', ['href', 'title']]
          ]
        };
      }
    ]);
})();
