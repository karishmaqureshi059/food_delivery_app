import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import CustomizeModal from './CustomizeModal';

const FoodCard = ({ food, restaurant }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  // Check if any variant of this food is in cart
  const cartMatches = cartItems.filter((item) => item.foodId === (food._id || food.id));
  const totalQuantityInCart = cartMatches.reduce((sum, item) => sum + item.quantity, 0);

  const hasCustomizations = food.customization && food.customization.length > 0;

  const handleAddClick = () => {
    if (hasCustomizations) {
      setIsCustomizeOpen(true);
    } else {
      addToCart(food, 1, [], restaurant);
    }
  };

  const handleIncrement = () => {
    if (hasCustomizations) {
      setIsCustomizeOpen(true);
    } else if (cartMatches.length > 0) {
      updateQuantity(cartMatches[0].cartItemId, 1);
    } else {
      addToCart(food, 1, [], restaurant);
    }
  };

  const handleDecrement = () => {
    if (cartMatches.length > 0) {
      updateQuantity(cartMatches[0].cartItemId, -1);
    }
  };

  return (
    <>
      <div className="food-card">
        <div className="food-details">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`food-veg-indicator ${food.isVeg ? 'veg' : 'non-veg'}`} />
            {food.isPopular && (
              <span className="badge badge-warning" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                ★ Bestseller
              </span>
            )}
          </div>

          <h4 className="food-name">{food.name}</h4>
          <div className="food-price">{formatCurrency(food.price)}</div>
          <p className="food-desc">{food.description}</p>
        </div>

        <div className="food-img-container">
          <img
            src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300'}
            alt={food.name}
            className="food-img"
            loading="lazy"
          />

          <div className="food-btn-wrap">
            {totalQuantityInCart > 0 && !hasCustomizations ? (
              <div className="qty-counter" style={{ width: '100%', justifyContent: 'space-between' }}>
                <button className="qty-btn" onClick={handleDecrement}>
                  <Minus size={14} />
                </button>
                <span className="qty-val">{totalQuantityInCart}</span>
                <button className="qty-btn" onClick={handleIncrement}>
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary btn-sm btn-block"
                style={{
                  background: '#fff',
                  color: 'var(--primary)',
                  border: '1.5px solid var(--primary)',
                  boxShadow: 'var(--shadow-sm)'
                }}
                onClick={handleAddClick}
              >
                ADD {hasCustomizations ? '+' : ''}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Customization Modal */}
      {hasCustomizations && (
        <CustomizeModal
          isOpen={isCustomizeOpen}
          onClose={() => setIsCustomizeOpen(false)}
          food={food}
          restaurant={restaurant}
          onConfirm={({ food, quantity, selectedCustomizations, restaurant }) => {
            addToCart(food, quantity, selectedCustomizations, restaurant);
          }}
        />
      )}
    </>
  );
};

export default FoodCard;
