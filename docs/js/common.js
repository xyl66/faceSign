  // 单击图片触发上传事件
  function upLoad(id){
    document.getElementById(id).click()
  }
  // 绑定上传input[file]事件
  function bindImgChange (idInput,callback) {
    document.getElementById(idInput).addEventListener('change', function(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file); // 读出 base64
    reader.onloadend = function () {
        // 图片的 base64 格式, 可以直接当成 img 的 src 属性值        
        var dataURL = reader.result;
        if(callback){
          callback(dataURL)
        }
    };
    })
  }