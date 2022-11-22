'use strict';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('scores-form').
           addEventListener('submit', e => e.preventDefault());

  document.getElementById('scores-get-data').onclick = () => {

    document.getElementById('scores-table').innerHTML = '';

    const username = document.getElementById('username').value;
    const minTime = document.getElementById('min-time').value;
    const layout = document.getElementById('layout-selection').value;
    const difficulty = document.getElementById('difficulty-selection').value;

    let url = `http://localhost:3000/scores?`;

    const params = [];
    if (username) params.push(`username=${username}`);
    if (minTime) params.push(`min_time=${minTime}`);
    if (layout) params.push(`layout=${layout}`);
    if (difficulty) params.push(`difficulty=${difficulty}`);

    url += params.join('&');

    fetch(url).
      then((res) => res.json()).then((data) => {
      Array.from(data).forEach((row) => {
        document.getElementById('scores-table').innerHTML += `
          <tr>
            <td>${row.username}</td>
            <td>${row.time}</td>
            <td>${row.layout}</td>
            <td>${row.difficulty}</td>
          </tr>`;
      });
    });
  };
});
