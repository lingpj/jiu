/**
 * Created by Administrator on 2017-5-29 029.
 */
function flushStatic() {
    var links = $('link');
    var scripts = $('script');

    $.each(links, function (index, ele) {
        var href = $(ele).attr('href');
        $(ele).attr('href', href + "?v=" + uuid());
    });
    $.each(scripts, function (index, ele) {
        var src = $(ele).attr('src');
        $(ele).attr('src', src + '?v=' + uuid());
    });
}

var cookies = (function () {
    var Cookies;
    Cookies = {
        set: function (key, value, day, path) {
            day = day || 0.5;
            path = path || "/";
            document.cookie = key + "=" + escape(value) + ";expires=" + expire(day) + ";path=" + path;
        },
        get: function (key) {
            return getCookies(key);
        },
        remove: function (key) {
            document.cookie = key + "=" + getCookies(key) + ";expires=" + expire(-1);
        },
        clear: function () {
            clearCookies();
        },
        has: function (key) {
            var _cookies = allCookies(), r = false;
            for (var i in _cookies) {
                if (trim(_cookies[i][0]) === key) {
                    r = true;
                    break;
                }
            }
            return r;
        },
        stringify: function (data) {
            return JSON.stringify(data);
        },
        parse: function (data) {
            return JSON.parse(data);
        },
        trim: function (string) {
            return trim(string);
        },
        dump: function (data) {
            console.log(data);
        }
    }
    function expire(day) {
        var exp = new Date();
        exp.setTime(exp.getTime() + day * 24 * 3600 * 1000);
        return exp.toUTCString();
    }
    function allCookies() {
        var _cookies;
        _cookies = document.cookie;
        _cookies = _cookies.split(';');
        for (var i in _cookies) {
            _cookies[i] = _cookies[i].split('=');
        }
        return _cookies;
    }
    function getCookies(key) {
        var _cookies = allCookies(), o = {};
        for (var i in _cookies) {
            o[trim(_cookies[i][0])] = _cookies[i][1];
        }
        return unescape(o[key]);
    }
    function clearCookies() {
        var _cookies = allCookies();
        for (var i in _cookies) {
            document.cookie = _cookies[i][0] + "=" + unescape(_cookies[i][1]) + ";expires=" + expire(-1);
        }
    }
    function trim(string) {
        return string.replace(/(^\s*)|(\s*$)/, '');
    }
    return Cookies;
})();

function uuid(num) {
    if (typeof num == 'undefined') {
        num = 6;
    }
    var source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g'];
    var len = source.length;
    var ret = '';
    for (var i = 0; i < num; i++) {
        var rand = Math.floor(Math.random() * len);
        ret += source[rand].toString();
    }
    return ret;
}

function WxAddImage(id, element) {
    this.id = uuid();

    this.init = function () {
        var othis = this;
        if (!$('#image').length) {
            throw 'AddImage:have no image input';
        }
        othis.image = $('#image');
        othis.trigger();
    };

    this.getImage = function () {
        return $('#image');
    };

    this.addOne = function (image_id) {
        var ele = this.getImage();
        var val = ele.val();
        if (val != '') {
            ele.val(ele.val() + "," + image_id);
        } else {
            ele.val(image_id);
        }
    };

    this.deleteOne = function (image_id) {
        var ele = this.getImage();
        var val = ele.val();
        var list = val.split(',');
        var newList = [];
        list.forEach(function (ele) {
            if (ele != image_id) {
                newList.push(ele);
            }
        });
        ele.val(newList.join(','));
    };

    this.createInput = function () {
        var input = $('<input>');
        var othis = this;
        input.attr('id', othis.id);
        input.attr('type', 'file');
        input.attr('name', 'image');
        input.css('display', 'none');
        input.bind('change', function () {
            var file = this.files[0];
            othis.showImage(file);
        });
        othis.fileInput = input;
        $('body').append(input);
    };

    this.trigger = function () {
        var othis = this;
        //_uploadOneImage(id, function (image_id, src) {
        //    othis._showImage(image_id, src, $(element));
        //});
        if ($(".media").find('.image-wrap').length >= 10) {
            layer.msg('最多上传10张图片');
            return;
        }
        var currentImage = 0;
        triggerWebUploader('media-upload-hook', function (src) {
            currentImage = othis.__showImage(0, src, $(element));
        }, function (image_id) {
            othis.__setId(image_id, currentImage);
        });
        //chooseImage(function (image_id, src) {
        //    othis._showImage(image_id, src, $(element));
        //});
    };

    this.check = function (file) {
        var m = 7;
        var limit = 1024 * 1024 * m;
        var size = file.size;
        var type = file.type;
        if (size > limit) {
            layer.alert('图片不能大于' + m + 'M');
            return false;
        }
        if (!inArray(type, ['image/png', 'image/jpg', 'image/jpeg'])) {
            layer.alert('请选择正确的图片类型');
            return false;
        }
        return true;
    };

    this._showImage = function (id, src, element) {
        var othis = this;

        if (othis.modify) {
            var image = othis.currentImage;
            image.attr('data-id', id);
            image.attr('src', src);
            othis.addOne(id);
        } else {
            othis.addOne(id);
            var image = $('<img>');
            image.attr('src', src);
            image.attr('data-id', id);
            othis.image = image;
            var div = $('<div>');
            div.addClass('image-wrap');
            div.append(image);
            othis.addTool(div);
            $('.show-image').append(div);

            othis.modify = false;
        }
    };

    this.__setId = function (id, image) {
        this.addOne(id);
        image.attr('data-id', id);
    };

    this.__showImage = function (id, src, element) {
        var othis = this;

        if (othis.modify) {
            var image = othis.currentImage;
            //image.attr('data-id', id);
            image.attr('src', src);
            //othis.addOne(id);
        } else {
            //othis.addOne(id);
            var image = $('<img>');
            image.attr('src', src);
            //image.attr('data-id', id);
            othis.image = image;
            var div = $('<div>');
            div.addClass('image-wrap');
            div.append(image);
            othis.addTool(div);
            $('.show-image').append(div);

            othis.modify = false;
        }

        return image;
    };

    this.del = function (id) {
        $.post(bao.imageDeleteUrl, { id: id }, function (r) {

        });
    };

    this.upload = function (file, callback) {
        lrz(file, { width: 400 }).then(function (rst) {
            $.post(bao.imageUploadUrl, { base64: rst.base64 }, function (r) {
                if (r.code == 1) {
                    callback(r.msg.image_id, '/upload/' + r.msg.src);
                } else {
                    layer.msg(r.msg);
                }
            });
        });
    };

    this.addTool = function (div) {
        var othis = this;
        var modify = $('<span>');
        var del = $('<span>');
        modify.addClass('image-wrap-modify').html('修改');
        del.addClass('image-wrap-del').html('删除');
        modify.click(function () {
            othis.modify = true;
            var currentImage = $(this).parent().find('img');
            othis.currentImage = currentImage;
            othis.deleteOne(currentImage.data('id'));
            othis.del(currentImage.data('id'));
            othis.trigger();
        });
        del.click(function () {
            div.remove();
            var id = div.find('img').data('id');
            othis.deleteOne(id);
            $('#' + othis.id).remove();
        });
        div.append(modify);
        div.append(del);
    };
}

