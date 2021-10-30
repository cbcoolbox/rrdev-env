<?php

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\GraphQL;
use GraphQL\Type\Schema;


function api($input) {
    // create the query schema
    $queryType = new ObjectType([
        'name' => 'Query',
        'fields' => [
            'echo' => [
                'type' => Type::string(),
                'args' => [
                    'message' => Type::nonNull(Type::string()),
                ],
                'resolve' => function ($rootValue, $args) {
                    return $rootValue['prefix'] . $args['message'];
                }
            ],
        ],
    ]);
    
    // instantiate the schema
    $schema = new Schema([
        'query' => $queryType
    ]);

    $input = json_decode($input, true);
    $query = $input['query'];
    $variableValues = isset($input['variables']) ? $input['variables'] : null;

    try{
        $rootValue = ['prefix' => 'You said: '];
        $result = GraphQL::executeQuery($schema, $query, $rootValue, null, $variableValues);
        $output = $result->toArray();
    } catch (\Throwable $e) {
        throw new Exception($e);
    }
        
    return json_encode($output);
}

function graphQLToJSON($body) {
    return "hey girl heyyyyy";
}

?>