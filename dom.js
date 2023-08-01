/* dom.js */

function init() {
  let element = document.getElementById("walkBtn");
  element.addEventListener("click", function () {
    walk();
  });

  element = document.getElementById("advancedWalkBtn");
  element.addEventListener("click", function () {
    advancedWalk(
      document.documentElement,
      "",
      document.querySelector("#advancedWalkOutput")
    );
  });

  element = document.getElementById("modifyBtn");
  element.addEventListener("click", function () {
    modify();
  });

  element = document.getElementById("advancedModifyBtn");
  element.addEventListener("click", function () {
    advancedModify();
  });

  element = document.getElementById("addBtn");
  element.addEventListener("click", function () {
    add();
  });

  // element = document.getElementById('removeBtn');
  // element.addEventListener('click', function () {
  //     remove();
  // });

  element = document.getElementById("safeDeleteBtn");
  element.addEventListener("click", function () {
    safeDelete();
  });

  element = document.getElementById("deleteBySelectorBtn");
  element.addEventListener("click", function () {
    deleteBySelector();
  });

  element = document.getElementById("cloneBtn");
  element.addEventListener("click", function () {
    clone();
  });

  element = document.getElementById("advancedCloneBtn");
  element.addEventListener("click", function () {
    advancedClone();
  });
}

function walk() {
  let el;
  let textArea = document.getElementById("walkOutput");

  if (textArea.value) {
    textArea.value = "";
  }

  el = document.getElementById("p1");
  showNode(el, textArea);

  el = el.firstChild;
  showNode(el, textArea);

  el = el.nextSibling;
  showNode(el, textArea);

  el = el.lastChild;
  showNode(el, textArea);

  el = el.parentNode.parentNode.parentNode;
  showNode(el, textArea);

  el = el.querySelector("section > *");
  showNode(el, textArea);
}

function advancedWalk(node, prefix, output) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    output.value += `${prefix}${node.nodeName}\n`;
    prefix = prefix.replaceAll("-", " ");
    let newPrefix = prefix + "|-- ";
    for (let i = 0; i < node.childNodes.length; i++) {
      advancedWalk(node.childNodes[i], newPrefix, output);
    }
  }
}

function showNode(el, textArea) {
  let nodeType = el.nodeType;
  let nodeName = el.nodeName;
  let nodeValue = el.nodeValue;

  textArea.value += `Node type: ${nodeType}\nNode name: ${nodeName}\nNode value: ${nodeValue}\n\n`;
  // alert(`Node type: ${nodeType}\nNode name: ${nodeName}\nNode value: ${nodeValue}`);
}

function modify() {
  let el = document.getElementById("p1");

  // You can do all the properties one by one if you know them in HTML
  el.title = "I was changed by JS";

  // you can update the style as a string
  // el.style = 'color: blue; font-size: 1em;';

  // you also may prefer to update on the CSS object.  This is the same as above
  // el.style.color = 'blue';
  // el.style.fontSize = '1em';
  // be careful doing many styles bit by bit it isn't efficent, might be easier just to set a class

  // you can also update the class list
  el.classList.add("fancy");

  // you can also update the dataset which change data-* attributes
  el.dataset.cool = "true"; // data-cool="true"
  el.dataset.coolFactor = "9000"; //data-cool-factor="9000"
}

function advancedModify() {
  let el = document.querySelector("h1");

  // https://stackoverflow.com/questions/48760274/get-all-css-root-variables-in-array-using-javascript-and-change-the-values
  let colors = Array.from(document.styleSheets)
    .filter(
      (sheet) =>
        sheet.href === null || sheet.href.startsWith(window.location.origin)
    )
    .reduce(
      (acc, sheet) =>
        (acc = [
          ...acc,
          ...Array.from(sheet.cssRules).reduce(
            (def, rule) =>
              (def =
                rule.selectorText === ":root"
                  ? [
                      ...def,
                      ...Array.from(rule.style).filter((name) =>
                        name.startsWith("--darkcolor")
                      ),
                    ]
                  : def),
            []
          ),
        ]),
      []
    );

  el.style.setProperty(
    "color",
    `var(${colors[Math.floor(Math.random() * colors.length)]})`
  );
  el.classList.add("schmancy");
}

