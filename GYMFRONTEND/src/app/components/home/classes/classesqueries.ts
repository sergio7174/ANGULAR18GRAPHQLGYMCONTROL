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
            dateBegin
            image
           
          }
    }
`;

const GET_CLASS = gql`
    query GetClass($id: ID!) {
        class(id: $id) {
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
            dateBegin
            image
            createdAt
        }
    }
`;


export { GET_CLASSES, GET_CLASS };