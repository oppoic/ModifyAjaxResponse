
$(function () {
    // $('#status').val('Enable');
    // $('#sort').val(1);
    // $('#method').val('get');
    // $('#pattern').val('/app\.json/gi');//转义？
    // $('#response').val('response');//转义？


    $('#iptStatus').on('click', function () {
        if (($(this).prop('checked'))) {
            $('#lblStatus').text('on');
            $('#spnTitle').show();
        }
        else {
            $('#lblStatus').text('off');
            $('#spnTitle').hide();
        }

        var value = '!dlrow olleh';
        chrome.storage.local.set({ data: value }, function () {
            console.log('value is set to ' + value);
        });
    });

    $('#btnAdd').on('click', function () {
        var value = 'hello world!';
        chrome.storage.local.set({ data: value }, function () {
            console.log('value is set to ' + value);
        });

    });

    $('#btnSave').on('click', function () {
        chrome.storage.local.get(['data'], function (result) {
            console.log('value currently is ' + result.data);
        });

    });

});