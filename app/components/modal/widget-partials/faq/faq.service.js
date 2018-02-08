(function() {
    'use strict';

    angular
        .module('serviceModule')
        .factory('FaqWidgetService', FaqWidgetService);

    /** ngInject */
    function FaqWidgetService(CommonWidgetService, faqService) {
        var service = {
            load: load,
            parseToLoad: parseToLoad,
            parseToSave: parseToSave
        };
        
        return service;

        ////////////////
        function load() {
            CommonWidgetService.request('LoadMoreFaq', faqService.faqs, {
                field: 'title',
                direction: 'ASC'
            }, 'title');
            return {
                content: {}
            };
        }

        function parseToLoad(widget) {
            widget.content.faq = widget.content ? widget.content.faq : null;
            let objLoaded = {
                title: widget.title,
                content: widget.content,
            };
            return objLoaded;
        }

        function parseToSave(widget) {
            let id;
            if (typeof widget.content.faq === 'object') {
                id = widget.content.faq.id;
            } else {
                id = widget.content.faq;
            }
            return {
                type: widget.type,
                faq: parseInt(id),
                id: undefined
            };
        }
    }
})();
