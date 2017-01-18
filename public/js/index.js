(function() {
  'use strict';

  $(document).ready(function() {
    $('.modal').modal();
    const options = {
      contentType: 'application/json',
      type: 'GET',
      url: '/token'
    };

    $.ajax(options)
      .done((loggedIn) => {
        if (loggedIn) {
          const username = localStorage.getItem('username');
          console.log(`logged in as ${username}`);
          $('#loginButton').addClass('hide');
          $('#usernameLI').addClass('hide');
          $('#passwordLI').addClass('hide');
          $('#signUp').addClass('hide');

          const $logOutBTN = $('<button>').addClass('btn').attr('id', 'logout');

          $logOutBTN.text('Log Out');

          const $listRight = $('#headerList');
          const $listLeft = $('#headerListLeft');
          const $usernameLabel = $('<h3>').text(username).attr('id', 'userLabel');

          $listLeft.append($usernameLabel);
          $listRight.append($logOutBTN);
          $('#logout').on('click', (event) => {
            console.log('clicked logout');
            // event.preventDefault();
            localStorage.clear();
            const options = {
              contentType: 'application/json',
              // data: JSON.stringify({ username, password }),
              // dataType: 'json',
              type: 'DELETE',
              url: '/token'
            };

            $.ajax(options)
              .done(() => {
                console.log('logged out Done');
                window.location.href = '/index.html';
              })
              .fail(($xhr) => {
                Materialize.toast($xhr.responseText, 3000);
              });
          });
        }
        // else {
        //   $userLabel.addClass('hide')
        // }
      })
      .fail(($xhr) => {
        Materialize.toast($xhr.responseText, 3000);
        console.log('fail');
      });

      const options2 = {
        contentType: 'application/json',
        type: 'GET',
        url: '/leaderboards'
      };

      $.ajax(options2)
        .done((rows) => {
          // const leaderboardRows = JSON.parse(rows);
          const leaderboardRows = rows;
          const $tableBody = $('#leaderboardsBody');
          console.log(leaderboardRows);
          for (let i = 1; i <= leaderboardRows.length; i++) {
            // make row
            console.log('Loop');
            console.log(leaderboardRows[i - 1]);
            const $tr = $('<tr>');
            const $td = $('<td>');
            $td.text(i);
            $tr.append($td);

            const { time, username, levelId, difficulty } = leaderboardRows[i - 1];
            console.log('time', time);
            console.log('username', username);
            console.log('levelId', levelId);
            console.log('difficulty', difficulty);
            const $tdTime = $('<td>');
            const $tdUsername = $('<td>');
            const $tdLevelId = $('<td>');
            const $tdDifficulty = $('<td>');

            $tdTime.text(time / 1000);
            $tdUsername.text(username);
            $tdLevelId.text(levelId);
            $tdDifficulty.text(difficulty);

            $tr.append($tdTime);
            $tr.append($tdUsername);
            $tr.append($tdLevelId);
            $tr.append($tdDifficulty);

            $tableBody.append($tr);

            // for (const key in leaderboardRows[i]) {
            //   // create td for each key/value pair
            //   // append to row
            //   //
            //   const $td = $('<td>');
            //   $td.text(leaderboardRows[i].key);
            //   $tr.append($td);
            // }
            // append to table
            // $tableBody.append($tr);
          }
        })
  });

  $('#signUpButton').on('click', (event) => {
    event.preventDefault();

    const username = $('#usernameSU').val().trim();
    localStorage.setItem('username', username);
    console.log(username);
    const password = $('#passwordSU').val().trim();
    const confirmPassword = $('#passwordConfirm').val().trim();

    if (!username) {
      return Materialize.toast('Username must not be blank', 3000);
      }

    if (!password || password.length < 8) {
      return Materialize.toast(
        'Password must be at least 8 characters long', 3000);
    }

    if (password !== confirmPassword) {
      return Materialize.toast('Passwords do not match', 3000);
    }

    const options = {
      contentType: 'application/json',
      data: JSON.stringify({ username, password }),
      dataType: 'json',
      type: 'POST',
      url: '/players'
    };

    $.ajax(options)
      .done(() => {
        console.log('done');
        window.location.href = '/index.html';
        // change header

      })
      .fail(($xhr) => {
        Materialize.toast($xhr.responseText, 3000);
        console.log('fail');
      });
  });

  $('#loginButton').on('click', (event) => {
    event.preventDefault();

    const username = $('#usernameLI').val().trim();
    const password = $('#passwordLI').val().trim();
    console.log(username);

    if (!username) {
      return Materialize.toast('Username must not be blank', 3000);
    }

    if (!password) {
      return Materialize.toast('Password must not be blank', 3000);
    }

    const options = {
      contentType: 'application/json',
      data: JSON.stringify({ username, password }),
      dataType: 'json',
      type: 'POST',
      url: '/token'
    };

    $.ajax(options)
      .done((body) => {
        console.log('logged In Done');
        window.localStorage.setItem('username', body.username);
        window.location.href = '/index.html';
      })
      .fail(($xhr) => {
        Materialize.toast($xhr.responseText, 3000);
      });
  });
})();
