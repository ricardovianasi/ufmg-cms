;(function(){
  'use strict';

  angular
    .module('serviceModule')
    .factory('sessionService', sessionService);

  sessionService.$inject = ['$location'];

  function sessionService($location) {
    var store = window.localStorage,
      key   = 'token';

    return {
      getToken: getToken,
      setToken: setToken,
      removeToken: removeToken,
      setIsLogged: setIsLogged,
      getIsLogged: getIsLogged,
      removeIsLogged: removeIsLogged
    };


    function getToken() {
      return store.getItem(key);
    }


    function setToken(token) {
        return store.setItem(key, token);
    }

    function removeToken() {
      return store.removeItem(key);
    }

    function setIsLogged() {
      return store.setItem('isLogged', true);
    }

    function getIsLogged() {
      if(store.getItem('isLogged') === 'true')
       return true;
      else
        $location.path('login');

      return false;
    }

    function removeIsLogged() {
      return store.removeItem('isLogged');
    }
  }
})();
