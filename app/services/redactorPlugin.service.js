var oi;
(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('RedactorPluginService', RedactorPluginService);

    /** ngInject */
    function RedactorPluginService(ModalService, ManagerFileService, $log) {
        $log.info('RedactorPluginService');

        var _insertItemOnEditor = function (redactor, template, obj) {
            var html = _.template($(template).html());

            redactor.selection.restore();
            redactor.buffer.set();
            redactor.air.collapsed();
            redactor.insert.html(html(obj));
            redactor.insert.html('<p></p>');
            actionsText();
        };

        function actionsText() {
            $('.redactor-editor').on('keyup', function (event) {
                var elements = $(this).children('.figure-removable');
                if (elements) {
                    elements.each(function (index, element) {
                        if (element.tagName !== 'FIGURE') {
                            element.remove();
                        }
                    });
                }
            });
        }

        function _getData(file) {
            return (function () {
                return {
                    type: file.type,
                    url: file.url,
                    legend: file.legend,
                    author: file.author_name,
                    title: file.title,
                    isList: true,
                    isIcon: false
                };
            })();
        }

        var _plugins = {
            imagencrop: function (options) {
                return {
                    init: function () {
                        var button = this.button.add('imagencrop', 'Inserir Imagem');
                        this.button.addCallback(button, this.imagencrop.show);
                        this.button.setIcon(button, '<i class="fa-picture-o"></i>');
                    },
                    show: function () {
                        var _this = this;
                        _this.selection.save();

                        ManagerFileService
                            .imageFiles()
                            .open(options.formats || ['vertical', 'medium', 'big', 'wide'])
                            .then(function (file) {
                                var data = _getData(file);
                                if (options.callback) {
                                    options.callback.call(null, _this, data);
                                }
                            });
                    }
                };
            },
            audioUpload: function (options) {
                return {
                    init: function () {
                        var button = this.button.add('audioUpload', 'Inserir Áudio');
                        this.button.addCallback(button, this.audioUpload.show);
                        this.button.setIcon(button, '<i class="fa-file-audio-o"></i>');
                    },
                    show: function () {
                        var _this = this;
                        _this.selection.save();

                        ManagerFileService
                            .audioFiles()
                            .open()
                            .then(function (file) {
                                var data = _getData(file);
                                if (options.callback) {
                                    options.callback.call(null, _this, data);
                                }
                            });
                    }
                };
            },
            uploadfiles: function (options) {
                return {
                    init: function () {
                        var button = this.button.add('uploadfiles', 'Inserir Arquivo');
                        this.button.setIcon(button, '<i class="fa-file-code-o"></i>');
                        this.button.addCallback(button, this.uploadfiles.show);
                    },
                    show: function () {
                        var _this = this;
                        _this.selection.save();

                        ManagerFileService
                            .files()
                            .open()
                            .then(function (file) {
                                var data = _getData(file);
                                if (options.callback) {
                                    options.callback.call(null, _this, data);
                                }
                            });
                    }
                };
            }
        };

        var _options = {
            imagencrop: {
                callback: function (redactor, data) {
                    _insertItemOnEditor(redactor, '#redactor-template-figure-' + data.type, data);
                }
            },
            audioUpload: {
                callback: function (redactor, data) {
                    _insertItemOnEditor(redactor, '#redactor-template-audio', data);
                }
            },
            uploadfiles: {
                callback: function (redactor, data) {
                    _insertItemOnEditor(redactor, '#redactor-template-files', data);
                }
            }
        };

        return {
            setPlugin: function (plugin, options) {
                return _plugins[plugin] ? _plugins[plugin](options) : null;
            },
            getOptions: function (plugin) {
                return _options[plugin] || {};
            }
        };
    }
})();
