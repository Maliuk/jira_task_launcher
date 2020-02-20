
function polling() {
    console.log('polling');
    setTimeout(polling, 1000 * 30);
}

//polling();

chrome.runtime.getPackageDirectoryEntry(function(root) {
    root.getFile("content.html", {}, function(fileEntry) {
        fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onloadend = function(e) {
                // contents are in this.result
                //alert(this.result);
            };
            reader.readAsText(file);
        }, function () {});
    }, function () {});
});