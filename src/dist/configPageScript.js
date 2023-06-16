
$(function () {
    showTable();

    chrome.storage.local.get(['on'], function (result) {
        renderStatus(result.on)
    });

    chrome.storage.local.get(null, function (items) {
        console.log(items);
    });

    $('#btnImport').on('click', function () {
        showTip(2, 'building...');
    });

    $('#btnExport').on('click', function () {
        showTip(2, 'building...');
    });

    $('#btnClear').on('click', function () {
        $.confirm({
            title: 'Confirm',
            type: 'red',
            content: 'Delete ALL',
            buttons: {
                Delete: function () {
                    chrome.storage.local.set({ data: [] }, function () {
                        $('#formArea').hide();
                        showTable();
                    });
                },
                Cancel: function () { }
            }
        });
    });

    $('#btnAdd').on('click', function () {
        initEditArea();
        $('#tblContent tr').removeClass('table-active');
        $('#formArea').show();
    });

    $('#tblContent').on('click', 'tr', function () {
        $(this).addClass('table-active').siblings().removeClass('table-active');

        var dtGuid = $(this).attr('data-label');
        var isExist = false;
        chrome.storage.local.get(['data'], function (result) {
            $.each(result.data, function (i, v) {
                if (v.guid === dtGuid) {
                    isExist = true;
                    $('#guidHidden').val(v.guid);
                    $('#sort').val(v.sort);
                    $('#method').val(v.method);
                    $('#pattern').val(v.pattern);
                    $('#response').val(v.response);
                    return false;
                }
            });
            if (isExist) {
                $('#formArea').show();
                $('#btnSave').attr('class', 'btn btn-success mt-3').text('Edit');
            }
            else {
                $('#formArea').hide();
                showTip(4, 'not exists, please refresh page');
            }
        });
    });

    $('#tblContent').on('click', 'tr input[type=checkbox]', function (event) {
        var dtGuid = $(this).closest('tr').attr('data-label');
        var dtStatus = $(this).prop('checked');

        var isExist = false;
        chrome.storage.local.get(['data'], function (result) {
            $.each(result.data, function (i, v) {
                if (v.guid === dtGuid) {
                    isExist = true;
                    v.status = dtStatus;
                    return false;
                }
            });
            if (isExist) {
                chrome.storage.local.set({ data: result.data });
            }
            else {
                $('#formArea').hide();
                showTip(4, 'not exists, please refresh page');
            }
        });
        event.stopPropagation();
    });

    $('#tblContent').on('click', 'tr button', function (event) {
        var currentTR = $(this).closest('tr');
        $.confirm({
            title: 'Delete',
            content: currentTR.find('td:eq(2)').text(),
            type: 'orange',
            buttons: {
                Delete: function () {
                    var dtGuid = currentTR.attr('data-label');
                    var arrayData = [];

                    chrome.storage.local.get(['data'], function (result) {
                        $.each(result.data, function (i, v) {
                            if (v.guid !== dtGuid) {
                                arrayData.push(v);
                            }
                        });
                        chrome.storage.local.set({ data: arrayData }, function () {
                            $('#formArea').hide();
                            showTable();
                        });
                    });
                },
                Cancel: function () { }
            }
        });
        event.stopPropagation();
    });

    $('#iptStatus').on('click', function () {
        operStatus($(this).prop('checked'));
    });

    $('#btnSave').on('click', function () {
        var sort = $.trim($('#sort').val());
        var reg = /^[0-9]+$/;
        if (sort === '' || !reg.test(sort)) {
            showTip(4, 'sort must be integer');
            $('#sort').focus();
            return false;
        }

        var method = $.trim($('#method').val());
        if (method === '') {
            showTip(4, 'method cannot be empty');
            return false;
        }

        var pattern = $.trim($('#pattern').val());
        if (pattern === '') {
            showTip(4, 'pattern cannot be empty');
            $('#pattern').focus();
            return false;
        }

        var response = $.trim($('#response').val());
        if (response === '') {
            showTip(4, 'response cannot be empty');
            $('#response').focus();
            return false;
        }

        var guidHdd = $('#guidHidden').val();
        chrome.storage.local.get(['data'], function (result) {
            if (result.hasOwnProperty('data')) {
                if (guidHdd === '') {//add
                    if (result.data.length == 0) {
                        renderDefault(false);
                    }

                    var guidAdd = uuidv4();
                    result.data.push({
                        "guid": guidAdd,
                        "status": true,
                        "sort": sort,
                        "method": method,
                        "pattern": pattern,
                        "response": response
                    });
                    result.data.sort(function (a, b) { return parseFloat(a.sort) - parseFloat(b.sort) });
                    chrome.storage.local.set({ data: result.data }, function () {
                        showTip(1);
                        showTable(guidAdd);
                    });
                }
                else {//edit
                    chrome.storage.local.get(['data'], function (result) {
                        $.each(result.data, function (i, v) {
                            if (v.guid === guidHdd) {
                                v.sort = sort;
                                v.method = method;
                                v.pattern = pattern;
                                v.response = response;
                                return false;
                            }
                        });
                        result.data.sort(function (a, b) { return parseFloat(a.sort) - parseFloat(b.sort) });
                        chrome.storage.local.set({ data: result.data }, function () {
                            showTip(1);
                            showTable(guidHdd);
                        });
                    });
                }
            }
            else {
                var guidAdd = uuidv4();
                chrome.storage.local.set({
                    data: [{
                        "guid": guidAdd,
                        "status": true,
                        "sort": sort,
                        "method": method,
                        "pattern": pattern,
                        "response": response
                    }]
                }, function () {
                    showTip(1);
                    showTable(guidAdd);
                    //first add:open checkbox and show table
                    operStatus(true);
                    renderDefault(false);
                });
            }
        });
    });
});

