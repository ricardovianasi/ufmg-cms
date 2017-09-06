setTimeout(function () {
    asyncLoad();
}, 100);

function asyncLoad() {
    Dropzone.autoDiscover = false;
}

String.prototype.addEllipsis = function () {
    var newString = this;
    if (this.length > 200) {
        newString = this.split('', 200).join('').concat('...');
    }
    return newString;
};

var updateRedactor = undefined;