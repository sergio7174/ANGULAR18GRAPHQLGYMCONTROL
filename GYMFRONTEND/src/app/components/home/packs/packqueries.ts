// src/app/components/home/packs/packqueries.ts
import { gql } from '@apollo/client';

const GET_PACKS = gql`
    query getPacks {  
        packs{
            id
            nameplan
            trialdays
            description
            features
            timedays
            image
            cost
            code
            status
            
        }
    }
`;

const GET_PACK = gql`
    query getPack($id: ID!) {
        pack(id: $id) {    
            id
            nameplan
            trialdays
            description
            features
            timedays
            image
            cost
            code
            status
            
        }
    }
`;


export { GET_PACKS, GET_PACK };