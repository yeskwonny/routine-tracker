import { gql } from "@apollo/client";

export const GET_ITEMS = gql`
  query GetItems {
    items {
      id
      name
      cycleDays
      lastReplacedAt
    }
  }
`;

export const ADD_ITEM = gql`
  mutation AddItem($name: String!, $cycleDays: Int!, $lastReplacedAt: String!) {
    addItem(
      name: $name
      cycleDays: $cycleDays
      lastReplacedAt: $lastReplacedAt
    ) {
      id
      name
      cycleDays
      lastReplacedAt
    }
  }
`;

export const UPDATE_ITEM = gql`
  mutation UpdateItem(
    $id: String!
    $name: String!
    $cycleDays: Int!
    $lastReplacedAt: String!
  ) {
    updateItem(
      id: $id
      name: $name
      cycleDays: $cycleDays
      lastReplacedAt: $lastReplacedAt
    ) {
      id
      name
      cycleDays
      lastReplacedAt
    }
  }
`;

export const DELETE_ITEM = gql`
  mutation DeleteItem($id: String!) {
    deleteItem(id: $id) {
      id
      name
      cycleDays
      lastReplacedAt
    }
  }
`;