function AddImage(id, element) {
    this.id = uuid();

    this.init = function () {
        var othis = this;
        //othis.createInput();
        //othis.trigger();
        if (!$('#image').length) {
            throw 'AddImage:have no image input';
        }
        othis.image = $('#image');
        othis.trigger();
    };

    this.getImage = function () {
        return $('#image');
    };

    this.addOne = function (image_id) {
        var ele = this.getImage();
        var val = ele.val();
        if (val != '') {
            ele.val(ele.val() + "," + image_id);
        } else {
            ele.val(image_id);
        }
    };

    this.deleteOne = function (image_id) {
        var ele = this.getImage();
        var val = ele.val();
        var list = val.split(',');
        var newList = [];
        list.forEach(function (ele) {
            if (ele != image_id) {
                newList.push(ele);
            }
        });
        ele.val(newList.join(','));
    };

    this.createInput = function () {
        var input = $('<input>');
        var othis = this;
        input.attr('id', othis.id);
        input.attr('type', 'file');
        input.attr('name', 'image');
        input.css('display', 'none');
        input.bind('change', function () {
            var file = this.files[0];
            othis.showImage(file);
        });
        othis.fileInput = input;
        $('body').append(input);
    };

    this.trigger = function () {
        var othis = this;
        //this.fileInput.click();
        _uploadOneImage(id, function (image_id, src) {
            //src = '/upload/' + src;
            othis._showImage(image_id, src, $(element));
        });
    };

    this.check = function (file) {
        var m = 7;
        var limit = 1024 * 1024 * m;
        var size = file.size;
        var type = file.type;
        if (size > limit) {
            layer.alert('图片不能大于' + m + 'M');
            return false;
        }
        if (!inArray(type, ['image/png', 'image/jpg', 'image/jpeg'])) {
            layer.alert('请选择正确的图片类型');
            return false;
        }
        return true;
    };

    //this.showImage = function (file) {
    //    var othis = this;
    //    var reader = new FileReader();
    //    reader.readAsDataURL(file);
    //    if (!othis.check(file)) {
    //        return;
    //    }
    //    if (othis.modify) {
    //        reader.onload = function () {
    //            othis.upload(file, function (id, src) {
    //                var image = othis.currentImage;
    //                image.attr('data-id', id);
    //                image.attr('src', src);
    //                othis.addOne(id);
    //            });
    //        };
    //    } else {
    //        reader.onload = function () {
    //            othis.upload(file, function (id, src) {
    //                othis.addOne(id);
    //                var image = $('<img>');
    //                image.attr('src', src);
    //                image.attr('data-id', id);
    //                othis.image = image;
    //                var div = $('<div>');
    //                div.addClass('image-wrap');
    //                div.append(image);
    //                othis.addTool(div);
    //                $(element).before(div);
    //            });
    //        };
    //        othis.modify = false;
    //    }
    //};

    this._showImage = function (id, src, element) {
        var othis = this;

        if (othis.modify) {
            var image = othis.currentImage;
            image.attr('data-id', id);
            image.attr('src', src);
            othis.addOne(id);
        } else {
            othis.addOne(id);
            var image = $('<img>');
            image.attr('src', src);
            image.attr('data-id', id);
            othis.image = image;
            var div = $('<div>');
            div.addClass('image-wrap');
            div.append(image);
            othis.addTool(div);
            $('.show-image').append(div);

            othis.modify = false;
        }
    };

    this.del = function (id) {
        $.post(bao.imageDeleteUrl, { id: id }, function (r) {

        });
    };

    this.upload = function (file, callback) {
        lrz(file, { width: 400 }).then(function (rst) {
            $.post(bao.imageUploadUrl, { base64: rst.base64 }, function (r) {
                if (r.code == 1) {
                    callback(r.msg.image_id, '/upload/' + r.msg.src);
                } else {
                    layer.msg(r.msg);
                }
            });
        });
    };

    this.addTool = function (div) {
        var othis = this;
        var modify = $('<span>');
        var del = $('<span>');
        modify.addClass('image-wrap-modify').html('修改');
        del.addClass('image-wrap-del').html('删除');
        modify.click(function () {
            othis.modify = true;
            var currentImage = $(this).parent().find('img');
            othis.currentImage = currentImage;
            othis.deleteOne(currentImage.data('id'));
            othis.del(currentImage.data('id'));
            othis.trigger();
        });
        del.click(function () {
            div.remove();
            var id = div.find('img').data('id');
            othis.deleteOne(id);
            $('#' + othis.id).remove();
        });
        div.append(modify);
        div.append(del);
    };
}
/**
 * 多少张图片无刷新上传
 *
 * @param file_id 触发上传事件的id
 * @param value_id 保存图片id的表单id，格式为1,2,3
 * @param show_id 显示图片的div id
 * @param limit 一共能上传几张
 * @param update_enable 更新权限
 * @param del_enable 删除权限
 */
function multipleImageUpload(file_id, value_id, show_id, limit, update_enable, del_enable) {
    var addPrefix = function (id) {
        if (id.indexOf('#') == -1) {
            id = "#" + id;
        }
        return id;
    };

    file_id = addPrefix(file_id);
    value_id = addPrefix(value_id);
    show_id = addPrefix(show_id);

    var value_input = $(value_id);

    var add = function (id) {
        var val = value_input.val();
        if (!val) {
            val = id;
        } else {
            val = val + ',' + id;
        }
        value_input.val(val);
    };

    var del = function (id) {
        var val = value_input.val();
        if (val) {
            var arr = val.split(',');
        } else {
            var arr = [];
        }
        var list = [];
        arr.forEach(function (ele) {
            if (ele != id) {
                list.push(ele);
            }
        });
        value_input.val(list.join(','));
    };
    rawUploadImage(file_id, function (image_id, src) {
        if ($(show_id).find('img').length >= limit) {
            layer.msg('一共只能上传' + limit + "张图片");
            return;
        }

        add(image_id);
        var img = $("<img>").attr('src', src).attr('data-id', image_id);
        if (del_enable) {
            img.dblclick(function () {
                var othis = $(this);
                del(image_id);
                othis.remove();
            });
        }
        $(show_id).append(img);
    });
}
// localStorage存储数据
function localStorageSetData(key, value) {
    if (!data || !value) return
    var str = JSON.stringify(value)
    localStorage.setItem(key, str)
}
// localStorage获取数据
function localStorageGetData(key,callback) {
    var str = localStorage.getItem(key)
    var data = JSON.parse(str)
    callback(data)
}

function checkImage(file) {
    var m = 7;
    var limit = 1024 * 1024 * m;
    var size = file.size;
    var type = file.type;
    if (size > limit) {
        layer.alert('图片不能大于' + m + 'M');
        return false;
    }
    if (!inArray(type, ['image/png', 'image/jpg', 'image/jpeg'])) {
        layer.alert('请选择正确的图片类型');
        return false;
    }
    return true;
}

function rawUploadImage(id, callback) {
    if (id.indexOf('#') == -1) {
        id = '#' + id;
    }
    layui.upload({
        elem: id,
        url: bao.imageUpload,
        ext: 'jpg|jpeg|png',
        before: function () {
            _uploadOneImage.index = layer.load(1);
        },
        success: function (r) {
            layer.close(_uploadOneImage.index);
            if (r.error_msg) {
                layer.msg(r.error_msg);
            } else {
                if (typeof callback == 'function') {
                    callback(r.image_id, r.src);
                }
            }
        }
    });
}

function oss_del_image(id, callback) {
    $.post(bao.delImage, { id: id }, function (r) {
        if (typeof callback == 'function') {
            callback(r);
        }
    });
}

/**
 *
 * @param id dome id
 * @param paramId param id
 * @param callback
 */
function zuploadImage(id, paramId, callback) {
    if (id.indexOf('#') == -1) {
        id = '#' + id;
    }
    layui.zupload({
        elem: id,
        id: paramId,
        url: bao.imageUpload,
        ext: 'jpg|jpeg|png',
        before: function () {
            _uploadOneImage.index = layer.load(1);
        },
        success: function (r) {
            layer.close(_uploadOneImage.index);
            if (r.error_msg) {
                layer.msg(r.error_msg);
            } else {
                if (typeof callback == 'function') {
                    callback(r.image_id, r.src);
                }
            }
        }
    });

    $(id).click();
}

function wxUploadImage(id, image_id, callback) {
    image_id = image_id || '';
    callback = callback || function () { };

    wx.uploadImage({
        localId: id.toString(),
        isShowProgressTips: 1,
        success: function (res) {
            var serverId = res.serverId;
            $.post(bao.saveOrUpdateServerId, { server_id: serverId, image_id: image_id }, function (r) {
                if (r.code == 0) {
                    layer.msg(r.msg);
                } else {
                    callback(r.data, id[0]);
                }
            });
        },
        fail: function (r) {
            alert('微信上传图片失败，错误码:' + JSON.stringify(r));
        }
    });
}

function chooseImage(callback) {
    callback = callback || function () { };

    wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
            var localIds = res.localIds;
            wxUploadImage(localIds, null, callback);
        }
    });
}

