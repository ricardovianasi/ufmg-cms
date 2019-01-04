(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('AlertService', AlertService);

    /** ngInject */
    function AlertService(apiUrl, $http) {
        let baseUrl = `${apiUrl}/alert`;
        let FORMAT_DATE = "YYYY-MM-DD[T]HH:mm:ss";
        let FORMAT_TIME = "HH:mm";

        var service = {
            listAlerts:listAlerts,
            alert:alert,
            remove: remove,
            save: save
        };

        return service;

        ////////////////
        function listAlerts(params = '') {
            let url = `${baseUrl}${params}`;
            return $http.get(url);
        }

        function alert(id) {
            let url = `${baseUrl}/${id}`;
            return $http.get(url)
                .then(res => {
                    let alert = res.data;
                    alert.post_date = moment(alert.post_date, FORMAT_DATE).toDate();
                    alert.end_date = moment(alert.end_date, FORMAT_DATE).toDate();
                    alert.post_time = _convertTimeToString(alert.post_date);
                    alert.end_time = _convertTimeToString(alert.end_date);
                    return alert;
                });
        }

        function  remove(id) {
            let url = `${baseUrl}/${id}`;
            return $http.delete(url);
        }

        function save(data) {
            let alert = angular.copy(data);
            alert.post_date = _prepareToSaveDate(alert.post_date, alert.post_time);
            alert.end_date = _prepareToSaveDate(alert.end_date, alert.end_time);
            let alertSave = {
                post_date: alert.post_date,
                end_date: alert.end_date,
                title: alert.title,
                subtitle: alert.subtitle,
                link: alert.link,
                status: alert.status,
            };
            if ('id' in alert) {
                let url = `${baseUrl}/${alert.id}`;
                return $http.put(url, alertSave);
            }
            return $http.post(baseUrl, alertSave);
        }

        function _prepareToSaveDate(date, time) {
            if(!date || !time) {
                return;
            }
            let partTime = time.split(':');
            let dateMoment = moment(date);
            dateMoment.set({'hour': partTime[0], 'minute': partTime[1]});
            return dateMoment.format("DD/MM/YYYY HH:mm");
        }

        function _convertTimeToString(date) {
            let hours = date.getHours();
            let minutes = date.getMinutes();
            hours = hours < 10 ? `0${hours}` : hours;
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            return `${hours}:${minutes}`;
        }

    }
})();
