;(function () {
  'use strict';

  angular.module('app')
    .config(Router)
    .config(Translator)
    .config(Tags);

  //Routing
  Router.$inject = ['$routeProvider'];

  /**
   * @param $routeProvider
   *
   * @constructor
   */
  function Router($routeProvider) {
    $routeProvider.otherwise({
      redirectTo: '/'
    });
  }

  //Translation
  Translator.$inject = ['$translateProvider'];

  /**
   * @param $translateProvider
   *
   * @constructor
   */
  function Translator($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: 'lang/',
      suffix: '.json',
    });

    $translateProvider.preferredLanguage('pt-br');
  }

  //Tags
  /**
   * @param tagsInputConfigProvider
   *
   * @constructor
   */
  function Tags(tagsInputConfigProvider) {
    tagsInputConfigProvider
      .setDefaults('tagsInput', {
        placeholder: 'Adicionar tag'
      });
  }
})();