function _uploadOneImage(id, callback) {
    if (id.indexOf('#') == -1) {
        id = '#' + id;
    }
    layui.upload({
        elem: id,
        url: bao.imageUpload,
        ext: 'jpg|jpeg|png',
        before: function () {
            _uploadOneImage.index = layer.load(1);
        },
        success: function (r) {
            layer.close(_uploadOneImage.index);
            if (r.error_msg) {
                layer.msg(r.error_msg);
            } else {
                if (typeof callback == 'function') {
                    callback(r.image_id, r.src, r.file);
                }
            }
        }
    });

    $(id).click();
}
//这个方式是未使用微信上传图片的api以前调用的 my.php
function uploadOneImage(id, value_id) {

    _uploadOneImage(id, function (image_id, src) {
        $(value_id).val(image_id);
        if ($('#main-image-src-one').length == 0) {
            var image = $('<img>').attr('id', 'main-image-src-one').attr('src', src);
            var span = $('<span>').addClass('del-main-image').text('删除');
            var changeItem = $('<span>').addClass('change-main-image').text('修改')
            span.click(function () {
                delMainImage(this);
            });
            changeItem.click(function () {
                uploadOneImage('#main-image-upload', '#main-image')
            })
            $('#main-image-src-one-wrap').empty().append(changeItem).append(span).append(image);
            $('#main-image-src-one-wrap').parent().removeClass('border-transparent');
            $('.upload-main-image').hide();
        } else {
            $('#main-image-src-one').attr('src', src);
        }
    });
}
//这个方法是使用微信api上传图片 my.php
function wxUploadOneImage(id, value_id) {
    id = 'main-upload-hook';
    triggerWebUploader(id, function (src) {
        if ($('#main-image-src-one').length == 0) {
            var image = $('<img>').attr('id', 'main-image-src-one').attr('src', src);
            var span = $('<span>').addClass('del-main-image').text('删除');
            var changeItem = $('<span>').addClass('change-main-image').text('修改')
            var changeItemWrap = $('<p>').addClass('main-image-button');
            changeItemWrap.append(changeItem).append(span);
            span.click(function () {
                delMainImage(this);
            });
            changeItem.click(function () {
                uploadOneImage('#main-image-upload', '#main-image')
            })
            $('#main-image-src-one-wrap').empty().append(changeItemWrap).append(image);
            $('#main-image-src-one-wrap').parent().removeClass('border-transparent');
            $('.upload-main-image').hide();
        } else {
            $('#main-image-src-one').attr('src', src);
        }
    }, function (image_id) {
        $(value_id).val(image_id);
    });

    return;

    chooseImage(function (image_id, src) {
        $(value_id).val(image_id);
        if ($('#main-image-src-one').length == 0) {
            var image = $('<img>').attr('id', 'main-image-src-one').attr('src', src);
            var span = $('<span>').addClass('del-main-image').text('删除');
            var changeItem = $('<span>').addClass('change-main-image').text('修改')
            span.click(function () {
                delMainImage(this);
            });
            changeItem.click(function () {
                uploadOneImage('#main-image-upload', '#main-image')
            })
            $('#main-image-src-one-wrap').empty().append(changeItem).append(span).append(image);
            $('#main-image-src-one-wrap').parent().removeClass('border-transparent');
            $('.upload-main-image').hide();
        } else {
            $('#main-image-src-one').attr('src', src);
        }
    });
}

function delMainImage(othis) {
    $('.upload-main-image').show()
    var main = $('#main-image');
    var wrap = $('#main-image-src-one-wrap');
    wrap.parent().addClass('border-transparent');
    main.val('');
    wrap.empty();
}

function initTab(tabId, contentId) {
    var lis = $("#" + tabId).find('li');
    var items = $('#' + contentId).find('.z-tab-item');
    lis.click(function () {
        items.addClass('layui-hide');
        var index = $(this).index();
        items.eq(index).removeClass('layui-hide');
        lis.removeClass('active');
        $(this).addClass('active');
    }).eq(0).trigger('click');
}

function inArray(needle, array) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (needle == array[i]) {
            return true;
        }
    }
    return false;
}

function initImageWidget(id, othis) {
    //被注释掉的是未使用微信上传图片的api调用的方式
    //var widget = new AddImage(id, $(othis));
    //widget.init();

    //使用微信api上传图片
    var widget = new WxAddImage(id, $(othis));
    widget.init();
}

function initVideoWidget(othis) {
    if ($('.video-wrap').length >= 5) {
        layer.msg('最多只能上传5个视频');
    } else {
        var html = '<div class="video-wrap"><span class="video-del" onclick="$(this).parent().remove()">删除</span><textarea class="layui-textarea video-textarea can-write" placeholder="请复制粘贴优酷、腾讯视频链接" name="video[]"></textarea></div>';
        $(othis).before(html);
    }
}

function joinDate(arr) {
    var month = arr[1] < 10 ? '0' + arr[1] : arr[1] + '';
    var date = arr[2] < 10 ? '0' + arr[2] : arr[2] + '';
    return arr[0] + '-' + month + '-' + date
}
function joinDate(arr) {
    var month = arr[1] < 10 ? '0' + arr[1] : arr[1] + '';
    var date = arr[2] < 10 ? '0' + arr[2] : arr[2] + '';
    return arr[0] + '-' + month + '-' + date
}
function show_datetime(othis) {
    var date = new Date();
    var prizeTime = $('#prize-time');
    othis = $(othis);

    weui.datePicker({
        start: date.getFullYear(),
        end: date.getFullYear() + 1,
        defaultValue: [date.getFullYear(), date.getMonth() + 1, date.getDate()],
        onConfirm: function (result) {
            var time = joinDate(result);
            othis.html(time);
            prizeTime.val(time);
            checkTimeSpacing();
        },
    });
}

function setIframeVideo() {
    var width = $('body').width() - 70;
    $('iframe').width(width).height(width * 0.778);
}

function commonUploadOneImage(callback) {
    var id = uuid();
    var fileInput = $('<input>');
    fileInput.attr('id', id);
    fileInput.attr('type', 'file');
    fileInput.css('display', 'none');
    fileInput.bind('change', function () {
        var file = window.event.target.files[0];
        if (checkImage(file)) {
            lrz(file, { width: 400 }).then(function (rst) {
                $.post(bao.imageUploadUrl, { base64: rst.base64 }, function (r) {
                    if (r.code == 1) {
                        if (typeof callback == 'function') {
                            callback(r.msg.image_id, r.msg.src);
                        }
                    } else {
                        layer.msg(r.msg);
                    }
                });
            });
        }
    });
    $('body').append(fileInput);
    fileInput.click();
}

function exchangeMe(element) {
    _uploadOneImage('change-image', function (image_id, src) {
        element = $(element);
        var pageImage = $('#page-image');
        var image = element.find('img');
        pageImage.val(image_id);
        image.attr('src', src);
    });
}

function wxExchangeMe(element) {

    triggerWebUploader('page-share-common-hook', function (src) {
        //element = $(element);
        //var image = element.find('img');
        //image.attr('src', src);
    }, function (image_id) {
        //var pageImage = $('#page-image');
        //pageImage.val(image_id);
    }, function (src, image_id) {
        element = $(element);
        var pageImage = $('#page-image');
        var image = element.find('img');
        pageImage.val(image_id);
        image.attr('src', src);
    });

    return;

    chooseImage(function (image_id, src) {
        element = $(element);
        var pageImage = $('#page-image');
        var image = element.find('img');
        pageImage.val(image_id);
        image.attr('src', src);
    });
}

function time2now(startTime, endTime) {
    var s1 = new Date(endTime.replace(/-/g, "/")),
        s2 = new Date(),
        runTime = parseInt((s2.getTime() - s1.getTime()) / 1000);
    var st = new Date(startTime.replace(/-/g, '/')).getTime();
    if (st > s2.getTime()) {
        return false;
    }
    runTime = -runTime;
    var year = Math.floor(runTime / 86400 / 365);
    runTime = runTime % (86400 * 365);
    var month = Math.floor(runTime / 86400 / 30);
    runTime = runTime % (86400 * 30);
    var day = Math.floor(runTime / 86400);
    runTime = runTime % 86400;
    var hour = Math.floor(runTime / 3600);
    runTime = runTime % 3600;
    var minute = Math.floor(runTime / 60);
    runTime = runTime % 60;
    var second = runTime;
    return {
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        second: second
    };
}

function countDown(startTime, endTime) {
 
    var time = time2now(startTime, endTime);
    var day = $('#count-day');
    var hour = $('#count-hour');
    var minute = $('#count-minute');
    var second = $('#count-second');
    if (time == false) {
        $('#count-down').html('请耐心等待，活动<br\/>' + startTime + '开始');
    } else {
        if (time.year < 0) {
            $('#count-down').html('活动已经于<br\/>' + endTime + '结束');
            return;
        } else {
            day.html(time.month * 30 + time.day);
            hour.html(time.hour);
            minute.html(time.minute);
            second.html(time.second);
            setTimeout(function () {
                countDown(startTime, endTime);
            }, 1000);
        }
    }
}

