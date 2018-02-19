(function () {
    'use strict';

    angular.module('app')
        .run(Debug);

    /** ngInject */
    function Debug($log, ENV) {
        var enabled = (ENV === 'development' || ENV === 'test');
        $log.debugEnabled(enabled);
    }
})();
