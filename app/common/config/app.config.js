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
          buttons: [
            'html',
            'formatting',
            'bold',
            'italic',
            'link',
            'imagencrop',
            'file',
          ],
          tabKey: false,
        };
      }
    ]);
})();
