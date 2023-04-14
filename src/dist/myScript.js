layui.use(['layer', 'form'], function () {
    var layer = layui.layer, form = layui.form;
    //form.render();

    form.verify({
        sort: function (value) {
            var regSort = /^\d+$/;
            if (!regSort.test(value)) {
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

    form.on('submit(add)', function () {
        layer.msg('add');

        return false;
    });
    form.on('submit(import)', function () {
        layer.msg('import');

        return false;
    });
    form.on('submit(export)', function () {
        layer.msg('export');

        return false;
    });

    form.on('submit(formConfig)', function (data) {
        layer.msg(JSON.stringify(data.field));

        return false;
    });
});