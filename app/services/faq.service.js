(function () {
    'use strict';

    angular.module('faqModule')
        .factory('faqService', faqService);

    /** ngInject */
    function faqService($http, $log, apiUrl) {

        var _parseData = function (faq) {
            var obj = faq;

            if (obj.categories.length > 0) {
                angular.forEach(obj.categories, function (v, k) {
                    obj.items.push({
                        question: obj.categories[k].name,
                        children: obj.categories[k].items
                    });
                });
                delete obj.categories;
            }
            return obj;
        };

        return {
            save: _save,
            get: _get,
            remove: _remove,
            update: _update,
            faqs: _faqs
        };

        function _save(data) {
            var obj = _parseData(data);
            return $http.post(apiUrl + '/faq', obj);
        }

        function _get(id) {
            var url = apiUrl + '/faq';

            if (id) {
                url = apiUrl + '/faq/' + id;
            }

            return $http.get(url);
        }

        function _faqs(params) {
            if (angular.isUndefined(params)) {
                params = '';
            }
            var url = apiUrl + '/faq' + params;
            return $http.get(url);
        }

        function _remove(id) {
            return $http.delete(apiUrl + '/faq/' + id);
        }

        function _update(data) {
            var id = data.id;
            var obj = _parseData(data);
            return $http.put(apiUrl + '/faq/' + id, obj);
        }
    }
})();
