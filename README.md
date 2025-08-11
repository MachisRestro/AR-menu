# Premium Digital Menu Subscription Webapp

A comprehensive digital menu solution with advanced features including AR integration, 360° views, loyalty programs, and a complete admin panel.

## 🌟 Features

### Customer Features
- **Augmented Reality Integration** - View dishes in AR for immersive experience
- **360° Dish Views** - Interactive product visualization
- **Smart Filtering** - VEG/NON-VEG/Vegan filtering with advanced search
- **Nutritional Information** - Detailed nutritional data for each item
- **Call to Waiter** - Direct communication with restaurant staff
- **Loyalty Program** - Points-based reward system with tier benefits
- **QR Code Generation** - Instant menu access via QR codes
- **Social Media Sharing** - Easy sharing of menu items
- **Customizable Themes** - Multiple visual themes for different brands
- **Festival & Events Menu** - Dynamic menu adaptation for special occasions
- **Real-time Recommendations** - AI-powered upselling suggestions

### Admin Features
- **Secure Authentication** - Protected admin access
- **Real-time Analytics** - Live performance metrics and insights
- **Order Management** - Complete order tracking and management
- **Menu Management** - Easy menu item updates and availability control
- **Customer Data** - User information collection and management
- **Revenue Tracking** - Comprehensive financial analytics
- **Popular Items Analysis** - Data-driven menu optimization

## 🚀 Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **State Management**: React Context API
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Netlify Ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd premium-digital-menu
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials
   - Configure app settings

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

### Core Tables
```sql
-- Restaurants
restaurants (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  theme TEXT DEFAULT 'modern',
  primary_color TEXT,
  secondary_color TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Menu Items
menu_items (
  id UUID PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  category TEXT,
  dietary_type TEXT CHECK (dietary_type IN ('veg', 'non-veg', 'vegan')),
  nutritional_info JSONB,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Customers
customers (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  loyalty_points INTEGER DEFAULT 0,
  created_at TIMESTAMP
)

-- Orders
orders (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  restaurant_id UUID REFERENCES restaurants(id),
  items JSONB,
  total_amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP
)
```

## 🎨 Theme System

The app supports multiple themes with customizable color schemes:

- **Modern**: Clean, minimalist design
- **Classic**: Traditional, elegant styling
- **Elegant**: Sophisticated, premium feel
- **Vibrant**: Colorful, energetic appearance

## 🔐 Admin Access

Access the admin panel at `/admin` with demo credentials:
- **Username**: admin
- **Password**: admin123

## 📱 Mobile Responsive

Fully optimized for:
- Mobile devices (< 768px)
- Tablets (768px - 1024px)
- Desktop (> 1024px)

## 🚀 Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your repository
   - Set environment variables
   - Deploy automatically

## 🔧 Configuration

### Environment Variables
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `VITE_APP_NAME` - Application name
- `VITE_APP_URL` - Application URL

### Customization
- Update `src/contexts/RestaurantContext.tsx` for restaurant data
- Modify themes in `src/components/Features/ThemeSelector.tsx`
- Customize menu items in the context provider

## 📊 Analytics & Insights

Track comprehensive metrics:
- **Order Analytics** - Revenue, order count, trends
- **Popular Items** - Best-selling dishes and categories
- **Customer Insights** - User behavior and preferences
- **Performance Metrics** - Page views, engagement rates

## 🎯 Future Enhancements

- **Payment Integration** - Stripe/PayPal checkout
- **Multi-restaurant Support** - SaaS platform expansion
- **Advanced AR Features** - WebXR implementation
- **Voice Ordering** - Speech recognition integration
- **AI Recommendations** - Machine learning suggestions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ for the future of digital dining experiences.