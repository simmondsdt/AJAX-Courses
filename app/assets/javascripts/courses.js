$(document).ready(function () {
  var $getCourses = $('#get-courses');
  var $courseForm = $('#add-course-form');
  var $courseTitle = $('#course-title')
  var $courseCode = $('#course-code')
  var $courseDescription = $('#course-description')
  var $courseActive = $('#course-active')
  var BASEURL = 'http://devpoint-ajax-example-server.herokuapp.com/api/v1';

  function getCourses() {
    var $courses = $('#courses');
    $courses.empty();
    $.ajax({
      type: 'GET',
      url: BASEURL + '/courses',
      dataType: 'JSON'
    }).success(function(data) {
      for(var i = 0; i < data.length; i++) {
        var course = data[i];
        $courses.append('<div id=' + course.id + '>' + course.title + ' - <button class="btn red delete-course" type="button"><i class="material-icons">delete_forever</i></button> <button class="btn blue show-course" type="button"><i class="material-icons">visibility</i></button> <button class="btn orange edit-course" type="button"><i class="material-icons">edit</i></button> </div>');
        $courses.append('<div>' + course.code + '</div>');
        $courses.append('<div>' + course.description + '</div>');
        $courses.append('<div>' + course.active + '</div>');
      }
    }).fail(function(data) {
      console.log(data);
    })
  };

  $(document).on('click', '.edit-course', function () {
    var courseId = ($(this).parent().attr('id'));
    $.ajax({
      type: 'GET',
      url: BASEURL + '/courses/' + courseId,
      dataType: 'JSON',
    }).success(function(data) {
      $courseTitle.val(data.title).focus();
      $courseCode.val(data.code);
      $courseDescription.val(data.description);
      if(!data.active) {
        $courseActive.removeAttr('checked')
      } else {
        $courseActive.attr('checked', data.active);
      }
      $courseForm.attr('data-course-id', courseId);
    }).fail(function(data) {
      console.log(data);
    });
  });


  $(document).on('click', '.show-course', function () {
  });


  $(document).on('click', '.delete-course', function () {
    var courseId = ($(this).parent().attr('id'));
    $.ajax({
      type: 'DELETE',
      url: BASEURL + '/courses/' + courseId,
      dataType: 'JSON',
    }).success(function(data) {
      alert('You deleted that course!')
        $('#' + courseId).remove
    }).fail(function(data) {
      alert('ERROR: \n Try Again')
    });
  });

  $courseForm.submit(function(e) {
    e.preventDefault();
    var requestType, requestURL;

    if($(this).data('course-id')) {
      requestType = 'PUT';
      requestURL = BASEURL + '/courses/' + $(this).data('course-id');
    } else {
      requestType = 'POST';
      requestURL = BASEURL + '/courses';
    };

    debugger
    $.ajax ({
      type: requestType,
      url: requestURL,
      dataType: 'JSON',
      data: {course: {title: $courseTitle.val(), code: $courseCode.val(),
                      description: $courseDescription.val(), active: $courseActive.val()
                      } }
    }).success(function(data) {
      $courseForm[0].reset();
      $courseTitle.focus();
      getCourses();
    }).fail(function(data) {
    });
  });

  $getCourses.click(function () {
    getCourses();
  });

});
