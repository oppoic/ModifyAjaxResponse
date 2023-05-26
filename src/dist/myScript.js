
$(function () {
    showTable();

    $('#btnImport').on('click', function () {
        showTip(2, 'btnImport');
    });

    $('#btnExport').on('click', function () {
        showTip(3, 'btnExport');
    });

    $('#btnClear').on('click', function () {
        if (confirm('sure to delete all?')) {
            chrome.storage.local.clear();
            showTable();
        }
    });

    $('#btnAdd').on('click', function () {

    });

    $('#tblContent').on('click', 'tr', function () {
        $(this).addClass('table-active').siblings().removeClass('table-active');

    });

    $('#tblContent').on('click', 'tr input[type=checkbox]', function () {
        var dtGuid = $(this).closest('tr').attr('data-label');
        console.log(dtGuid);


        return false;//阻止冒泡
    });

    $('#tblContent').on('click', 'tr button', function () {
        if (confirm('sure to delete this?')) {
            var dtGuid = $(this).closest('tr').attr('data-label');
            console.log(dtGuid);

        }

        return false;//阻止冒泡
    });

    $('#iptStatus').on('click', function () {
        if (($(this).prop('checked'))) {
            $('#lblStatus').text('on');
            $('#spnTitle').show();
        }
        else {
            $('#lblStatus').text('off');
            $('#spnTitle').hide();
        }
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
        if (result.data && result.data !== undefined) {
            console.log(result.data);

            $.each(result.data, function (i, v) {
                $('#tblContent').append('<tr data-label="' + v.guid + '"><td>' + v.sort + '</td><td>' + v.method + '</td><td>' + v.pattern + '</td><td><div class="form-check form-switch"><input class="form-check-input" type="checkbox"></div></td><td><button type="button" class="btn btn-sm btn-link">delete</button></td></tr>');
            });
        }
    });
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
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