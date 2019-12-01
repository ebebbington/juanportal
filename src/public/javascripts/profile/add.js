/* global $ */

$(document).ready(function () {

    const validate = (function () {
        function name () {
            const name = $('#name').val()
            return name.length < 2 ? false : true
        }
        return {
            name: name
        }
    })()

    $('#form').on('submit', function (e) {
        e.preventDefault()
        const nameIsValid = validate.name()
        if (!nameIsValid) {
            $('#name').val('Didnt pass validation')
            return false
        }
        $.ajax({
            method: 'post',
            processData: false,
            contentType: false,
            url: '/profile/add',
            data: new FormData($('#form')[0]),
            success: function (res) {
                console.log('success')
                window.location.href = '/'
            },
            error: function (err) {
                $('.form-error').text('Unable to perform this request, Please try again')
            }
        })
    })
})