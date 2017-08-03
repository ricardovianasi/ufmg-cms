(function () {
    'use strict';

    angular.module('serviceModule')
        .factory('RedactorPluginService', RedactorPluginService);

    /** ngInject */
    function RedactorPluginService(ModalService, ManagerFileService, $log) {
        $log.info('RedactorPluginService');

        var _insertItemOnEditor = function (redactor, template, obj) {
            var html = _.template($(template).html()); // jshint ignore: line

            redactor.selection.restore();
            redactor.buffer.set();
            redactor.air.collapsed();
            redactor.insert.html(html(obj));
        };

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
                            .open(options.formats || 'free')
                            .then(function (image) {
                                var data = {
                                    type: image.type,
                                    id: image.id,
                                    legend: image.legend,
                                    author: image.author_name,
                                    url: image.url
                                };
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
                            .then(function (data) {
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
                        var button = this.button.add('uploadfiles', 'Inserir Arquivos');
                        this.button.setIcon(button, '<i class="fa-file-code-o"></i>');
                        this.button.addCallback(button, this.uploadfiles.show);
                    },
                    show: function () {
                        var _this = this;
                        _this.selection.save();

                        ManagerFileService
                            .allFiles()
                            .open()
                            .then(function (data) {
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
