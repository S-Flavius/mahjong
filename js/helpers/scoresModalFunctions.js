'use strict';

import {lang}     from '../intl/languages/lang.js';
import {language} from '../main.js';

function insertData(data) {
  document.getElementById('scores-table').innerHTML = '';

  Array.from(data).forEach((row) => {
    document.getElementById('scores-table').innerHTML += `
          <tr>
            <td>${row.username}</td>
            <td>${row.time}</td>
            <td>${row.layout}</td>
            <td>${row.difficulty}</td>
          </tr>`;
  });
}

document.addEventListener('DOMContentLoaded', () => {

  let lastData = '';

  document.getElementById('scores-form').
           addEventListener('submit', e => e.preventDefault());

  document.getElementById('scores-get-data').onclick = () => {

    const username = document.getElementById('username').value;
    const layout = document.getElementById('layout-selection').value;
    const difficulty = document.getElementById('difficulty-selection').value;

    let url = `http://localhost:3000/scores?`;

    const params = [];
    if (username) params.push(`username=${username}`);
    if (layout !== lang[language]['all']) params.push(`layout=${layout}`);
    if (difficulty !== lang[language]['all']) params.push(
      `difficulty=${difficulty}`);

    url += params.join('&');

    fetch(url).
      then((res) => res.json()).then((data) => {
      lastData = data;
      insertData(data);
    });
  };

  let descending = false;
  let lastElement = document.getElementById('table-username');

  function sortElement(element, event) {
    let key = element.includes('username') ?
              'username' :
              element.includes('time') ?
              'time' :
              element.includes('layout') ?
              'layout' :
              element.includes('difficulty') ? 'difficulty' : '';
    if (lastData) {
      lastElement.innerHTML = lastElement.innerHTML.replaceAll('▲', '').
                                          replaceAll('▼', '');
      if (descending && lastElement === event.target) {
        lastData.sort((a, b) => a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0);
        event.target.innerHTML += '▲';
      } else {
        lastData.sort((a, b) => a[key] > b[key] ? -1 : a[key] < b[key] ? 1 : 0);
        event.target.innerHTML += '▼';
      }
      descending = !descending;
    }

    lastElement = event.target;
    insertData(lastData);
  }

  document.getElementById('table-username').
           addEventListener('click',
                            event => sortElement('table-username', event));

  document.getElementById('table-time').
           addEventListener('click', event => sortElement('table-time', event));

  document.getElementById('table-layout').
           addEventListener('click',
                            event => sortElement('table-layout', event));

  document.getElementById('table-difficulty').
           addEventListener('click',
                            event => sortElement('table-difficulty', event));
});
