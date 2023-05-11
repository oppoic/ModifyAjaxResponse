
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
    });

    $('#btnAdd').on('click', function () {
        console.log('btnAdd click');
        alert('btnAdd click');
    });

});