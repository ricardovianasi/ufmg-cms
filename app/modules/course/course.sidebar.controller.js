;(function(){
  'use strict';

  angular.module('courseModule')
    .controller('CourseSidebarController', CourseSidebarController);


  CourseSidebarController.$inject = ['$routeParams'];

  function CourseSidebarController($routeParams) {
    var vm = this;

    vm.type = $routeParams.type;
  }
})();
