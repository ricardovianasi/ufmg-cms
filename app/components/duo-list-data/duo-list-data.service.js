(function () {
    'use strict';

    angular
        .module('serviceModule')
        .factory('DuoListDataService', DuoListDataService);
    /**ngInject */
    function DuoListDataService() {
        var _title;
        var _fnService;
        var _size;
        var _orderElement;
        var _searchElement;
        return {
            set: set,
            get: get
        };

        function get() {
            return {
                title: _title,
                fnService: _fnService,
                size: _size,
                orderElement: _orderElement,
                searchElement: _searchElement
            };
        }

        function set(data) {
            _fnService = data.fnService;
            _title = data.title;
            _size = data.size;
            _orderElement = data.orderElement;
            _searchElement = data.searchElement;
        }
    }
})();
