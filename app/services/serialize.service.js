(function () {
    'use strict';

    angular
        .module('serviceModule')
        .factory('SerializeService', SerializeService);

        /** ngInject */
        function SerializeService() {

            return {
                parseParams: parseParams
            };

            function parseParams (data) {
                if (!angular.isObject(data)) {
                    return ((data === null) ? '' : data.toString());
                }

                return angular.isObject(data) && String(data) !== '[object File]' ? _param(data) : data;
            }

            function _param(obj) {
                var query = '';
                var name;
                var value;
                var fullSubName;
                var subName;
                var subValue;
                var innerObj;
                var i;

                for (name in obj) {
                    value = obj[name];

                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += _param(innerObj) + '&';
                        }
                    } else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += _param(innerObj) + '&';
                        }
                    } else if (value !== undefined && value !== null) {
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                    }
                }

                return query.length ? query.substr(0, query.length - 1) : query;
            }
        }
})();
