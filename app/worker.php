<?php

use Spiral\RoadRunner;
use Nyholm\Psr7;
use GraphQL\Language\Parser;
use GraphQL\Language\Source;

include "vendor/autoload.php";
include "dbBuilder.php";
include "ORM/QueryBuilder.php";


$worker = RoadRunner\Worker::create();
$psrFactory = new Psr7\Factory\Psr17Factory();

$worker = new RoadRunner\Http\PSR7Worker($worker, $psrFactory, $psrFactory, $psrFactory);

// $test= "";
// try {
//     $dbh = new PDO('mysql:host=rr-db:3306;dbname=test_db', "root", "rootpassword", [PDO::ATTR_PERSISTENT => true]);
// } catch (PDOException $e) {
//     $test = $e->getMessage();
// }

while ($req = $worker->waitRequest()) {
    try {
        $printRow = "";
        $GLOBALS["rsp"] = $rsp = new Psr7\Response();
        // foreach($dbh->query('SELECT * from products') as $row) {
        //     $printRow = $printRow . $row["name"];
        // }
        

        // $req->getMethod() / $req->getRequestTarget() 

        if ($req->getRequestTarget() == "/queryBuilder") {
            $request =  file_get_contents("test.json");
            $databaseSchema = file_get_contents("db.json");
            $GLOBALS["database"] = json_decode($databaseSchema, true);
            $rsp->getBody()->write($request);
            $requestJSON = json_decode($request);
            foreach ($requestJSON as $thisRequest) {
                parseQuery($thisRequest);
            }
            
            // foreach($dbh->query('SELECT * from products') as $row) {
            //     $printRow = $printRow . $row["name"];
            // }
    
            // $query = new Query();
            // $query->addTable("products");
    
    
            // $rsp->getBody()->write($meta["products"]->bob());
        } else if ($req->getRequestTarget() == "/builder") {
            $reqBody = json_decode((string)$req->getBody(), true);
            $return = "";

            switch($reqBody["command"]) {
                case "explainDB": 
                    $return = DBBuilder::getDetails();
                    break;
                case "addTable": 
                    $return = DBBuilder::addTable($reqBody["data"]);
                    break; 
                case "addField": 
                    $return = DBBuilder::addField($reqBody["data"]);
                    break;   
            }

            $rsp->getBody()->write(json_encode($return));

        } else if ($req->getMethod() == "POST" && $req->getRequestTarget() == "/api") {
            $reqBody = json_decode((string)$req->getBody(), true);
            $documentNode = Parser::parse(new Source($reqBody['query'], 'GraphQL'));
            // $rsp->getBody()->write((string)$documentNode);
            $rsp->getBody()->write($documentNode->toJSON());
        } else {
            $rsp->getBody()->write(file_get_contents("/app/front/index.html"));
        }

        $worker->respond($rsp);
    } catch (\Throwable $e) {
        $errRsp = new Psr7\Response();
        $errRsp->getBody()->write($e->getMessage());
        $worker->respond($errRsp->withStatus(500));
        // $worker->getWorker()->error((string)$e->getMessage());
    }
}

function parseQuery($piece) {
    $query = new Query($piece);
    dump($query->toSQL());

}

function dump($data) {
    $data = var_export($data, true);
    $GLOBALS["rsp"]->getBody()->write($data);
}


?>