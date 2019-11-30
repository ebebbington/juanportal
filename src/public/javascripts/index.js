'use strict'

$(document).ready(function () {
  $('.delete-profile').on('click', function () {
    const id = $(this).data('id')
    const profile = $(this).closest('.person')
    $.ajax({
      method: 'delete',
      url: '/profile/id/' + id,
      success: function () {
        profile.remove()
      },
      error: function (err) {
        profile.remove()
      }
    })
  })
})