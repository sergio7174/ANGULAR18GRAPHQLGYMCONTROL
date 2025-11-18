// app/components/home/trainers/trainersqueries.ts
import gql from 'graphql-tag';

const GET_TRAINERS = gql`
    query GetStaffs {  
          staffs{
            id
            name
            email
            age
            id_card
            phone
            address
            gender
            field
            image
            createdAt

            
          }
    }
`;

export { GET_TRAINERS };