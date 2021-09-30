const { gql } = require("apollo-server-express");

module.exports = {
  getListingsQuery: gql`
    query {
      properties(city: "Houston") {
        favoriteCount
        listingId
        listPrice
        property {
          area
          bedrooms
        }
        address {
          crossStreet
          state
          country
          postalCode
          streetName
          streetNumberText
          city
          streetNumber
          full
          unit
        }
        disclaimer
      }
    }
  `,
  markAsFavoriteMutation: gql`
    mutation {
      markAsFavorite(listingId: "49699701") {
        message
        favoriteCount
      }
    }
  `,
};
