
$(function () {
    showTable();

    console.log('JSONViewer,Format several JSON documents in one window. https://github.com/oppoic/JSONViewer  https://chrome.google.com/webstore/detail/jsonviewer/khbdpaabobknhhlpglenglkkhdmkfnca');

    chrome.storage.local.get(['on'], function (result) {
        renderStatus(result.on)
    });

    $('#btnImport').on('click', function () {
        $.confirm({
            title: 'Import',
            content: '<textarea id="txtaImport" style="width: 100%;resize:none;" rows="20" placeholder="paste import json here"></textarea>',
            columnClass: 'large',
            closeIcon: true,
            buttons: {
                OK: function () {
                    var str = $.trim($('#txtaImport').val());
                    if (str === '') {
                        showTip(4, "can't be empty");
                        $('#txtaImport').focus();
                        return false;
                    }

                    try {
                        var jsArray = $.parseJSON(str);
                        chrome.storage.local.get(['data'], function (result) {
                            var jsArrayTotal = [];
                            if (result.hasOwnProperty('data') && result.data.length > 0) {
                                jsArrayTotal = result.data;
                            }

                            if (jsArrayTotal.length + jsArray.length > 100) {
                                showTip(4, 'max 100, please delete some');
                                return false;
                            }

                            var successCount = 0;
                            $.each(jsArray, function (i, v) {
                                if (v.hasOwnProperty('method') && v.hasOwnProperty('pattern') && v.hasOwnProperty('response') && v.hasOwnProperty('sort') && v.hasOwnProperty('status')) {
                                    var method = $.trim(v.method);
                                    var pattern = $.trim(v.pattern);
                                    var response = $.trim(v.response);
                                    var sort = $.trim(v.sort);
                                    //var status = $.trim(v.status);
                                    if (verifyMethod(method) && verifyPattern(pattern) && verifyResponse(response) && verifySort(sort) && verifyStatus(v.status)) {
                                        successCount++;
                                        jsArrayTotal.push({
                                            "guid": uuidv4(),
                                            "status": v.status,
                                            "sort": parseInt(sort),
                                            "method": method,
                                            "pattern": pattern,
                                            "response": response
                                        });
                                    }
                                }
                            });

                            jsArrayTotal.sort(function (a, b) { return a.sort - b.sort });
                            chrome.storage.local.set({ data: jsArrayTotal }, function () {
                                $('#formArea').hide();
                                showTable();
                                $.dialog('import count:' + successCount + ', total count:' + jsArrayTotal.length);
                            });
                        });
                    }
                    catch (err) {
                        showTip(4, err);
                        return false;
                    }
                }
            }
        });
    });

    $('#btnExport').on('click', function () {
        $.confirm({
            title: 'Confirm',
            content: 'Export all to json file?',
            type: 'blue',
            backgroundDismiss: true,
            closeIcon: true,
            buttons: {
                Export: function () {
                    chrome.storage.local.get(['data'], function (result) {
                        if (result.hasOwnProperty('data') && result.data.length > 0) {
                            exportFile(result.data, "ModifyAjaxResponse-" + Math.floor(new Date().getTime() / 1000) + ".json");
                        }
                        else {
                            showTip(4, 'nothing to export');
                        }
                    });
                }
            }
        });
    });

    $('#btnClear').on('click', function () {
        $.confirm({
            title: 'Confirm',
            type: 'red',
            content: 'Delete ALL?',
            backgroundDismiss: true,
            closeIcon: true,
            buttons: {
                Delete: function () {
                    chrome.storage.local.set({ data: [] }, function () {
                        $('#formArea').hide();
                        showTable();
                    });
                }
            }
        });
    });

    $('#btnAdd').on('click', function () {
        initEditArea();
        $('#tblContent tr').removeClass('table-active');
        $('#formArea').show();

        chrome.storage.local.get(['data'], function (result) {
            if (result.hasOwnProperty('data') && result.data.length > 0) {
                $('#sort').val(result.data[result.data.length - 1].sort + 1);
            }
            else {
                $('#sort').val(1);
            }
        });
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
            backgroundDismiss: true,
            closeIcon: true,
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
                }
            }
        });
        event.stopPropagation();
    });

    $('#iptStatus').on('click', function () {
        operStatus($(this).prop('checked'));
    });

    $('#btnSave').on('click', function () {
        var sort = $.trim($('#sort').val());
        if (!verifySort(sort)) {
            showTip(4, 'sort must be integer and below 1,000,000,000');
            $('#sort').focus();
            return false;
        }

        var method = $.trim($('#method').val());
        if (!verifyMethod(method)) {
            showTip(4, "pls select method");
            return false;
        }

        var pattern = $.trim($('#pattern').val());
        if (!verifyPattern(pattern)) {
            showTip(4, "pattern can't be empty");
            $('#pattern').focus();
            return false;
        }

        var response = $.trim($('#response').val());
        if (!verifyResponse(response)) {
            showTip(4, "response can't be empty");
            $('#response').focus();
            return false;
        }

        var guidHdd = $('#guidHidden').val();
        chrome.storage.local.get(['data'], function (result) {
            if (result.hasOwnProperty('data')) {
                if (guidHdd === '') {//add
                    if (result.data.length > 99) {
                        showTip(4, 'max 100, please delete some');
                        return;
                    }

                    var guidAdd = uuidv4();
                    result.data.push({
                        "guid": guidAdd,
                        "status": true,
                        "sort": parseInt(sort),
                        "method": method,
                        "pattern": pattern,
                        "response": response
                    });
                    result.data.sort(function (a, b) { return a.sort - b.sort });
                    chrome.storage.local.set({ data: result.data }, function () {
                        showTip(1);
                        showTable(guidAdd);
                    });
                }
                else {//edit
                    chrome.storage.local.get(['data'], function (result) {
                        $.each(result.data, function (i, v) {
                            if (v.guid === guidHdd) {
                                v.sort = parseInt(sort);
                                v.method = method;
                                v.pattern = pattern;
                                v.response = response;
                                return false;
                            }
                        });
                        result.data.sort(function (a, b) { return a.sort - b.sort });
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
                        "sort": parseInt(sort),
                        "method": method,
                        "pattern": pattern,
                        "response": response
                    }]
                }, function () {
                    showTip(1);
                    showTable(guidAdd);
                    operStatus(true);//first add:open checkbox and show table
                });
            }
        });
    });
});

