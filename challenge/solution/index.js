const DATA = {
  "data": [
    {
      "name": "Europe",
      "plan": "10525200",
      "forecast": [
        "11333200",
        "11123250"
      ],
      "best_case": [
        "72532001",
        "21525200"
      ],
      "commit": [
        "12725200",
        "21725200"
      ],
      "comments": [
        "bonjour",
        "worlddd"
      ]
    },
    {
      "name": "Russia",
      "plan": "10525200",
      "forecast": "12525200",
      "best_case": [
        "10725200",
        "11525200"
      ],
      "commit": [
        "22725200",
        "31725200"
      ],
      "comments": [
        "hello",
        "world"
      ]
    },
    {
      "name": "South Korea",
      "plan": "9525200",
      "forecast": "9525200",
      "best_case": [
        "12725200",
        "12525200"
      ],
      "commit": [
        "31725200",
        "51725200"
      ],
      "comments": [
        "anyeong",
        "segae"
      ]
    }
  ]
}

/*
  createTable(data)
  * Create Aviso table
  * @param data: a list of objects
*/
var cols  = {},
    attrs = [],
    lastCol = 0;
function createTable(data) {
    let body            = document.body,
    		container       = document.getElementById('container'),
        tablesContainer = document.createElement('div'),
        len             = data.length,
        maxChildrenCount   = 1;

		// insert the column titles
    for (let k in data[0]) {
      let table = document.createElement('table');
      let tr    = table.insertRow();
      let td    = tr.insertCell();

      td.appendChild(document.createTextNode(k));
      td.style.border = '1px solid black';
      table.setAttribute('class', 'col_' + k);
      table.style.display = 'inline';
      cols[k] = table;
      attrs.push(k);
    }

    // add dropdownbox to the last attributes
    lastIndex = attrs.length - 1;
    createCheckboxDropdown(attrs, cols[attrs[lastIndex]].rows[0].cells[0]);

    // find the max. of elements in a table
    for (let i = 0; i < len; ++i) {

      for(let k in data[i]) {
        let temp = 0;

        if (data[i][k].constructor === Array) {
          for (let j = 0; j < data[i][k].length; ++j) {
            temp++;
          }
        }
        maxChildrenCount = Math.max(temp, maxChildrenCount);
      }
    }
    // create a table based on each col name
    for (let i = 0; i < len; ++i) {

      for(let k in data[i]) {
        let table = cols[k];
        let td    = table.insertRow().insertCell();

        if (data[i][k].constructor !== Array) {
          if (isNaN(Number(data[i][k]))) {
            td.appendChild(document.createTextNode(data[i][k]));
          } else {
            td.appendChild(document.createTextNode( '$'+ Number(data[i][k]).toLocaleString()));
          }
          fillWithDivs(1, maxChildrenCount, td);
        } else {
          for (let j = 0; j < data[i][k].length; ++j) {
            let div = document.createElement('div');

            if (j > 0) {
              div.className += "more";
            }
            if (isNaN(Number(data[i][k]))) {
              div.appendChild(document.createTextNode(data[i][k][j]));
            } else {
              div.appendChild(document.createTextNode('$'+ Number(data[i][k][j]).toLocaleString()));
            }
            td.appendChild(div);
          }
          fillWithDivs(1, maxChildrenCount, td, true);
        }
        td.style.border = '1px solid black';
      }
    }

    // create empty div elements for the table.
    function fillWithDivs(start, end, td, placehoder=false) {
      let containerDiv = document.createElement('div');

      for (let j = start; j < end; ++j) {
        let div = document.createElement('div');
        div.innerHTML += '\u00A0';
        if (placehoder) {
          div.setAttribute('class', 'less');
        }
        containerDiv.appendChild(div);
      }
      td.appendChild(containerDiv);
    }

    // Append the table to the conatiner
    for (let i = 0; i < attrs.length; ++i) {
      tablesContainer.appendChild(cols[attrs[i]]);
    }
    container.appendChild(tablesContainer);
    body.appendChild(container);

    // initially restrict to 5 columns
    if (attrs.length > 5) { showHideColumns(attrs.slice(0,5),attrs.slice(5)); }
}


/*
  get checked items
  @param:  table element
  @return: a list of selected values
*/
function getCheckedItems(table) {
  // let selectTypes = document.getElementsByClassName('select_types');
  let checked 		= [],
  		nonchecked  = [],
      fields      = table.getElementsByClassName('checkbox_field');

  for (let i = 0; i < fields.length; ++i) {
    let field = fields[i];

    if (field.checked === true) {
      checked.push(field.name);
    } else {
    	nonchecked.push(field.name);
    }
  }

  return { checked, nonchecked };
}

