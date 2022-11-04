<?php 
header("Content-type: application/json; charset=utf-8");
// On se  connecte, voir cours
try {
    $dns = 'mysql:host=localhost;dbname=jardin'; // dbname : nom de la base
    $utilisateur = 'root'; // root sur vos postes
    $motDePasse = ''; // pas de mot de passe sur vos postes
    $connexion = new PDO( $dns, $utilisateur, $motDePasse );
    $connexion->exec('SET NAMES utf8');
  } catch (Exception $e) {
    echo "Connexion à MySQL impossible : ", $e->getMessage();
    die();
}

// Envoi de la requête vers MySQL
$select = $connexion->query("SELECT * FROM produits");
$produits = json_encode($select->fetchAll( PDO::FETCH_ASSOC ));
//$produits = json_encode( $array );

print_r ($produits);
?>