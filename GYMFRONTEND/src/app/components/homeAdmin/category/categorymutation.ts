// app/commonents/auth/authmutations.js
import { gql } from '@apollo/client';


const ADD_CATEGORY = gql`
        mutation addCategory($name: String!, $description: String!, $image: String!) {
            addCategory(name: $name, description: $description, image: $image) {
           
                id
                name
                description
                image     
            }
        }`;

const VERIFY_CATEGORY = gql`
        mutation verifyCategory($name: String!) {
            verifyCategory(name: $name) {

                id
                name
                description
                image     
            }
        }`;

 const DELETE_CATEGORY = gql`
    mutation DeleteCategory($id: ID!) {
        deleteCategory(id: $id) {
            id
        }
    }
`;

const UPDATE_CATEGORY = gql`
    mutation updateCategory($id: ID!, $name: String!, $description: String!, $image: String!) {
        updateCategory(id: $id, name: $name, description: $description, image: $image) {
            id
            name
            description
            image
            }
    }
`;

export { ADD_CATEGORY, VERIFY_CATEGORY, DELETE_CATEGORY, UPDATE_CATEGORY };