/*
	showHideColumns(lst, table)
  	show and hide elements based on a list
	  @param selected: a list of selected column names
  	@param table: a table element
*/
function showHideColumns(checkedCols=[], noncheckedCols=[]) {

  // get last column title and remove the dropdown.
  let lastTitle = attrs[lastIndex];
  cols[lastTitle].rows[0].cells[0].removeChild(document.getElementById('dropdown'));

  // display these selected columns
  for (let i = 0; i < checkedCols.length; ++i) {
    let colTitle = checkedCols[i],
        els 		 = document.getElementsByClassName('col_' + checkedCols[i]);
    
    for (let i = 0; i < els.length; ++i) {
      let el = els[i];
      el.style.display = 'inline';
    }
  }

  // re-attach the dropdown.
  if (checkedCols.length > 0) {
    lastTitle = checkedCols[checkedCols.length-1];
    for (let i = 0; i < attrs.length; ++i) {
      if (attrs[i] === lastTitle) {
        lastIndex = i;
        break;
      }
    }
    createCheckboxDropdown(attrs, cols[attrs[lastIndex]].rows[0].cells[0]);
  } else {
    createCheckboxDropdown(attrs);
  }

  // dont display these columns
  for (let i = 0; i < noncheckedCols.length; ++i) {
    let colTitle = noncheckedCols[i],
        els 		 = document.getElementsByClassName('col_' + noncheckedCols[i]);

    for (let i = 0; i < els.length; ++i) {
      let el = els[i];
      el.style.display = 'none';
    }
  }
}

// click event handler for options.
function moreOptionsHandler() {
	let els      = document.getElementsByClassName('more');
  let lesses   = document.getElementsByClassName('less');
  let dropdown = document.getElementById('dropdown');

  for (let i = 0; i < els.length; ++i) {
  	let el = els[i];
    el.style.display = 'block';
  }

  for (let i = 0; i < lesses.length; ++i) {
    let el = lesses[i];
    el.style.display = 'none';
  }
}

function lessOptionsHandler() {
	let mores  = document.getElementsByClassName('more');
  let lesses = document.getElementsByClassName('less');

  for (let i = 0; i < mores.length; ++i) {
  	let el = mores[i];
    el.style.display = 'none';
  }

  for (let i = 0; i < lesses.length; ++i) {
    let el = lesses[i];
    el.style.display = 'block';
  }
}

/**
  createCheckboxDropdown()
  @param lst: a list of attributes in data.
  @param element: an element that dropdown will be attached to.
**/
function createCheckboxDropdown(lst, element=undefined) {
  let wrapper         = document.createElement('div'),
  		selectTable     = document.createElement('table'),
  		dropdownBtn     = document.createElement('button'),
      dropdownContent = document.createElement('div'),
      btn             = document.createElement('button'),
      len             = lst.length;

	wrapper.setAttribute('id', 'dropdown');

  dropdownBtn.setAttribute('class', 'dropbtn');
  dropdownBtn.setAttribute('id', 'dropbtn');
  dropdownBtn.innerHTML = 'Dropdown';

  dropdownContent.setAttribute('id', 'myDropdown');
  dropdownContent.setAttribute('class', 'dropdown-content');

  btn.innerHTML = 'Magic!';
  btn.setAttribute('id', 'apply');
  selectTable.setAttribute('id', 'select_types');

  for (let i = 0; i < len; ++i) {
    let row   = selectTable.insertRow();
    let cell  = row.insertCell(),
        input = document.createElement('input'),
        label = document.createElement('label');

    input.setAttribute('class', 'checkbox_field');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', lst[i]);
    label.innerHTML = lst[i];
    cell.appendChild(input);
    cell.appendChild(label);
  }

  dropdownContent.appendChild(selectTable);
  dropdownContent.appendChild(btn);
  wrapper.appendChild(dropdownBtn);
	wrapper.appendChild(dropdownContent);

  btn.addEventListener("click", closeDropdown);
  dropdownBtn.addEventListener("click", showDropdown);

  if (element === undefined) {
    document.body.appendChild(wrapper);
  } else {
    element.appendChild(wrapper);
  }
}

// click event handler for dropdowns.
function showDropdown()  { document.getElementById("myDropdown").classList.add("show"); }

function closeDropdown() {
  let { checked, nonchecked } = getCheckedItems(document.getElementById('select_types'));

  if (0 < checked.length && checked.length < 6) {
    showHideColumns(checked, nonchecked);
  }
  if (checked.length > 5) {
    alert('You have exceeded 5 maxmium selections! Please, select again.');
  }
  document.getElementById("myDropdown").classList.remove('show');
}

// Function calls
createTable(DATA['data']);

document.getElementById("more-options").addEventListener("click",moreOptionsHandler);
document.getElementById("less-options").addEventListener("click",lessOptionsHandler);

//https://jsfiddle.net/qpjhd0xr/25/
//https://jsfiddle.net/7jnb7vvv/26/
