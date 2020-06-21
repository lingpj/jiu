var mediaComponentStr = '<div class="media">\
    <div class="show-image">\
    <div class="image-wrap" v-for="(v,index) in thumbs">\
    <img :src="v.src"/>\
    <span @click.stop="replaceImage(index,v.id)" class="image-wrap-modify view-show">修改</span>\
    <span @click.stop="delImage(v.id)" class="image-wrap-del view-show">删除</span>\
    </div>\
    </div>\
    <div class="view-show">\
    <span data-limit="10" @click="addImage" class="widget-add-image"><i class="icon iconfont icon-xiangji"></i> 添加图片（最多添加10张图片）</span>\
</div>\
<div class="view-show">\
<div class="video-wrap" v-for="(v,index) in video"><span class="video-del" @click="delVideo(index)">删除</span>\
<textarea placeholder="请复制粘贴优酷、腾讯视频链接" @keyup="writeVideo(index)" class="layui-textarea video-textarea can-write">{{v}}</textarea>\
</div>\
</div>\
<div class="view-show"><span @click="addVideo" data-limit="5" class="widget-add-video"><i class="icon iconfont icon-x-mpg"></i>添加视频（最多添加5个视频）</span></div>\
</div>';
// 添加一句判断，如果图片没有src，图片不标签不显示
var mainImageStr = '<div>\
    <div class="image-wrap" v-if="main_image.id != 0">\
    <img :src="main_image.src" />\
    <p class="main-image-button" v-show="main_image.id?true:false">\
        <span class="change-main-image view-show" @click="replace">修改</span>\
        <span class="change-main-image view-show" @click="del">删除</span>\
    </p>\
    </div>\
        <div class="tc mt-10 can-write" v-show="main_image.id?false:true">\
        <img @click="add" src="/static/img/xiang_sm.png" /> \
        </div>\
    </div>';
var headImgStr = '<div id="head-img-component"><button class="select-headImg-btn" @click="headImgBtnClick">\
                        <i class="icon iconfont icon-tupian animated infinite swing" style="display:inline-block;position:relative;top:.005rem"></i> \
                        <span>头图</span>\
                 </button>\
    <div id="headImgScrollBar" class="footer" :class="{\'footer-show\' : footerShow}">\
        <button class="certain-btn" @click="certainBtnClick">确定</button>\
        <button class="cancel-btn" @click="cancelBtnClick">取消</button>\
        <div class="select-img-box">\
            <img :src="obj | formatImgUrl" alt="" :class="{ \'active\' : tempIndex == index}" v-for="(obj,index) in imgArr" @click="setActiveImg(index,obj)">\
        </div>\
    </div> </div>';

var selectMusicStr = '<div><div class="banner-btn">\
                        <button type="button" class="music-btn" @click="showMusicList"><i class="icon iconfont icon-music"></i><span style="font-size:14px;margin-left:.05rem;position:relative;top:-2px;">音乐</span></button>\
                        </div>\
                        <div id="music-list">\
                        <div class="music-list">\
                        <p><input type="radio" id="pause" value="0" name="musicList"  @click="selectMusic(0,0)">\
                            <label for="pause">不播放音乐</label>\
                        </p>\
                        <p v-for="(m,index) in musicArr" @click="selectMusic(m,index+1)">\
                            <input type="radio" :id="m.id" :value="m.url" name="musicList" data-src="m.url | formatMusicUrl" >\
                            <label :for="m.id">{{m.name}}</label>\
                        </p>\
                        </div>\
                        </div>\
            </div>'

var changeSkinStr = '<div id="change-skin-component"><button class="change-skin-btn" @click="changeSkinBtnClick"> \
<i class="icon iconfont icon-yifu animated infinite swing" style="display:inline-block;position:relative;top:.005rem"></i>\
            <span>换肤</span>\
        </button>\
        <div id="changeSkinScrollBar" class="footer" :class="{\'footer-show\' : footerShow}">\
        <button class="certain-btn" @click="certainBtnClick">确定</button>\
        <button class="cancel-btn" @click="cancelBtnClick">取消</button>\
        <div class="change-skin-box">\
        <img :src="obj" alt="" :class="{ \'active\' : tempIndex == index}" v-for="(obj,index) in thumbsImgArr" @click="setActiveImg(index,obj)">\
        </div>\
        </div> </div>';
Vue.component('change-skin-component', {
    template: changeSkinStr,
    // thumbsImgArr 要展示图片的数组
    // currentSelectIndex 默认a展示的图片索引
    props: ["thumbsImgArr","currentSelectIndex"],
    data: function () {
        return {
            footerShow: false,     //底部选图控件是否显示
            imgArr: [],            //缩略图
            tempIndex: 0,         //临时选中的图片index
            isOpen:false,
        }
    },
    methods: {
        changeSkinBtnClick: function () {
            if(this.isOpen == false){
                this.tempIndex = vm.currentSelectIndex
                this.controlFooter()
                this.isOpen = true
            }
        },
        setActiveImg: function (index) {
            this.tempIndex = index
            this.$emit('change-skin-to-child', this.tempIndex)
        },
        certainBtnClick: function () {
            vm.currentSelectIndex = this.tempIndex
            this.controlFooter()
        },
        cancelBtnClick: function () {
            this.tempIndex =  vm.currentSelectIndex
            this.controlFooter()
            this.$emit('change-skin-to-child', vm.currentSelectIndex)
        },
        controlFooter: function () {
            if (!this.footerShow) {
                $('.make-nav.fix').hide()
            } else {
                $('.make-nav.fix').show()
            }
            this.footerShow = !this.footerShow
            this.isOpen = false
        },
    },
});

