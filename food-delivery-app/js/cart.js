// ============================================
// CART MODULE
// ============================================

const Cart = {
  // Get cart for current user
  getCart() {
    const user = Auth.getCurrentUser();
    if (!user) return [];
    const db = DB.get();
    if (!db.cart) db.cart = {};
    if (!db.cart[user.id]) db.cart[user.id] = [];
    return db.cart[user.id];
  },

  // Save cart
  saveCart(items) {
    const user = Auth.getCurrentUser();
    if (!user) return;
    const db = DB.get();
    if (!db.cart) db.cart = {};
    db.cart[user.id] = items;
    DB.save(db);
  },

  // Add item to cart
  addItem(food, quantity = 1, customization = []) {
    const user = Auth.getCurrentUser();
    if (!user) {
      Utils.toast('Please login to add items to cart', 'error');
      return false;
    }

    const cart = this.getCart();
    const existingIndex = cart.findIndex(item =>
      item.foodId === food.id &&
      JSON.stringify(item.customization) === JSON.stringify(customization)
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        foodId: food.id,
        restaurantId: food.restaurantId,
        name: food.name,
        price: food.price,
        image: food.image,
        quantity,
        customization,
        isVeg: food.isVeg
      });
    }

    this.saveCart(cart);
    Utils.toast(`${food.name} added to cart!`);
    this.updateCartBadge();
    return true;
  },

  // Update item quantity
  updateQuantity(foodId, customization, quantity) {
    const cart = this.getCart();
    const index = cart.findIndex(item =>
      item.foodId === foodId &&
      JSON.stringify(item.customization) === JSON.stringify(customization)
    );

    if (index > -1) {
      if (quantity <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = quantity;
      }
      this.saveCart(cart);
      this.updateCartBadge();
    }
  },

  // Remove item from cart
  removeItem(foodId, customization) {
    const cart = this.getCart();
    const index = cart.findIndex(item =>
      item.foodId === foodId &&
      JSON.stringify(item.customization) === JSON.stringify(customization)
    );

    if (index > -1) {
      cart.splice(index, 1);
      this.saveCart(cart);
      this.updateCartBadge();
    }
  },

  // Clear cart
  clearCart() {
    this.saveCart([]);
    this.updateCartBadge();
  },

  // Get cart total
  getTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => {
      let itemTotal = item.price * item.quantity;
      item.customization.forEach(c => {
        if (c.price) itemTotal += c.price * item.quantity;
      });
      return total + itemTotal;
    }, 0);
  },

  // Get cart item count
  getCount() {
    const cart = this.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  // Get cart item count for badge
  updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      const count = this.getCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  },

  // Get restaurant ID from cart (all items must be from same restaurant)
  getRestaurantId() {
    const cart = this.getCart();
    if (cart.length === 0) return null;
    return cart[0].restaurantId;
  },

  // Check if cart has items from different restaurant
  hasMultipleRestaurants() {
    const cart = this.getCart();
    if (cart.length <= 1) return false;
    const restaurantId = cart[0].restaurantId;
    return cart.some(item => item.restaurantId !== restaurantId);
  }
};
