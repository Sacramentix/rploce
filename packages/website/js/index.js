'use strict';

const $table = document.querySelector('table > tbody');
const $colorInput = document.querySelector('input[type="color"]');

// add on click event to change color
{
  const trs = $table.children;

  for (let y = 0; y < trs.length; y++) {
    const tr = trs[y];
    const tds = tr.children;
    for (let x = 0; x < tds.length; x++) {
      const td = tds[x];
      function changeColor() {
        td.style.backgroundColor = $colorInput.value;
        updatePixelRemote(x,y,$colorInput.value);
      }
      td.addEventListener("click", ()=>{
        changeColor();
      });
      td.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          changeColor();
        }
      });
    }
  }
}
/**
 * 
 * @param {string} x 
 * @param {string} y 
 * @param {string} color 
 */
function updatePixelRemote(x,y,color) {
  console.log("remote");
  const c = color.substring(1);
  fetch(`http://localhost:3003/update/pixel/${x}/${y}/${c}`)
    .then((res) => res.json())
    .then(renderTable);
}

const renderTable = (grid) => {
  const trs = $table.children;
  for (let y = 0; y < trs.length; y++) {
    const tr = trs[y];
    const tds = tr.children;
    for (let x = 0; x < tds.length; x++) {
      const td = tds[x];
      td.style.backgroundColor = grid[y][x];
    }
  }
};

fetch('http://localhost:3003/canvas')
  .then((res) => res.json())
  .then(renderTable);
