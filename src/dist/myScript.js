layui.use(['layer', 'form'], function () {
    var layer = layui.layer;
    var form = layui.form;

    form.verify({
        sort: function (value) {
            var pattern = /^\d+$/;
            if (!pattern.test(value)) {
                return 'must be number';
            }
            if (value.length > 10) {
                return 'too long';
            }
        },
        pattern: function (value) {
            if (value.length === 0) {
                return 'cant be empty';
            }
        }
    });

    //layer.msg('Hello World');
    form.on('submit(formConfig)', function (data) {
        layer.msg(JSON.stringify(data.field));
        return false;
    });
});