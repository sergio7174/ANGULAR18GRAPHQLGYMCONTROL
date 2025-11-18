import { gql } from '@apollo/client';

const GET_MEMBERS = gql`
    query GetMembers {  
          members{
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
            leftdays
            imageUser         
          }
    }`;

export { GET_MEMBERS };