function showJoinGasoline(activity_id) {
    var tpl = $('#join-tpl').html();
    layer.open({
        title: '超级加油·填写信息',
        content: tpl,
        skin:'joinbox',
        btn: ['取消', '确定'],
        closeBtn: 0,
        btn1: function (index) {
            layer.close(index);
        },
        btn2: function (index) {
            var member_info = [];
            var infos = $('.join-member-info');
            $.each(infos, function (index, ele) {
                member_info.push(ele.value.trim());
            });

            var phone = $('#join-phone').val();
            var name = $('#join-name').val();

            var fish = new Fish();
            var loading = layer.load(2)
            if (!fish.isPhone(phone)) {
                alert('请输入正确格式的手机号');
                layer.close(loading);
                return false;
            }

            if (name.length < 2 || name.length > 20) {
                alert('姓名在2~20个字符之间');
                layer.close(loading);
                return false;
            }

            //type:join open
            var param = {
                activity_id: activity_id,
                phone: phone,
                name: name,
                member_info: member_info
            };
            
            $.post(bao.joinGasoline, param, function (result) {
                if (result.code == 1) {
                    result = result.msg;
                    if (result.redirect) {
                        if (result.msg) {
                            layer.msg(result.msg);
                        }
                        redirectTo(result.redirect, 1500);
                    } else {
                        alert(result.msg);
                        return false;
                    }
                } else {
                    alert(result.msg);
                    layer.close(loading);
                    return false;
                }
            });
            return false;
        }
    });
}

function showJoinGroup(tag, activity_id, parent_id) {
    var tpl = $('#join-tpl').html();
    layer.open({
        title: '参团•请填写个人信息',
        content: tpl,
        skin:'joinbox',
        closeBtn: 0,
        btn: ['取消', '确定'],
        btn1: function (index) {
            layer.close(index);
        },
        btn2: function (index) {
            var member_info = [];
            var infos = $('.join-member-info');
            $.each(infos, function (index, ele) {
                member_info.push(ele.value.trim());
            });

            var phone = $('#join-phone').val();
            var name = $('#join-name').val();

            var fish = new Fish();
            var loading = layer.load(2);
            if (!fish.isPhone(phone)) {
                alert('请输入正确格式的手机号');
                layer.close(loading);
                return false;
            }

            if (name.length < 2 || name.length > 20) {
                alert('姓名在2~20个字符之间');
                layer.close(loading);
                return false;
            }

            //type:join open
            var param = {
                tag: tag,
                activity_id: activity_id,
                phone: phone,
                name: name,
                member_info: member_info
            };
            if (parent_id != 0) {
                param.parent_id = parent_id;
            }
            // return;
            $.post(bao.joinGroup, param, function (result) {
                if (result.code == 0) {
                    alert(result.msg);
                    layer.close(loading)
                    return false;
                } else {
                    var r = result.msg;
                    if (r.pay_param) {
                        weixinPay(r.pay_param, function () {
                            if (r.redirect) {
                                redirectTo(r.redirect);
                            }
                        });
                    } else if (r.redirect) {
                        if (r.msg) {
                            layer.msg(r.msg);
                            redirectTo(r.redirect, 2000);
                        } else {
                            redirectTo(r.redirect);
                        }
                    }
                }
            });
            return false;
        }
    });
}

function flushPage() {
    window.location.reload();
}

function redirectTo(uri, timeout) {
    timeout = timeout || 0;
    setTimeout(function () {
        window.location.href = uri;
    }, timeout);
}

function showOpenGroup(activity_id) {
    var tpl = $('#join-tpl').html();
    layer.open({
        title: '开团•请填写个人信息',
        content: tpl,
        skin:'joinbox',
        closeBtn: 0,
        btn: ['取消', '确定'],
        btn1: function (index) {
            layer.close(index);
        },
        btn2: function (index) {
            var member_info = [];
            var infos = $('.join-member-info');
            $.each(infos, function (index, ele) {
                member_info.push(ele.value.trim());
            });

            var phone = $('#join-phone').val();
            var name = $('#join-name').val();

            var fish = new Fish();
            var loading = layer.load(2);
            if (!fish.isPhone(phone)) {
                alert('请输入正确格式的手机号');
                layer.close(loading);
                return false;
            }

            if (name.length < 2 || name.length > 20) {
                alert('姓名在2~20个字符之间');
                layer.close(loading);
                return false;
            }

            //type:join open
            var param = {
                activity_id: activity_id,
                phone: phone,
                name: name,
                member_info: member_info
            };

            $.post(bao.openGroup, param, function (result) {
                if (result.code == 0) {
                    alert(result.msg);
                    layer.close(loading);
                    return false;
                } else {
                    var r = result.msg;
                    if (r.pay_param) {
                        weixinPay(r.pay_param, function () {
                            if (r.redirect) {
                                redirectTo(r.redirect);
                            }
                        });
                    } else if (r.redirect) {
                        if (r.msg) {
                            layer.msg(r.msg);
                            redirectTo(r.redirect, 1000);
                        } else {
                            redirectTo(r.redirect);
                        }
                    }
                }
            });
            return false;
        }
    });
}

function watchGroupDetail(url, title) {
    var uri = bao.host + url;

    layer.open({
        title: title,
        type: 2,
        area: ['100%', '100%'],
        content: uri
    });
}

function delViewImage(element, id) {
    var val = $('#image').val();
    var list = val.split(',');
    var ret = [];
    list.forEach(function (ele) {
        if (ele != id) {
            ret.push(ele);
        }
    });
    $('#image').val(ret.join(','));
    $(element).parent().remove();
}

function modifyViewImage(element, id) {
    element = $(element);
    triggerWebUploader('media-upload-hook-modify', function (src) {
        element.parent().find('img').attr('src', src);
    }, function (image_id) {
        var id_str = $('#image').val();
        id_str = id_str.replace(id, image_id);
        $('#image').val(id_str);
    }, function (src, image_id) {
    });

    return;

    chooseImage(function (image_id, src) {
        element.parent().find('img').attr('src', src);
        var id_str = $('#image').val();
        id_str = id_str.replace(id, image_id);
        $('#image').val(id_str);
    });
}

function delOneActivity() {
    layer.confirm('确认删除？', function (r) {
        if (r == 1) {

        }
    });
}

function genQrcode(url) {
    var tpl = $('#share-tpl').html();
    laytpl(tpl).render({ src: 'test' }, function (r) {
        layer.open({
            title: '二维码',
            content: r
        });
    });
}
//input[name=name]
function findArrayInput(name) {
    var inputs = $('input');
    var ret = [];
    $.each(inputs, function (index, ele) {
        if ($(ele).attr('name') == name) {
            ret.push(ele);
        }
    });
    return ret;
}

function addGroupSet(element) {
    var inputs = findArrayInput('person[]');
    var len = inputs.length;
    if (len >= 3) {
        layer.msg('最多只能添加3组');
    } else {
        var input = $(inputs[0]);
        var div = input.parent().parent().parent();
        var newdiv = div.clone(true);
        newdiv.find('input').val(1);
        var notice = $(element).parent().parent().find('.notice');
        if (notice) {
            notice.before(newdiv);
        } else {
            $(element).parent().before(newdiv);
        }
        var btn = $('#group-add-btn');
        if (findArrayInput('person[]').length < 3) {
            btn.removeClass('layui-hide');
        } else {
            btn.addClass('layui-hide');
        }
    }
}

function delGroupSet(element) {
    var inputs = findArrayInput('person[]');
    var len = inputs.length;
    if (len > 1) {
        $(element).parent().remove();
    } else {
        layer.msg('至少设置一组');
    }
    var btn = $('#group-add-btn');
    if (findArrayInput('person[]').length < 3) {
        btn.removeClass('layui-hide');
    } else {
        btn.addClass('layui-hide');
    }
}