function showTable(activeGuid) {
    $('#tblContent').empty();
    chrome.storage.local.get(['data'], function (result) {
        if (result.hasOwnProperty('data') && result.data.length > 0) {
            renderDefault(false);
            $.each(result.data, function (i, v) {
                var strHtml = '<tr data-label="' + v.guid + '"><td>' + v.sort + '</td><td>' + v.method + '</td><td style="word-break: break-all;">' + v.pattern + '</td><td><div class="form-check form-switch"><input class="form-check-input" type="checkbox"';
                if (v.status)
                    strHtml += ' checked';
                strHtml += '></div></td><td><button type="button" class="btn btn-sm btn-link">delete</button></td></tr>';
                $('#tblContent').append(strHtml);
            });

            if (activeGuid) {
                var activeTR = $('#tblContent tr[data-label="' + activeGuid + '"]');
                if (activeTR.length > 0) {
                    activeTR.click();
                }
                else {
                    showTip(4, 'not exists, please refresh page');
                }
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

function exportFile(data, fileName) {
    var a = document.createElement("a");
    var json = JSON.stringify(data);
    var blob = new Blob([json], { type: "octet/stream" });
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
}

function verifyMethod(method) {
    if (['get', 'post', 'head', 'put', 'patch', 'delete', 'options', 'other'].indexOf(method) === -1) {
        return false;
    }
    else {
        return true;
    }
}

function verifyPattern(pattern) {
    if (pattern === '') {
        return false;
    }
    else {
        return true;
    }
}

function verifyResponse(response) {
    if (response === '') {
        return false;
    }
    else {
        return true;
    }
}

function verifySort(sort) {
    var reg = /^[0-9]+$/;
    if (sort === '' || !reg.test(sort) || sort.length > 9) {
        return false;
    }
    else {
        return true;
    }
}

function verifyStatus(status) {
    if (typeof (status) == 'boolean') {
        return true;
    }
    else {
        return false;
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