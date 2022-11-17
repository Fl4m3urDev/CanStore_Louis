// la variable "products" va contenir tous les produits (ce dont on a besoin).

var products;

// ajout du fichier json dans la variable "products".

// la fonction "fetch" permet d'appeler le fichier (JSON) et permet d'eviter les erreurs.

fetch('produits.php').then(function (response) {
  if (response.ok) {
    response.json().then(function (json) {
      products = json;
      initialize();
    });
  } else {
    console.log('La demande de requête pour produits.json a échoué ' + response.status + ': ' + response.statusText);
  }
});

// recuperation de l'ID "searchTerm" qui fera appel à la fonction autocompleteMatch ayant un évènement raccordé.

document.getElementById('searchTerm').addEventListener("keyup", function (event) { autocompleteMatch(event) });

/* La Fonction "autocompleteMatch" permettant d'affecter la saisie des caractères écrit (récupéré sur la
  barre de saisie) puis de chercher la liste des mots complété dans la base JSON appelant aussi
  la fonction "traiterReponse" */

function autocompleteMatch(event) {
  var input = event.target;
  var saisie = input.value;
  var min_characters = 1;
  if (!isNaN(saisie) || saisie.length < min_characters) {
    return [];
  }
  fetch('produits.php').then(function (response) {
    if (response.ok) {
      response.json().then(function (json) {
        traiterReponse(json, saisie);
      });
    } else {
      console.log('La demande de requête pour produits.json a échoué ' + response.status + ': ' + response.statusText);
    }
  });
}

/* La Fonction "traiterReponse" permettant de traiter la réponse de la saisi effectué précédement en affichant
les termes proposé et écrit dans la base JSON  */

function traiterReponse(data, saisie) {
  var listeValeurs = document.getElementById('listeValeurs');
  listeValeurs.innerHTML = "";
  var reg = new RegExp(saisie, "i");
  let terms = data.filter(term => term.nom.match(reg));
  for (i = 0; i < terms.length; i++) {
    var option = document.createElement('option');
    option.value = terms[i].nom;
    listeValeurs.appendChild(option);
  }
}

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

  // fonction permettant de faire le tri des produits selectionné.

  function selectCategory(e) {
    if (e) e.preventDefault();//if : pas d'evenement au premier chargement
    var myData = new FormData(document.querySelector('form'));
    for (var x of myData) console.log(x);
    fetch('produits_tri.php', { method: "POST", body: myData }).then(function (response) {
      if (response.ok) {
        response.json().then(function (json) {
          finalGroup = json;
        });
      } else {
        console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
      }
    });

    categoryGroup = [];
    finalGroup = [];

      lastnutriscore = nutriscore.value
      lastCategory = category.value;
      lastSearch = searchTerm.value.trim();

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
      // var regex = new RegExp(categoryGroup, "i");
      // var stringSearchTerm = searchTerm.value.trim().match(regex);

      products.forEach(categoryGroup => {
      // for (var i = 0; i < categoryGroup.length; i++) {
        if (categoryGroup.nom.indexOf(lowerCaseSearchTerm) !== -1 || lowerCaseSearchTerm === '') {
          finalGroup.push(categoryGroup);
        }
      //  }
    });
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

  // fonction permettant sucessivement de melanger le positonnement des affichages des elements dans un tableaux.

  function MelangeTableau(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // Déclenchement sur le choix

  category.addEventListener('change', function (event) {
    event.preventDefault();
    document.forms[0].submit();
  });

  nutriscore.addEventListener('change', function (event) {
    event.preventDefault();
    document.forms[0].submit();
  });

  searchTerm.addEventListener('change', function (event) {
    event.preventDefault();
    document.forms[0].submit();
  });

  // RESET
  searchBtn.addEventListener('click', function (event) {
    event.preventDefault();
    initialize();
    videPanier();
    reload()
  });

  // fonction permettant d'ajouter les produits dans le html.

  function showProduct(product) {

    // déclaration de variables des elements qui composera le(s) produit(s) + style avec bootstrap.

    var url = 'images/' + product.image;
    var section = document.createElement('section');
    var heading = document.createElement('h2');
    heading.setAttribute("class", "d-flex justify-content-center mt-1 fs-6 text-warning");
    var para = document.createElement('p');
    para.setAttribute("class", "d-flex card position-absolute text-warning p-3 px-2 mt-4 bg-success border border-warning rounded-circle");
    var image = document.createElement('img');
    image.setAttribute("class", "mb-2");
    var button_acheter = document.createElement('button');
    button_acheter.setAttribute("class", "d-grid w-75 mx-auto p-3 text-center btn btn-outline-dark bg-warning")
    var txtnutriscore = document.createElement('h3')
    txtnutriscore.setAttribute("class", "fs-5 text-warning text-center ms-1 mt-3");
    var nutriscore = document.createElement('span')
    nutriscore.setAttribute("class", "d-inline rounded-pill p-1 text-dark ");

    section.setAttribute("class", product.type);
    section.classList.add("mb-4", "card");

    heading.textContent = product.nom.replace(product.nom.charAt(0), product.nom.charAt(0).toUpperCase());

    // para.textContent = product.prix.toFixed(2) + ' €';
    para.textContent = product.prix + ' €';

    image.src = url;
    image.alt = product.nom;

    button_acheter.textContent = "Acheter"

    button_acheter.addEventListener('click', function (event) {
      event.preventDefault();
      ajouterPanier();
    });

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
    section.appendChild(button_acheter);
    section.appendChild(txtnutriscore)
    txtnutriscore.appendChild(nutriscore)

  }

  /* fonction permettant d'ajouter les produits aux paniers grâce à cette variable "nbProduits"
  servant à compter tous les produits selectionné. */

  var nbProduits = 0
  var panier = document.getElementById('panier')
  panier.innerHTML = (nbProduits);
  function ajouterPanier() {
      nbProduits += 1;
      panier.innerHTML = "";
      panier.innerHTML = nbProduits;
  }

  /* fonction (Annexe) permettant de supprimer tous les produits ajouté auparavant
  grâce à la fonction "ajouterPanier" qui a servi a compté les produits ajouté au panier. */

  function videPanier() {
    nbProduits = 0
    panier.innerHTML = (nbProduits);
  }
}