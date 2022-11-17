<?php
// header("Content-type: application/json; charset=utf-8");
// On se connecte, voir cours
try {
    $dns = 'mysql:host=localhost;dbname=jardin'; // dbname : nom de la base
    $utilisateur = 'root'; // root sur vos postes
    $motDePasse = ''; // pas de mot de passe sur vos postes
    $connexion = new PDO($dns, $utilisateur, $motDePasse);
    $connexion->exec('SET NAMES utf8');
} catch (Exception $e) {
    echo "Connexion à MySQL impossible : ", $e->getMessage();
    die();
}

// base de la requete
$requete = "SELECT * FROM produits WHERE 1+1 ";
// si une categorie existe ?! trier !
if (!isset($_POST['category'])) {
    $_POST['category']= 'Tous';
}
// si un nutriscore existe ?! trier !
if (!isset($_POST['nutriscore'])) {
    $_POST['nutriscore']= 'Tous';
}
// si un terme de recherche existe ?! trier !
if (!isset($_POST['searchTerm'])) {
    $_POST['searchTerm']= '';
}

// definition variable recuperant impérativement les posts

$category = $_POST['category'];
$nutriscore = $_POST['nutriscore'];
$searchTerm = $_POST['searchTerm'];

// Triage

if ($_POST['category'] == 'Tous' && $_POST['nutriscore'] == 'Tous' && $_POST['searchTerm'] == '') {
    $requete = "SELECT * FROM produits ORDER BY RAND() LIMIT 12";
} else {
    $requete = "SELECT * FROM produits WHERE 1=
          1 ";
    if ($category !== 'Tous') {
        $requete .= "AND type = '" . $_POST['category'] . "'";
    }
    if ($nutriscore !== 'Tous') {
        $requete .= "AND nutriscore = '" . $_POST['nutriscore'] . "'";
    }
    if ($searchTerm !== '') {
        $requete .= "AND nom Like '%" . $_POST['searchTerm'] . "%'";
    }
}

// Envoi de la requête vers MySQL
$select = $connexion->query($requete);
//recu sous forme d'un seul tableau et transformation en Json
// $produits = json_encode($select->fetchAll(PDO::FETCH_ASSOC));
$select->setFetchMode(PDO::FETCH_OBJ);
