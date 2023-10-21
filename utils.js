function itemsMapper(response, categories){
  return {
    query: response.data.query,
    categories,
    items: response.data.results.map((result) => ({
      id: result.id,
      title: result.title,
      price: {
        currency: result.currency_id,
        amount: result.price.toString().includes('.') 
          ? Number(result.price.toString().split('.')[0]) 
          : result.price,
        decimals: result.price.toString().includes('.') 
          ? Number(result.price.toString().split('.')[1]) 
          : 0
      },
      picture_url: result.thumbnail,
      condition: result.condition,
      free_shipping: result.shipping.free_shipping,
      city: result.address.city_name
    }))
  }
}

function productMapper(categories, productData, description){
  return {
    categories,
    items: {
      id: productData.id,
      title: productData.title,
      price: {
        currency: productData.currency_id,
        amount: productData.price.toString().includes('.') 
          ? Number(productData.price.toString().split('.')[0]) 
          : productData.price,
        decimals: productData.price.toString().includes('.') 
          ? Number(productData.price.toString().split('.')[1]) 
          : 0
      },
      picture_url: productData.pictures[0].url,
      condition: productData.condition,
      free_shipping: productData.shipping.free_shipping,
      sold_qty: productData.sold_quantity,
      description
    }
  }
}

module.exports = {
  itemsMapper,
  productMapper
}