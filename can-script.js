// la variable "products" va contenir tous les produits (ce dont on a besoin).

var products;

// ajout du fichier json dans la variable "products".

// la fonction "fetch" permet d'appeler le fichier (JSON) et permet d'eviter les erreurs.

fetch('produits.json').then(function (response) {
  if (response.ok) {
    response.json().then(function (json) {
      products = json;
      initialize();
    });
  } else {
    console.log('La demande de requête pour produits.json a échoué ' + response.status + ': ' + response.statusText);
  }
});

// fonction principal permettant d'initialiser les produits y compris la recherche et le filtrage...

function initialize() {

  // déclaration de variables sur les elements modifiable (comme le filtre) de la page.

  var category = document.querySelector('#category');
  var nutriscore = document.querySelector('#nutriscore');
  var searchTerm = document.querySelector('#searchTerm');
  var searchBtn = document.querySelector('button');
  var main = document.querySelector('main');

  var lastCategory = category.value;
  var lastnutriscore = nutriscore.value;
  var lastSearch = '';
  var categoryGroup = [];
  var finalGroup = [];
  finalGroup = products;

  // voir ci-dessous

  updateDisplay();

  // La recherche au click sur le bonton afficher qui appelle "selectCategory".

  searchBtn.onclick = selectCategory; 

  // Les elements seront encapsulé dans la variable "categoryGroup" puis dans les conditions des filtres.

  function selectCategory(e) {
    e.preventDefault();
    categoryGroup = [];
    finalGroup = [];

      lastnutriscore = nutriscore.value
      lastCategory = category.value;
      lastSearch = searchTerm.value.trim();

      // Condition permettant de filtrer les produits selon la catégorie choisi.

      var lowerCaseType = category.value.toLowerCase();
      for (var i = 0; i < products.length; i++) {
        if (products[i].type === lowerCaseType || category.value === 'Tous') {
          if (products[i].nutriscore === lastnutriscore || lastnutriscore === 'Tous'){
            categoryGroup.push(products[i]);
          }
        }
      }
        selectProducts();
  }

  /* La fonction "selectProducts" est semi-inutile car il renvoit les elements vers la fonction "updateDisplay"
  afin de les afficher correctement */

  function selectProducts() {
    if (searchTerm.value.trim() === '') {
      finalGroup = categoryGroup;
      updateDisplay();
    } else {
      var lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();

      for (var i = 0; i < categoryGroup.length; i++) {
        if (categoryGroup[i].nom.indexOf(lowerCaseSearchTerm) !== -1) {
          finalGroup.push(categoryGroup[i]);
        }
      }
      updateDisplay();
    }
  }

  /* fonction permettant de vider et mettre à jour les éléments affiché
  puis envoit des nouveaux elements vers la fonction "showProduct". */

  function updateDisplay() {
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }

    // Condition permettant de visualiser si le produit recherché existe puis de melanger les produits sinon.

    if (finalGroup.length === 0) {
      var para = document.createElement('p');
      para.textContent = 'Aucun résultat à afficher !';
      main.appendChild(para);
    } else {
      MelangeTableau(finalGroup)
      for (var i = 0; i < finalGroup.length; i++) {
        showProduct(finalGroup[i]);
      }
    }
  }

  // fonction permettant sucessivement de melanger le positonnement des affichages des elements dans un tableaux

  function MelangeTableau(arr){
    for(var i =arr.length-1 ; i>0 ;i--){
        var j = Math.floor( Math.random() * (i + 1) );
        [arr[i],arr[j]]=[arr[j],arr[i]];
    }
  }

  // fonction permettant d'ajouter les produits dans le html.

  function showProduct(product) {

    // déclaration de variables des elements qui composera le(s) produit(s).

    var url = 'images/' + product.image;
    var section = document.createElement('section');
    var heading = document.createElement('h2');
    heading.setAttribute("class", "fs-5 text-warning text-right w-25", style="--bs-text-opacity: .5;");
    var para = document.createElement('p');
    para.setAttribute("class", "w-50 h-50 rounded-4 text-center fs-5 text-warning", style="--bs-text-opacity: .5;");
    var image = document.createElement('img');
    image.setAttribute("class", "d-block");
    var txtnutriscore = document.createElement('h3')
    txtnutriscore.setAttribute("class", "w-100 mb-1 text-warning text-center");
    var nutriscore = document.createElement('span')
    nutriscore.setAttribute("class", "text-white p-2 rounded-2");
    
    section.setAttribute('class', "w-25 h-25 mb-2", product.type);

    heading.textContent = product.nom.replace(product.nom.charAt(0), product.nom.charAt(0).toUpperCase());

    para.textContent = product.prix.toFixed(2) + ' €';

    image.src = url;
    image.alt = product.nom;

    /* variable "nutriscore" utilisé pour creer un text sur les produits +
    Condition pour mettre en couleur les nutriscores selon la lettre y compris son évaluation. */

    nutriscore.textContent = product.nutriscore

    if (nutriscore.textContent == 'A') {
    nutriscore.style.backgroundColor = ' #196f3d'
    }
    else if (nutriscore.textContent == 'B') {
    nutriscore.style.backgroundColor = '#52be80'
    }
    else if (nutriscore.textContent == 'C') {
    nutriscore.style.backgroundColor = ' #f1c40f' 
    }
    else if (nutriscore.textContent == 'D') {
    nutriscore.style.backgroundColor = '#dc7633'
    }
    else if (nutriscore.textContent == 'E') {
    nutriscore.style.backgroundColor = '#c0392b'
    }
     
    txtnutriscore.textContent = 'Nutriscore : '

    // ces variables (défini au-dessus) permettant d'ajouter les elements du produit dans le html.
    main.appendChild(section);
    section.appendChild(heading);
    section.appendChild(para);
    section.appendChild(image);
    section.appendChild(txtnutriscore)
    txtnutriscore.appendChild(nutriscore)
  }
}