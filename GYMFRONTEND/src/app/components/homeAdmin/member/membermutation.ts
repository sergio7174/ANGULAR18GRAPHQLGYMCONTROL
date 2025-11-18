// app/components/homeAdmin/MEMBER/MEMBERmutations.ts
import { gql } from '@apollo/client';

const ADD_MEMBER = gql`
        mutation addMEMBER(
            $nameplan:    String!, 
            $trialdays:   Number!, 
            $description: String!, 
            $features:    String!,
            $timedays:    Number!,
            $cost:        Number!,
            $code:        String!,
            $status:      String!,
            $image:       String!) {
            addMEMBER(
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
                features
                

            }
        }`;

const VERIFY_MEMBER = gql`
        mutation verifyMEMBER($code: String!) {
            verifyMEMBER(code: $code) {
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

const DELETE_MEMBER = gql`
    mutation DeleteMEMBER($id: ID!) {
        deleteMEMBER(id: $id) {
            id
        }
    }
`;

const UPDATE_MEMBER = gql`
    mutation updateMEMBER(
            $id:          ID!, 
            $nameplan:    String!, 
            $trialdays:   Number!, 
            $description: String!, 
            $features:    String!,
            $timedays:    Number!,
            $cost:        Number!,
            $code:        String!,
            $status:      MEMBERStatusUpdate!,
            $image:       String! 
       ) {
        updateMEMBER(
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
                features
                timedays
                cost
                code
                status
                image 
            }
    }
`;

export { ADD_MEMBER, VERIFY_MEMBER, DELETE_MEMBER, UPDATE_MEMBER };