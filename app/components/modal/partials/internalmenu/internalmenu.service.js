(function () {
    'use strict';

    angular
        .module('serviceModule')
        .factory('InternalMenuService', InternalMenuService);

    /** ngInject */
    function InternalMenuService(CommonWidgetService) {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };

        return service;

        ////////////////
        function load(ctrl, _getPages) {
            CommonWidgetService.request('LoadMorePage', _getPages, {
                field: 'title',
                direction: 'ASC'
            }, 'title');
            ctrl.pages = [];
            ctrl.widget.links = ctrl.widget.links || [];
            _registerFunction(ctrl);
        }

        function parseToLoad(widget) {
            var widgetLinks = [];

            if (!widget.content) {
                widget.content = {
                    links: widget.links
                };
            }

            angular.forEach(widget.content.links, function (links) {
                if (links.external_url) {
                    links.isExternal = true;
                    widgetLinks.push(links);
                } else {
                    widgetLinks.push(links);
                }
            });

            return {
                links: widgetLinks,
            };
        }

        function parseToSave(widget) {
            var widgetLinks = [];
            var page;
            var external_url;
            var linksOnEach = widget.links ? widget.links : widget.content.links;

            angular.forEach(linksOnEach, function (links) {
                if (links.external_url) {
                    links.isExternal = true;
                }

                if (!links.isExternal) {
                    external_url = null;
                    page = links.page ? links.page.id : null;
                } else {
                    external_url = links.external_url ? links.external_url : null;
                    page = null;
                }

                widgetLinks.push({
                    page: page,
                    label: links.label,
                    external_url: external_url,
                });
            });

            return {
                links: widgetLinks,
            };
        }

        function _registerFunction(ctrl) {
            ctrl.addItem = function () {
                _registerAddItem(ctrl);
            };
            ctrl.removeItem = function (idx) {
                _registerRemoveItem(ctrl, idx);
            };
        }

        function _registerRemoveItem(ctrl, idx) {
            if (ctrl.widget.links[idx]) {
                ctrl.widget.links.splice(idx, 1);
            }
        }

        function _registerAddItem(ctrl) {
            ctrl.widget.links.push({
                title: '',
                url: '',
            });
        }
    }
})();
