// ============================================
// MOCK DATA LAYER - LocalStorage Based
// ============================================

const DB = {
  // Initialize the database with mock data
  init() {
    if (!localStorage.getItem('fd_db')) {
      const initialData = this.getInitialData();
      localStorage.setItem('fd_db', JSON.stringify(initialData));
    }
  },

  // Get the entire database
  get() {
    return JSON.parse(localStorage.getItem('fd_db'));
  },

  // Save the entire database
  save(data) {
    localStorage.setItem('fd_db', JSON.stringify(data));
  },

  // Get a collection
  collection(name) {
    return this.get()[name] || [];
  },

  // Find by ID
  findById(collectionName, id) {
    return this.collection(collectionName).find(item => item.id === id);
  },

  // Find by field
  findByField(collectionName, field, value) {
    return this.collection(collectionName).find(item => item[field] === value);
  },

  // Filter collection
  filter(collectionName, predicate) {
    return this.collection(collectionName).filter(predicate);
  },

  // Insert into collection
  insert(collectionName, item) {
    const db = this.get();
    if (!db[collectionName]) db[collectionName] = [];
    item.id = this.generateId();
    item.createdAt = new Date().toISOString();
    db[collectionName].push(item);
    this.save(db);
    return item;
  },

  // Update item in collection
  update(collectionName, id, updates) {
    const db = this.get();
    const index = db[collectionName].findIndex(item => item.id === id);
    if (index !== -1) {
      db[collectionName][index] = { ...db[collectionName][index], ...updates, updatedAt: new Date().toISOString() };
      this.save(db);
      return db[collectionName][index];
    }
    return null;
  },

  // Delete from collection
  delete(collectionName, id) {
    const db = this.get();
    db[collectionName] = db[collectionName].filter(item => item.id !== id);
    this.save(db);
  },

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  },

  // Get initial mock data
  getInitialData() {
    return {
      users: [
        {
          id: 'user1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          password: 'password123',
          avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=ff6b35&color=fff',
          addresses: [
            { id: 'addr1', label: 'Home', street: '123 Main St', city: 'New York', state: 'NY', zip: '10001', lat: 40.7128, lng: -74.0060 },
            { id: 'addr2', label: 'Work', street: '456 Office Blvd', city: 'New York', state: 'NY', zip: '10002', lat: 40.7580, lng: -73.9855 }
          ],
          favorites: ['rest1', 'rest3'],
          notifications: true,
          isActive: true,
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: 'user2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1987654321',
          password: 'password123',
          avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=ff6b35&color=fff',
          addresses: [
            { id: 'addr3', label: 'Home', street: '789 Park Ave', city: 'Los Angeles', state: 'CA', zip: '90001', lat: 34.0522, lng: -118.2437 }
          ],
          favorites: ['rest2'],
          notifications: true,
          isActive: true,
          createdAt: '2024-02-20T14:30:00Z'
        }
      ],
      admins: [
        {
          id: 'admin1',
          name: 'Admin User',
          email: 'admin@fooddelivery.com',
          password: 'admin123',
          role: 'super_admin',
          avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=2d3436&color=fff',
          createdAt: '2024-01-01T00:00:00Z'
        }
      ],
      categories: [
        { id: 'cat1', name: 'Pizza', icon: '🍕', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200' },
        { id: 'cat2', name: 'Burger', icon: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200' },
        { id: 'cat3', name: 'Sushi', icon: '🍣', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200' },
        { id: 'cat4', name: 'Chinese', icon: '🥡', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200' },
        { id: 'cat5', name: 'Indian', icon: '🍛', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200' },
        { id: 'cat6', name: 'Desserts', icon: '🍰', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200' },
        { id: 'cat7', name: 'Beverages', icon: '🥤', image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=200' },
        { id: 'cat8', name: 'Healthy', icon: '🥗', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200' }
      ],
      restaurants: [
        {
          id: 'rest1',
          name: 'Pizza Palace',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
          coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
          description: 'Authentic Italian pizzas with fresh ingredients and wood-fired ovens.',
          cuisine: ['Italian', 'Pizza'],
          rating: 4.5,
          reviewCount: 234,
          deliveryTime: '25-35 min',
          deliveryFee: 2.99,
          minOrder: 15,
          priceRange: '$$',
          address: '123 Pizza Street, New York, NY 10001',
          lat: 40.7200,
          lng: -74.0000,
          isOpen: true,
          isApproved: true,
          isActive: true,
          categories: ['cat1', 'cat6'],
          openingHours: '10:00 AM - 11:00 PM',
          phone: '+1-555-0101'
        },
        {
          id: 'rest2',
          name: 'Burger Barn',
          image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400',
          coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
          description: 'Juicy handcrafted burgers with premium beef and secret sauces.',
          cuisine: ['American', 'Burgers'],
          rating: 4.3,
          reviewCount: 189,
          deliveryTime: '20-30 min',
          deliveryFee: 1.99,
          minOrder: 10,
          priceRange: '$',
          address: '456 Burger Ave, New York, NY 10002',
          lat: 40.7300,
          lng: -73.9900,
          isOpen: true,
          isApproved: true,
          isActive: true,
          categories: ['cat2', 'cat7'],
          openingHours: '11:00 AM - 12:00 AM',
          phone: '+1-555-0102'
        },
        {
          id: 'rest3',
          name: 'Sushi Zen',
          image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400',
          coverImage: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800',
          description: 'Fresh sushi and Japanese cuisine prepared by master chefs.',
          cuisine: ['Japanese', 'Sushi'],
          rating: 4.7,
          reviewCount: 312,
          deliveryTime: '30-40 min',
          deliveryFee: 3.99,
          minOrder: 20,
          priceRange: '$$$',
          address: '789 Sushi Lane, New York, NY 10003',
          lat: 40.7400,
          lng: -73.9800,
          isOpen: true,
          isApproved: true,
          isActive: true,
          categories: ['cat3'],
          openingHours: '12:00 PM - 10:00 PM',
          phone: '+1-555-0103'
        },
        {
          id: 'rest4',
          name: 'Dragon Wok',
          image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400',
          coverImage: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800',
          description: 'Traditional Chinese flavors with a modern twist.',
          cuisine: ['Chinese', 'Asian'],
          rating: 4.2,
          reviewCount: 156,
          deliveryTime: '25-35 min',
          deliveryFee: 2.49,
          minOrder: 12,
          priceRange: '$$',
          address: '321 Dragon St, New York, NY 10004',
          lat: 40.7500,
          lng: -73.9700,
          isOpen: true,
          isApproved: true,
          isActive: true,
          categories: ['cat4'],
          openingHours: '11:00 AM - 11:00 PM',
          phone: '+1-555-0104'
        },
        {
          id: 'rest5',
          name: 'Spice Garden',
          image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
          coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
          description: 'Authentic Indian curries and tandoori specialties.',
          cuisine: ['Indian', 'Curry'],
          rating: 4.4,
          reviewCount: 278,
          deliveryTime: '30-45 min',
          deliveryFee: 2.99,
          minOrder: 15,
          priceRange: '$$',
          address: '654 Spice Rd, New York, NY 10005',
          lat: 40.7600,
          lng: -73.9600,
          isOpen: true,
          isApproved: true,
          isActive: true,
          categories: ['cat5'],
          openingHours: '11:30 AM - 10:30 PM',
          phone: '+1-555-0105'
        },
        {
          id: 'rest6',
          name: 'Green Bowl',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
          coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
          description: 'Healthy salads, bowls, and fresh smoothies.',
          cuisine: ['Healthy', 'Salads'],
          rating: 4.6,
          reviewCount: 198,
          deliveryTime: '15-25 min',
          deliveryFee: 1.49,
          minOrder: 10,
          priceRange: '$$',
          address: '987 Health Blvd, New York, NY 10006',
          lat: 40.7700,
          lng: -73.9500,
          isOpen: true,
          isApproved: true,
          isActive: true,
          categories: ['cat8', 'cat7'],
          openingHours: '8:00 AM - 9:00 PM',
          phone: '+1-555-0106'
        }
      ],
      foods: [
        // Pizza Palace
        { id: 'food1', restaurantId: 'rest1', name: 'Margherita Pizza', description: 'Classic tomato sauce, fresh mozzarella, basil', price: 14.99, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300', category: 'cat1', isVeg: true, isAvailable: true, isPopular: true, customization: [{ name: 'Size', options: [{ label: 'Small', price: 0 }, { label: 'Medium', price: 3 }, { label: 'Large', price: 5 }] }] },
        { id: 'food2', restaurantId: 'rest1', name: 'Pepperoni Pizza', description: 'Tomato sauce, mozzarella, premium pepperoni', price: 16.99, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300', category: 'cat1', isVeg: false, isAvailable: true, isPopular: true, customization: [{ name: 'Size', options: [{ label: 'Small', price: 0 }, { label: 'Medium', price: 3 }, { label: 'Large', price: 5 }] }] },
        { id: 'food3', restaurantId: 'rest1', name: 'Garlic Bread', description: 'Toasted bread with garlic butter and herbs', price: 6.99, image: 'https://images.unsplash.com/photo-1619531040576-f9416740661b?w=300', category: 'cat1', isVeg: true, isAvailable: true, isPopular: false, customization: [] },
        { id: 'food4', restaurantId: 'rest1', name: 'Tiramisu', description: 'Classic Italian coffee-flavored dessert', price: 8.99, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300', category: 'cat6', isVeg: true, isAvailable: true, isPopular: true, customization: [] },
        // Burger Barn
        { id: 'food5', restaurantId: 'rest2', name: 'Classic Cheeseburger', description: 'Angus beef patty, cheddar, lettuce, tomato', price: 12.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300', category: 'cat2', isVeg: false, isAvailable: true, isPopular: true, customization: [{ name: 'Extras', options: [{ label: 'Extra Cheese', price: 1.5 }, { label: 'Bacon', price: 2 }, { label: 'Avocado', price: 2.5 }] }] },
        { id: 'food6', restaurantId: 'rest2', name: 'Crispy Chicken Burger', description: 'Fried chicken breast, spicy mayo, pickles', price: 11.99, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300', category: 'cat2', isVeg: false, isAvailable: true, isPopular: true, customization: [] },
        { id: 'food7', restaurantId: 'rest2', name: 'French Fries', description: 'Crispy golden fries with sea salt', price: 4.99, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300', category: 'cat2', isVeg: true, isAvailable: true, isPopular: false, customization: [] },
        { id: 'food8', restaurantId: 'rest2', name: 'Milkshake', description: 'Thick and creamy vanilla milkshake', price: 5.99, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300', category: 'cat7', isVeg: true, isAvailable: true, isPopular: false, customization: [{ name: 'Flavor', options: [{ label: 'Vanilla', price: 0 }, { label: 'Chocolate', price: 0 }, { label: 'Strawberry', price: 0 }] }] },
        // Sushi Zen
        { id: 'food9', restaurantId: 'rest3', name: 'Salmon Nigiri (8pc)', description: 'Fresh salmon over seasoned rice', price: 18.99, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300', category: 'cat3', isVeg: false, isAvailable: true, isPopular: true, customization: [] },
        { id: 'food10', restaurantId: 'rest3', name: 'Dragon Roll', description: 'Eel, avocado, cucumber, tobiko', price: 16.99, image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300', category: 'cat3', isVeg: false, isAvailable: true, isPopular: true, customization: [] },
        { id: 'food11', restaurantId: 'rest3', name: 'Miso Soup', description: 'Traditional Japanese miso with tofu', price: 4.99, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300', category: 'cat3', isVeg: true, isAvailable: true, isPopular: false, customization: [] },
        { id: 'food12', restaurantId: 'rest3', name: 'Edamame', description: 'Steamed soybeans with sea salt', price: 5.99, image: 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=300', category: 'cat3', isVeg: true, isAvailable: true, isPopular: false, customization: [] },
        // Dragon Wok
        { id: 'food13', restaurantId: 'rest4', name: 'Kung Pao Chicken', description: 'Spicy stir-fried chicken with peanuts', price: 13.99, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=300', category: 'cat4', isVeg: false, isAvailable: true, isPopular: true, customization: [] },
        { id: 'food14', restaurantId: 'rest4', name: 'Fried Rice', description: 'Wok-fried rice with vegetables and egg', price: 10.99, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300', category: 'cat4', isVeg: true, isAvailable: true, isPopular: true, customization: [{ name: 'Protein', options: [{ label: 'Vegetable', price: 0 }, { label: 'Chicken', price: 3 }, { label: 'Shrimp', price: 4 }] }] },
        { id: 'food15', restaurantId: 'rest4', name: 'Spring Rolls (4pc)', description: 'Crispy rolls with vegetable filling', price: 6.99, image: 'https://images.unsplash.com/photo-1548507200-e9e594ad29e2?w=300', category: 'cat4', isVeg: true, isAvailable: true, isPopular: false, customization: [] },
        { id: 'food16', restaurantId: 'rest4', name: 'Hot & Sour Soup', description: 'Spicy and sour soup with tofu', price: 7.99, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300', category: 'cat4', isVeg: true, isAvailable: true, isPopular: false, customization: [] },
        // Spice Garden
        { id: 'food17', restaurantId: 'rest5', name: 'Butter Chicken', description: 'Creamy tomato curry with tender chicken', price: 15.99, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300', category: 'cat5', isVeg: false, isAvailable: true, isPopular: true, customization: [{ name: 'Spice Level', options: [{ label: 'Mild', price: 0 }, { label: 'Medium', price: 0 }, { label: 'Hot', price: 0 }] }] },
        { id: 'food18', restaurantId: 'rest5', name: 'Garlic Naan', description: 'Soft bread with garlic and butter', price: 3.99, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300', category: 'cat5', isVeg: true, isAvailable: true, isPopular: true, customization: [] },
        { id: 'food19', restaurantId: 'rest5', name: 'Samosa (2pc)', description: 'Crispy pastry with spiced potato filling', price: 5.99, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300', category: 'cat5', isVeg: true, isAvailable: true, isPopular: false, customization: [] },
        { id: 'food20', restaurantId: 'rest5', name: 'Biryani', description: 'Fragrant basmati rice with spices and meat', price: 14.99, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300', category: 'cat5', isVeg: false, isAvailable: true, isPopular: true, customization: [{ name: 'Type', options: [{ label: 'Chicken', price: 0 }, { label: 'Lamb', price: 3 }, { label: 'Vegetable', price: -2 }] }] },
        // Green Bowl
        { id: 'food21', restaurantId: 'rest6', name: 'Caesar Salad', description: 'Romaine, parmesan, croutons, caesar dressing', price: 11.99, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300', category: 'cat8', isVeg: true, isAvailable: true, isPopular: true, customization: [{ name: 'Add Protein', options: [{ label: 'None', price: 0 }, { label: 'Grilled Chicken', price: 4 }, { label: 'Shrimp', price: 5 }] }] },
        { id: 'food22', restaurantId: 'rest6', name: 'Acai Bowl', description: 'Acai, granola, fresh berries, honey', price: 12.99, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=300', category: 'cat8', isVeg: true, isAvailable: true, isPopular: true, customization: [] },
        { id: 'food23', restaurantId: 'rest6', name: 'Green Smoothie', description: 'Spinach, banana, apple, almond milk', price: 7.99, image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=300', category: 'cat7', isVeg: true, isAvailable: true, isPopular: false, customization: [] },
        { id: 'food24', restaurantId: 'rest6', name: 'Quinoa Bowl', description: 'Quinoa, roasted veggies, tahini dressing', price: 13.99, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300', category: 'cat8', isVeg: true, isAvailable: true, isPopular: true, customization: [] }
      ],
      orders: [
        {
          id: 'order1',
          userId: 'user1',
          restaurantId: 'rest1',
          items: [
            { foodId: 'food1', name: 'Margherita Pizza', price: 14.99, quantity: 2, customization: [{ name: 'Size', selected: 'Medium', price: 3 }] },
            { foodId: 'food3', name: 'Garlic Bread', price: 6.99, quantity: 1, customization: [] }
          ],
          status: 'delivered',
          deliveryAddress: { label: 'Home', street: '123 Main St', city: 'New York', state: 'NY', zip: '10001' },
          paymentMethod: 'card',
          paymentStatus: 'paid',
          subtotal: 38.97,
          deliveryFee: 2.99,
          tax: 3.12,
          total: 45.08,
          deliveryPartnerId: 'partner1',
          rating: { restaurant: 5, food: 4, delivery: 5 },
          review: 'Great pizza! Fast delivery.',
          createdAt: '2024-03-10T18:30:00Z',
          deliveredAt: '2024-03-10T19:05:00Z'
        },
        {
          id: 'order2',
          userId: 'user1',
          restaurantId: 'rest2',
          items: [
            { foodId: 'food5', name: 'Classic Cheeseburger', price: 12.99, quantity: 1, customization: [{ name: 'Extras', selected: 'Bacon', price: 2 }] },
            { foodId: 'food7', name: 'French Fries', price: 4.99, quantity: 1, customization: [] }
          ],
          status: 'out_for_delivery',
          deliveryAddress: { label: 'Home', street: '123 Main St', city: 'New York', state: 'NY', zip: '10001' },
          paymentMethod: 'upi',
          paymentStatus: 'paid',
          subtotal: 19.98,
          deliveryFee: 1.99,
          tax: 1.60,
          total: 23.57,
          deliveryPartnerId: 'partner2',
          rating: null,
          review: null,
          createdAt: '2024-03-15T12:15:00Z'
        },
        {
          id: 'order3',
          userId: 'user2',
          restaurantId: 'rest3',
          items: [
            { foodId: 'food9', name: 'Salmon Nigiri (8pc)', price: 18.99, quantity: 1, customization: [] },
            { foodId: 'food11', name: 'Miso Soup', price: 4.99, quantity: 2, customization: [] }
          ],
          status: 'preparing',
          deliveryAddress: { label: 'Home', street: '789 Park Ave', city: 'Los Angeles', state: 'CA', zip: '90001' },
          paymentMethod: 'cod',
          paymentStatus: 'pending',
          subtotal: 28.97,
          deliveryFee: 3.99,
          tax: 2.32,
          total: 35.28,
          deliveryPartnerId: null,
          rating: null,
          review: null,
          createdAt: '2024-03-15T19:00:00Z'
        }
      ],
      deliveryPartners: [
        { id: 'partner1', name: 'Mike Johnson', phone: '+1-555-1001', email: 'mike@delivery.com', vehicle: 'Honda Civic', licensePlate: 'ABC-1234', status: 'online', currentOrderId: 'order2', rating: 4.8, totalDeliveries: 234, avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&color=fff&background=00b894' },
        { id: 'partner2', name: 'Sarah Wilson', phone: '+1-555-1002', email: 'sarah@delivery.com', vehicle: 'Toyota Corolla', licensePlate: 'XYZ-5678', status: 'online', currentOrderId: null, rating: 4.9, totalDeliveries: 189, avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&color=fff&background=00b894' },
        { id: 'partner3', name: 'David Lee', phone: '+1-555-1003', email: 'david@delivery.com', vehicle: 'Ford Focus', licensePlate: 'DEF-9012', status: 'offline', currentOrderId: null, rating: 4.6, totalDeliveries: 156, avatar: 'https://ui-avatars.com/api/?name=David+Lee&color=fff&background=00b894' }
      ],
      reviews: [
        { id: 'rev1', userId: 'user1', orderId: 'order1', restaurantId: 'rest1', foodId: 'food1', userName: 'John Doe', userAvatar: 'https://ui-avatars.com/api/?name=John+Doe&background=ff6b35&color=fff', restaurantName: 'Pizza Palace', rating: 5, foodRating: 4, deliveryRating: 5, review: 'Great pizza! Fast delivery.', isReported: false, createdAt: '2024-03-10T20:00:00Z' },
        { id: 'rev2', userId: 'user2', orderId: 'order3', restaurantId: 'rest3', foodId: 'food9', userName: 'Jane Smith', userAvatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=ff6b35&color=fff', restaurantName: 'Sushi Zen', rating: 4, foodRating: 5, deliveryRating: 4, review: 'Fresh sushi, will order again!', isReported: false, createdAt: '2024-03-12T15:30:00Z' }
      ],
      coupons: [
        { id: 'coupon1', code: 'WELCOME20', description: '20% off on your first order', discountType: 'percentage', discountValue: 20, minOrder: 20, maxDiscount: 50, expiryDate: '2024-12-31', isActive: true, usageCount: 45, maxUsage: 100 },
        { id: 'coupon2', code: 'FREEDELIVERY', description: 'Free delivery on orders above $25', discountType: 'free_delivery', discountValue: 0, minOrder: 25, maxDiscount: 5, expiryDate: '2024-06-30', isActive: true, usageCount: 78, maxUsage: 200 },
        { id: 'coupon3', code: 'FLAT10', description: '$10 off on orders above $40', discountType: 'flat', discountValue: 10, minOrder: 40, maxDiscount: 10, expiryDate: '2024-08-15', isActive: true, usageCount: 23, maxUsage: 150 },
        { id: 'coupon4', code: 'SUMMER25', description: '25% off summer special', discountType: 'percentage', discountValue: 25, minOrder: 30, maxDiscount: 75, expiryDate: '2024-09-30', isActive: false, usageCount: 12, maxUsage: 100 }
      ],
      notifications: [
        { id: 'notif1', userId: 'user1', title: 'Order Delivered', message: 'Your order from Pizza Palace has been delivered!', type: 'order', isRead: false, createdAt: '2024-03-10T19:05:00Z' },
        { id: 'notif2', userId: 'user1', title: 'Special Offer!', message: 'Get 20% off on your next order. Use code WELCOME20', type: 'promo', isRead: true, createdAt: '2024-03-08T10:00:00Z' },
        { id: 'notif3', userId: 'user2', title: 'Order Confirmed', message: 'Your order from Sushi Zen has been confirmed.', type: 'order', isRead: false, createdAt: '2024-03-15T19:05:00Z' }
      ],
      payments: [
        { id: 'pay1', orderId: 'order1', userId: 'user1', amount: 45.08, method: 'card', status: 'success', transactionId: 'txn_001', createdAt: '2024-03-10T18:30:00Z' },
        { id: 'pay2', orderId: 'order2', userId: 'user1', amount: 23.57, method: 'upi', status: 'success', transactionId: 'txn_002', createdAt: '2024-03-15T12:15:00Z' },
        { id: 'pay3', orderId: 'order3', userId: 'user2', amount: 35.28, method: 'cod', status: 'pending', transactionId: null, createdAt: '2024-03-15T19:00:00Z' }
      ],
      cart: {}
    };
  }
};

// Initialize database on load
DB.init();
