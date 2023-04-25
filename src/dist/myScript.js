
$(function () {
    $('#status').val('Enable');
    $('#sort').val(1);
    $('#method').val('get');
    $('#pattern').val('/app\.json/gi');//转义？
    $('#response').val('response');//转义？

})


// layui.use(['layer', 'form', 'table'], function () {
//     var layer = layui.layer, form = layui.form, table = layui.table;
//     //form.render();

//     form.verify({
//         sort: function (value) {
//             var regSort = /^\d+$/;
//             if (!regSort.test(value)) {
//                 return 'must be number';
//             }
//             if (value.length > 10) {
//                 return 'too long';
//             }
//         },
//         pattern: function (value) {
//             if (value.length === 0) {
//                 return 'cant be empty';
//             }
//         }
//     });

//     table.render({
//         elem: '#configTable'
//         , cols: [[ //标题栏
//             { field: 'id', title: 'ID', width: 80, sort: true }
//             , { field: 'username', title: '用户名', width: 120 }
//             , { field: 'email', title: '邮箱', minWidth: 150 }
//             , { field: 'sign', title: '签名', minWidth: 160 }
//             , { field: 'sex', title: '性别', width: 80 }
//             , { field: 'city', title: '城市', width: 100 }
//             , { field: 'experience', title: '积分', width: 80, sort: true }
//         ]]
//         , data: [{
//             "id": "10001"
//             , "username": "杜甫"
//             , "email": "test@email.com"
//             , "sex": "男"
//             , "city": "浙江杭州"
//             , "sign": "人生恰似一场修行"
//             , "experience": "116"
//             , "ip": "192.168.0.8"
//             , "logins": "108"
//             , "joinTime": "2016-10-14"
//         }]
//     });

//     form.on('submit(add)', function () {
//         layer.msg('add');

//         return false;
//     });
//     form.on('submit(import)', function () {
//         layer.msg('import');

//         return false;
//     });
//     form.on('submit(export)', function () {
//         layer.msg('export');

//         return false;
//     });

//     form.on('submit(formConfig)', function (data) {
//         layer.msg(JSON.stringify(data.field));

//         return false;
//     });
// });
