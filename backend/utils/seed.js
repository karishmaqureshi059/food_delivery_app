import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Food from '../models/Food.js';
import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';
import DeliveryPartner from '../models/DeliveryPartner.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';
import Payment from '../models/Payment.js';

// Realistic INR prices and rich desserts data definitions
const getINRSeedData = (adminUser, demoUser) => {
  const categoriesData = [
    { name: 'Pizza', slug: 'pizza', icon: '🍕', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300', description: 'Wood-fired & cheesy delights' },
    { name: 'Burgers', slug: 'burgers', icon: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300', description: 'Juicy, artisanal burgers' },
    { name: 'Sushi', slug: 'sushi', icon: '🍣', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300', description: 'Fresh Japanese rolls & nigiri' },
    { name: 'Chinese', slug: 'chinese', icon: '🥡', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300', description: 'Sizzling noodles and dim sums' },
    { name: 'Indian', slug: 'indian', icon: '🍛', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300', description: 'Rich curries & royal biryani' },
    { name: 'Desserts', slug: 'desserts', icon: '🍰', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300', description: 'Cakes, pastries, sweets & ice cream' },
    { name: 'Beverages', slug: 'beverages', icon: '🥤', image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=300', description: 'Refreshing shakes & coolers' },
    { name: 'Healthy', slug: 'healthy', icon: '🥗', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300', description: 'Salads, bowls and keto delights' }
  ];

  const restaurantsData = [
    {
      name: 'Pizza Palace',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
      coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000',
      description: 'Authentic Italian pizzas with fresh mozzarella, wood-fired stone oven crunch, and artisan desserts.',
      cuisine: ['Italian', 'Pizza', 'Desserts'],
      rating: 4.8,
      reviewCount: 342,
      deliveryTime: '25-35 min',
      deliveryFee: 49,
      minOrder: 199,
      priceRange: '₹₹',
      address: '12 Connaught Place, Block C, New Delhi 110001',
      phone: '+91-98110-23456',
      openingHours: '10:00 AM - 11:30 PM',
      categories: ['Pizza', 'Desserts', 'Beverages'],
      isOpen: true,
      isActive: true,
      isApproved: true,
      isVegOnly: false
    },
    {
      name: 'Burger Barn',
      image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=500',
      coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000',
      description: 'Juicy handcrafted smash burgers, golden fries, thick milkshakes, and indulgent desserts.',
      cuisine: ['American', 'Burgers', 'Desserts', 'Fast Food'],
      rating: 4.6,
      reviewCount: 289,
      deliveryTime: '20-30 min',
      deliveryFee: 39,
      minOrder: 149,
      priceRange: '₹',
      address: '45 Bandra West, Linking Road, Mumbai 400050',
      phone: '+91-98220-34567',
      openingHours: '11:00 AM - 12:00 AM',
      categories: ['Burgers', 'Desserts', 'Beverages'],
      isOpen: true,
      isActive: true,
      isApproved: true,
      isVegOnly: false
    },
    {
      name: 'Sushi Zen',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500',
      coverImage: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1000',
      description: 'Artisanal sashimi, signature sushi rolls, and delicate Kyoto green tea mochi desserts.',
      cuisine: ['Japanese', 'Sushi', 'Asian', 'Desserts'],
      rating: 4.9,
      reviewCount: 418,
      deliveryTime: '30-40 min',
      deliveryFee: 59,
      minOrder: 299,
      priceRange: '₹₹₹',
      address: '88 Indiranagar 100ft Road, Bengaluru 560038',
      phone: '+91-98330-45678',
      openingHours: '12:00 PM - 10:30 PM',
      categories: ['Sushi', 'Desserts', 'Healthy'],
      isOpen: true,
      isActive: true,
      isApproved: true,
      isVegOnly: false
    },
    {
      name: 'Dragon Wok Express',
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500',
      coverImage: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=1000',
      description: 'Smoky wok tossed noodles, authentic Schezwan dumplings, and crispy honey desserts.',
      cuisine: ['Chinese', 'Asian', 'Noodles', 'Desserts'],
      rating: 4.5,
      reviewCount: 195,
      deliveryTime: '25-35 min',
      deliveryFee: 45,
      minOrder: 199,
      priceRange: '₹₹',
      address: '22 Park Street, Kolkata 700016',
      phone: '+91-98440-56789',
      openingHours: '11:00 AM - 11:00 PM',
      categories: ['Chinese', 'Desserts'],
      isOpen: true,
      isActive: true,
      isApproved: true,
      isVegOnly: false
    },
    {
      name: 'Royal Spice Garden',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
      coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000',
      description: 'Aromatic Dum Biryani, buttery rich dal makhani, and traditional royal Indian sweets & desserts.',
      cuisine: ['Indian', 'Curry', 'Biryani', 'Desserts'],
      rating: 4.7,
      reviewCount: 380,
      deliveryTime: '30-45 min',
      deliveryFee: 49,
      minOrder: 199,
      priceRange: '₹₹',
      address: '65 Jubilee Hills, Road No. 36, Hyderabad 500033',
      phone: '+91-98550-67890',
      openingHours: '11:30 AM - 11:00 PM',
      categories: ['Indian', 'Desserts'],
      isOpen: true,
      isActive: true,
      isApproved: true,
      isVegOnly: false
    },
    {
      name: 'The Green Bowl Co.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500',
      coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000',
      description: 'Nutritious superfood salads, organic protein bowls, and guilt-free raw vegan desserts.',
      cuisine: ['Healthy', 'Salads', 'Vegan', 'Desserts'],
      rating: 4.7,
      reviewCount: 220,
      deliveryTime: '15-25 min',
      deliveryFee: 35,
      minOrder: 149,
      priceRange: '₹₹',
      address: '10 Koregaon Park, North Main Road, Pune 411001',
      phone: '+91-98660-78901',
      openingHours: '08:00 AM - 09:30 PM',
      categories: ['Healthy', 'Desserts', 'Beverages'],
      isOpen: true,
      isActive: true,
      isApproved: true,
      isVegOnly: true
    },
    {
      name: 'Sweet Tooth Patisserie & Dessert Bar',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500',
      coverImage: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1000',
      description: 'Artisanal cakes, handcrafted gourmet chocolates, decadent Belgian waffles, and French pastries.',
      cuisine: ['Desserts', 'Bakery', 'Cakes', 'Waffles'],
      rating: 4.9,
      reviewCount: 460,
      deliveryTime: '20-30 min',
      deliveryFee: 39,
      minOrder: 149,
      priceRange: '₹₹',
      address: '77 Sector 29, Gourmet Boulevard, Gurgaon 122002',
      phone: '+91-98770-89012',
      openingHours: '09:00 AM - 11:30 PM',
      categories: ['Desserts', 'Beverages'],
      isOpen: true,
      isActive: true,
      isApproved: true,
      isVegOnly: true
    }
  ];

  return { categoriesData, restaurantsData };
};

const getFoodsList = (restaurantMap) => {
  const restPizza = restaurantMap['Pizza Palace'];
  const restBurger = restaurantMap['Burger Barn'];
  const restSushi = restaurantMap['Sushi Zen'];
  const restChinese = restaurantMap['Dragon Wok Express'];
  const restIndian = restaurantMap['Royal Spice Garden'];
  const restGreen = restaurantMap['The Green Bowl Co.'];
  const restDessert = restaurantMap['Sweet Tooth Patisserie & Dessert Bar'];

  return [
    // ==================== PIZZA PALACE ====================
    {
      restaurantId: restPizza._id,
      name: 'Signature Margherita Pizza',
      description: 'Classic San Marzano tomato puree, buffalo mozzarella, fresh sweet basil & extra virgin olive oil.',
      price: 299,
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
      category: 'Pizza',
      isVeg: true,
      isAvailable: true,
      isPopular: true,
      customization: [{
        name: 'Crust & Size',
        options: [
          { label: 'Regular 10"', price: 0 },
          { label: 'Medium 12"', price: 70 },
          { label: 'Large Cheese Burst 14"', price: 130 }
        ]
      }, {
        name: 'Add-ons',
        options: [
          { label: 'Extra Buffalo Mozzarella', price: 50 },
          { label: 'Roasted Garlic Dip', price: 35 }
        ]
      }]
    },
    {
      restaurantId: restPizza._id,
      name: 'Spicy Pepperoni & Jalapeno Pizza',
      description: 'Loaded with premium crispy pepperoni, spicy pickled jalapenos, and melted gouda.',
      price: 399,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
      category: 'Pizza',
      isVeg: false,
      isAvailable: true,
      isPopular: true,
      customization: [{
        name: 'Crust & Size',
        options: [
          { label: 'Regular 10"', price: 0 },
          { label: 'Medium 12"', price: 70 },
          { label: 'Large 14"', price: 120 }
        ]
      }]
    },
    {
      restaurantId: restPizza._id,
      name: 'Herbed Garlic Breadsticks',
      description: 'Crisp outside, pillowy inside, infused with garlic butter and rosemary, served with warm marinara.',
      price: 149,
      image: 'https://images.unsplash.com/photo-1619531040576-f9416740661b?w=400',
      category: 'Pizza',
      isVeg: true,
      isAvailable: true,
      isPopular: false,
      customization: []
    },
    // Pizza Palace Desserts
    {
      restaurantId: restPizza._id,
      name: 'Italian Espresso Tiramisu',
      description: 'Authentic Venetian layers of espresso-soaked Savoiardi ladyfingers and whipped mascarpone cream dusted with cocoa.',
      price: 229,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
      category: 'Desserts',
      isVeg: true,
      isAvailable: true,
      isPopular: true,
      customization: []
    },
    {
      restaurantId: restPizza._id,
      name: 'Warm Belgian Chocolate Lava Cake',
      description: 'Molten Belgian dark chocolate heart oozing from a freshly baked soufflé sponge cake, dusted with powdered sugar.',
      price: 199,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
      category: 'Desserts',
      isVeg: true,
      isAvailable: true,
      isPopular: true,
      customization: []
    },
    {
      restaurantId: restPizza._id,
      name: 'New York Baked Cheesecake Slice',
      description: 'Rich, velvety Philadelphia cream cheese baked over a crunchy butter graham crust with sweet strawberry compote.',
      price: 249,
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400',
      category: 'Desserts',
      isVeg: true,
      isAvailable: true,
      isPopular: true,
      customization: []
    },
    {
      restaurantId: restPizza._id,
      name: 'Sicilian Pistachio Cannoli (2 pcs)',
      description: 'Crisp fried pastry shells piped with sweet ricotta cream, dark chocolate chips, and dipped in crushed Bronte pistachios.',
      price: 179,
      image: 'https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?w=400',
      category: 'Desserts',
      isVeg: true,
      isAvailable: true,
      isPopular: false,
      customization: []
    },

    // ==================== BURGER BARN ====================
    {
      restaurantId: restBurger._id,
      name: 'Truffle Angus Cheeseburger',
      description: 'Prime Angus beef patty, aged cheddar, caramelized balsamic onions, and black truffle garlic aioli.',
      price: 299,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      category: 'Burgers',
      isVeg: false,
      isAvailable: true,
      isPopular: true,
      customization: [{
        name: 'Extras',
        options: [
          { label: 'Double Patty', price: 90 },
          { label: 'Crispy Smoked Bacon', price: 50 },
          { label: 'Extra Melted Cheddar', price: 35 }
        ]
      }]
    },
    {
      restaurantId: restBurger._id,
      name: 'Nashville Hot Crispy Chicken Burger',
      description: 'Golden fried chicken breast tossed in spicy cayenne glaze, creamy coleslaw and crunchy dill pickles.',
      price: 269,
      image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400',
      category: 'Burgers',
      isVeg: false,
      isAvailable: true,
      isPopular: true,
      customization: [{
        name: 'Heat Level',
        options: [
          { label: 'Medium Spice', price: 0 },
          { label: 'Fiery Hot', price: 0 },
          { label: 'Ghost Pepper Blaster', price: 25 }
        ]
      }]
    },
    {
      restaurantId: restBurger._id,
      name: 'Seasoned Waffle Fries',
      description: 'Crispy criss-cross cut potato waffle fries seasoned with smoked paprika and Himalayan sea salt.',
      price: 129,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
      category: 'Burgers',
      isVeg: true,
      isAvailable: true,
      isPopular: false,
      customization: []
    },
    {
      restaurantId: restBurger._id,
      name: 'Salted Caramel Thickshake',
      description: 'Decadent hand-spun gelato shake with swirls of rich house-made butterscotch salted caramel.',
      price: 169,
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
      category: 'Beverages',
      isVeg: true,
      isAvailable: true,
      isPopular: true,
      customization: []
    },
    // Burger Barn Desserts
    {
      restaurantId: restBurger._id,
      name: 'Gooey Hot Fudge Brownie with Ice Cream',
      description: 'Warm, fudgy double-chocolate walnut brownie served with hot Belgian dark fudge and vanilla bean ice cream.',
      price: 189,
      image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400',
      category: 'Desserts',
      isVeg: true,
      isAvailable: true,
      isPopular: true,
      customization: []
    },
    {
      restaurantId: restBurger._id,
      name: 'Crispy Cinnamon Apple Pie Bites (4 pcs)',
      description: 'Golden flaky puff hand pies bursting with spiced Granny Smith caramelized apples and cinnamon sugar.',
      price: 149,
      image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400',
      category: 'Desserts',
      isVeg: true,
      isAvailable: true,
      isPopular: false,
      customization: []
    },
    {
      restaurantId: restBurger._id,
      name: 'Oreo Overload Waffle Sandwich',
      description: 'Crispy Belgian waffle packed with rich Oreo cream, chocolate crunch cookies, and warm milk chocolate sauce.',
      price: 199,
      image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400',
      category: 'Desserts',
      isVeg: true,
      isAvailable: true,
      isPopular: true,
      customization: []
    },

    // ==================== SUSHI ZEN ====================
    {
      restaurantId: restSushi._id,
      name: 'Atlantic Salmon Nigiri (8 pcs)',
      description: 'Pristine raw Atlantic salmon over seasoned Niigata sushi rice with freshly grated wasabi and soy.',
      price: 499,
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400',
      category: 'Sushi',
      isVeg: false,
      isAvailable: true,
      isPopular: true,
      customization: []
    },
    {
      restaurantId: restSushi._id,
      name: 'Signature Dragon Roll (8 pcs)',
      description: 'BBQ freshwater unagi eel, crisp cucumber, topped with avocado slices and savoury kabayaki glaze.',
      price: 449,
      image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400',
      category: 'Sushi',
      isVeg: false,
      isAvailable: true,
      isPopular: true,
      customization: []
    },
    {
      restaurantId: restSushi._id,
      name: 'Silken Tofu Miso Soup',
      description: 'Traditional fermented soybean dashi with wakame seaweed, silken tofu cubes and scallions.',
      price: 149,
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
      category: 'Sushi',
      isVeg: true,
      isAvailable: true,
      isPopular: false,
      customization: []
    },
    // Sushi Zen Desserts
    {
      restaurantId: restSushi._id,
      name: 'Matcha Green Tea Mochi Ice Cream (3 pcs)',
      description: 'Soft, chewy artisan Japanese rice flour mochi wrapped around premium Kyoto ceremonial green tea ice cream.',
      price: 229,
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
      category: 'Desserts',
      isVeg: true,
      isAvailable: true,
      isPopular: true,
      customization: []
    },
    {
      restaurantId: restSushi._id,
      name: 'Japanese Dorayaki Red Bean Pancakes',
      description: 'Fluffy golden honey-infused sponge pancakes filled with sweetened azuki red bean paste and chestnut puree.',
      price: 179,
      image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=400',
      category: 'Desserts',
      isVeg: true,
      isAvailable: true,
      isPopular: false,
      customization: []
    },
    {
      restaurantId: restSushi._id,
      name: 'Black Sesame & Coconut Panna Cotta',
      description: 'Silky smooth coconut milk set custard infused with toasted black sesame and Japanese Kuromitsu brown sugar drizzle.',
      price: 199,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
      category: 'Desserts',
      isVeg: true,
      isAvailable: true,
      isPopular: true,
      customization: []
    },

    // ==================== DRAGON WOK EXPRESS ====================
    {
      restaurantId: restChinese._id,
      name: 'Szechuan Kung Pao Chicken',
      description: 'Wok-seared tender chicken with roasted peanuts, dry red chilies, and sweet-spicy garlic ginger sauce.',
      price: 329,
      image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
      category: 'Chinese',
      isVeg: false,
      isAvailable: true,
      isPopular: true,
      customization: [{
        name: 'Rice Selection',
        options: [
          { label: 'Steamed Jasmine Rice', price: 0 },
          { label: 'Egg Fried Rice', price: 50 }
        ]
      }]
    },
    {
      restaurantId: restChinese._id,
      name: 'Crispy Veg Spring Rolls (4 pcs)',
      description: 'Golden pastry rolls filled with shredded cabbage, carrots, water chestnuts, and glass noodles with plum sauce.',
      price: 159,
      image: 'https://images.unsplash.com/photo-1548507200-e9e594ad29e2?w=400',
      category: 'Chinese',
      isVeg: true,
      isAvailable: true,
      isPopular: false,
      customization: []
    },
    // Dragon Wok Express Desserts
    {
      restaurantId: restChinese._id,
      name: 'Crispy Honey Darsaan with Vanilla Ice Cream',
      description: 'Crispy fried flat noodles tossed in wild blossom honey and toasted sesame seeds, served warm with vanilla ice cream.',
      price: 179,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
      category: 'Desserts',
      isVeg: true,
      isAvailable: true,
      isPopular: true,
      customization: []
    },
    {
      restaurantId: restChinese._id,
      name: 'Golden Banana Fritters with Palm Jaggery',
      description: 'Sweet ripe bananas dipped in crisp golden batter, dusted with cinnamon sugar and drizzled with warm spiced jaggery.',
      price: 149,
      image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=400',
      category: 'Desserts',
      isVeg: true,
      isAvailable: true,
      isPopular: false,
      customization: []
    },
    {
      restaurantId: restChinese._id,
      name: 'Mango Sticky Rice with Coconut Cream',
      description: 'Steamed sweet glutinous rice infused with coconut milk, paired with fresh juicy Alphonso mango slices.',
      price: 199,
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400',
      category: 'Desserts',
      isVeg: true,
      isAvailable: true,
      isPopular: true,
      customization: []
    },

    // ==================== ROYAL SPICE GARDEN ====================
    {
      restaurantId: restIndian._id,
      name: 'Grand Hyderabadi Dum Biryani',
      description: 'Long-grain aged basmati rice slow cooked under steam with tender marinated chicken, saffron and caramelized onions.',
      price: 349,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
      category: 'Indian',
      isVeg: false,
      isAvailable: true,
      isPopular: true,
      customization: [{
        name: 'Accompaniment',
        options: [
          { label: 'Mirchi Ka Salan & Raita', price: 0 },
          { label: 'Extra Rich Gravy', price: 35 }
        ]
      }]
    },
    {
      restaurantId: restIndian._id,
      name: 'Butter Chicken Masala',
      description: 'Tandoor-charred boneless chicken simmered in rich velvety butter, fresh dairy cream, and aromatic tomato gravy.',
      price: 329,
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
      category: 'Indian',
      isVeg: false,
      isAvailable: true,
      isPopular: true,
      customization: []
    },
    {
      restaurantId: restIndian._id,
      name: 'Garlic Butter Naan (2 pcs)',
      description: 'Tandoor baked soft fluffy Indian flatbread brushed with roasted garlic and pure clarified desi butter.',
      price: 89,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
      category: 'Indian',
      isVeg: true,
      isAvailable: true,
      isPopular: true,
      customization: []
    },
    // Royal Spice Garden Traditional Indian Desserts
    {
      restaurantId: restIndian._id,
      name: 'Royal Shahi Gulab Jamun (2 pcs)',
      description: 'Melt-in-mouth golden khoya dumplings soaked in warm saffron and green cardamom syrup, garnished with silver leaf and pistachios.',
      price: 129,
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400',
      category: 'Desserts',
      isVeg: true,
      isAvailable: true,
      isPopular: true,
      customization: []
    },
    {
      restaurantId: restIndian._id,
      name: 'Kesar Pista Rasmalai (2 pcs)',
      description: 'Delicate, spongy cottage cheese discs steeped in slow-simmered saffron rabri milk, flavoured with cardamom and crushed nuts.',
      price: 159,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400',
      category: 'Desserts',
      isVeg: true,
      isAvailable: true,
      isPopular: true,
      customization: []
    },
    {
      restaurantId: restIndian._id,
      name: 'Desi Ghee Moong Dal Halwa',
      description: 'Rich, aromatic Rajasthani yellow lentil pudding slow-roasted in pure clarified desi ghee, garnished with roasted cashews and saffron.',
      price: 189,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
      category: 'Desserts',
      isVeg: true,
      isAvailable: true,
      isPopular: true,
      customization: []
    },
    {
      restaurantId: restIndian._id,
      name: 'Royal Malai Kulfi Falooda Sundae',
      description: 'Dense, traditional malai kulfi layered over chilled rose falooda vermicelli, sweet basil seeds (sabja), and rich thick rabri.',
      price: 169,
      image: 'https://images.unsplash.com/photo-1579954115563-e72bf1381629?w=400',
      category: 'Desserts',
      isVeg: true,
      isAvailable: true,
      isPopular: true,
      customization: []
    },

    // ==================== THE GREEN BOWL CO. ====================
    {
      restaurantId: restGreen._id,
      name: 'Mediterranean Quinoa Power Bowl',
      description: 'Organic red quinoa, cherry tomatoes, kalamata olives, cucumber, avocado, and lemon herb tahini dressing.',
      price: 279,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
      category: 'Healthy',
      isVeg: true,
      isAvailable: true,
      isPopular: true,
      customization: [{
        name: 'Protein Boost',
        options: [
          { label: 'Tofu Feta (Vegan)', price: 0 },
          { label: 'Grilled Chicken Breast', price: 70 }
        ]
      }]
    },
    {
      restaurantId: restGreen._id,
      name: 'Amazonian Berry Acai Bowl',
      description: 'Pure organic acai berry smoothie base topped with artisan granola, chia seeds, fresh berries, and raw forest honey.',
      price: 249,
      image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
      category: 'Healthy',
      isVeg: true,
      isAvailable: true,
      isPopular: true,
      customization: []
    },
    // The Green Bowl Co. Healthy Desserts
    {
      restaurantId: restGreen._id,
      name: 'Chia Seed Coconut Pudding with Wild Berries',
      description: 'Layered creamy coconut milk chia pudding with antioxidant blueberry compote, organic honey, and roasted pumpkin seeds.',
      price: 189,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
      category: 'Desserts',
      isVeg: true,
      isAvailable: true,
      isPopular: true,
      customization: []
    },
    {
      restaurantId: restGreen._id,
      name: 'Raw Vegan Avocado Dark Chocolate Mousse',
      description: 'Silky decadent dark chocolate mousse crafted from fresh Haas avocados, raw cacao, Medjool dates, and crushed hazelnuts.',
      price: 199,
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400',
      category: 'Desserts',
      isVeg: true,
      isAvailable: true,
      isPopular: true,
      customization: []
    },

    // ==================== SWEET TOOTH PATISSERIE & DESSERT BAR ====================
    ...(restDessert ? [
      {
        restaurantId: restDessert._id,
        name: 'Belgian Triple Chocolate Truffle Cake',
        description: 'Layers of moist Dutch dark chocolate sponge and rich 64% Belgian chocolate ganache topped with hand-shaved curls.',
        price: 249,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
        category: 'Desserts',
        isVeg: true,
        isAvailable: true,
        isPopular: true,
        customization: []
      },
      {
        restaurantId: restDessert._id,
        name: 'Signature French Macarons Box (5 pcs)',
        description: 'Pastel Parisian almond macarons: Raspberry, Bronte Pistachio, Salted Butter Caramel, Madagascar Vanilla, and Dark Chocolate.',
        price: 299,
        image: 'https://images.unsplash.com/photo-1569864321342-5e6f6631c5d8?w=400',
        category: 'Desserts',
        isVeg: true,
        isAvailable: true,
        isPopular: true,
        customization: []
      },
      {
        restaurantId: restDessert._id,
        name: 'Lotus Biscoff Cheesecake Jar',
        description: 'Crunchy Biscoff cookie crumble layered with velvety cream cheese mousse and melted spiced speculoos spread.',
        price: 239,
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400',
        category: 'Desserts',
        isVeg: true,
        isAvailable: true,
        isPopular: true,
        customization: []
      },
      {
        restaurantId: restDessert._id,
        name: 'Warm Belgian Nutella Waffle',
        description: 'Freshly baked golden Belgian waffle generously smothered with Nutella, roasted hazelnuts, and whipped dairy cream.',
        price: 219,
        image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400',
        category: 'Desserts',
        isVeg: true,
        isAvailable: true,
        isPopular: true,
        customization: []
      },
      {
        restaurantId: restDessert._id,
        name: 'Signature Red Velvet Cream Cheese Cupcake (2 pcs)',
        description: 'Crimson cocoa sponge cupcakes crowned with luscious vanilla bean cream cheese frosting and red velvet crumb.',
        price: 169,
        image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400',
        category: 'Desserts',
        isVeg: true,
        isAvailable: true,
        isPopular: false,
        customization: []
      },
      {
        restaurantId: restDessert._id,
        name: 'Spanish Churros with Warm Dark Chocolate Dip (4 pcs)',
        description: 'Crispy ridged golden churros rolled in cinnamon sugar, served with warm 70% dark Belgian dipping chocolate.',
        price: 189,
        image: 'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=400',
        category: 'Desserts',
        isVeg: true,
        isAvailable: true,
        isPopular: true,
        customization: []
      },
      {
        restaurantId: restDessert._id,
        name: 'Iced Caramel Macchiato Frappe',
        description: 'Fresh espresso shot blended with chilled milk, vanilla bean gelato, and golden butterscotch caramel ribbons.',
        price: 189,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
        category: 'Beverages',
        isVeg: true,
        isAvailable: true,
        isPopular: true,
        customization: []
      }
    ] : [])
  ];
};

const getCouponsData = () => [
  {
    code: 'WELCOME50',
    description: 'Flat 50% discount on your first order up to ₹150',
    discountType: 'percentage',
    discountValue: 50,
    minOrder: 200,
    maxDiscount: 150,
    expiryDate: new Date('2027-12-31'),
    isActive: true,
    usageCount: 42
  },
  {
    code: 'FEAST20',
    description: '20% off on all party orders above ₹400 up to ₹200',
    discountType: 'percentage',
    discountValue: 20,
    minOrder: 400,
    maxDiscount: 200,
    expiryDate: new Date('2027-12-31'),
    isActive: true,
    usageCount: 68
  },
  {
    code: 'FREEDELIVERY',
    description: '100% Free delivery on any meal over ₹199',
    discountType: 'free_delivery',
    discountValue: 49,
    minOrder: 199,
    maxDiscount: 49,
    expiryDate: new Date('2027-12-31'),
    isActive: true,
    usageCount: 110
  },
  {
    code: 'FLAT100',
    description: 'Flat ₹100 savings on orders above ₹499',
    discountType: 'flat',
    discountValue: 100,
    minOrder: 499,
    maxDiscount: 100,
    expiryDate: new Date('2027-12-31'),
    isActive: true,
    usageCount: 25
  }
];

// Helper to update any pre-existing database to INR prices and add desserts
export const syncINRAndDesserts = async () => {
  try {
    console.log('[Sync] Checking database for INR prices and desserts dishes...');

    // 1. Ensure Desserts category exists
    const dessertsCategory = await Category.findOne({ name: 'Desserts' });
    if (!dessertsCategory) {
      await Category.create({
        name: 'Desserts',
        slug: 'desserts',
        icon: '🍰',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300',
        description: 'Cakes, pastries, sweets & ice cream'
      });
      console.log('[Sync] Created Desserts category.');
    }

    // 2. Fetch all restaurants
    let restaurants = await Restaurant.find({});
    const restMap = {};
    restaurants.forEach(r => { restMap[r.name] = r; });

    // If Sweet Tooth Patisserie doesn't exist, create it
    if (!restMap['Sweet Tooth Patisserie & Dessert Bar']) {
      const newDessertRest = await Restaurant.create({
        name: 'Sweet Tooth Patisserie & Dessert Bar',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500',
        coverImage: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1000',
        description: 'Artisanal cakes, handcrafted gourmet chocolates, decadent Belgian waffles, and French pastries.',
        cuisine: ['Desserts', 'Bakery', 'Cakes', 'Waffles'],
        rating: 4.9,
        reviewCount: 460,
        deliveryTime: '20-30 min',
        deliveryFee: 39,
        minOrder: 149,
        priceRange: '₹₹',
        address: '77 Sector 29, Gourmet Boulevard, Gurgaon 122002',
        phone: '+91-98770-89012',
        openingHours: '09:00 AM - 11:30 PM',
        categories: ['Desserts', 'Beverages'],
        isOpen: true,
        isActive: true,
        isApproved: true,
        isVegOnly: true
      });
      restMap['Sweet Tooth Patisserie & Dessert Bar'] = newDessertRest;
      console.log('[Sync] Created Sweet Tooth Patisserie & Dessert Bar restaurant.');
    }

    // Update restaurant fees, min orders, priceRanges to INR
    for (const rest of restaurants) {
      let changed = false;
      if (rest.deliveryFee < 10) {
        rest.deliveryFee = 49;
        changed = true;
      }
      if (rest.minOrder < 50) {
        rest.minOrder = 199;
        changed = true;
      }
      if (rest.priceRange && rest.priceRange.includes('$')) {
        rest.priceRange = rest.priceRange.replace(/\$/g, '₹');
        changed = true;
      }
      // Ensure 'Desserts' is in categories if not present
      if (!rest.categories.includes('Desserts')) {
        rest.categories.push('Desserts');
        changed = true;
      }
      if (!rest.cuisine.includes('Desserts')) {
        rest.cuisine.push('Desserts');
        changed = true;
      }
      if (changed) {
        await rest.save();
      }
    }

    // 3. Update existing food prices to INR if they are under ₹50 (old USD values)
    const existingFoods = await Food.find({});
    for (const food of existingFoods) {
      if (food.price < 50) {
        // Convert old USD price to INR equivalent
        let newPrice = 249;
        if (food.price <= 5) newPrice = 129;
        else if (food.price <= 10) newPrice = 199;
        else if (food.price <= 15) newPrice = 299;
        else if (food.price <= 20) newPrice = 399;
        else newPrice = 499;

        food.price = newPrice;

        // Also scale customization prices
        if (food.customization && food.customization.length > 0) {
          food.customization.forEach(group => {
            group.options.forEach(opt => {
              if (opt.price > 0 && opt.price < 15) {
                opt.price = Math.round(opt.price * 25);
              }
            });
          });
        }
        await food.save();
      }
    }
    console.log('[Sync] Verified existing food prices in INR.');

    // 4. Add any missing dessert dishes
    const allINRFoods = getFoodsList(restMap);
    let addedCount = 0;
    for (const foodItem of allINRFoods) {
      const exists = await Food.findOne({ name: foodItem.name, restaurantId: foodItem.restaurantId });
      if (!exists) {
        await Food.create(foodItem);
        addedCount++;
      }
    }
    console.log(`[Sync] Added ${addedCount} new dishes/desserts to menu.`);

    // 5. Update coupons to INR
    const coupons = getCouponsData();
    for (const cp of coupons) {
      await Coupon.findOneAndUpdate(
        { code: cp.code },
        cp,
        { upsert: true, new: true }
      );
    }
    console.log('[Sync] Verified active coupons in INR.');
    console.log('[Sync] Database successfully synchronized with INR prices and Desserts dishes!');
  } catch (error) {
    console.error('[Sync] Error during database synchronization:', error);
  }
};

export const seedInitialData = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@foodhub.com' });
    if (existingAdmin) {
      console.log('Database already populated with initial data. Checking INR & desserts synchronization...');
      await syncINRAndDesserts();
      return;
    }

    console.log('Seeding initial data into database with INR prices and Desserts menu...');

    // 1. Create Admin & Demo Users
    const adminUser = await User.create({
      name: 'Admin Manager',
      email: 'admin@foodhub.com',
      phone: '+91-98110-00199',
      password: 'admin123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      addresses: [{
        label: 'Office',
        street: '742 Evergreen Terrace',
        city: 'New Delhi',
        state: 'Delhi',
        zip: '110001',
        isDefault: true
      }]
    });

    const demoUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91-98110-00144',
      password: 'password123',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      addresses: [
        {
          label: 'Home',
          street: '123 Main St, Apt 4B, GK-1',
          city: 'New Delhi',
          state: 'Delhi',
          zip: '110048',
          isDefault: true
        },
        {
          label: 'Work',
          street: '456 Cyber City, Tower B',
          city: 'Gurgaon',
          state: 'Haryana',
          zip: '122002',
          isDefault: false
        }
      ],
      paymentMethods: [
        {
          type: 'card',
          label: 'HDFC Visa ending in 4242',
          details: '**** **** **** 4242',
          isDefault: true
        },
        {
          type: 'upi',
          label: 'Google Pay UPI',
          details: 'johndoe@okaxis',
          isDefault: false
        }
      ]
    });

    // 2. Categories
    const { categoriesData, restaurantsData } = getINRSeedData(adminUser, demoUser);
    await Category.insertMany(categoriesData);

    // 3. Restaurants
    const insertedRestaurants = await Restaurant.insertMany(restaurantsData);
    const restMap = {};
    insertedRestaurants.forEach(r => { restMap[r.name] = r; });

    // 4. Food Items (Includes authentic Desserts dishes for each cuisine + dedicated bakery)
    const foodsData = getFoodsList(restMap);
    const insertedFoods = await Food.insertMany(foodsData);

    // 5. Delivery Partners
    const partnersData = [
      {
        name: 'Mike Johnson',
        phone: '+91-98100-11001',
        email: 'mike@foodexpress.com',
        vehicle: 'Honda Hornet 2.0',
        licensePlate: 'DL-01-AB-1234',
        status: 'online',
        rating: 4.9,
        totalDeliveries: 312,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
      },
      {
        name: 'Sarah Wilson',
        phone: '+91-98100-11002',
        email: 'sarah@foodexpress.com',
        vehicle: 'Ather 450X Electric',
        licensePlate: 'DL-04-CD-5678',
        status: 'online',
        rating: 4.8,
        totalDeliveries: 245,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'
      },
      {
        name: 'David Lee',
        phone: '+91-98100-11003',
        email: 'david@foodexpress.com',
        vehicle: 'Yamaha MT-15',
        licensePlate: 'DL-08-EF-9012',
        status: 'offline',
        rating: 4.7,
        totalDeliveries: 180,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'
      }
    ];
    const insertedPartners = await DeliveryPartner.insertMany(partnersData);

    // 6. Coupons in INR
    const couponsData = getCouponsData();
    await Coupon.insertMany(couponsData);

    // 7. Seed Sample Orders for demoUser in INR
    const restPizza = restMap['Pizza Palace'];
    const restBurger = restMap['Burger Barn'];
    const pizzaFood = insertedFoods.find(f => f.name === 'Signature Margherita Pizza');
    const garlicFood = insertedFoods.find(f => f.name === 'Herbed Garlic Breadsticks');
    const tiramisuFood = insertedFoods.find(f => f.name === 'Italian Espresso Tiramisu');
    const burgerFood = insertedFoods.find(f => f.name === 'Truffle Angus Cheeseburger');
    const friesFood = insertedFoods.find(f => f.name === 'Seasoned Waffle Fries');
    const brownieFood = insertedFoods.find(f => f.name === 'Gooey Hot Fudge Brownie with Ice Cream');

    const sampleOrder1 = await Order.create({
      orderNumber: 'FD-100234',
      userId: demoUser._id,
      restaurantId: restPizza._id,
      items: [
        {
          foodId: pizzaFood._id,
          name: pizzaFood.name,
          price: pizzaFood.price,
          quantity: 2,
          customization: [{ name: 'Crust & Size', selected: 'Medium 12"', price: 70 }],
          itemTotal: (pizzaFood.price + 70) * 2
        },
        {
          foodId: garlicFood._id,
          name: garlicFood.name,
          price: garlicFood.price,
          quantity: 1,
          customization: [],
          itemTotal: garlicFood.price
        },
        {
          foodId: tiramisuFood._id,
          name: tiramisuFood.name,
          price: tiramisuFood.price,
          quantity: 1,
          customization: [],
          itemTotal: tiramisuFood.price
        }
      ],
      deliveryAddress: {
        label: 'Home',
        street: '123 Main St, Apt 4B, GK-1',
        city: 'New Delhi',
        state: 'Delhi',
        zip: '110048',
        phone: '+91-98110-00144',
        instructions: 'Please call on arrival'
      },
      paymentMethod: 'card',
      paymentStatus: 'paid',
      orderStatus: 'Delivered',
      subtotal: 1116,
      deliveryFee: 49,
      tax: 89.28,
      discount: 150,
      total: 1104.28,
      couponCode: 'WELCOME50',
      deliveryPartnerId: insertedPartners[0]._id,
      trackingTimeline: [
        { status: 'New Order', timestamp: new Date(Date.now() - 3600000 * 2), note: 'Order placed by customer' },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 3600000 * 1.8), note: 'Restaurant confirmed order' },
        { status: 'Preparing', timestamp: new Date(Date.now() - 3600000 * 1.5), note: 'Chef is baking fresh pizza and desserts' },
        { status: 'Ready for Pickup', timestamp: new Date(Date.now() - 3600000 * 1.2), note: 'Packaging done' },
        { status: 'Out for Delivery', timestamp: new Date(Date.now() - 3600000 * 1.0), note: 'Mike is on the way' },
        { status: 'Delivered', timestamp: new Date(Date.now() - 3600000 * 0.5), note: 'Delivered to door' }
      ],
      ratings: {
        restaurant: 5,
        food: 5,
        delivery: 5,
        review: 'Hot, delicious pizza and heavenly tiramisu delivered with incredible speed!',
        ratedAt: new Date(Date.now() - 3600000 * 0.4)
      }
    });

    const sampleActiveOrder = await Order.create({
      orderNumber: 'FD-100235',
      userId: demoUser._id,
      restaurantId: restBurger._id,
      items: [
        {
          foodId: burgerFood._id,
          name: burgerFood.name,
          price: burgerFood.price,
          quantity: 1,
          customization: [{ name: 'Extras', selected: 'Double Patty', price: 90 }],
          itemTotal: burgerFood.price + 90
        },
        {
          foodId: friesFood._id,
          name: friesFood.name,
          price: friesFood.price,
          quantity: 1,
          customization: [],
          itemTotal: friesFood.price
        },
        {
          foodId: brownieFood._id,
          name: brownieFood.name,
          price: brownieFood.price,
          quantity: 1,
          customization: [],
          itemTotal: brownieFood.price
        }
      ],
      deliveryAddress: {
        label: 'Home',
        street: '123 Main St, Apt 4B, GK-1',
        city: 'New Delhi',
        state: 'Delhi',
        zip: '110048',
        phone: '+91-98110-00144',
        instructions: 'Leave at door, please do not ring doorbell'
      },
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      orderStatus: 'Out for Delivery',
      subtotal: 707,
      deliveryFee: 39,
      tax: 56.56,
      discount: 0,
      total: 802.56,
      couponCode: null,
      deliveryPartnerId: insertedPartners[1]._id,
      trackingTimeline: [
        { status: 'New Order', timestamp: new Date(Date.now() - 1800000), note: 'Order placed by customer' },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 1500000), note: 'Burger Barn accepted order' },
        { status: 'Preparing', timestamp: new Date(Date.now() - 1200000), note: 'Burger is sizzling on the grill' },
        { status: 'Ready for Pickup', timestamp: new Date(Date.now() - 600000), note: 'Packed with warm brownie sundae' },
        { status: 'Out for Delivery', timestamp: new Date(Date.now() - 180000), note: 'Sarah is on the electric scooter nearing your location' }
      ]
    });

    // 8. Payments
    await Payment.create({
      transactionId: 'TXN-98218731',
      orderId: sampleOrder1._id,
      userId: demoUser._id,
      amount: 1104.28,
      method: 'card',
      status: 'success'
    });

    await Payment.create({
      transactionId: 'TXN-98218732',
      orderId: sampleActiveOrder._id,
      userId: demoUser._id,
      amount: 802.56,
      method: 'upi',
      status: 'success',
      upiId: 'johndoe@okaxis'
    });

    // 9. Reviews
    await Review.create({
      userId: demoUser._id,
      orderId: sampleOrder1._id,
      restaurantId: restPizza._id,
      foodId: pizzaFood._id,
      userName: 'John Doe',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      restaurantName: 'Pizza Palace',
      rating: 5,
      foodRating: 5,
      deliveryRating: 5,
      review: 'Hot, delicious pizza and outstanding tiramisu! The dessert was the highlight.',
      isReported: false
    });

    // 10. Notifications
    await Notification.create({
      userId: demoUser._id,
      title: 'Order Out for Delivery! 🛵',
      message: 'Your order #FD-100235 from Burger Barn is on the way with Sarah.',
      type: 'order',
      isRead: false
    });

    await Notification.create({
      userId: null, // broadcast
      title: 'Weekend Feast 20% OFF! 🎉',
      message: 'Use coupon FEAST20 on any restaurant order this weekend.',
      type: 'promo',
      isRead: false
    });

    console.log('Database seeding successfully finished with INR pricing and Desserts!');
  } catch (error) {
    console.error('Error during database seed:', error);
  }
};

// If run directly via node utils/seed.js
if (process.argv[1] && (process.argv[1].endsWith('seed.js') || process.argv[1].endsWith('seed'))) {
  const { connectDB, closeDB } = await import('../config/db.js');
  await connectDB();
  await syncINRAndDesserts();
  console.log('Seed standalone script finished successfully!');
  await closeDB();
  process.exit(0);
}