function add() {
  // let p, em, txt1, txt2, txt3;

  // first we do things the long old-fashioned standard DOM way
  // p = document.createElement('p'); // <p></p>
  // em = document.createElement('em'); // <em></em>
  // txt1 = document.createTextNode('This is a '); // "This is a"
  // txt2 = document.createTextNode('test'); // "test"
  // txt3 = document.createTextNode(' of the DOM'); // " of the DOM"

  // p.appendChild(txt1); // <p>This is a</p>
  // em.appendChild(txt2); // <em>test</em>
  // p.appendChild(em); // <p>This is a<em>test</em></p>
  // p.appendChild(txt3); // <p>This is a<em>test</em> of the DOM</p>

  // go an insert this new copy below the old one
  // let oldP = document.getElementById('p1');
  // oldP.parentNode.insertBefore(p, oldP.nextSibling);

  // Alternative method using innerHTML and insertAdjacentHTML
  // let oldP = document.getElementById('p1');
  // oldP.insertAdjacentHTML('afterend', '<p>This is a<em>test</em> of the DOM</p>');
  // clearly short hands are pretty easy!

  let selectMenu = document.getElementById("elementType");
  let type = selectMenu.options[selectMenu.selectedIndex].label;
  let text = document.getElementById("elementContent").value;

  let output = document.getElementById("output");

  let timestamp = new Date().toLocaleString();
  text = text === "" ? `${timestamp} : New ${type}` : `${timestamp} : ${text}`;

  let newElement;

  switch (type) {
    case "Text Node":
      newElement = document.createTextNode(text);
      break;
    case "Comment":
      newElement = document.createComment(text);
      break;
    case "Element":
      newElement = document.createElement("p");
      newElement.textContent = text;
      break;
  }

  output.appendChild(newElement);
}

// function remove() {
//   document.body.removeChild(document.body.lastChild);
// }

function safeDelete() {
  let controls = document.getElementById("controls");
  let elements = document.body.getElementsByTagName("*");
  console.log(elements);
  for (let i = elements.length - 1; i >= 0; i--) {
    if (!controls.contains(elements[i])) {
      elements[i].parentNode.removeChild(elements[i]);
    }
  }
}

function deleteBySelector() {
  let selector = document.getElementById("deleteSelector").value;
  let elements = document.querySelectorAll(selector);

  elements.forEach((element) => {
    if (element.parentNode) element.parentNode.removeChild(element);
  });
}

function clone() {
  let element = document.getElementById("p1");
  let clone = element.cloneNode(true);

  let output = document.getElementById("output");
  output.appendChild(clone);
}

function advancedClone() {
  let cardTemplate = document.getElementById("cardTemplate").content;
  let cardContainer = document.getElementById("cardContainer");

  let clone = document.importNode(cardTemplate, true);

  fetch("https://api.thedogapi.com/v1/images/search", {
    headers: {
      "x-api-key": "live_ASIctxl9GPFaf012nrKaxZvIz4Cr8TBYdm1Rd8oQX7TKGXLFlvYNtyR5cm5iui89",
    },
  })
    .then((response) => response.json())
    .then((data) => {
        let dogData = data[0];
        let breed = dogData.breeds[0].name;
        let description = `Temperament: ${dogData.breeds[0].temperament}\nLife Span: ${dogData.breeds[0].life_span}`;


        clone.querySelector('.card-img').src = dogData.url;
        clone.querySelector('.card-img').alt = `Picture of ${breed}`;
        clone.querySelector('.card-title').innerHTML = `Breed: ${breed}`;
        clone.querySelector('.card-text').innerText = description;
        clone.querySelector('.card').style.backgroundColor = getRandomColor();
        clone.querySelector('.card-number').innerHTML = getRandomInt(0, 99);
        clone.querySelector('.card-link').href = dogData.url;


        cardContainer.appendChild(clone);
    })
    .catch((error) => console.error("Error:", error));
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.addEventListener("DOMContentLoaded", init);
