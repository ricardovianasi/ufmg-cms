(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('Util', Util);

    /** ngInject */
    function Util($log) {
        $log.info('Util');
        return {
            restoreOverflow: restoreOverflow,
            hiddenOverflow: hiddenOverflow,
            goTop: goTop
        };

        function restoreOverflow() {
            $('html, body')
                .css({
                    overflowY: 'auto',
                    height: 'auto'
                });
        }

        function hiddenOverflow() {
            $('html, body')
                .css({
                    overflowY: 'hidden',
                    height: '100%'
                });
        }

        function goTop() {
            $('html, body')
                .animate({
                    scrollTop: $('html').offset().top
                });
        }
    }
})();
