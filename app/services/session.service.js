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
      saveData: saveData,
      getToken: getToken,
      setToken: setToken,
      removeToken: removeToken,
      setIsLogged: setIsLogged,
      getIsLogged: getIsLogged,
      removeIsLogged: removeIsLogged,
      getTokenRefresh: getTokenRefresh,
      setTokenRefresh: setTokenRefresh,
      removeTokenRefresh: removeTokenRefresh,
      getTokenTime: getTokenTime,
      setTokenTime: setTokenTime,
      removeTokenTime: removeTokenTime,
      getLastLoginDate: getLastLoginDate,
      verifyTokenIsExpired: verifyTokenIsExpired
    };

    function saveData(data) {
      setToken(data.access_token);
      setTokenRefresh(data.refresh_token);
      setTokenTime(data.expires_in);
      setLastLoginDate();
    }

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

    function getTokenRefresh() {
      return store.getItem('token_refresh');
    }

    function setTokenRefresh(refresh) {
      return store.setItem('token_refresh', refresh);
    }

    function removeTokenRefresh() {
      return store.removeItem('token_refresh');
    }

    function getTokenTime() {
      return store.getItem('token_Time');
    }

    function setTokenTime(time) {
      return store.setItem('token_Time', time);
    }

    function removeTokenTime() {
      return store.removeItem('token_Time');
    }

    function getLastLoginDate() {
      return store.getItem('LastLoginDate');
    }

    function setLastLoginDate() {
      return store.setItem('LastLoginDate', Date());
    }

    function removeLastLoginDate() {
      return store.removeItem('LastLoginDate');
    }

    function verifyTokenIsExpired(){
      var tokenExpiredIn = getTokenTime();
      var dateLastLogin = getLastLoginDate();
      var hours = Math.floor( tokenExpiredIn / 60);
      var futureDate = moment(dateLastLogin);
          futureDate.add(hours, 'hours');

      if(futureDate.isSameOrBefore(new Date()))
        return true;
      else
        return false;

    }

  }
})();