Vue.component('select-music-component', {
    template: selectMusicStr,
    props: [],
    data: function () {
        return {
            musicArr: [],
            normal: '&#xe63f;',
            check: '&#xe643;'
        }
    },
    methods: {
        showMusicList: function () {
            var self = this
            $.post(bao.musicList, function (r) {
                if (r.code == 1) {
                    self.musicArr = r.data
                    setTimeout(function () {
                        var tpl = $('#music-list').html();
                        layer.open({
                            title: '请选择音乐',
                            content: tpl,
                            yes: function (index) {
                                layer.close(index);
                                $('#audio-controller')[0].pause();
                            }
                        });
                    }, 20);
                } else {
                    layer.msg(r.msg)
                }
            })
        },
        selectMusic: function (music, index) {
            $('.layui-layer-content input')[index].checked = true
            if (music != 0) {
                var src = music.url
                src = ossMusic(src)
                $('#audio-controller').attr('src', src);
                this.$emit('listen-to-child2', music.id)
            } else {
                $('#audio-controller').attr('src', '');
                this.$emit('listen-to-child2', 0)
            }
        }
    },
    filters: {
        formatMusicUrl: function (url) {
            return 'http://jushangbao1.oss-cn-hangzhou.aliyuncs.com/' + url
        }
    }
})
/* <div id="music-list">\
                        <div class="music-list">\
                            <p>\
                                <input type="radio" name="musiclist"  id="pause" value="0" />\
                                <label for="pause">&nbsp;不播放音乐</label>\
                            </p>\
                            <p v-for="(m,index) in musicArr">\
                                <input type="radio" name="musiclist"   id="m.id" value="m.id" data-src="{:oss_music($v.url)}" >\
                                <label for="m.id">1111</label></p>\
                        </div>\
                     </div> */

Vue.component('head-img-component', {
    template: headImgStr,
    // originalImgSrc 原来的banner图
    // thumbsUrl      缩略图url
    // requestParam   请求的参数
    props: ['originalImgSrc', 'thumbsUrl', 'requestParam'],
    data: function () {
        return {
            activeIndex: -1,       //最终选中的图片index
            footerShow: false,     //底部选图控件是否显示
            imgArr: [],            //缩略图
            tempIndex: -1,         //临时选中的图片index
        }
    },
    methods: {
        headImgBtnClick: function () {
            var self = this
            var param = {}
            for (var key in vm.requestParam) {
                param[key] = vm.requestParam[key]
            }
            $.post(vm.thumbsUrl, param, function (r) {
                self.imgArr = r.data
     
                self.imgArr.forEach(function(ele,index){
                    if(ele == vm.originalImgSrc){
                        self.activeIndex = index
                        self.tempIndex = self.activeIndex
                    }
                })
            })
            
            this.controlFooter()
            this.$emit('listen-to-child', vm.originalImgSrc)
        },
        setActiveImg: function (index, src) {
            this.tempIndex = index
            this.$emit('listen-to-child', src)
        },
        certainBtnClick: function () {
            this.activeIndex = this.tempIndex
            vm.originalImgSrc = this.imgArr[this.activeIndex]
            this.controlFooter()
        },
        cancelBtnClick: function () {
            this.tempIndex = self.activeIndex
            this.$emit('listen-to-child', vm.originalImgSrc)
            this.controlFooter()
        },
        controlFooter: function () {
            if (!this.footerShow) {
                $('.make-nav.fix').hide()
            } else {
                $('.make-nav.fix').show()
            }
            this.footerShow = !this.footerShow
        },
    },
    filters: {
        formatImgUrl: function (url) {
            return 'http://jushangbao1.oss-cn-hangzhou.aliyuncs.com/' + url + "?x-oss-process=style/400px";
        }
    }
});
Vue.component('main-image-component', {
    template: mainImageStr,
    props: ['main_image'],
    data: function () {
        return {
            show: false
        };
    },
    methods: {
        add: function () {
            if (vm.main_image.id) {
                layer.msg('只能上传一张主图');
            } else {
                //_uploadOneImage('public-upload-hook',function(image_id,src){
                //    vm.main_image = {
                //        id:image_id,
                //        src:src
                //    };
                //});
                vm.main_image = {};
                triggerWebUploader('vue-main-hook-add', null, null, function (src, image_id) {
                    vm.main_image = {
                        src: src,
                        id: image_id
                    };
                });
                //chooseImage(function(image_id,src){
                //    vm.main_image = {
                //        id:image_id,
                //        src:src
                //    };
                //});
            }
        },
        replace: function () {
            //var id = vm.main_image.id;
            //chooseImage(function(image_id,src){
            //    vm.main_image = {
            //        id:image_id,
            //        src:src
            //    };
            //});
            triggerWebUploader('vue-main-hook', function (src) {
                vm.main_image.src = src;
            }, function (image_id) {
                vm.main_image.id = image_id;
            });
            //
            //zuploadImage('public-upload-hook',id,function(image_id,src){
            //    if(image_id == id){
            //        vm.main_image.src = src+"&v="+Math.random();
            //    }else {
            //        vm.main_image = {'id': image_id, src: src};
            //    }
            //});
        },
        del: function () {
            //oss_del_image(vm.main_image.id);
            vm.main_image = {};
        }
    }
});