function showTable(activeGuid) {
    $('#tblContent').empty();
    chrome.storage.local.get(['data'], function (result) {
        if (result.hasOwnProperty('data') && result.data.length > 0) {
            $.each(result.data, function (i, v) {
                var strHtml = '<tr data-label="' + v.guid + '"><td>' + v.sort + '</td><td>' + v.method + '</td><td>' + v.pattern + '</td><td><div class="form-check form-switch"><input class="form-check-input" type="checkbox"';
                if (v.status)
                    strHtml += ' checked';
                strHtml += '></div></td><td><button type="button" class="btn btn-sm btn-link">delete</button></td></tr>';
                $('#tblContent').append(strHtml);
            });

            if (activeGuid) {
                $('#tblContent tr[data-label="' + activeGuid + '"]').click();
            }
        }
        else {
            renderDefault(true);
        }
    });
}

function initEditArea() {
    $('#sort').val('');
    $('#method option:first').prop('selected', true);
    $('#pattern').val('');
    $('#response').val('');
    $('#guidHidden').val('');
    $('#btnSave').attr('class', 'btn btn-primary mt-3').text('Add');
}

function operStatus(flag) {
    chrome.storage.local.set({
        on: flag
    }, function () {
        if (flag) {
            chrome.storage.local.set({ onTime: new Date().toLocaleString() });
        }
        renderStatus(flag);
    });
}

function renderStatus(flag) {
    if (flag) {
        $('#iptStatus').prop("checked", true);
        $('#lblStatus').text('on');
        $('#spnTitle').show();
        chrome.action.setIcon({ path: "/images/16.png" });
    }
    else {
        $('#lblStatus').text('off');
        $('#spnTitle').hide();
        chrome.action.setIcon({ path: "/images/16_gray.png" });
    }
}

function renderDefault(flag) {
    if (flag) {
        $('#tblContent').parent().hide();
        $('#cdEmpty').show();
    }
    else {
        $('#tblContent').parent().show();
        $('#cdEmpty').hide();
    }
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

    if (typeof (msg) == "undefined" || msg === '') {
        toastr[level](msgDefault);
    }
    else {
        toastr[level](msg);
    }
}