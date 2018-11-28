  // 单击图片触发上传事件
  function upLoad(id) {
    document.getElementById(id).click()
  }
  // 绑定上传input[file]事件
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
    return new File([u8arr], `${filename}.${suffix}`, {
      type: mime
    })
  }
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