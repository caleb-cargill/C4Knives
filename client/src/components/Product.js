import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
const Product = ({ product }) => {
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.5
          }
        }
      };

    return (
        <motion.div
                  key={product._id}
                  className="bg-secondary rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  variants={itemVariants}>
            <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-64 object-cover"
            />
            <div className="p-6">
            <h3 className="text-xl font-bold mb-2 text-text">{product.name}</h3>
            <p className="text-muted mb-4 line-clamp-2">{product.description}</p>
            {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.tags.map((tag) => (
                      <span 
                        key={`${product._id}-${tag}`}
                        className="bg-complement text-gray-200 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
            <div className="flex justify-between items-center">
                <span className="text-highlight font-bold">${product.price.toFixed(2)}</span>
                <Link 
                to={`/products/${product._id}`}
                className="bg-olive hover:bg-complement text-text font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                View Details
                </Link>
            </div>
            </div>
        </motion.div>
    );
};

export default Product;