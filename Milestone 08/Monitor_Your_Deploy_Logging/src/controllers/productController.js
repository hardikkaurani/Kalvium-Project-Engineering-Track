import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    // STEP 8 DIAGNOSIS:
    // The query below uses req.query.category. If category is missing in URL,
    // it becomes { category: undefined }, which filters out all products.
    // We should only filter if the category is provided.
    
    const query = {};
    if (req.query.category) {
      query.category = req.query.category;
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    // STEP 4: Add error logging
    console.error('API Error (/api/products):', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
