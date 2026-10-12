import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Plus, Minus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const CustomizeModal = ({ isOpen, onClose, food, restaurant, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [specialNote, setSpecialNote] = useState('');

  useEffect(() => {
    if (food) {
      setQuantity(1);
      setSpecialNote('');
      // Initialize default selections
      const initial = {};
      if (food.customization && Array.isArray(food.customization)) {
        food.customization.forEach((group) => {
          if (group.options && group.options.length > 0) {
            initial[group.name] = group.options[0]; // pick first option by default
          }
        });
      }
      setSelectedOptions(initial);
    }
  }, [food, isOpen]);

  if (!food) return null;

  const handleOptionChange = (groupName, option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupName]: option
    }));
  };

  // Calculate current unit price with chosen options
  const extraTotal = Object.values(selectedOptions).reduce((sum, opt) => sum + (opt?.price || 0), 0);
  const unitPrice = food.price + extraTotal;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const formattedSelections = Object.entries(selectedOptions).map(([groupName, opt]) => ({
      name: groupName,
      selected: opt.label,
      price: opt.price || 0
    }));

    onConfirm({
      food,
      quantity,
      selectedCustomizations: formattedSelections,
      restaurant,
      note: specialNote
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Customize ${food.name}`}
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Quantity Selector */}
          <div className="qty-counter">
            <button
              className="qty-btn"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              <Minus size={15} />
            </button>
            <span className="qty-val">{quantity}</span>
            <button
              className="qty-btn"
              onClick={() => setQuantity((q) => q + 1)}
            >
              <Plus size={15} />
            </button>
          </div>

          <button className="btn btn-primary" onClick={handleAdd}>
            Add to Order • {formatCurrency(totalPrice)}
          </button>
        </div>
      }
    >
      <div>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
          {food.image && (
            <img
              src={food.image}
              alt={food.name}
              style={{ width: '90px', height: '90px', borderRadius: '10px', objectFit: 'cover' }}
            />
          )}
          <div>
            <div className={`food-veg-indicator ${food.isVeg ? 'veg' : 'non-veg'}`} />
            <h4 style={{ fontSize: '1.1rem' }}>{food.name}</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>{food.description}</p>
            <div style={{ fontWeight: 700, marginTop: '4px', color: '#ff5621' }}>Base {formatCurrency(food.price)}</div>
          </div>
        </div>

        {/* Customization Groups */}
        {food.customization && food.customization.length > 0 ? (
          food.customization.map((group, idx) => (
            <div key={idx} style={{ marginBottom: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{group.name}</span>
                <span style={{ fontSize: '0.75rem', color: '#ff5621', fontWeight: 600 }}>REQUIRED</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {group.options.map((option, oIdx) => {
                  const isSelected = selectedOptions[group.name]?.label === option.label;
                  return (
                    <label
                      key={oIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                        background: isSelected ? 'var(--primary-light)' : '#fff',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <input
                          type="radio"
                          name={`group_${idx}`}
                          checked={isSelected}
                          onChange={() => handleOptionChange(group.name, option)}
                          style={{ accentColor: 'var(--primary)' }}
                        />
                        <span style={{ fontSize: '0.9rem', fontWeight: isSelected ? 600 : 400 }}>{option.label}</span>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: isSelected ? 'var(--primary)' : '#64748b', fontWeight: 600 }}>
                        {option.price > 0 ? `+${formatCurrency(option.price)}` : 'Free'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '1rem 0' }}>No extra customizations available for this item.</p>
        )}

        {/* Special Instructions */}
        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <label className="form-label">Special Cooking Instructions (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Less spicy, dressing on the side, extra cutlery"
            value={specialNote}
            onChange={(e) => setSpecialNote(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CustomizeModal;
