// src/app/components/homeAdmin/category/categoryqueries.ts
import { gql } from '@apollo/client';

const GET_CATEGORIES = gql`
    query getCategories {  
        categories{
            id
            name
            description
            image
            
        }
    }
`;

const GET_CATEGORY = gql`
    query getCategory($id: ID!) {
        category(id: $id) {    
          
            id
            name
            description
            image
        }
    }
`;


export { GET_CATEGORIES, GET_CATEGORY };