function group_action(joiner_id, activity_id, name) {
    layer.open({
        content: '',
        btn: ['取消', '确定'],
        closeBtn: 0,
        btn1: function (index) {
            layer.close(index);
        },
        btn2: function (index, layero) {
            layer.close(index);
            layer.prompt({ title: '输入新名称，并确认', formType: 3 }, function (pass, index2) {
                if (pass == name) {
                    layer.close(index2);
                    layer.msg('没有修改');
                } else {
                    layer.load();
                    $.post(bao.updateJoinerGroupName, {
                        joiner_id: joiner_id,
                        activity_id: activity_id,
                        name: pass
                    }, function (r) {
                        layer.close('loading');
                        layer.msg(r.msg);
                        if (r.code == 1) {
                            layer.close(index2);
                            window.location.reload();
                        }
                    });
                }
            });
        }
        , btn2: function (index, layero) {
        }
        , cancel: function () {
        }
    })
}

function showQrcode(id, image, link, title) {
    var tpl = $('#qrcode-tpl').html();
    if (!title) {
        title = "优惠大减价，快来扫我啊!";
    }

    layui.laytpl(tpl).render({
        image: image,
        link: link,
        title: title
    }, function (r) {
        layer.open({
            offset: '20px',
            title: '分享给朋友',
            content: r,
            btn: ['取消', '保存文案'],
            closeBtn: 0,
            btn1: function (index) {
                layer.close(index);
            },
            btn2: function (index) {
                var title = $('#qrcode-title').val();
                var i = layer.load();
                $.post(bao.updateQrcodeTitle, {
                    title: title,
                    id: id
                }, function (r) {
                    layer.close(i);
                    layer.msg(r.msg);
                    if (r.code == 1) {
                        layer.close(index);
                    }
                });
            }
        });
    });
}

function time_now() {
    var date = new Date();
    return date.getTime();
}

function get_day(time) {
    var date = new Date();
    if (typeof time != 'undefined') {
        date.setTime(time);
    }
    return date.getDate();
}

function masterAddGasoline(id, parent_id) {
    if (!parent_id) {
        return;
    }
    var loading = layer.load(2);
    $.post(bao.masterAddGasoline, {
        activity_id: id,
        parent_id: parent_id
    }, function (r) {
        layer.close(loading);
        if (r.code == 0) {
            var msg = r.msg;
            var tpl = $('#seek-help-info').html();
            layui.laytpl(tpl).render({
                title: msg,
                intro: '找人帮忙加油更快哦',
                click: function () {
                    layer.closeAll();
                    showShareMusk();
                }
            }, function (r) {
                layer.open({
                    title: '信息',
                    btn: [],
                    content: r
                });
            });
        } else {
            layer.msg(r.msg);
        }
    });
}

function visitorAddGasoline(id, parent_id) {
    if (!parent_id) {
        return;
    }
    $.post(bao.visitorAddGasoline, {
        activity_id: id,
        parent_id: parent_id
    }, function (r) {
        if (r.code == 1) {
            layer.alert(r.msg.msg);
        } else {
            layer.alert(r.msg);
        }
    });
}

function addLuckPrize(element) {
    var inputs = findArrayInput('prize_set_name[]');
    var len = inputs.length;

    if (len > 5) {
        layer.msg('最多添加6个');
    } else {
        var tpl = $("#luck-add-price").html();
        layui.laytpl(tpl).render({ order: len + 1 }, function (r) {
            $(element).parent().before(r);
        });
    }
}

function delLuckPrize(element) {
    $(element).parent().parent().remove();
}

function uploadLuckPrizeImage(id, element) {
    element = $(element);
    _uploadOneImage(id, function (image_id, src) {
        element.parent().find('input').eq(0).val(image_id);
        element.attr('style', 'background-image:url(' + src + ')');
    });
}

function wxUploadLuckPrizeImage(id, element) {
    element = $(element);

    //triggerWebUploader(uuid(10),function(src){
    //    element.find('img').attr('src', src);
    //},function(image_id){
    //    element.parent().find('input').eq(0).val(image_id);
    //});
    //
    //return;

    chooseImage(function (image_id, src) {
        element.parent().find('input').eq(0).val(image_id);
        element.find('img').attr('src', src);
    });
}

function showJoinLuck(tag, activity_id, callback) {
    var loading = layer.load(2);
    $.post(bao.startDraw, { tag: tag, activity_id: activity_id }, function (r) {
        layer.close(loading);
        if (r.code == 0) {
            layer.msg(r.msg);
        } else {
            if (typeof r.msg.need_login != 'undefined') {
                var tpl = $('#join-tpl').html();
                layer.open({
                    title: '参加抽奖•请填写个人信息',
                    content: tpl,
                    skin:'joinbox',
                    closeBtn: 0,
                    btn: ['取消', '确定'],
                    btn1: function (index) {
                        layer.close(index);
                    },
                    btn2: function (index) {
                        var member_info = [];
                        var infos = $('.join-member-info');
                        $.each(infos, function (index, ele) {
                            member_info.push(ele.value.trim());
                        });

                        var phone = $('#join-phone').val();
                        var name = $('#join-name').val();

                        var fish = new Fish();
                        var loading = layer.load(2);
                        if (!fish.isPhone(phone)) {
                            alert('请输入正确格式的手机号');
                            layer.close(loading);
                            return false;
                        }

                        if (name.length < 2 || name.length > 20) {
                            alert('姓名在2~20个字符之间');
                            layer.close(loading);
                            return false;
                        }

                        //type:join open
                        var param = {
                            tag: tag,
                            activity_id: activity_id,
                            phone: phone,
                            name: name,
                            member_info: member_info
                        };
                        $.post(bao.joinLuck, param, function (result) {
                            if (result.code == 0) {
                                alert(result.msg);
                                layer.close(loading);
                                return false;
                            } else {
                                layer.closeAll();
                                $(window).scrollTop(0);
                                $('.pointer').click();
                            }
                        });
                        return false;
                    }
                });
            } else if (r.msg.item != 'undefined') {
                var index = r.msg.item.index;
                if (typeof callback == 'function') {
                    callback(index + 1);
                }
            }
        }
    });
}

function showJoinLoverBargain(activity_id) {
    var tpl = $('#join-tpl').html();

    layer.open({
        title: '情人节砍价•请填写个人信息',
        content: tpl,
        skin:'joinbox',
        closeBtn: 0,
        btn: ['取消', '确定'],
        btn1: function (index) {
            layer.close(index);
        },
        btn2: function (index) {
            var layer = layui.layer;

            var member_info = [];
            var infos = $('.join-member-info');
            $.each(infos, function (index, ele) {
                member_info.push(ele.value.trim());
            });

            var phone = $('#join-phone').val().trim();
            var name = $('#join-name').val().trim();

            var fish = new Fish();
            var loading = layer.load(2);
            if (!fish.isPhone(phone)) {
                alert('请输入正确格式的手机号');
                layer.close(loading);
                return false;
            }

            if (name.length < 2 || name.length > 20) {
                alert('姓名在2~20个字符之间');
                layer.close(loading);
                return false;
            }

            var param = {
                activity_id: activity_id,
                phone: phone,
                name: name,
                member_info: member_info
            };

            $.post(bao.joinLoverBargain, param, function (result) {
                if (result.code == 0) {
                    alert(result.msg);
                    layer.close(loading);
                } else {
                    var r = result.msg;
                    if (r.redirect) {
                        window.location.href = r.redirect;
                    }
                }
            });
            return false;
        }
    });
}


function showJoinBargain(activity_id) {
    var tpl = $('#join-tpl').html();

    

    layer.open({
        title: '砍价•请填写个人信息',
        content: tpl,
        skin:'joinbox',
        closeBtn: 0,
        btn: ['取消', '确定'],
        btn1: function (index) {
            layer.close(index);
        },
        btn2: function (index) {
            var layer = layui.layer;

            var member_info = [];
            var infos = $('.join-member-info');
            $.each(infos, function (index, ele) {
                member_info.push(ele.value.trim());
            });

            var phone = $('#join-phone').val();
            var name = $('#join-name').val();

            var fish = new Fish();
            var loading = layer.load(2)
            if (!fish.isPhone(phone)) {
                alert('请输入正确格式的手机号');
                layer.close(loading);
                return false;
            }

            if (name.length < 2 || name.length > 20) {
                alert('姓名在2~20个字符之间');
                layer.close(loading);
                return false;
            }

            var param = {
                activity_id: activity_id,
                phone: phone,
                name: name,
                member_info: member_info
            };

            $.post(bao.joinBargain, param, function (result) {
                if (result.code == 0) {
                    alert(result.msg);
                    layer.close(loading)
                    return false;
                } else {
                    var r = result.msg;
                    if (r.redirect) {
                        window.location.href = r.redirect;
                    }
                }
            });
            return false;
        }
    });
}