Vue.component('media-component', {
    template: mediaComponentStr,
    props: ['thumbs', 'video'],
    methods: {
        checkImage: function () {
            if (vm.thumbs.length >= 10) {
                layer.msg('最多上传10张图片');
                return false;
            } else {
                return true;
            }
        },
        addImage: function () {
            if (this.checkImage()) {
                //_uploadOneImage('public-upload-hook',function(image_id,src){
                //    vm.thumbs.push({id:image_id,src:src});
                //});
                //chooseImage(function(image_id,src){
                //    vm.thumbs.push({id:image_id,src:src});
                //});

                var current = {};
                var index = -1;
                triggerWebUploader('vue-media-hook', function (src) {
                    current.src = src;
                    current.id = 0;
                    index = vm.thumbs.push(current) - 1;
                }, function (image_id) {
                    vm.thumbs[index].id = image_id;
                }, function (src, image_id) {
                    //vm.thumbs.push({
                    //    id:image_id,
                    //    src:src
                    //});
                });
            }
        },
        replaceImage: function (index, id) {
            if (this.checkImage()) {
                triggerWebUploader('vue-media-hook2', function (src) {
                    vm.thumbs.map(function (ele) {
                        if (ele.id == id) {
                            ele.src = src;
                        }
                        return ele;
                    });
                }, function (image_id) {
                    vm.thumbs.map(function (ele) {
                        if (ele.id == id) {
                            ele.id = image_id;
                        }
                        return ele;
                    });
                }, function (src, image_id) {
                    //vm.thumbs.map(function(ele){
                    //    if(ele.id == id){
                    //        ele.id = image_id;
                    //        ele.src = src;
                    //    }
                    //    return ele;
                    //});
                });
                //chooseImage(function(image_id,src){
                //    vm.thumbs.map(function(ele){
                //        if(ele.id == id){
                //            ele.id = image_id;
                //            ele.src = src;
                //        }
                //        return ele;
                //    });
                //});
                //zuploadImage('public-upload-hook',id,function(image_id,src){
                //    if(image_id == id){
                //        vm.thumbs[index].src = src+"&v="+Math.random();
                //    }else {
                //        vm.thumbs[index] = {'id': image_id, src: src};
                //    }
                //});
            }
        },
        delImage: function (id) {
            //$.post(bao.delImage,{id:id});
            var list = [];
            vm.thumbs.forEach(function (ele) {
                if (ele.id != id) {
                    list.push(ele);
                }
            });
            vm.thumbs = list;
        },
        writeVideo: function (index) {
            var value = window.event.target.value;
            vm.video[index] = value;
        },
        delVideo: function (index) {
            var list = [];
            vm.video.map(function (ele, i) {
                if (i != index) {
                    list.push(ele);
                }
            });
            vm.video = list;
        },
        addVideo: function () {
            if (vm.video.length >= 5) {
                layer.msg('最多添加5个视频');
            } else {
                vm.video.push("");
            }
        }
    },
    data: function () {
        return {};
    },
});
// 时间日期选择控件
var dataPickerStr = '<div class="time-block">\
<p style="text-align:center;margin-bottom:.12rem;font-size:.16rem">活动时间</p>\
<div class="timeselector">\
    <div class="timestart" onclick="selectWeDate(this,0)">\
        <span id="starttime" ref="start" class="can-write dotted">{{start_time}}</span>\
        <input type="text" id="start-time" class="datetime-picker view-show" v-model="start_time" name="start_time">\
    </div>\
    <div class="selecttimenotice">到</div>\
    <div class="timeend" onclick="selectWeDate(this,1)">\
        <span id="endtime" ref="end" class="can-write dotted">{{end_time}}</span>\
        <input type="text" id="end-time" class="datetime-picker view-show" v-model="end_time" name="end_time">\
    </div>\
</div>\
<p class="mt-10 notice view-show">活动时间：（建议活动时间5~7天）</p>\
</div>';
Vue.component('date-time-comp', {
    template: dataPickerStr,
    props: ['start_time', 'end_time'],
    data: function () {
        return {
        }
    },
    methods: {
        initTime: function () {
            vm.start_time = this.$refs.start.innerText;
            vm.end_time = this.$refs.end.innerText;
        }
    },
    mounted: function () {
        resolvetime().showTimePicker();
    }
})