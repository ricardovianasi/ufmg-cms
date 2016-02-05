;(function () {
  'use strict';

  angular.module('app')
    .config(Router)
    .config(Translator);

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
    $translateProvider.translations('en', {
      published: 'publicado',
      publish: 'publicado',
      draft: 'rascunho',
      auto_draft: 'auto publicado',
      trash: 'excluído',
      pending_review: 'revisão pendente',
      scheduled: 'agendado',
    });

    $translateProvider.preferredLanguage('en');
  }
})();
