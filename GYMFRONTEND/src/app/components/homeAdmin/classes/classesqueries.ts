import { gql } from '@apollo/client';

const GET_CLASSES = gql`
    query GetClasses {  
          classes{
            id
            classname
            code
            classday
            classtime
            classlevel
            session_time
            price
            trainer
            key_benefits
            expert_trainer
            class_overview
            why_matters
            image
            dateBegin
           
           
          }
    }
`;

const GET_CLASSE = gql`
    query GetClasse($id: ID!) {
        classe(id: $id) {
            id
            classname
            code
            classday
            classtime
            classlevel
            session_time
            price
            trainer
            key_benefits
            expert_trainer
            class_overview
            why_matters
            image
            dateBegin
            
        }
    }
`;


export { GET_CLASSES, GET_CLASSE };