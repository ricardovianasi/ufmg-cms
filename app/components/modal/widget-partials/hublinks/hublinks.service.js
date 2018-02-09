(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('HublinksService', HublinksService);

    /** ngInject */
    function HublinksService(CommonWidgetService, PagesService) {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load(ctrl) {
            CommonWidgetService.request('LoadMorePage', PagesService.getPages, {
                field: 'title',
                direction: 'ASC'
            }, 'title');

            ctrl.widget.links = ctrl.widget.links || [];
            ctrl.sortableOptions = {
                accept: function (sourceItemHandleScope, destSortableScope) {
                    return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
                },
                containment: '#sort-main'
            };

            _registerFunctions(ctrl);

        }

        function parseToLoad(widget) {
            let objLoaded = { links: _getLinks(widget) };
            objLoaded.links = objLoaded.links.map(function (link) {
                return _handleLinkWidget(link);
            });
            return objLoaded;
        }

        function parseToSave(widget) {
            if (widget.content) {
                angular.forEach(widget.content.links, function (v, k) {
                    if (typeof widget.content.links[k].page === 'object' &&
                        typeof widget.content.links[k].page !== 'number' &&
                        widget.content.links[k].page !== null) {
                        widget.content.links[k].page = widget.content.links[k].page.id ?
                            widget.content.links[k].page.id :
                            widget.content.links[k].page;
                    }
                });
            } else {
                angular.forEach(widget.links, function (v, k) {
                    if (typeof widget.links[k].page === 'object' &&
                        typeof widget.links[k].page !== 'number' &&
                        widget.links[k].page !== 'null' &&
                        widget.links[k].external_url === null) {
                        widget.links[k].page = widget.links[k].page.id ?
                            widget.links[k].page.id :
                            widget.links[k].page;
                    }
                });
            }

            return {
                links: widget.content ? widget.content.links : widget.links,
            };
        }

        function _handleLinkWidget(link) {
            if(link.external_url) {
                link.link_type = 'link';
            } else {
                link.link_type = 'page';
                link.page = link.page ? link.page : false;
            }
            return link;
        }

        function _getLinks(widget) {
            if (widget.content) {
                return widget.content.links || [];
            }
            return widget.links || [];
        }

        function _registerFunctions(ctrl) {
            ctrl.addItem = function () { addItem(ctrl); };
            ctrl.removeItem = function (idx) { removeItem(ctrl, idx); };
            ctrl.changeType = function (idx) { changeType(ctrl, idx); };
        }

        function addItem(ctrl) {
            ctrl.widget.links.push({
                title: '',
                url: '',
            });
        }

        function removeItem(ctrl, idx) {
            if (ctrl.widget.links[idx]) {
                ctrl.widget.links.splice(idx, 1);
            }
        }

        function changeType(ctrl, idx) {
            if (ctrl.widget.links[idx].link_type === 'page') {
                ctrl.widget.links[idx].external_url = null;
            } else {
                ctrl.widget.links[idx].page = null;
            }
        }

    }
})();
