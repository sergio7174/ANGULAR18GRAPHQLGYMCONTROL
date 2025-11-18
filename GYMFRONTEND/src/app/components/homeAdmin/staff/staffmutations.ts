// app/components/homeAdmin/staff/staffmutations.js
import { gql } from '@apollo/client';

const ADD_TRAINER = gql`
        mutation addStaff(
            $name:    String!,
            $email:   String!,
            $id_card: String!, 
            $phone:   String!,
            $address: String!,
            $gender:  String!,
            $field:   String!,
            $age:     Int!,
            $image:   String! ) {
            addStaff(
                name:    $name,
                email:   $email,
                id_card: $id_card,
                phone:   $phone,
                address: $address,
                gender:  $gender,
                field:   $field,
                age:     $age
                image:   $image, ) {
                
                id
                
            }
        }`;

const DELETE_STAFF = gql`
    mutation DeleteStaff($id: ID!) {
        deleteStaff(id: $id) {
            id
        }
    }
`;

const VERIFY_TRAINER = gql`
        mutation verifyStaff($email: String!) {
            verifyStaff(email: $email) {
                id               
            }
        }`;
const DELETE_TRAINER_IMAGE = gql`
    mutation deleteTrainerImage($image: String!) {
        deleteTrainerImage(image: $image) {
            id
        }
    }
`;

const UPDATE_TRAINER = gql`
    mutation updateTrainer(
            $id: ID!,
            $name:    String!,
            $email:   String!,
            $id_card: String!, 
            $phone:   String!,
            $address: String!,
            $gender:  String!,
            $field:   String!,
            $age:     Int!,
            $image:   String!, 
       ) {
        updateTrainer(
                id:      $id, 
                name:    $name,
                email:   $email,
                id_card: $id_card,
                phone:   $phone,
                address: $address,
                gender:  $gender,
                field:   $field,
                age:     $age
                image:   $image,) {
                
                id
                name 
                email 
            }
    }
`;


export { ADD_TRAINER, DELETE_STAFF, VERIFY_TRAINER, DELETE_TRAINER_IMAGE, UPDATE_TRAINER };