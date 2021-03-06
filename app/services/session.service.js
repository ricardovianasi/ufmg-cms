(function () {
    'use strict';

    angular
        .module('serviceModule')
        .factory('sessionService', sessionService);

    /**ngInject */
    function sessionService($location, $window) {
        var store = $window.localStorage;
        var SAFETY_TIME = 20;
        var DEFAULT_TIME = 7180;
        var key = 'token';

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
            verifyTokenIsExpired: verifyTokenIsExpired,
            removeLastLoginDate: removeLastLoginDate
        };

        function saveData(data, rememberMe) {
            setToken(data.access_token);
            if (rememberMe) {
                setTokenRefresh(data.refresh_token);
            }
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

        function setIsLogged(value) {
            if (angular.isUndefined(value)) {
                value = true;
            }
            return store.setItem('isLogged', value);
        }

        function getIsLogged() {
            if (store.getItem('isLogged') === 'true') {
                return true;
            } else if (store.getItem('isLogged') === 'false') {
                return false;
            }
            return null;
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
            var time = Number(store.getItem('token_Time'));
            return time ? time : DEFAULT_TIME;
        }

        function setTokenTime(tokenTime) {
            var time = Number(tokenTime) - SAFETY_TIME;
            return store.setItem('token_Time', time);
        }

        function removeTokenTime() {
            return store.removeItem('token_Time');
        }

        function getLastLoginDate() {
            return store.getItem('LastLoginDate');
        }

        function setLastLoginDate() {
            return store.setItem('LastLoginDate', moment());
        }

        function removeLastLoginDate() {
            return store.removeItem('LastLoginDate');
        }

        function verifyTokenIsExpired() {
            var dateLastLogin = getLastLoginDate();
            var futureDate = moment(dateLastLogin);
            futureDate.add(moment.duration(2, 'hours'));


            if (futureDate.isSameOrBefore(new Date())) {
                return true;
            }
            return false;

        }

    }
})();
