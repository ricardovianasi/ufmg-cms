(function () {
    'use strict';

    angular
        .module('componentsModule')
        .directive('canGet', CanGetCtrl);

    /** ngInject */
    function CanGetCtrl(PermissionService, $rootScope, $timeout, NotificationService) {
        return {
            restrict: 'A',
            scope: {
                context: '@',
                contextId: '='
            },
            link: function ($scope, element) {
                $timeout(function () {
                    if ($rootScope.viewOnly) {
                        disableAll();
                        NotificationService.warn('Acesso negado', 'Você não tem permissão para editar e executar ações.');
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
                    removeEventClick(elem);
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

                function removeEventClick(elem) {
                    if (elem.id === 'btn-back') {
                        return;
                    }

                    $(elem).off('click');

                    $(elem).css({
                        'cursor': 'default'
                    });
                }
            }
        };
    }
})();
