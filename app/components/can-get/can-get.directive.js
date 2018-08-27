(function () {
    'use strict';

    angular
        .module('componentsModule')
        .directive('canGet', CanGetCtrl);

    /** ngInject */
    function CanGetCtrl(PermissionService, $rootScope, $timeout) {
        return {
            restrict: 'A',
            scope: {
                context: '@',
                contextId: '=',
                canGet: '='
            },
            link: function ($scope, element) {
                $timeout(function () {
                    if ($rootScope.viewOnly || $scope.canGet) {
                        disableAll();
                    }
                }, 600);

                function disableAll() {
                    findChildren(element[0]);
                }

                function findChildren(elem) {
                    if (!elem) {
                        return;
                    }
                    var children = elem.children;
                    if (children.length > 0) {
                        for (var index = 0; index < children.length; index++) {
                            var elemChildren = children[index];
                            findChildren(elemChildren);
                        }
                    }
                    disableInputs(elem);
                    removeEvents(elem);
                    addCss(elem);
                }

                function disableInputs(elem) {
                    if (
                        elem.nodeName === 'INPUT' ||
                        elem.nodeName === 'TEXTAREA' ||
                        elem.nodeName === 'SELECT'
                    ) {
                        elem.disabled = true;
                        return;
                    }
                }

                function addCss(elem){
                    if(!noRemoveEvents(elem)) {
                        $(elem).css({
                            'cursor': 'default'
                        });
                    }
                    if(elem.nodeName === 'IMG'){
                        $(elem).css({
                            'width': '100%'
                        });
                    }
                }

                function removeEvents(elem) {
                    if (noRemoveEvents(elem)) {
                        return;
                    }

                    $(elem).off('click');
                    
                    $(document).off('mouseenter');

                    $(elem).off('mouseenter');

                    $(elem).off('dragenter');
                }

                function noRemoveEvents(elem) {
                    return elem.id == 'btn-back' || $(elem).hasClass('view-permission');
                }
            }
        };
    }
})();
