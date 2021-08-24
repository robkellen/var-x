import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { useStaticQuery, graphql } from "gatsby"

export default function PromotionalProducts() {
  const data = useStaticQuery(graphql`
    query getPromo {
      allStrapiProduct(filter: { promo: { eq: true } }) {
        edges {
          node {
            name
            strapiId
            description
            variants {
              images {
                url
              }
            }
          }
        }
      }
    }
  `)
  console.log(data)
  return <div>Promo Products</div>
}
