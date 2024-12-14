import React from 'react'
import { useParams } from 'react-router-dom'

const SubCategory = () => {

    const {category, subcategory, productType} = useParams();

    console.log('params:', category, subcategory, productType)

  return (
    <div>

        {category}
        {subcategory}
        {productType}
      
    </div>
  )
}

export default SubCategory
