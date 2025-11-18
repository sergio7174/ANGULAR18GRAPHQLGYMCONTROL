// app/commonents/auth/authmutations.js
import { gql } from '@apollo/client';

const LOGIN_USER = gql`    
        mutation loginUser($email: String!, $password: String!) {
            loginUser(email: $email, password: $password ) {
              token
               user {
                     id
                     fullName
                     email
                     isAdmin
                     image
                 }
                
            }
        }`;

const ADD_USER = gql`
        mutation addUser($fullName: String!, $email: String!, $password: String!, $isAdmin: String!, $image: String!) {
            addUser(fullName: $fullName, email: $email, password: $password, isAdmin: $isAdmin, image: $image) {
           
                id
                fullName
                email
                isAdmin
                image     
            }
        }`;

const VERIFY_USER = gql`
        mutation verifyUser($email: String!) {
            verifyUser(email: $email) {

                id
                fullName
                email
                isAdmin
                image     
            }
        }`;

export { ADD_USER, LOGIN_USER, VERIFY_USER };