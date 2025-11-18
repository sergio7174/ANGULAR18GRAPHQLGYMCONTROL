// app/components/homeAdmin/MEMBER/MEMBERmutations.ts
import { gql } from '@apollo/client';

const ADD_MEMBER = gql`
        mutation addMember(
            $namemember:  String!
            $client_CI:   String!,
            $email:       String!,
            $phone:       String!,
            $nameplan:    String!, 
            $timedays:    Int!,
            $cost:        Int!,
            $code:        String!,
            $status:      String!,
            $image:       String!   
            ) {
            addMember(
                namemember:  $namemember,
                client_CI:   $client_CI,
                email:       $email,
                phone:       $phone,
                nameplan:    $nameplan,
                timedays:    $timedays,
                cost:        $cost,
                code:        $code,
                status:      $status,
                image:       $image,
                ) {
           
                id
                email
               
               
            }
        }`;

        const VERIFY_MEMBER = gql`
        mutation verifyMember($email: String!) {
            verifyMember(email: $email) { id }
        }`;


export { ADD_MEMBER, VERIFY_MEMBER };