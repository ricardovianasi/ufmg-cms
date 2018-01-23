(function () {
    'use strict';

    angular.module('galleryModule')
        .controller('GalleryNewController', GalleryNewController);

    /** ngInject */
    function GalleryNewController($location, $uibModal, StatusService, VIEWER, GalleryService, MediaService,
        ManagerFileService, NotificationService, PermissionService, $rootScope, Util, $log, ModalService) {

        let vm = this;

        vm.publish = publish;
        vm.editPhotos = editPhotos;
        vm.removePhoto = removePhoto;
        vm.uploadImage = uploadImage;

        activate();

        function publish() {
            let _photos = [];

            angular.forEach(vm.gallery.photos, function (photo) {
                _photos.push(photo.file.id);
            });

            let obj = {
                title: vm.gallery.title,
                category: parseInt(vm.gallery.category),
                photos: _photos
            };
            vm.isLoading = true;
            GalleryService.newGallery(obj).then(function () {
                $location.path('/gallery');
                vm.isLoading = false;
            }).catch(console.error)
            .then(function () { vm.isLoading = false; });
        }

        function removePhoto(id) {
            let idx = vm.gallery.photos.findIndex(function(photo) {
                return photo.file.id === id;
            });
            let modalConfirm = ModalService.confirm('Você deseja remover esta imagem da galeria?', 'md');
            modalConfirm.result.then(function () {
                vm.gallery.photos.splice(idx, 1);
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

                    let obj = {
                        file: data
                    };

                    vm.gallery.photos.push(obj);
                });
        }

        function editPhotos() {
            let editPhotosModal = _openEditPhotos();

            editPhotosModal.result.then(function (data) {
                angular.forEach(data, function (file) {
                    let obj = {
                        title: file.title ? file.title : '',
                        description: file.description ? file.description : '',
                        altText: file.alt_text ? file.alt_text : '',
                        legend: file.legend ? file.legend : ''
                    };

                    MediaService.updateFile(file.id, obj);
                });
            });
        }

        function _openEditPhotos() {
            return $uibModal.open({
                templateUrl: 'modules/gallery/photos-edit-modal/photos-edit.modal.template.html',
                controller: 'PhotosEditModalController as vm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    photos: function () { return vm.gallery.photos; },
                    index: function () { return 0; }
                }
            });
        }

        function _loadCategories() {
            GalleryService.getCategories().then(function (res) {
                vm.categories = res.data.items;
                vm.canPermission = !VIEWER ? VIEWER : PermissionService.canPost('gallery');
            });
        }

        function _initVariables() {
            vm.categories = [];
            vm.gallery = {};
            vm.gallery.title = '';
            vm.gallery.category = '';
            vm.gallery.photos = [];
        }

        function activate() {
            _initVariables();
            _loadCategories();
        }
    }
})();
