(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('TextService', TextService);

    /** ngInject */
    function TextService() {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(ctrl) {
            ctrl.widget = { };
        }

        function parseToLoad(widget) {
            return {
                text: widget.text || (widget.content ? widget.content.text : null),
            };
        }

        function parseToSave(widget) {
            return {
                text: widget.text || (widget.content ? widget.content.text : null),
            };
        }
    }
})();
