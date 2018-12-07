  // 单击图片触发上传事件
  function upLoad(id) {
    document.getElementById(id).click()
  }
  /**
   *
   *绑定上传input[file]事件
   * @param {*} idInput 绑定按钮id
   * @param {*} callback 回调函数返回图片base64
   */
  function bindImgChange(idInput, callback) {
    document.getElementById(idInput).addEventListener('change', function (e) {
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file); // 读出 base64
      reader.onloadend = function () {
        // 图片的 base64 格式, 可以直接当成 img 的 src 属性值        
        var dataURL = reader.result;
        if (callback) {
          callback(dataURL)
        }
      };
    })
  }
  /**
   *获取url中参数
   *
   * @param {*} name 需要获取的参数名
   * @returns 参数值
   */
  function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg); //search,查询？后面的参数，并匹配正则
    if (r != null) return unescape(r[2]);
    return null;
  }
  // 将base64转换成file对象
  function dataURLtoFile(dataurl, filename = 'file') {
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let suffix = mime.split('/')[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename+'.'+suffix, {
      type: mime
    })
  }
  /**
   *
   *图片压缩
   * @param {*} file 文件(类型是图片格式)
   * @param {*} obj 设置参数{width:转换后的宽度，height:转换后的高度，quality:转后图片质量}
   * @returns
   */
  function photoCompress(file, obj) {
    return new Promise(function (resolve, reject) {
      var ready = new FileReader();
      /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
      ready.readAsDataURL(file);
      ready.onload = async function () {
        var re = this.result;
        var result = await canvasDataURL(re, obj)
        resolve(result)
      }
    })
  }
  /**
   *转换图片
   *
   * @param {*} path base64编码图片
   * @param {*} obj 设置参数{width:转换后的宽度，height:转换后的高度，quality:转后图片质量}
   * @returns
   */
  function canvasDataURL(path, obj) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.src = path;
      img.onload = function () {
        var that = this;
        // 默认按比例压缩
        var w = that.width,
          h = that.height,
          scale = w / h;
        w = obj.width || w;
        h = obj.height || (w / scale);
        var quality = 0.7; // 默认图片质量为0.7
        //生成canvas
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        // 图像质量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
          quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        var base64 = canvas.toDataURL('image/jpeg', quality);
        // 回调函数返回base64的值
        resolve(base64);
      }
    })
  }
  /**
   * 请求封装对象
   */
  var request = {
    get: function (url, scope) {
      return new Promise(function (resolve, reject) {
        scope.$indicator.open({
          spinnerType: 'triple-bounce'
        });
        axios.get(url).then(function (res) {
          scope.$indicator.close()
          resolve(res)
        }).catch(function (err) {
          scope.$indicator.close()
          console.log(err)
        })
      })
    },
    post: function (url, data, scope) {
      return new Promise(function (resolve, reject) {
        scope.$indicator.open({
          spinnerType: 'triple-bounce'
        });
        axios.post(url, data).then(function (res) {
          scope.$indicator.close()
          resolve(res)
        }).catch(function (err) {
          scope.$indicator.close()
          console.log(err)
        })
      })
    },
  }
  /**
   *canvas 图片旋转90°
   *
   * @param {*} imgUrl
   * @param {*} type
   * @returns
   */
  function rotate90(imgUrl,type) {
    return new Promise(function (resolve, reject) {
      try {
        // 1. 创建图片，canvas,获取画布
        var img = new Image(),
          canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d');
        img.src = imgUrl
        // 2. 图片加载完成进行图片编辑
        img.onload = function () {
          // 2.1 设置canvas宽高，旋转90° ，宽高互换
          canvas.width = this.height
          canvas.height = this.width
          // 2.2 画布中心点(也是起始点)平移至中心(0,0)->(x,y)
          ctx.translate(canvas.width / 2, canvas.height / 2)
          // 2.3 画布旋转90°
          ctx.rotate(270 * Math.PI / 180)
          // 2.4 绘制图像 图像起始点需偏移负宽高
          ctx.drawImage(img, -this.width / 2, -this.height / 2)
          // 2.5返回结果(base64)
          resolve(canvas.toDataURL(type))
        }
      } catch (error) {
        reject(error)
      }
    })
  }
  /**
   *是否登录
   *根据sessionStorage tel判断是否登录
   * @returns
   */
  function isLogin() {
    reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
    return window.sessionStorage.getItem('tel') != null && reg.test(window.sessionStorage.getItem('tel'))
  }
  (function () {
    var path = window.location.pathname
    if (path.indexOf('login.html') >= 0 | isLogin()) {
      return
    }
    window.location.href = './login.html'
  })()
