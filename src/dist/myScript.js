
$(function () {
    showTable();

    chrome.storage.local.get(['switch'], function (result) {
        if (result.switch) {
            $('#iptStatus').prop("checked", true);
            $('#lblStatus').text('on');
            $('#spnTitle').show();
        }
        else {
            $('#lblStatus').text('off');
            $('#spnTitle').hide();
        }
    });

    // chrome.storage.local.get(['switchTime'], function (result) {
    //     console.log(result.switchTime);
    // });

    $('#btnImport').on('click', function () {
        showTip(2, 'btnImport');
    });

    $('#btnExport').on('click', function () {
        showTip(3, 'btnExport');
    });

    $('#btnClear').on('click', function () {
        if (confirm('delete all rules?')) {
            chrome.storage.local.set({
                data: []
            }, function () {
                showTable();
            });
        }
    });

    $('#btnAdd').on('click', function () {
        showTip(1, 'btnAdd');
        initEditArea();

    });

    $('#tblContent').on('click', 'tr', function () {
        $(this).addClass('table-active').siblings().removeClass('table-active');

        $('#txtEditArea').attr('class', 'alert alert-success').html('Rule Edit');
        $('#btnSave').attr('class', 'btn btn-success mt-3').text('Edit');

        var dtGuid = $(this).attr('data-label');
        chrome.storage.local.get(['data'], function (result) {
            $.each(result.data, function (i, v) {
                if (v.guid === dtGuid) {
                    $('#sort').val(v.sort);
                    $('#method').val(v.method);
                    $('#pattern').val(v.pattern);
                    $('#response').val(v.response);

                    return false;
                }
            });
        });
    });

    $('#tblContent').on('click', 'tr input[type=checkbox]', function (event) {
        var dtGuid = $(this).closest('tr').attr('data-label');
        var dtStatus = $(this).prop('checked');

        chrome.storage.local.get(['data'], function (result) {
            $.each(result.data, function (i, v) {
                if (v.guid === dtGuid) {
                    v.status = dtStatus;
                    return false;
                }
            });
            chrome.storage.local.set({
                data: result.data
            }, function () {
                //showTable();
            });
        });
        event.stopPropagation();
    });

    $('#tblContent').on('click', 'tr button', function (event) {
        if (confirm('delete this rule?')) {
            var dtGuid = $(this).closest('tr').attr('data-label');
            var arrayData = [];

            chrome.storage.local.get(['data'], function (result) {
                $.each(result.data, function (i, v) {
                    if (v.guid !== dtGuid) {
                        arrayData.push(v);
                    }
                });
                chrome.storage.local.set({
                    data: arrayData
                }, function () {
                    showTable();
                });
            });
        }
        event.stopPropagation();
    });

    $('#iptStatus').on('click', function () {
        var flag = $(this).prop('checked');
        chrome.storage.local.set({
            switch: flag
        }, function () {
            if (flag) {
                chrome.storage.local.set({ switchTime: new Date().toLocaleString() }, function () {
                    $('#lblStatus').text('on');
                    $('#spnTitle').show();
                });
            }
            else {
                $('#lblStatus').text('off');
                $('#spnTitle').hide();
            }
        });
    });

    $('#btnSave').on('click', function () {
        var sort = $.trim($('#sort').val());
        var reg = /^[0-9]+$/;
        if (sort === '' || !reg.test(sort)) {
            showTip(4, 'sort must be integer');
            $('#sort').focus();
            return;
        }

        var method = $.trim($('#method').val());
        if (method === '') {
            showTip(4, 'method Cannot be empty');
            return;
        }

        var pattern = $.trim($('#pattern').val());
        if (pattern === '') {
            showTip(4, 'pattern Cannot be empty');
            $('#pattern').focus();
            return;
        }

        var response = $.trim($('#response').val());
        if (response === '') {
            showTip(4, 'response Cannot be empty');
            $('#response').focus();
            return;
        }

        chrome.storage.local.get(['data'], function (result) {
            if (result.data && result.data !== undefined) {
                result.data.push({
                    "guid": uuidv4(),
                    "status": true,
                    "sort": sort,
                    "method": method,
                    "pattern": pattern,//编码？
                    "response": response//编码？
                });
                chrome.storage.local.set({
                    data: result.data
                }, function () {
                    showTip(1);
                    showTable();
                });
            }
            else {
                chrome.storage.local.set({
                    data: [{
                        "guid": uuidv4(),
                        "status": true,
                        "sort": sort,
                        "method": method,
                        "pattern": pattern,//编码？
                        "response": response//编码？
                    }]
                }, function () {
                    showTip(1);
                    showTable();
                });
            }
        });
    });
});

function showTable() {
    $('#tblContent').empty();
    chrome.storage.local.get(['data'], function (result) {
        if (result.data && result.data !== undefined && result.data.length > 0) {
            console.log(result.data);

            $.each(result.data, function (i, v) {
                var strHtml = '<tr data-label="' + v.guid + '"><td>' + v.sort + '</td><td>' + v.method + '</td><td>' + v.pattern + '</td><td><div class="form-check form-switch"><input class="form-check-input" type="checkbox"';
                if (v.status)
                    strHtml += ' checked';
                strHtml += '></div></td><td><button type="button" class="btn btn-sm btn-link">delete</button></td></tr>';
                $('#tblContent').append(strHtml);
            });
        }
        else {
            $('#tblContent').append('<tr><td colspan="5" align="center">Empty, Please add</td></tr>');
        }
    });
    initEditArea();
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function initEditArea() {
    $('#sort').val('');
    $('#method option:first').prop('selected', true);
    $('#pattern').val('');
    $('#response').val('');
    $('#txtEditArea').attr('class', 'alert alert-primary').html('Rule Add');
    $('#btnSave').attr('class', 'btn btn-primary mt-3').text('Add');
}

function showTip(type, msg) {
    toastr.clear();
    var level = '';
    var timeout = 0;
    var msgDefault = '';
    switch (type) {
        case 1:
        default:
            level = 'success';
            timeout = 2000;
            msgDefault = 'success';
            break;
        case 2:
            level = 'info';
            timeout = 3000;
            msgDefault = 'info';
            break;
        case 3:
            level = 'warning';
            timeout = 3000;
            msgDefault = 'warning';
            break;
        case 4:
            level = 'error';
            timeout = 5000;
            msgDefault = 'error';
            break;
    }

    toastr.options = {
        "positionClass": "toast-bottom-left",
        "timeOut": timeout
    }

    if (msg === undefined || msg === '') {
        toastr[level](msgDefault);
    }
    else {
        toastr[level](msg);
    }
}