function addRelaySet(element) {
    var len = $('.relay-game-set-item').length;
    if (len >= 5) {
        layer.msg('最多存在5个');
    } else {
        var tpl = $('#relay-set-tpl').html();
        layui.laytpl(tpl).render({ order: len + 1 }, function (r) {
            $('#relay-game-set').append(r);
        });
    }
}


function delRelaySet(element) {
    $(element).parent().remove();
}

function joinRelay(tag, activity_id) {
    var tpl = $('#join-tpl').html();
    layer.open({
        title: '万人接龙•请填写个人信息',
        content: tpl,
        skin:'joinbox',
        btn: ['取消', '确定'],
        closeBtn: 0,
        btn1: function (index) {
            layer.close(index);
        },
        btn2: function (index) {
            var member_info = [];
            var infos = $('.join-member-info');
            $.each(infos, function (index, ele) {
                member_info.push(ele.value.trim());
            });

            var phone = $('#join-phone').val();
            var name = $('#join-name').val();

            var fish = new Fish();
            var loading = layer.load(2);
            if (!fish.isPhone(phone)) {
                alert('请输入正确格式的手机号');
                layer.close(loading);
                return false;
            }

            if (name.length < 2 || name.length > 20) {
                alert('姓名在2~20个字符之间');
                layer.close(loading);
                return false;
            }

            //type:join open
            var param = {
                //tag:tag,
                activity_id: activity_id,
                phone: phone,
                name: name,
                member_info: member_info
            };
            $.post(bao.joinRelay, param, function (result) {
                if (result.code == 0) {
                    alert(result.msg);
                    layer.close(loading);
                    return false;
                } else {
                    var r = result.msg;
                    if (r.pay_param) {
                        weixinPay(r.pay_param, function () {
                            if (r.redirect) {
                                redirectTo(r.redirect);
                            } else {
                                flushPage();
                            }
                        });
                    } else if (r.redirect) {
                        if (r.msg) {
                            layer.msg(r.msg);
                            redirectTo(r.redirect, 1000);
                        } else {
                            redirectTo(r.redirect);
                        }
                    }
                }
            });
            return false
        }
    });
}

function verifyPay(result, callback) {
    if (typeof result.pay_param != 'undefined') {
        if (typeof callback != 'function') {
            callback = function () { };
        }
        if (typeof result.msg != 'undefined') {
            layer.msg(result.msg);
            setTimeout(function () {
                weixinPay(result.pay_param, callback);
            }, 1000);
        } else {
            weixinPay(result.pay_param, callback);
        }
    }
}

function loverBargainWantReduce(activity_id, callback) {
    var loading = layer.load(2);
    $.post(bao.loverBargainWantReduce, { activity_id: activity_id }, function (r) {

        layer.close(loading);

        if (r.code == 0) {
            layer.msg(r.msg);
        } else {
            var obj = r.msg;
            layer.alert(obj.msg);
            callback(obj.after_price);
        }
    });
}

function bargainWantReduce(activity_id) {
    var loading = layer.load(2);
    $.post(bao.bargainWantReduce, { activity_id: activity_id }, function (r) {

        layer.close(loading);

        if (r.code == 0) {
            layer.msg(r.msg);
        } else {
            var obj = r.msg;
            layer.alert(obj.msg);
            if ($('#current-price').length) {
                $('#current-price').text(obj.after_price);
            }
        }
    });
}

function showCompaint() {
    window.layer_index = layer.open({
        title: '投诉',
        type: 2,
        maxWidth: 400,
        maxmin: true,
        area: ['100%', '100%'],
        content: [bao.complaint]
    });
}

function increaseShare() {
    var href = window.location.href;
    var m = href.match(/id=(\d+)/);
    if (!m) {
        m = href.match(/id\/(\d+)/);
    }
    if (m) {
        var activity_id = m[1];
        $.post(bao.increaseShare, { activity_id: activity_id });
    }
}

function ossImg(url) {
    return 'http://jushangbao1.oss-cn-hangzhou.aliyuncs.com/' + url + "?x-oss-process=style/400px";
}

function ossMusic(url) {
    return 'http://jushangbao1.oss-cn-hangzhou.aliyuncs.com/' + url;
}

function generateQrcode(activity_id, parent_id) {
    var index = layer.load(1);
    $.post(bao.genRichQrCode, {
        activity_id: activity_id,
        parent_id: parent_id,
    }, function (r) {
        layer.close(index);
        if (r.code == 0) {
            layer.msg(r.msg);
        } else {
            var url = r.msg;
            var temp = '<div class="qrcode-container"><div class="z-musk"></div><div class = "z-dialog qrcode-dialog"><p class="qr-notice">长按保存图片</p><span class="close-btn-container"><i class="layui-icon closebtn">&#x1006;</i></span><div class="dialog-img-box"><img src="' + r.msg + '"></div></div></div>'
            $('body').append(temp);
            $('.closebtn').on('click', function () {
                $('.qrcode-container').remove();
            })
            $('.qrcode-container .z-musk').on('click', function () {
                $('.qrcode-container').remove();
            })
        }
    });
    // $.post(bao.genqrcode, { url: encodeURIComponent(window.location.href) }, function (r) {
    //     layer.close(index);
    //     increaseShare();
    //     r = '/upload/' + r;
    //     layer.open({
    //         title: '分享二维码',
    //         content: '<div class="tc share-qrcode-wrap"><img src="' + r + '" /></div><p class="tc">长按二维码保存并发送到朋友圈</p>',
    //     });
    // });
}

function showShareMusk() {
    $('.share-count-musk').removeClass('layui-hide');
}

function hideShareMusk() {
    $('.share-count-musk').addClass('layui-hide');
}

function timeEndGreaterThanStart(start_time, end_time) {
    start_time = start_time || '';
    end_time = end_time || '';

    start_time = start_time.replace(/-/g, '/');
    end_time = end_time.replace(/-/g, '/');

    start_time = new Date(start_time);
    end_time = new Date(end_time);

    var invalid = 'Invalid Date';
    if (start_time == invalid) {
        layer.msg('开始时间是非法时间');
        return false;
    }
    if (end_time == invalid) {
        layer.msg('结束时间是非法时间');
        return false;
    }

    if (start_time.getTime() >= end_time.getTime()) {
        layer.msg('开始时间不能大于结束时间');
        return false;
    }

    return true;
}
function checkTimeSpacing() {
    var start = $('#starttime').html();
    var end = $('#endtime').html();
    start = new Date(start).getTime();
    end = new Date(end).getTime();
    if (end <= start) {
        layer.msg('结束时间必须大于开始时间');
    }
}

