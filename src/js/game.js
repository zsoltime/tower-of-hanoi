'use strict';

const Game = (function() {

  let dom = {};
  let moves = 0;
  let time = 0;
  let timerId = 0;
  let disks = 6;
  let diskInHand = false;
  let grabbedRod = false;
  let rods = [];
  let snapshots = [];
  let solving = false;

  function init() {
    createRods();
    cacheDOM();
    bindEvents();
    render();
  }

  function createRods() {
    for (let i = 0; i < 3; i++) {
      rods.push(new Rod());
      if (i === 0) {
        rods[i].populate(disks);
      }
    }
  }

  function cacheDOM() {
    dom = {
      game: document.getElementById('game'),
      rod: [
        document.getElementById('rod-0'),
        document.getElementById('rod-1'),
        document.getElementById('rod-2')
      ],
      moves: document.getElementById('moves'),
      timer: document.getElementById('timer'),
      options: document.getElementById('options')
    }
  }

  function render() {
    dom.moves.textContent = moves;

    for (let i = 0; i < rods.length; i++) {

      dom.rod[i].innerHTML = '';

      for (let j = rods[i].disks.length - 1; j >= 0; j--) {
        const disk = document.createElement('div');
        disk.classList.add('disk');
        disk.dataset.size = rods[i].disks[j] + 1; // @todo back to size
        // disk.textContent = rods[i].disks[j]
        dom.rod[i].appendChild(disk);
      }
      if (!solving) {
        if (rods[i].isSelected()) {
          setTimeout(function() {dom.rod[i].classList.add('grabbed');}, 20);
        }
        else {
          setTimeout(function() {dom.rod[i].classList.remove('grabbed');}, 20);
        }
      }
    }
  }

  function bindEvents() {

    timerId = setInterval(updateTimer, 1000);

    dom.game.addEventListener('click', handleClick);
  }

  function handleClick(event) {

    if (event.target === dom.options) {
      callSolve();
      return;
    }

    for (let i = 0; i < dom.rod.length; i++) {

      if (event.target === dom.rod[i] ||
          event.target.parentElement === dom.rod[i]) {

        if (!diskInHand && rods[i].size() > 0) {
          diskInHand = true;
          grabbedRod = rods[i];
          rods[i].select();
        }
        else if (diskInHand && grabbedRod) {
          diskInHand = false;
          grabbedRod.select();
          moveDisk(grabbedRod, rods[i]);

          if (isSolved()) {
            // show game over page
            clearTimeout(timerId);
            alert('Solved with ' + moves + ' moves in ' + formatTime(time));
          }
        }
      }
    }
    render();
  }

  function isSolved() {
    return (rods[0].size() === 0 &&
      (rods[1].size() === disks || rods[2].size() === disks));
  }

  function moveDisk(from, to) {
    if (to.isStackable(from.last())) {
      moves += 1;
      const disk = from.pop();
      to.push(disk);
    }
  }

  function updateTimer() {
    time += 1;
    dom.timer.textContent = formatTime(time);
  }

  function formatTime(secs) {
    const mins = ('0' + Math.floor(secs / 60)).slice(-2);
    secs = ('0' + (secs % 60)).slice(-2);

    return `${mins}:${secs}`;
  }

  function solve(n, from, to, aux) {

    if (n > 0) {
      solve(n-1, from, aux, to);
      moveDisk(from, to);
      snapshots.push(JSON.stringify(rods));
      solve(n-1, aux, to, from);
    }
  }

  function wait(time) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, time);
    });
  }

  function callSolve() {
    solve(disks, rods[0], rods[1], rods[2]);
    solving = true;
    moves = 0;
    for (let i = 0; i < snapshots.length; i++) {
      wait(500 * i)
      .then(_ => {
        moves += 1;
        rods = JSON.parse(snapshots[i]);
        render();
      });
    }
  }

  return {
    init: init
  }
})();

Game.init();
