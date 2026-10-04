import { gql } from "@apollo/client";
export const SAVE_SUBSCRIPTION = gql`
  mutation SaveSubscription(
    $endpoint: String!
    $p256dh: String!
    $auth: String!
  ) {
    saveSubscription(endpoint: $endpoint, p256dh: $p256dh, auth: $auth)
  }
`;
