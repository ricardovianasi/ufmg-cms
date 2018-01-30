  (function () {
      'use strict';

      angular.module('galleryModule')
          .controller('GalleryEditController', GalleryEditController);

      /** ngInject */
    function GalleryEditController($scope, $uibModal, $location, $routeParams, StatusService, GalleryService, MediaService,
        NotificationService, ManagerFileService, $rootScope, $log, Util, VIEWER, PermissionService, ModalService, 
        HandleChangeService) {

        let vm = this;

        vm.publish = publish;
        vm.removePhoto = removePhoto;
        vm.editPhotos = editPhotos;
        vm.uploadImage = uploadImage;

        activate();

        function publish () {
            let _photos = [];

            angular.forEach(vm.gallery.photos, function (photo) {
                _photos.push(photo.file.id);
            });

            let obj = {
                title: vm.gallery.title,
                category: parseInt(vm.gallery.category),
                photos: _photos,
                status: vm.gallery.status
            };
            vm.isLoading = true;
            GalleryService.updateGallery(vm.gallery.id, obj).then(function () {
                NotificationService.success('Galeria atualizada com sucesso!');
                $location.path('/gallery');
                vm.isLoading = false;
            }).catch(console.error)
            .then(function() { vm.isLoading = false; });
        }

        function removePhoto(id) {
            var idx = _.findIndex(vm.gallery.photos, function (files) { // jshint ignore: line
                return files.file.id === id ? id : '';
            });

            let modalConfirm = ModalService.confirm('Você deseja remover esta imagem da galeria?', 'md');
            modalConfirm.result.then(function () {
                vm.gallery.photos.splice(idx, 1);
            });
        }

        function editPhotos(index) {
            let editPhotosModal = _openEditPhotos(index);

            editPhotosModal.result.then(function (data) {
                angular.forEach(data, function (files) {
                    var obj = {
                        title: files.file.title ? files.file.title : '',
                        author_name: files.file.author_name ? files.file.author_name : '',
                        description: files.file.description ? files.file.description : '',
                        altText: files.file.alt_text ? files.file.alt_text : '',
                        legend: files.file.legend ? files.file.legend : ''
                    };

                    MediaService.updateFile(files.file.id, obj);
                });

                NotificationService.success('Ediçao realizada com sucesso!');
            });
        }

        function _openEditPhotos(index) {
            return $uibModal.open({
                templateUrl: 'modules/gallery/photos-edit-modal/photos-edit.modal.template.html',
                controller: 'PhotosEditModalController as vm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    photos: function () {
                        return vm.gallery.photos;
                    },
                    index: function () {
                        return index;
                    }
                }
            });
        }

        function uploadImage() {
            ManagerFileService.imageFiles();
            ManagerFileService
                .open('galleryImage')
                .then(function (data) {
                    data.author = {
                        name: data.author
                    };

                    var obj = {
                        file: data
                    };

                    vm.gallery.photos.push(obj);
                });
        }

        function _initVariables() {
            vm.categories = [];
            vm.sortableOptions = {
                containment: '#gallery-list' //optional param.
            };
        }

        function _loadGallery() {
            GalleryService.getGallery(parseInt($routeParams.id)).then(function (data) {
                vm.canPermission = !VIEWER ? VIEWER : PermissionService.canPut('gallery', $routeParams.id);
                vm.gallery = data.data;
                vm.gallery.category = '' + data.data.category.id + '';
            });
        }

        function _loadCategories() {
            GalleryService.getCategories().then(function (res) {
                vm.categories = res.data.items;
            });
        }

        function _hasLoaded(oldValue) {
            return oldValue && angular.isDefined(oldValue.id);
        }

        function activate() {
            _initVariables();
            _loadGallery();
            _loadCategories();
            HandleChangeService.registerHandleChange('/gallery/', ['PUT'], $scope, 
                ['galleryCtrl.gallery'], undefined, _hasLoaded);
        }
    }
})();
