function beetlex4axios() {
    this._requestid = 1;
    this.errorHandlers = new Object();
}

beetlex4axios.prototype.getErrorHandler = function (code) {
    return this.errorHandlers[code];
}
beetlex4axios.prototype.SetErrorHandler = function (code, callback) {
    this.errorHandlers[code] = callback;
}

beetlex4axios.prototype.getRequestID = function () {

    this._requestid++;
    if (this._requestid > 2000) {
        this._requestid = 1;
    }

    return this._requestid;
}

beetlex4axios.prototype.get = function (url, params, callback) {
    var httpurl = url;
    if (!params)
        params = new Object();
    var _this = this;
    params['_requestid'] = this.getRequestID();
    axios.get(httpurl, { params: params, headers: { 'Content-Type': 'application/json;charset=UTF-8' } })
        .then(function (response) {
            var data = response.data;
            if (data.Code && data.Code != 200) {
                _this.onError(data.Code, data.Error);
            }
            else {
                if (callback)
                    callback(data);
            }
        })
        .catch(function (error) {
            var code = error.response ? error.response.status : 500;
            var message = error.message;
            if (error.response)
                message += "\r\n" + error.response.data;
            _this.onError(code, message);
        });
};

beetlex4axios.prototype.onError = function (code, message) {
    var handler = this.getErrorHandler(code);
    if (handler)
        handler(code, message);
    else
        alert(message);
}

beetlex4axios.prototype.post = function (url, params, callback) {
    var httpurl = url;
    if (!params)
        params = new Object();
    var id = this.getRequestID();
    var _this = this;
    params['_requestid'] = id;
    keys = Object.keys(params);
    axios.post(httpurl, JSON.stringify(params), { headers: { 'Content-Type': 'application/json;charset=UTF-8' } })
        .then(function (response) {
            var data = response.data;
            if (data.Code && data.Code != 200) {
                _this.onError(data.Code, data.Error);
            }
            else {
                if (callback)
                    callback(data);
            }
        })
        .catch(function (error) {
            var code = error.response ? error.response.status : 500;
            var message = error.message;
            if (error.response)
                message += "\r\n" + error.response.data;
            _this.onError(code, message);
        });
};

var beetlexWebapi = new beetlex4axios();

function beetlexAction(actionUrl, actionData, defaultResult) {
    this.url = actionUrl;
    this.data = actionData;
    this.result = defaultResult;

}

beetlexAction.prototype.onCallback = function (callback) {
    this.callback = callback;
    return this;
}

beetlexAction.prototype.onValidate = function (callback) {
    this.validate = callback;
    return this;
}

beetlexAction.prototype.get = function (callback) {
    var _this = this;
    if (this.validate)
        if (!this.validate()) return;
    beetlexWebapi.get(this.url, this.data, function (r) {
        _this.result = r;
        if (_this.callback)
            _this.callback(r);
        if (callback)
            callback(r);
    });
};

beetlexAction.prototype.post = function (callback) {
    var _this = this;
    if (this.validate)
        if (!this.validate()) return;
    beetlexWebapi.post(this.url, this.data, function (r) {
        _this.result = r;
        if (_this.callback)
            _this.callback(r);
        if (callback)
            callback(r);

    });

};
