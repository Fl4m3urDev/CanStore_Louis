//premier affichage
addDonnee();


//sur le click
document.querySelector('button').addEventListener(
  'click', function (event) {
    event.preventDefault();
    addDonnee();
  });

//recup données
function addDonnee() {
  fetch('products.json').then(function (response) {
    if (response.ok) {
      response.json().then(function (json) {
        triage(json);//lancement asynchrone !!
      });
    } else {
      console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
    }
  });
}

//triage
function triage(products) {

  var lowerCaseType = document.querySelector('#category').value.toLowerCase();
  var lowerCaseSearchTerm = document.querySelector('#searchTerm').value.trim().toLowerCase();
  var finalGroup = [];

  products.forEach(product => {
    if (product.type === lowerCaseType || lowerCaseType === 'all') {//sur la categorie
      if (product.name.indexOf(lowerCaseSearchTerm) !== -1 || lowerCaseSearchTerm === '') {//sur le searchterm
        finalGroup.push(product);
      }
    }
  });

  showProduct(finalGroup);
}

//Affichage
function showProduct(finalGroup) {

  var main = document.querySelector('main');
  //vidage
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }
  // affichage propduits
  if (finalGroup.length === 0) {
    var para = document.createElement('p');
    para.textContent = 'No results to display!';
    main.appendChild(para);
  }
  else {
    finalGroup.forEach(product => {
      var section = document.createElement('section');
      var heading = document.createElement('h2');
      var para = document.createElement('p');
      var image = document.createElement('img');
      section.setAttribute('class', product.type);
      heading.textContent = product.name.replace(product.name.charAt(0), product.name.charAt(0).toUpperCase());
      para.textContent = '$' + product.price.toFixed(2);
      image.src = "images/" + product.image;
      image.alt = product.name;
      section.appendChild(heading);
      section.appendChild(para);
      section.appendChild(image);
      main.appendChild(section);
    });
  }
}