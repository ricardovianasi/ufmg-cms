;(function(){
  "use strict";

  angular
    .module("periodicalModule")
     .config(["$routeProvider", function($routeProvider) {

      $routeProvider
        .when("/periodicals", {
          templateUrl: "modules/periodical/periodical.template.html",
          controller: "PeriodicalController",
          controllerAs: "ctrl"
        })
        .when("/periodicals/new", {
          templateUrl: "modules/periodical/periodical.form.template.html",
          controller: "PeriodicalNewController",
          controllerAs: "ctrl"
        })
        .when("/periodicals/edit/:id", {
          templateUrl: "modules/periodical/periodical.form.template.html",
          controller: "PeriodicalEditController",
          controllerAs: "ctrl"
        })
        .when("/periodicals/:id/editions", {
          templateUrl: "modules/periodical/periodical-editions.template.html",
          controller: "PeriodicalEditionsController",
          controllerAs: "ctrl"
        })
        .when("/periodicals/:id/edition/edit/:edition", {
          templateUrl: "modules/periodical/periodical-editions.edition.form.template.html",
          controller: "PeriodicalEditionEditController",
          controllerAs: "ctrl"
        })
        .when("/periodicals/:id/edition/new", {
          templateUrl: "modules/periodical/periodical-editions.edition.form.template.html",
          controller: "PeriodicalEditionNewController",
          controllerAs: "ctrl"
        });
    }]);
})();

// articles[][title]
// articles[][subtitle]
// articles[][author_name]
// articles[][thumb]: id de um file
// articles[][cover]: id de um file
// articles[][content]: conteudo em html
// articles[][page_number]
