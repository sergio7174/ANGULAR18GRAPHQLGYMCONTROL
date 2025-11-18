import { gql } from '@apollo/client';

const GET_MEMBER_BY_EMAIL = gql`
    query getMemberbe($email: String!) {
        memberByEmail(email: $email) {      
            id
            namemember
            client_CI
            email
            phone
            nameplan
            timedays
            cost
            code
            status
            imageUser
            leftdays
            finishAt
            
           
    }}
`;

const GET_MEMBER = gql`
    query getMember($email: String!) {
        member(email: $email) {    
            id
            namemember
            client_CI
            email
            phone
            nameplan
            timedays
            cost
            code
            status
            imageUser
            finishAt
            
        }
    }
`;


export { GET_MEMBER, GET_MEMBER_BY_EMAIL };