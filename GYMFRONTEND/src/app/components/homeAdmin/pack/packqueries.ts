// src/app/components/homeAdmin/pack/packqueries.ts
import { gql } from '@apollo/client';

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

export { GET_PACK };