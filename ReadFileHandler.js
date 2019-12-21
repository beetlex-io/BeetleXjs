var _readFileHandlerID = 0;

function readFileHandler(file, blockSize) {
    this.file = file;
    this.size = file.size;
    this.readBytes = 0;
    this.id = ++_readFileHandlerID;
    this.index = 0;
    this.name = file.name;
    this.blockSize = 1024 * 8;
    if (blockSize)
        this.blockSize = blockSize;
    this.pages = parseInt(file.size / this.blockSize);
    if (file.size % this.blockSize > 0)
        this.pages++;
    this.reader = null;
    this.percent = 0;
    this.error = null;
    this.data = null;
    this.onload = null;
}

readFileHandler.prototype.completed = function () {
    return this.pages == this.index;
};

readFileHandler.prototype.read = function () {
    var _this = this;
    var length = _this.size - this.readBytes;
    if (length > _this.blockSize)
        length = _this.blockSize;
    if (!_this.reader)
        _this.reader = new FileReader();
    _this.reader.onload = function (evt) {
        if (evt.target.readyState == FileReader.DONE) {
            var str = _this.toBase64(evt.target.result);
            _this.error = null;
            _this.data = str;
            if (_this.onload)
                _this.onload.call(_this);
        }
        else {
            _this.error = "load file error state:" + evt.target.readyState;
            _this.data = str;
            if (_this.onload)
                _this.onload.call(_this);
        }
    };
    _this.reader.onerror = function (evt) {
        _this.error = evt.target.error.name;
        _this.data = str;
        if (_this.onload)
            _this.onload.call(_this);
    };
    var start = _this.index * _this.blockSize;
    var end = start + length;
    _this.index++;
    _this.readBytes += length;
    var blob = _this.file.slice(start, end);
    _this.reader.readAsArrayBuffer(blob);
    var p = this.index / this.pages * 100;
    this.percent = parseInt(p);
};

readFileHandler.prototype.toBase64 = function (buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

function FileUpload(url) {
    this.action = new beetlexAction(url);
    this.completed = null;
    this.items = [];
    this.index = 0;
    this.status = false;
    this.blockSize = 1024 * 16;
    var _this = this;
    this.action.requested = function () {
        console.log(this.token);
        if (!this.token.completed()) {
            this.token.read();
        }
        else {
            if (_this.completed)
                _this.completed(this.token);
            if (_this.index < _this.items.length) {
                _this.execute();
            }
            else {
                _this.status = false;
            }
        }
    };
}
FileUpload.prototype.execute = function () {
    this.status = true;
    var _this = this;
    var item = this.items[this.index];
    this.index++;
    this.action.token = item;
    item.onload = function () {
        _this.action.post(
            {
                name: this.name,
                data: this.data,
                completed: this.completed(),
                index: this.index - 1,
                buffersize: this.blockSize,
                filesize: this.file.size,
            });
    };
    item.read();
}
FileUpload.prototype.upload = function (file) {
    var reader = new readFileHandler(file, this.blockSize);
    this.items.push(reader);
    if (this.status == false) {
        this.execute();
    }
}

