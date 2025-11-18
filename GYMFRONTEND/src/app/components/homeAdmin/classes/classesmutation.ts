// app/commonents/auth/authmutations.js
import { gql } from '@apollo/client';

const ADD_CLASS = gql`
        mutation addClass(
            $classname:   String!, 
            $code:        String!, 
            $classday:     String!,
            $classtime:    String!,
            $classlevel:   String!,
            $trainer:      String!,
            $session_time: Int!,
            $price:        Int!,
            $dateBegin:      Date!,
            $image:        String!,
            $class_overview: String!,
            $why_matters:    String!,
            $key_benefits: String!,
            $expert_trainer: String!,
             ) {
            addClass(
                classname:      $classname,
                code:           $code,
                classday:       $classday,
                classtime:      $classtime,
                classlevel:     $classlevel,
                trainer:        $trainer,
                dateBegin:      $dateBegin,
                image:          $image,
                class_overview: $class_overview,
                why_matters:    $why_matters,
                key_benefits:   $key_benefits,
                expert_trainer: $expert_trainer,
                session_time:   $session_time,
                price:          $price,
               
                ) {
           
                id
                classname
                code                
                classday
                classtime
                classlevel
                trainer
                
            }
        }`;

const UPDATE_CLASS = gql`
    mutation updateClass(
            $id: ID!,
            $classname:   String!, 
            $code:        String!, 
            $classday:     String!,
            $classtime:    String!,
            $classlevel:   String!,
            $session_time: Int!,
            $price:        Int!,
            $trainer:      String!,
            $dateBegin:      Date!,
            $key_benefits: String!,
            $expert_trainer: String!,
            $class_overview: String!,
            $why_matters:    String!, 
            $image:          String! ) { 
            updateClass(
                id:             $id,
                classname:      $classname,
                code:           $code,
                classday:       $classday,
                classtime:      $classtime,
                classlevel:     $classlevel,
                session_time:   $session_time,
                price:          $price,
                trainer:        $trainer,
                dateBegin:      $dateBegin,
                key_benefits:   $key_benefits,
                expert_trainer: $expert_trainer,
                class_overview: $class_overview,
                why_matters:    $why_matters, 
                image:          $image          
                ) {
                id
                
                  
            }
    }
`;

const VERIFY_CLASS = gql`
        mutation verifyClass($code: String!) {
            verifyClass(code: $code) {
                id
                classname
                code     
            }
        }`;

 const DELETE_CLASS = gql`
    mutation DeleteClass($id: ID!) {
        deleteClass(id: $id) {
            id
        }
    }
`;

const DELETE_CLASS_IMAGE = gql`
    mutation deleteClassImage($image: String!) {
        deleteClassImage(image: $image) {
            id
        }
    }
`;

export { ADD_CLASS, VERIFY_CLASS, DELETE_CLASS, UPDATE_CLASS, DELETE_CLASS_IMAGE };