import React from 'react'
import {useStaticQuery, graphql} from "gatsby" 


export default function FeaturedProducts(){

  // query db for featured products
  const data = useStaticQuery(graphql`
  query getFeatured {
    allStrapiProduct(filter: {featured: {eq: true}}) {
      edges {
        node {
          name
          strapiId
          variants {
            price
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

  return <div>Featured Products</div>

}