function checkInfoCollection(element) {
    element = $(element);
    var checked = element.find('input[type=checkbox]').prop('checked');
    if (checked) {
        var text = element.find('input[type=text]').val().trim();
        if (text.length == 0) {
            layer.msg('信息收集有必填项没有填写');
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}

function joinDate2(arr) {
    return arr[0] + '-' + arr[1] + '-' + arr[2] + ' ' + arr[3] + ':' + arr[4]
}
function resolvetime() {//时间日期选择菜单
    return {
        num: null,
        time: '',
        showTimePicker: function () {
            var now = new Date()
            $(".datetime-picker").datetimePicker({
                title: '请选择时间',
                toolbarCloseText: '确定',
                yearSplit: '年',
                monthSplit: '月',
                min: now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes(),
                max: "2022-12-12 12:12",
                onChange: function (picker, values, displayValues) {
                    time = joinDate2(values)
                    if (new Date(time).getTime() < new Date(this.min).getTime()) {
                        values = [now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes()];
                        for (var i = 0; i < values.length; i++) {
                            values[i] = values[i] < 10 ? '0' + values[i] : values[i] + '';
                        }
                        time = joinDate2(values)
                    }
                },
                onClose: function () {
                    var start = $('#starttime');
                    var end = $('#endtime');
                    // if(new Date(time).getTime()<new Date(this.min).getTime()){
                    //     time=this.min
                    // }
                    if (num == 0) {
                        start.html(time)
                        $('#start-time').val(time)
                    } else if (num == 1) {
                        end.html(time)
                        $('#end-time').val(time)
                    }
                    num = null;
                    checkTimeSpacing()
                }
            });
        },
        checknum: function (n) {
            num = n
        }
    }
}
function selectWeDate(othis, index) {
    resolvetime().checknum(index)
}
// function selectWeDate(othis, index) {
//     var date = new Date();

//     var start = $('#start-time');
//     var end = $('#end-time');
//     othis = $(othis);

//     weui.datePicker({
//         start: date.getFullYear(),
//         end: date.getFullYear() + 1,
//         defaultValue: [date.getFullYear(), date.getMonth() + 1, date.getDate()],
//         //onChange: function(result){
//         //    var time = joinDate(result)+" 00:00:00";
//         //    othis.html(time);
//         //    if(index == 0){
//         //        start.val(time);
//         //    }else{
//         //        end.val(time);
//         //    }
//         //    checkTimeSpacing();
//         //},
//         onConfirm: function (result) {
//             var time = joinDate(result) + " 00:00:00";
//             othis.html(time);
//             if (index == 0) {
//                 start.val(time);
//             } else {
//                 end.val(time);
//             }
//             checkTimeSpacing();
//         },
//     });
// };

//function selectWeDate(othis, index) {
//    var date=new Date()
//    var start = $('#start-time');
//    var end = $('#end-time');
//    othis = $(othis);
//    weui.datePicker({
//        start: date.getFullYear(),
//        end: date.getFullYear() + 1,
//        defaultValue: [date.getFullYear(), date.getMonth() + 1, date.getDate()],
//        //onChange: function(result){
//        //    var time = joinDate(result)+" 00:00:00";
//        //    othis.html(time);
//        //    if(index == 0){
//        //        start.val(time);
//        //    }else{
//        //        end.val(time);
//        //    }
//        //    checkTimeSpacing();
//        //},
//        onConfirm: function (result) {
//            var time = joinDate(result) + " 12:00";
//            othis.html(time);
//            if (index == 0) {
//                start.val(time);
//            } else {
//                end.val(time);
//            }
//            checkTimeSpacing();
//        }
//    })
//
//};


function showUpdateName(default_name, joiner_id, tag, callback) {

    layer.open({
        title: '请输入新名字',
        content: '<div class="new-name-wrap tc"><input maxlength="4" id="new-name" class="new-name"/></div>',
        btn: ['取消', '确定'],
        btnAlign: 'c',
        btn1: function (index) {
            layer.close(index);
        },
        btn2: function (index) {
            var ele = $('.new-name');
            var value = ele.val();
            var length = value.length;

            if (length < 1 || length > 10) {
                alert('姓名在1~10个字符之间');
                return false;
            }
            var loading = weui.loading('加载中...');
            $.post(bao.updateName, {
                joiner_id: joiner_id,
                tag: tag,
                name: value
            }, function (r) {
                loading.hide();
                if (r.code == 1) {
                    if (typeof callback == 'function') {
                        callback(value);
                        layer.close(index);
                    }
                } else {
                    alert(r.msg);
                }
            });
        }
    });

    $('#new-name').val(default_name).focus();
}

function simpleLabel(othis, joiner_id, tag) {
    othis = $(othis);
    var label = othis.attr('data-label');
    var loading = layer.load(2);

    $.post(bao.label, {
        joiner_id: joiner_id,
        tag: tag,
        label: label == 1 ? 0 : 1
    }, function (r) {
        layer.close(loading);

        if (r.code == 1) {
            if (label == 1) {//已经标记
                othis.attr('data-label', 0);
                //othis.html('标记');
                othis.parent().removeClass('gray');
            } else {
                othis.attr('data-label', 1);
                //othis.html('撤销');
                othis.parent().addClass('gray');
            }
            layer.msg('修改标记成功');
        } else {
            layer.msg(r.msg);
        }
    });
}

function vueLabel(joiner_id, label, tag, callback) {
    var loading = weui.loading('加载中');

    $.post(bao.label, {
        joiner_id: joiner_id,
        tag: tag,
        label: label == 1 ? 0 : 1
    }, function (r) {
        loading.hide();
        if (r.code == 1) {
            if (callback) {
                callback(label == 1 ? 0 : 1);
            }
        } else {
            layer.msg(r.msg);
        }
    });
}

function label(othis, joiner_id, tag) {
    othis = $(othis);
    var label = othis.attr('data-label');
    var loading = layer.load(2);

    $.post(bao.label, {
        joiner_id: joiner_id,
        tag: tag,
        label: label == 1 ? 0 : 1
    }, function (r) {
        layer.close(loading);

        if (r.code == 1) {
            if (label == 1) {//已经标记
                othis.attr('data-label', 0);
                if (tag == 'luck') {
                    othis.html('兑奖');
                } else {
                    othis.html('标记');
                }
                othis.parent().removeClass('gray');
            } else {
                othis.attr('data-label', 1);
                othis.html('撤销');
                othis.parent().addClass('gray');
            }
        } else {
            layer.msg(r.msg);
        }
    });
}

function filterHtmlEntity(string) {
    if (!string) return ''
    return string.replace(/<[^<]*>/ig, '');
}

function initReachEditor(ids, showTool) {
    var reach = {};
    var layedit = layui.layedit;
    if (showTool) {
        ids.forEach(function (ele) {
            var index = layedit.build(ele, {
                height: 290
            });
            reach[ele] = index;
        });
    } else {
        //ids.forEach(function(ele){
        //    var index = layedit.build(ele,{
        //        height:290,
        //        tool:[]
        //    });
        //    reach[ele] = index;
        //});
        //$('.layui-layedit-tool').hide();

        //不是layui，是另一个wangEditor
        ids.forEach(function (ele) {
            var E = window.wangEditor;
            var editor = new E('#' + ele);
            editor.customConfig.menus = [];
            editor.create();
            reach[ele] = editor;
            if ($('.w-e-text-container').length) {
                $('.w-e-text-container').css({
                    'z-index': 9,
                    height: 'auto',
                    'border': 'none'
                });
            }
            if ($('.w-e-toolbar').length) {
                $('.w-e-toolbar').remove();
            }
            if (editor.txt.text().trim().length > 0) {
                if ($('.w-e-text').length) {
                    var ps = $('.w-e-text').find('p');
                    if (ps.length) {
                        var b = ps.eq(ps.length - 1).html().trim();
                        if (b == '<br/>' || b == '<br>') {
                            ps.eq(ps.length - 1).remove();
                        }
                    }
                    $('.w-e-text').blur();
                }
            }
        });
    }

    bao.reach = reach;
}

function initWang(ele) {
    var E = window.wangEditor;
    var editor = new E('#' + ele);
    editor.customConfig.menus = [];
    editor.create();
    if ($('.w-e-text-container').length) {
        $('.w-e-text-container').css({
            'z-index': 9,
            height: 'auto',
            'border': 'none'
        });
    }
    if ($('.w-e-toolbar').length) {
        $('.w-e-toolbar').remove();
    }

    return editor;
}

function recoveryReachTextArea() {
    var reach = bao.reach;
    if (reach) {
        for (var i in reach) {
            var editor = reach[i];
            var textarea = $('textarea[name=' + i + ']');
            if (textarea.length) {
                textarea.val(editor.txt.html());
            } else {
                layer.msg('对应的textarea name不存在！');
            }
        }
    }
}

function triggerMusic() {
    var ele = $('.fixed-music');
    var audio = $('audio').get(0);
    if (audio.paused) {
        audio.play();
        ele.find('.music-play').removeClass('layui-hide');
        ele.find('.music-pause').addClass('layui-hide');
        ele.addClass('fixed-music-rotate');
    } else {
        audio.pause();
        ele.find('.music-play').addClass('layui-hide');
        ele.find('.music-pause').removeClass('layui-hide');
        ele.removeClass('fixed-music-rotate');
    }
}

function shiftIndexOfArray(list, index) {
    var ret = [];
    list.forEach(function (ele, i) {
        if (i != index) {
            ret.push(ele);
        }
    });
    return ret;
}
//降序排列
function sortByKey(list, key) {
    var ret = [];
    while (list.length > 0) {
        var len = list.length;
        if (len == 1) {
            ret.push(list[0]);
            list = [];
        } else {
            var max = list[0][key];
            var index = 0;

            for (var i = 1; i < len; i++) {
                if (list[i][key] > max) {
                    max = list[i][key];
                    index = i;
                }
            }

            ret.push(list[index]);
            list = shiftIndexOfArray(list, index);
        }
    }
    return ret;
}


function ossMake200(url) {
    return 'http://jushangbao1.oss-cn-hangzhou.aliyuncs.com/' + url + '?x-oss-process=image/resize,m_fill,h_100,w_100';
}

//自然排序，重复名次后，以后顺延
function natureSort(list, key) {
    var ret = [];
    var index = 0;
    var value = null;

    list.forEach(function (ele) {
        if (ele[key] != value) {
            index = ret.length + 1;
        }
        value = ele[key];
        ret.push([index, ele]);
    });

    return ret;
}

function weixinPay(param, callback) {
    if (typeof param == 'string') {
        param = JSON.parse(param);
    }

    var interface = function () { };

    if (typeof callback == 'function') {
        var success = callback;
        var fail = interface;
        var cancel = interface;
    } else {
        if (typeof callback == 'undefined') {
            callback = {};
        }
        var success = callback.success || interface;
        var fail = callback.fail || interface;
        var cancel = callback.cancel || interface;
    }

    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
            "appId": param.appId,
            "timeStamp": param.timeStamp,
            "nonceStr": param.nonceStr,
            "package": param.package,
            "signType": param.signType,
            "paySign": param.paySign
        },
        function (res) {

            var err = res.err_msg;
            if (err == "get_brand_wcpay_request:ok") {
                success();
            } else if (err == 'get_brand_wcpay_request:cancel') {
                alert('取消支付');
                cancel();
            } else if (err == 'get_brand_wcpay_request:fail') {
                alert('支付失败');
                fail();
            } else {
                alert('非法支付');
            }
        }
    );
}
//设置弧形文字
function getcircle(str, tag, color) {
    
    var canvas = tag;
    if(!canvas) return
    var ctx = canvas.getContext('2d');
    var circle = {
        x: 165,
        y: 538,
        radius: 500
    }
    var n = str.length;
    var sAngle = 270 - 2.5 * n;
    var eAngle = 270 + 2.5 * n;
    drawCircularText(circle, str, rads(sAngle), rads(eAngle), 'center');
    //转换弧度
    function rads(x) {
        return Math.PI * x / 180;
    }
    function drawCircularText(s, string, startAngle, endAngle, lv) {
        var radius = s.radius,
            angleDecrement = (startAngle - endAngle) / (string.length - 1),
            angle = parseFloat(startAngle),
            index = 0,
            character;

        // ctx.save();

        ctx.fillStyle = color;
        ctx.font = '50px 微软雅黑';
        ctx.textAlign = lv;
        ctx.textBaseline = 'middle';

        while (index < string.length) {
            character = string.charAt(index);

            ctx.save();
            ctx.beginPath();
            ctx.translate(s.x + Math.cos(angle) * radius,
                s.y + Math.sin(angle) * radius);
            ctx.rotate(Math.PI / 2 + angle);

            ctx.fillText(character, 0, 0);

            angle -= angleDecrement;
            index++;
            ctx.restore();
        }
        ctx.restore();
    }
}
// 初始化可编辑div所对应的textarea
function inittextarea() {
    $('.rulearea').val($('.rule').html());
    $('.prizearea').val($('.prizeset').html());
    $('.orgarea').val($('.orgintro').html());
    $('.introarea').val($('.intro').html());
}
function isStringLong() {
    var msg = "";
    if ($('.prizearea').length) {
        if ($('.prizeset').text().length > 500) {
            return '奖品描述不得多于500个字';
        }
    }
    if ($('.introarea').length) {
        if ($('.intro').text().length > 500) {
            return '商品描述不得多于500个字';
        }
    }
    if ($('.rulearea').length) {
        if ($('.rule').text().length > 500) {
            return '规则设置字数不能多于500字';
        }
    }
    if ($('.orgarea').length) {
        if ($('.orgintro').text().length > 500) {
            return '机构介绍字数不得多于500个字';
        }
    }
    return msg;
}

