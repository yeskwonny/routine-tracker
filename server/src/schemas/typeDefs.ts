export const typeDefs = `#graphql
  type Item {
    id: ID
    name: String
    cycleDays: Int
    lastReplacedAt: String
  }

  type Query {
    hello: String
    items: [Item]
  }

  type Mutation {
    addItem(name: String!, cycleDays: Int!, lastReplacedAt: String!): Item
    updateItem(id: ID!, name: String, cycleDays: Int, lastReplacedAt: String): Item
    deleteItem(id: ID!): Item
  }
`;
