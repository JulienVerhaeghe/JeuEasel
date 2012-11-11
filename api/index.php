<?php
/**
 * Step 1: Require the Slim Framework
 *
 * If you are not using Composer, you need to require the
 * Slim Framework and register its PSR-0 autoloader.
 *
 * If you are using Composer, you can skip this step.
 */
require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

/**
 * Step 2: Instantiate a Slim application
 *
 * This example instantiates a Slim application using
 * its default settings. However, you will usually configure
 * your Slim application now by passing an associative array
 * of setting names and values into the application constructor.
 */
$app = new \Slim\Slim();

/**
 * Step 3: Define the Slim application routes
 *
 * Here we define several Slim application routes that respond
 * to appropriate HTTP request methods. In this example, the second
 * argument for `Slim::get`, `Slim::post`, `Slim::put`, and `Slim::delete`
 * is an anonymous function.
 */

// GET route
$app->get('/scores','getScore');
$app->post('/scores', 'addScore');
$app->get('/', function () {
    $template = <<<EOT
<!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8"/>
            <title>administration SCORE</title>
            
            </header>
            <h1>Administration!</h1>
            
        </body>
    </html>
EOT;
	//addScore(); fonctionne
    echo $template;
});


function getScore() {
	$sql = "SELECT `name`, `lastname`, `score`, `sexe`, `photo` FROM scores";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$score = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		
		echo json_encode($score);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}
function addScore() {
	//error_log('addScore\n', 3, '/var/tmp/php.log');
	$request = \Slim\Slim::getInstance()->request();
	$score = json_decode($request->getBody());
	
	
	
	$sql = "INSERT INTO `scores` (`name`, `lastname`, `score`, `sexe`) VALUES (:name, :lastname, :score, :sexe)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("name", $score->name);
		$stmt->bindParam("lastname", $score->lastname);
		$stmt->bindParam("score", $score->score);
		$stmt->bindParam("sexe", $score->sexe);
		
		$stmt->execute();
		
		$db = null;
		echo json_encode($score); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
	var_dump('hello workd');
}
function getConnection() {
	$dbhost="db391191129.db.1and1.com";
	$dbuser="dbo391191129";
	$dbpass="b60bf27c4d";
	$dbname="db391191129";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
		
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}
$app->run();