<?php
session_start();
include('produits_tri.php');
if (empty($_POST)) {
  $_POST['category'] = 'Tous';
  $_POST['nutriscore'] = 'Tous';
  $_POST['searchTerm'] = '';
}
?>
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Au jardin de Louis</title>
  <link rel="icon" type="image/png" href="icons/LeFeuDeLaMort.png">
  <link href="https://fonts.googleapis.com/css?family=Cherry+Swash|Raleway" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
  <link href="can-style.css" rel="stylesheet">
  <!--[if lt IE 9]>
      <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
</head>

<body class="m-0 bg-info bg-opacity-50">
  <header class="d-flex p-2 border border-start-0 border-dark bg-success bg-opacity-50 text-dark">
    <h1 class="text-center text-success w-100 pr-5 pl-5">Au jardin en boite</h1>
  </header>
  <div class="d-flex flex-column">
    <aside class="d-flex flex-row p-2 pb-4 bg-warning bg-opacity-50 border border-top-0 border-dark text-dark">
      <form class="d-flex flex-row w-100" method="post">
        <div class="d-flex flex-column me-2">
          <label class="mb-1" for="category">Choisissez une catégorie :</label>
          <select class="py-3 text-warning bg-success" id="category" name="category">
            <option <?php if ($_POST['category'] == 'Tous') {
                      echo 'selected';
                    } ?>>Tous</option>
            <option <?php if ($_POST['category'] == 'Legumes') {
                      echo 'selected';
                    } ?>>Legumes</option>
            <option <?php if ($_POST['category'] == 'Viande') {
                      echo 'selected';
                    } ?>>Viande</option>
            <option <?php if ($_POST['category'] == 'Soupe') {
                      echo 'selected';
                    } ?>>Soupe</option>
          </select>
        </div>
        <div class="d-flex flex-column me-2">
          <label class="mb-1" for="nutriscore">Choisissez un nutriscore :</label>
          <select class="py-3 text-warning bg-success" id="nutriscore" name="nutriscore">
            <option <?php if ($_POST['nutriscore'] == 'Tous') {
                      echo 'selected';
                    } ?>>Tous</option>
            <option class="nutriscore_A" <?php if ($_POST['nutriscore'] == 'A') {
                                            echo 'selected';
                                          } ?>>A</option>
            <option class="nutriscore_B" <?php if ($_POST['nutriscore'] == 'B') {
                                            echo 'selected';
                                          } ?>>B</option>
            <option class="nutriscore_C" <?php if ($_POST['nutriscore'] == 'C') {
                                            echo 'selected';
                                          } ?>>C</option>
            <option class="nutriscore_D" <?php if ($_POST['nutriscore'] == 'D') {
                                            echo 'selected';
                                          } ?>>D</option>
            <option class="nutriscore_E" <?php if ($_POST['nutriscore'] == 'E') {
                                            echo 'selected';
                                          } ?>>E</option>
          </select>
        </div>
        <div class="d-flex flex-column me-2">
          <label class="mb-1" for="searchTerm">Entrez le terme de recherche :</label>
          <input class="py-3 text-warning bg-success" type="text" name="searchTerm" id="searchTerm" list="listeValeurs" placeholder="Exemple : haricots" <?php if ($_POST['searchTerm'] !== '') {
                                                                                                                                                            echo 'value="' . $_POST['searchTerm'] . '"';
                                                                                                                                                          } ?>>
          <datalist id="listeValeurs">
          </datalist>
        </div>
        <div class="d-flex me-2">
          <button id="searchBtn" type="button" class="mt-4 py-3 px-5 text-warning bg-success rounded-4">Reset</button>
        </div>
      </form>
      <div class="d-flex gap-2 justify-content-end">
        <img src="icons/panier.png" class="d-inline-block align-text-top" width="45" height="45" alt="panier">
      </div>
      <div class="d-flex gap-2 justify-content-end">
        <input name="deletepanier" id="panier" class="text-danger" type="hidden" value="0" onclick="viderPanier()">
      </div>
    </aside>
    <main class="d-flex flex-row flex-wrap justify-content-around p-3 col-12">
      <?php
      if ($select->rowCount() == 0) {
        echo '<span class="none">Aucun de résultat pour cette recherche</span>';
      } else {
        // Parcours des enregistrements retournés par la requête

        while ($enregistrement = $select->fetch()) { ?>
          <!-- Affichage des produits -->
          <section class="' mb-4 card <?php echo $enregistrement->type; ?> '">
            <h2 class="d-flex justify-content-center mt-1 fs-6 text-warning"><?php echo ucfirst($enregistrement->nom); ?></h2>
            <p class="d-flex card position-absolute text-warning p-3 px-2 mt-4 bg-success border border-warning rounded-circle"><?php echo number_format($enregistrement->prix, 2, ','); ?>€</p>
            <img class="mb-2" src="images/<?php echo $enregistrement->image ?>" alt=" <?php echo $enregistrement->nom ?> ">
            <button name="addpanier" id="panier" class="d-grid w-75 mx-auto p-3 text-center btn btn-outline-dark bg-warning" onclick="ajouterPanier()">Acheter</button>
            <h3 class="fs-5 text-warning text-center ms-1 mt-3">Nutriscore :
              <span id="color-nutriscore" class="' d-inline rounded-pill p-1 text-dark <?php echo $enregistrement->nutriscore ?> '"><?php echo $enregistrement->nutriscore ?></span>
            </h3>
          </section>
      <?php
        }
      }
      ?>
    </main>
  </div>
  <footer class="p-2 border border-start-0 border-dark bg-info">
    <p><a href="https://github.com/NTT2023/TP_Canstore">TP BOUTIQUE (AJAX – JSON)</a>

      A partir des fichiers du repository, vous êtes chargé de :<br>
    <ol>
      <li class="lh-base">Après lecture du code, remplacer les commentaires du JS pour une meilleure compréhension (plus
        succints et en français) puis adapter la page html pour le public
        français. La boutique s’appellera : "Au jardin en boite".</li>
      <li class="lh-base"> La méthode d’accès aux images est : function fetchBlob(product). Supprimer cette fonction
        puis utiliser
        l’url de l’image transmise par le JSON pour paramétrer l’attribut « src » des images dans la function
        showProduct(objectURL, product) qui ne prendra donc plus qu’un argument « product ».</li>
      <li class="lh-base"> Adapter le script pour faire fonctionner la page de présentation des produits avec le fichier
        JSON joint : «
        produits.json ». La loi Française oblige le vendeur à afficher le « nutri-score » du produit. Mettre en œuvre
        cet ajout.
      </li>
      <li class="lh-base">Le client souhaite un nouveau look plus moderne, nature et une page responsive…</li>
    </ol>
    </p>
  </footer>
  <script>
    // recuperation de l'ID "searchTerm" qui fera appel à la fonction autocompleteMatch ayant un évènement raccordé.

    document.getElementById('searchTerm').addEventListener("keyup", function(event) {
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
      fetch('produits.php').then(function(response) {
        if (response.ok) {
          response.json().then(function(json) {
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
    category.addEventListener('change', function(event) {
      event.preventDefault();
      document.forms[0].submit();
    });

    // déclanche nutriscore
    nutriscore.addEventListener('change', function(event) {
      event.preventDefault();
      document.forms[0].submit();
    });

    // déclanche searchTerm
    searchTerm.addEventListener('change', function(event) {
      event.preventDefault();
      document.forms[0].submit();
    });

    // RESET
    document.getElementById("searchBtn").addEventListener('click', function(event) {
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
  }

  /* fonction (Annexe) permettant de supprimer tous les produits ajouté auparavant
  grâce à la fonction "ajouterPanier" qui a servi a compté les produits ajouté au panier. */

  function videPanier() {
    document.forms[0].deletepanier.value.submit() = "0";
    document.forms[0].submit();
  }
  </script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3" crossorigin="anonymous"></script>

</body>

</html>