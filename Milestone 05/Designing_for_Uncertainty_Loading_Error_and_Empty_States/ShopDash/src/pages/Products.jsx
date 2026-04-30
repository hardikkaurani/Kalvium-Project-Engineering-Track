import React from 'react';
import { useFetch } from '../hooks/useFetch';
import { fetchProducts } from '../services/api';
import { SkeletonCard, ErrorMessage, EmptyState } from '../components/states';

function Products() {
  const { data: products, isLoading, error, refetch } = useFetch(fetchProducts);

  // 4-STATE PATTERN: Loading → Error → Empty → Data

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Products</h1>
        <SkeletonCard count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Products</h1>
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Products</h1>
        <EmptyState
          title="No products listed"
          message="Add your first product to start selling."
          actionLabel="Add Product"
          onAction={() => alert('Add product form coming soon!')}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5 hover:border-violet-500/30 transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gray-700/50 flex items-center justify-center text-xl">
                {product.image}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{product.name}</p>
                <p className="text-gray-500 text-xs">{product.category}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-700/50">
              <span className="text-lg font-bold text-emerald-400">${product.price.toFixed(2)}</span>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${
                product.stock > 0
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
