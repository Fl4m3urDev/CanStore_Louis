// recuperation de l'ID "searchTerm" qui fera appel à la fonction autocompleteMatch ayant un évènement raccordé.

document.getElementById('searchTerm').addEventListener("keyup", function (event) {
    autocompleteMatch(event)
});

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
            console.log('La demande de requête pour produits.php a échoué ' + response.status + ': ' + response.statusText);
        }
    });
}

/* La Fonction "traiterReponse" permettant de traiter la réponse de la saisi effectué précédement en affichant
les termes proposé et écrit dans la base php  */

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

// déclanche category
category.addEventListener('change', function (event) {
    event.preventDefault();
    document.forms[0].submit();
});

// déclanche nutriscore
nutriscore.addEventListener('change', function (event) {
    event.preventDefault();
    document.forms[0].submit();
});

// déclanche searchTerm
searchTerm.addEventListener('change', function (event) {
    event.preventDefault();
    document.forms[0].submit();
});

// RESET
document.getElementById("searchBtn").addEventListener('click', function (event) {
    event.preventDefault();
    document.forms[0].category.selectedIndex = 0;
    document.forms[0].nutriscore.selectedIndex = 0;
    document.forms[0].searchTerm.value = "";
    document.forms[0].submit();
});

/* fonction permettant d'ajouter les produits aux paniers grâce à cette variable "nbProduits"
servant à compter tous les produits selectionné. */

function ajouterPanier() {
    document.forms[0].addpanier.value = "1";
    document.forms[0].submit();
    console.log(addpanier);
}

/* fonction (Annexe) permettant de supprimer tous les produits ajouté auparavant
grâce à la fonction "ajouterPanier" qui a servi a compté les produits ajouté au panier. */

function videPanier() {
    document.forms[0].deletepanier.value.submit() = "0";
    document.forms[0].submit();
}