function triggerWebUploader(id, previewCallback, setCallback, mergeCallback) {
    id = id.replace('#', '');
    if ($('#' + id).length) {
        $('#' + id).remove();
    }

    var btn = $('<div>').html('uploader').attr('id', id).css('display', 'block');
    $('body').append(btn);

    realTimeUpload(id, previewCallback, setCallback, mergeCallback);

    setTimeout(function () {
        var btn = $('#'+id);
        if(btn.find('input').length){
            //调出摄像头；支持多种格式图片；
            btn.find('input').removeAttr('multiple');
            //区分移动和pc端，分别设置accept，以为pc端设置image/*会非常慢
            if(window.navigator.userAgent.toLowerCase().indexOf('mobile') > -1){
                btn.find('input').attr('accept','image/*,video');
            }else{
                btn.find('input').attr('accept','image/png,image/jpg,image/jpeg');
            }
            btn.find('input').click();
        }
    }, 20);
}

function realTimeUpload(domId, previewCallback, setCallback, mergeCallback,readyCallback) {

    var interface = function () { };

    previewCallback = previewCallback || interface;
    setCallback = setCallback || interface;
    mergeCallback = mergeCallback || interface;
    readyCallback = readyCallback || interface;

    domId = domId.trim();

    if (domId.substr(0, 1) != '#') {
        domId = '#' + domId;
    }

    if ($(domId).length == 0) {
        throw 'dom 节点:' + domId + '不存在';
    }

    var requestSignature = function (callback) {
        bao.signatureData = false;
        if ( ! bao.signatureData) {
            var loading = -1;
            $.ajax({
                url: bao.signature,
                beforeSend: function () {
                    loading = layer.load(2);
                },
                timeout: 5 * 1000,
                async:false,
                success: function (r) {
                    if (r.code === 0) {
                        alert(r.msg);
                    } else {
                        bao.signatureData = {
                            'key': r.dir,
                            'policy': r.policy,
                            'OSSAccessKeyId': r.accessid,
                            'success_action_status': '200',
                            'signature': r.signature,
                            'host': r.host
                        };
                        //callback(bao.signatureData);
                    }
                },
                complete: function () {
                    layer.close(loading);
                },
                error: function () {
                    layer.msg('网络延迟，请稍后再试');
                }
            });
        } else {
            //callback(bao.signatureData);
        }
    };

    var initWebUploader = function (r) {
        var server = r.host;
        var swf = bao.swf;
        var object = '';
        var base64Src = '';

        var uploader = WebUploader.create({
            auto: true,
            swf: swf,
            server: server,
            pick: domId,
            duplicate: true,
            fileNumLimit: 1,
            fileSingleSizeLimit: 1024 * 1024 * 10,
            compress: {
                width: 800,
                height: 800,
                quality: 90,
                allowMagnify: false,
                crop: false,
                preserveHeaders: true,
                noCompressIfLarger: false,
                compressSize: 50
            },
            thumb: {
                width: 800,
                height: 800,
                quality: 70,
                allowMagnify: true,
                crop: false,
                type: 'image/jpeg'
            },
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/jpg,image/jpeg,image/png'
            }
        });

        uploader.on('fileQueued', function (file) {
            var loading = layer.load(2);

            uploader.makeThumb(file, function (error, src) {
                if (error) {
                    alert('不能预览');
                    layer.close(loading);
                } else {
                    base64Src = src;
                    previewCallback(src);
                    layer.close(loading);
                }
            });
        });

        uploader.on('uploadBeforeSend', function (obj, data, headers) {
            delete r.host;

            data = $.extend(data, r);
            data.key = object = data.key + '/' + uuid(16) + '.jpg';

            headers['Access-Control-Allow-Origin'] = "*";
        });

        uploader.on('uploadSuccess', function (file, response) {
            $.post(bao.dealWithObject, { object: object }, function (r) {
                if (r.code == 1) {
                    setCallback(r.data);//image_id
                    mergeCallback(base64Src, r.data,object);
                }
            });
        });

        uploader.on('uploadError', function (file) {
            alert('网络差，请重新上传');//代表上传失败了
        });

        readyCallback();
    };

    //调用
    requestSignature(interface);
    if(bao.signatureData){
        initWebUploader(bao.signatureData);
    }
}
function lazyload(parent){
    function getTag(){
        var tag = parent?$(parent + ' img'):$('img');
        return tag
    }
    var imglist = getTag();
    function isLazy(ele){
        return ele.offset().top <= $(window).scrollTop() + $(window).height() + 300;
    }
    
    function initImage(){
        imglist.map(function(i,ele){
            if($(ele).attr('src') == '/static/img/default1.png'){
                if(isLazy($(ele))){
                    var src = $(ele).data('src')
                    $(ele).attr('src',src);
                    $(ele).css('width','100%');
                }
            }
        })
    }
    function scrolled(){
        $(window).on('scroll',function(){
            initImage();
        })
    }
    scrolled();
}