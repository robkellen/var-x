import * as React from "react"

import Layout from "../components/ui/layout"
import HeroBlock from "../components/home/HeroBlock"
import PromotionalProducts from "../components/home/PromotionalProducts"
import FeaturedProducts from "../components/home/FeaturedProducts"
import MarketingButtons from "../components/home/MarketingButtons"

const IndexPage = () => (
  <Layout>
    <HeroBlock />
    <PromotionalProducts />
    <FeaturedProducts />
    <MarketingButtons />
  </Layout>
)

export default IndexPage
