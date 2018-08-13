var contactList = $('#contact-list')
var addContactName = $('#add-contact-name')
var addContactPhone = $('#add-contact-phone')
var saveAdd = $('#save-add')
var saveRevise=$('#save-revise')
var searchContactValue = $('#search-contact-value')
var searchBtn = $('#search-btn')
var reviseContactName = $('#revise-contact-name')
var reviseContactPhone = $('#revise-contact-phone')

var id1=''
//填充模块
var addEventListener = function () {
    var removeBtn = $('.remove-btn')
    removeBtn.on('click', function () {
        removeContact($(this).attr('data-_id'))
    })
    var reviseBtn = $('.revise-btn')
    reviseBtn.on('click', function () {

        findId($(this).attr('data-_id'))
        id1=$(this).attr('data-_id')
    })
}

//修改填充原信息模块
var fillVal = function (name, phone) {
    reviseContactName.val(name)
    reviseContactPhone.val(phone)
}

var fillData = function (arr) {

    var html = ''
    arr.forEach(element => {
        html += `
      <li class="list-group-item">
      <h3>${element.name}</h3>
      <p>${element.phone}</p>
      <div class="btn-group-sm" role="group" aria-label="...">
          <button type="button" class="btn btn-default btn-info call-btn" >拨号</button>
          <button type="button" class="btn btn-default btn-warning revise-btn" data-_id='${element._id}' data-toggle="modal" data-target='#revise-contact'>修改</button>
          <button type="button" class="btn btn-default btn-danger remove-btn" data-_id='${element._id}'>删除</button>
      </div>
  </li>
      `
    })
    contactList.html(html)
    addEventListener()
}


//获取所有
var getAllContact = function () {
    $.ajax({
        type: 'GET',
        url: '/getAllContact',
        data: {},
        success: function (result) {
            fillData(result)

        }
    })
}


//添加模块
var addContact = function (name, phone) {
    $.ajax({
        type: 'POST',
        url: '/addContact',
        data: {
            name: name,
            phone: phone
        },
        success: function (result) {
            getAllContact()
        }
    })
}

//修改模块
var reviseContact = function (_id, name, phone) {
    $.ajax({
        type: 'POST',
        url: '/reviseContact',
        data: {
            _id: _id,
            name: name,
            phone: phone
        },
        success: function (result) {
            getAllContact()
        }
    })
}


//删除模块
var removeContact = function (_id) {
    $.ajax({
        type: 'get',
        url: '/removeContact',
        data: { _id: _id },
        success: function () {
            getAllContact()
        }
    })
}

//通过id查询信息
var findId = function (_id) {
    $.ajax({
        type: 'get',
        url: '/findId',
        data: { _id: _id },
        success: function (result) {

            fillVal(result[0].name, result[0].phone)

        }
    })
}

//查询模块
var searchContact = function (wd) {
    $.ajax({
        type: 'get',
        url: '/search',
        data: { wd: wd },
        success: function (result) {
            console.log(result)

            fillData(result)
        }
    })
}


//查询监听
searchBtn.on('click', function () {
    var wd = searchContactValue.val()
    // console.log(wd)

    searchContact(wd)
})



//监听器模块
var initListener = function () {
    saveAdd.on('click', function () {
        var name = addContactName.val()
        var phone = addContactPhone.val()
        addContact(name, phone)
        addContactName.val('')
        addContactPhone.val('')
    })
    saveRevise.on('click',function(){
        var name = reviseContactName.val()
        var phone = reviseContactPhone.val()
        var _id=id1
        reviseContact(_id,name,phone)
        id1=''
        
    })
}

//初始化模块
var main = function () {
    getAllContact()
    initListener()
}
main()
