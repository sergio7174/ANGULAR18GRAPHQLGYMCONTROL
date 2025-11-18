// app/components/homeAdmin/pack/packmutations.ts
import { gql } from '@apollo/client';

const ADD_PACK = gql`
        mutation addPack($nameplan: String!, $trialdays: Int!, $description: String!, $features: String!, $timedays: Int!, $cost: Int!, $code: String!, $status: String!, $image: String! ) {
            addPack(nameplan: $nameplan, trialdays: $trialdays, description: $description,features: $features, timedays: $timedays, cost: $cost, code: $code, status: $status,image: $image ) {
                id
                nameplan 
                trialdays 
                description 
            }
        }`;


const VERIFY_PACK = gql`
        mutation verifyPack($code: String!) {
            verifyPack(code: $code) {
                id
                nameplan 
                trialdays 
                description
                features
                timedays
                cost
                code                 
            }
        }`;

const DELETE_PACK = gql`
    mutation DeletePack($id: ID!) {
        deletePack(id: $id) {
            id
        }
    }
`;

const UPDATE_PACK = gql`
    mutation updatePack(
            $id: ID!,
            $nameplan: String!, 
            $trialdays: Int!, 
            $description: String!, 
            $features: String!, 
            $timedays: Int!, 
            $cost: Int!, 
            $code: String!, 
            $status: String!, 
            $image: String! 
       ) {
        updatePack(
                id:          $id, 
                nameplan:    $nameplan, 
                trialdays:   $trialdays, 
                description: $description,
                features:    $features, 
                timedays:    $timedays, 
                cost:        $cost, 
                code:        $code, 
                status:      $status,
                image:       $image) {
                
                id
                nameplan 
                trialdays 
                description 
                
            }
    }
`;

const DELETE_PACK_IMAGE = gql`
    mutation deletePackImage($image: String!) {
        deletePackImage(image: $image) {
            id
        }
    }
`;

export { ADD_PACK, VERIFY_PACK, DELETE_PACK, DELETE_PACK_IMAGE, UPDATE_PACK };