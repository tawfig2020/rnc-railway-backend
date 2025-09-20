import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
  Divider,
  Avatar,
  Chip,
  CardMedia,
  CardActionArea,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  Slider,
  IconButton,
  Rating,
  Badge,
  useTheme,
  Breadcrumbs,
  Link as MuiLink,
  Checkbox,
  FormControlLabel,
  Alert,
  Snackbar,
  MenuItem,
} from '@mui/material';
import {
  Search,
  FilterList,
  ShoppingCart,
  Storefront,
  LocalShipping,
  Favorite,
  FavoriteBorder,
  Share,
  LocationOn,
  VolunteerActivism,
  LocalOffer,
  StarBorder,
  Category,
  MonetizationOn,
  HandshakeOutlined,
  EmojiObjectsOutlined,
  Home as HomeIcon,
  NavigateNext,
  DeleteOutline,
  Close,
  People,
  AddBusiness,
  Send,
  SupportAgent,
  PriceCheck,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Marketplace = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [categoryTitle, setCategoryTitle] = useState('Community Marketplace');
  const [categoryDescription, setCategoryDescription] = useState('Support refugee entrepreneurs by purchasing handcrafted products and services. Each purchase directly helps refugee families build sustainable livelihoods.');
  const [showFilters, setShowFilters] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [cart, setCart] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info'); // can be 'success', 'error', 'warning', 'info'

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Optional: update URL based on tab for better navigation, but this can get complex with existing category logic
    // For now, just changing the tab state is sufficient for basic tab functionality.
    // If specific URLs are needed for tabs, that logic would go here, potentially clearing activeCategory or setting a default.
    if (newValue === 0) navigate('/marketplace');
    // else if (newValue === 1) navigate('/marketplace/products'); // Example, adjust as needed
    // else if (newValue === 2) navigate('/marketplace/services'); // Example, adjust as needed
    // else if (newValue === 3) navigate('/marketplace/featured-vendors'); // Example for new tab
    // else if (newValue === 4) navigate('/marketplace/become-vendor'); // Example for new tab
  };

  // Set the active category based on the URL path
  useEffect(() => {
    const path = location.pathname.split('/');
    if (path.length > 2) {
      const category = path[2];
      setActiveCategory(category);
      
      // Set the category title and description based on the URL
      switch(category) {
        case 'handicrafts':
          setCategoryTitle('Handicrafts & Accessories');
          setCategoryDescription('Beautiful handcrafted jewelry, bags, and woven goods created by refugee women artisans.');
          setTabValue(1); // Set to Products tab
          break;
        case 'art':
          setCategoryTitle('Art & Cultural Pieces');
          setCategoryDescription('Traditional art, calligraphy, and paintings that showcase cultural heritage and artistic expression.');
          setTabValue(1);
          break;
        case 'clothing':
          setCategoryTitle('Custom Clothing & Fabric');
          setCategoryDescription('Handmade garments, embroidery, and fabric crafts created with traditional techniques and modern designs.');
          setTabValue(1);
          break;
        case 'handmade':
          setCategoryTitle('Handmade & Artisan Products');
          setCategoryDescription('Explore our collection of handcrafted items made by refugee artisans using traditional techniques.');
          setTabValue(1);
          break;
        case 'freelance':
          setCategoryTitle('Freelancer Services');
          setCategoryDescription('Professional services including design, translation, editing, and digital consulting from skilled refugee professionals.');
          setTabValue(2); // Set to Services tab
          break;
        case 'downloads':
          setCategoryTitle('Downloadable Goods');
          setCategoryDescription('Digital products including eBooks, templates, posters, and educational resources created by refugee content creators.');
          setTabValue(1);
          break;
        case 'apps':
          setCategoryTitle('Community-built Apps & Tools');
          setCategoryDescription('Digital applications, Chrome extensions, mobile apps, and AI tools developed by the RNC tech community.');
          setTabValue(1);
          break;
        case 'digital':
          setCategoryTitle('Digital Products & Services');
          setCategoryDescription('Browse our collection of digital offerings, from professional services to downloadable content.');
          setTabValue(0); // Show both products and services
          break;
        case 'bakery':
          setCategoryTitle('Bakery & Snacks');
          setCategoryDescription('Delicious homemade treats, traditional pastries, and artisanal snacks from refugee bakers and food entrepreneurs.');
          setTabValue(1);
          break;
        default:
          setCategoryTitle('Community Marketplace');
          setCategoryDescription('Support refugee entrepreneurs by purchasing handcrafted products and services. Each purchase directly helps refugee families build sustainable livelihoods.');
          setTabValue(0);
          setActiveCategory('all');
      }
    } else {
      setActiveCategory('all');
      setCategoryTitle('Community Marketplace');
      setCategoryDescription('Support refugee entrepreneurs by purchasing handcrafted products and services. Each purchase directly helps refugee families build sustainable livelihoods.');
    }
  }, [location.pathname]);

  // Handicrafts & Accessories Products
  const handicraftProducts = [
    {
      id: 1,
      title: "Hand-Woven Traditional Basket",
      seller: "Amina's Crafts",
      sellerOrigin: "Somalia",
      price: 45,
      image: "https://images.unsplash.com/photo-1563298998-d795091aafe8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.8,
      reviews: 24,
      category: "Crafts",
      description: "Beautifully crafted basket using traditional Somali weaving techniques. Each basket takes 3-4 days to complete and features natural dyes from local plants. Perfect for storage or as a decorative piece.",
      tags: ["Handmade", "Fair Trade", "Traditional"],
      sellerAvatar: "https://randomuser.me/api/portraits/women/32.jpg",
      sellerStory: "Amina learned basket weaving from her grandmother and has been preserving this tradition for over 20 years.",
      featured: true,
      stock: 8,
      dimensions: "12\" x 10\" x 10\"",
      materials: ["Reed", "Natural Dyes", "Raffia"],
      sustainabilityInfo: "Made with locally sourced materials and natural dyes"
    },
    {
      id: 2,
      title: "Beaded Statement Necklace",
      seller: "Nyaruot's Jewelry",
      sellerOrigin: "South Sudan",
      price: 38,
      image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.9,
      reviews: 37,
      category: "Crafts",
      description: "Vibrant beaded necklace handcrafted using traditional South Sudanese beading techniques. Each piece tells a story through its unique color pattern and arrangement.",
      tags: ["Handmade", "Jewelry", "Cultural"],
      sellerAvatar: "https://randomuser.me/api/portraits/women/33.jpg",
      sellerStory: "Nyaruot creates jewelry inspired by her heritage, supporting her family and community through her craft.",
      featured: false,
      stock: 5,
      dimensions: "18 inches with 2-inch extender",
      materials: ["Glass beads", "Recycled metal", "Cotton cord"],
      sustainabilityInfo: "Incorporates recycled materials where possible"
    },
    {
      id: 3,
      title: "Hand-Embroidered Table Runner",
      seller: "Syrian Stitches Collective",
      sellerOrigin: "Syria",
      price: 55,
      image: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.7,
      reviews: 18,
      category: "Home Goods",
      description: "Exquisite hand-embroidered table runner featuring traditional Syrian patterns. Each piece takes 2-3 weeks to complete and showcases intricate needlework passed down through generations.",
      tags: ["Handmade", "Home Decor", "Cultural"],
      sellerAvatar: "https://randomuser.me/api/portraits/women/45.jpg",
      sellerStory: "A collective of Syrian women preserving cultural heritage through textile arts while building new lives.",
      featured: true,
      stock: 3,
      dimensions: "72\" x 16\"",
      materials: ["Cotton", "Silk thread", "Traditional dyes"],
      sustainabilityInfo: "Supporting refugee artisans with fair wages"
    },
    {
      id: 4,
      title: "Handcrafted Leather Journal",
      seller: "Kabir's Leatherworks",
      sellerOrigin: "Afghanistan",
      price: 32,
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.6,
      reviews: 14,
      category: "Crafts",
      description: "Beautiful leather-bound journal with hand-stitched binding and embossed cover design. Contains 120 pages of recycled paper perfect for sketching or writing.",
      tags: ["Handmade", "Stationery", "Leather"],
      sellerAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
      sellerStory: "Kabir learned leatherworking from his father and continues the tradition in his new home.",
      featured: false,
      stock: 12,
      dimensions: "7\" x 5\"",
      materials: ["Vegetable-tanned leather", "Recycled paper", "Waxed thread"],
      sustainabilityInfo: "Uses eco-friendly tanning processes and recycled materials"
    },
    {
      id: 5,
      title: "Hand-Knotted Macramé Wall Hanging",
      seller: "Maya's Fiber Arts",
      sellerOrigin: "Venezuela",
      price: 65,
      image: "https://images.unsplash.com/photo-1594125674956-61a9b49c8eeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.9,
      reviews: 22,
      category: "Home Goods",
      description: "Intricate macramé wall hanging handcrafted using traditional knotting techniques. Each piece is unique and adds texture and warmth to any space.",
      tags: ["Handmade", "Home Decor", "Fiber Art"],
      sellerAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
      sellerStory: "Maya combines traditional techniques with contemporary designs to create unique fiber art pieces.",
      featured: true,
      stock: 4,
      dimensions: "36\" x 24\"",
      materials: ["Organic cotton rope", "Driftwood", "Natural dyes"],
      sustainabilityInfo: "Made with organic and sustainably sourced materials"
    },
    {
      id: 6,
      title: "Handwoven Wool Scarf",
      seller: "Tibetan Weaving Collective",
      sellerOrigin: "Tibet",
      price: 48,
      image: "https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.8,
      reviews: 31,
      category: "Clothing",
      description: "Luxurious handwoven wool scarf created using traditional Tibetan weaving techniques. Features intricate patterns and vibrant colors that tell stories of cultural heritage.",
      tags: ["Handmade", "Fashion", "Winter"],
      sellerAvatar: "https://randomuser.me/api/portraits/women/52.jpg",
      sellerStory: "A group of Tibetan women preserving their weaving traditions while supporting their families.",
      featured: false,
      stock: 7,
      dimensions: "72\" x 12\"",
      materials: ["Yak wool", "Merino wool", "Natural dyes"],
      sustainabilityInfo: "Ethically sourced wool with traditional processing methods"
    },
    {
      id: 7,
      title: "Embroidered Decorative Pillows",
      seller: "Syrian Stitches Collective",
      sellerOrigin: "Syria",
      price: 35,
      image: "https://images.unsplash.com/photo-1540381396677-363a5ec5a128?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.7,
      reviews: 18,
      category: "Home Goods",
      description: "Hand-embroidered decorative pillows featuring traditional Syrian patterns. Made with high-quality fabrics and detailed stitching that showcases generations of textile expertise.",
      tags: ["Handmade", "Home Decor", "Cultural"],
      sellerAvatar: "https://randomuser.me/api/portraits/women/45.jpg",
      sellerStory: "A collective of Syrian women preserving cultural heritage through textile arts while building new lives.",
      featured: false,
      stock: 9,
      dimensions: "18\" x 18\"",
      materials: ["Cotton", "Silk thread", "Down alternative filling"],
      sustainabilityInfo: "Supporting refugee artisans with fair wages"
    }
  ];
  
  // Digital Products & Services
  const digitalProducts = [
    {
      id: 101,
      title: "Digital Marketing Services",
      seller: "TechRefugees Agency",
      sellerOrigin: "Multiple Countries",
      price: 120,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.9,
      reviews: 32,
      category: "Services",
      description: "Professional digital marketing services including social media management, content creation, and SEO optimization for small businesses. Our team of refugee tech professionals will help your business thrive online.",
      tags: ["Digital", "Business", "Professional", "Technology"],
      sellerAvatar: "https://randomuser.me/api/portraits/men/54.jpg",
      sellerStory: "A team of refugee tech professionals offering digital services to help businesses thrive online.",
      featured: true,
      hourlyRate: true,
      deliveryTime: "Ongoing service",
      languages: ["English", "Arabic", "French", "Farsi"],
      skills: ["Social Media Marketing", "SEO", "Content Creation", "Analytics"]
    },
    {
      id: 102,
      title: "Web Development & Design",
      seller: "CodeBridge Collective",
      sellerOrigin: "Syria & Iran",
      price: 35,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.9,
      reviews: 27,
      category: "Services",
      description: "Professional web development services including responsive design, e-commerce setup, and maintenance. Our team creates beautiful, functional websites tailored to your specific needs.",
      tags: ["Digital", "Technology", "Professional"],
      sellerAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      sellerStory: "A team of refugee developers using their skills to build digital bridges.",
      featured: true,
      hourlyRate: true,
      deliveryTime: "2-4 weeks depending on project scope",
      languages: ["English", "Arabic", "Farsi"],
      skills: ["React", "Node.js", "WordPress", "UI/UX Design"]
    },
    {
      id: 103,
      title: "Multilingual Translation Services",
      seller: "Global Voices",
      sellerOrigin: "Multiple Countries",
      price: 25,
      image: "https://images.unsplash.com/photo-1456513080867-f24f812c922a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.8,
      reviews: 29,
      category: "Services",
      description: "Professional translation services in over 15 languages including Arabic, Farsi, Urdu, Somali, and more. We provide accurate, culturally sensitive translations for documents, websites, and marketing materials.",
      tags: ["Digital", "Language", "Professional", "Communication"],
      sellerAvatar: "https://randomuser.me/api/portraits/women/22.jpg",
      sellerStory: "A network of refugee linguists providing language services to bridge cultural gaps.",
      featured: false,
      hourlyRate: true,
      deliveryTime: "24-48 hours for standard documents",
      languages: ["15+ languages available"],
      skills: ["Document Translation", "Website Localization", "Subtitling", "Interpretation"]
    },
    {
      id: 104,
      title: "Refugee Stories eBook Collection",
      seller: "Voices of Hope Publishing",
      sellerOrigin: "Various Countries",
      price: 12,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.7,
      reviews: 42,
      category: "Digital Products",
      description: "A collection of powerful personal narratives written by refugees from around the world. These stories offer insight into the refugee experience while celebrating resilience and hope.",
      tags: ["Digital", "eBook", "Cultural", "Educational"],
      sellerAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
      sellerStory: "A publishing initiative that empowers refugees to share their stories and receive fair compensation for their work.",
      featured: true,
      format: "PDF, EPUB, and MOBI formats included",
      pages: 186,
      languages: ["English", "Arabic", "French"],
      contributorCount: 12
    },
    {
      id: 105,
      title: "Cultural Recipe Collection",
      seller: "Global Kitchen Collective",
      sellerOrigin: "Multiple Countries",
      price: 15,
      image: "https://images.unsplash.com/photo-1556909114-44e3e9699e2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.9,
      reviews: 56,
      category: "Digital Products",
      description: "A beautifully designed digital cookbook featuring authentic recipes from refugee chefs around the world. Each recipe includes cultural context, cooking tips, and stunning photography.",
      tags: ["Digital", "Cookbook", "Cultural", "Food"],
      sellerAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
      sellerStory: "A collective of refugee chefs sharing their culinary heritage and building community through food.",
      featured: false,
      format: "PDF with interactive elements",
      pages: 120,
      languages: ["English"],
      recipeCount: 45
    },
    {
      id: 106,
      title: "Language Learning App - Arabic Basics",
      seller: "DigiLearn Collective",
      sellerOrigin: "Syria & Lebanon",
      price: 8,
      image: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.6,
      reviews: 38,
      category: "Digital Products",
      description: "An interactive mobile app designed by native Arabic speakers to teach conversational Arabic. Features audio pronunciations, cultural notes, and practical phrases for everyday situations.",
      tags: ["Digital", "Education", "Language", "Technology"],
      sellerAvatar: "https://randomuser.me/api/portraits/men/36.jpg",
      sellerStory: "A team of educators and developers creating accessible language learning tools based on their own experiences.",
      featured: true,
      platform: "iOS and Android",
      fileSize: "45MB",
      languages: ["Interface in English, teaches Arabic"],
      lessonCount: 30
    },
    {
      id: 107,
      title: "Graphic Design Services",
      seller: "Creative Refuge Studio",
      sellerOrigin: "Venezuela & Colombia",
      price: 40,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.8,
      reviews: 23,
      category: "Services",
      description: "Professional graphic design services including logo design, branding, marketing materials, and social media assets. Our designers blend cultural influences with modern aesthetics.",
      tags: ["Digital", "Design", "Professional", "Creative"],
      sellerAvatar: "https://randomuser.me/api/portraits/women/29.jpg",
      sellerStory: "A collective of refugee designers using their creative talents to build new careers.",
      featured: false,
      hourlyRate: false,
      deliveryTime: "3-7 days depending on project complexity",
      languages: ["English", "Spanish"],
      skills: ["Logo Design", "Branding", "Print Design", "Digital Assets"]
    }
  ];
  
  // Bakery & Snacks Products
  const bakeryProducts = [
    {
      id: 201,
      title: "Traditional Baklava Assortment",
      seller: "Aleppo Sweets",
      sellerOrigin: "Syria",
      price: 32,
      image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.9,
      reviews: 64,
      category: "Food",
      description: "Authentic Syrian baklava made with layers of phyllo dough, chopped nuts, and sweet syrup. This assortment includes classic baklava, bird's nests, and finger baklava, all made using traditional family recipes.",
      tags: ["Culinary", "Dessert", "Cultural", "Middle Eastern"],
      sellerAvatar: "https://randomuser.me/api/portraits/men/43.jpg",
      sellerStory: "Ahmad continues his family's 100-year-old bakery tradition from Aleppo, preserving authentic Syrian pastry techniques.",
      featured: true,
      dietary: ["Contains nuts", "Vegetarian"],
      weight: "500g box (12-15 pieces)",
      shelfLife: "7 days at room temperature",
      ingredients: ["Phyllo dough", "Pistachios", "Walnuts", "Honey", "Rose water"]
    },
    {
      id: 202,
      title: "Homemade Date Cookies (Maamoul)",
      seller: "Beirut Bakery",
      sellerOrigin: "Lebanon",
      price: 24,
      image: "https://images.unsplash.com/photo-1587244141530-6b594e7600d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.8,
      reviews: 37,
      category: "Food",
      description: "Traditional Lebanese date-filled shortbread cookies, delicately spiced with cinnamon and cardamom. These melt-in-your-mouth treats are perfect with coffee or tea and are especially popular during holidays.",
      tags: ["Culinary", "Cookies", "Cultural", "Middle Eastern"],
      sellerAvatar: "https://randomuser.me/api/portraits/women/42.jpg",
      sellerStory: "Fatima's cookies are made using her grandmother's recipe, passed down through generations of Lebanese bakers.",
      featured: false,
      dietary: ["Vegetarian"],
      weight: "400g box (16 cookies)",
      shelfLife: "14 days in airtight container",
      ingredients: ["Semolina flour", "Dates", "Butter", "Cardamom", "Rose water"]
    },
    {
      id: 203,
      title: "Traditional Spice Blend Set",
      seller: "Fatima's Kitchen",
      sellerOrigin: "Ethiopia",
      price: 28,
      image: "https://images.unsplash.com/photo-1532336414608-2ab8ed639a8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 5.0,
      reviews: 41,
      category: "Food",
      description: "Set of 5 authentic Ethiopian spice blends, including Berbere and Mitmita. Each blend is handcrafted in small batches using traditional methods and organic ingredients sourced from Ethiopian farmers when possible.",
      tags: ["Culinary", "Organic", "Cultural", "African"],
      sellerAvatar: "https://randomuser.me/api/portraits/women/68.jpg",
      sellerStory: "Fatima shares her family's culinary traditions through these carefully crafted spice blends.",
      featured: true,
      dietary: ["Vegan", "Gluten-free"],
      weight: "250g total (5 x 50g jars)",
      shelfLife: "12 months when stored properly",
      ingredients: ["Organic spices", "Herbs", "No additives or preservatives"]
    },
    {
      id: 204,
      title: "Afghan Rosewater Cardamom Cookies",
      seller: "Kabul Confections",
      sellerOrigin: "Afghanistan",
      price: 18,
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.7,
      reviews: 29,
      category: "Food",
      description: "Delicate shortbread cookies infused with cardamom and rosewater, a traditional Afghan sweet treat. These melt-in-your-mouth cookies are perfect with tea and are made using a family recipe passed down through generations.",
      tags: ["Culinary", "Cookies", "Cultural", "Middle Eastern"],
      sellerAvatar: "https://randomuser.me/api/portraits/women/58.jpg",
      sellerStory: "Soraya continues her family's baking traditions, sharing the flavors of her homeland through these beloved cookies.",
      featured: false,
      dietary: ["Vegetarian"],
      weight: "300g box (20 cookies)",
      shelfLife: "10 days in airtight container",
      ingredients: ["Flour", "Butter", "Sugar", "Cardamom", "Rosewater"]
    },
    {
      id: 205,
      title: "Somali Spiced Tea Blend",
      seller: "Mogadishu Teas",
      sellerOrigin: "Somalia",
      price: 15,
      image: "https://images.unsplash.com/photo-1547825407-2d060104b7f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.9,
      reviews: 26,
      category: "Food",
      description: "Traditional Somali spiced tea blend with cardamom, cinnamon, cloves, and ginger. This aromatic blend creates a warming, comforting beverage that's central to Somali hospitality and culture.",
      tags: ["Culinary", "Beverage", "Cultural", "African"],
      sellerAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
      sellerStory: "Omar shares the traditional tea of his homeland, a symbol of hospitality and community in Somali culture.",
      featured: true,
      dietary: ["Vegan", "Gluten-free"],
      weight: "100g loose leaf blend",
      shelfLife: "6 months when stored properly",
      ingredients: ["Black tea", "Cardamom", "Cinnamon", "Cloves", "Ginger"]
    },
    {
      id: 206,
      title: "Syrian Olive Oil Soap",
      seller: "Aleppo Traditions",
      sellerOrigin: "Syria",
      price: 12,
      image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.8,
      reviews: 33,
      category: "Bath & Body",
      description: "Traditional Aleppo soap made with olive oil and laurel oil using centuries-old Syrian techniques. This natural soap is gentle on skin, long-lasting, and free from artificial ingredients.",
      tags: ["Handmade", "Natural", "Cultural", "Middle Eastern"],
      sellerAvatar: "https://randomuser.me/api/portraits/women/25.jpg",
      sellerStory: "Layla continues her family's soap-making tradition, preserving this ancient Syrian craft in her new home.",
      featured: false,
      weight: "Set of 3 bars (100g each)",
      ingredients: ["Olive oil", "Laurel oil", "Water", "Lye"],
      process: "Aged for 6+ months using traditional methods"
    },
    {
      id: 207,
      title: "Handmade Ceramic Mugs",
      seller: "Hassan's Pottery",
      sellerOrigin: "Afghanistan",
      price: 22,
      image: "https://images.unsplash.com/photo-1537185020140-c8ef1a23e464?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.6,
      reviews: 15,
      category: "Crafts",
      description: "Set of 2 handmade ceramic mugs featuring traditional Afghan designs. Each piece is unique, handcrafted, and microwave/dishwasher safe. Perfect for enjoying your favorite hot beverages.",
      tags: ["Handmade", "Ceramics", "Kitchen", "Cultural"],
      sellerAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
      sellerStory: "Hassan learned pottery from his father and continues the craft in his new home.",
      featured: false,
      dimensions: "4\" tall, 3.5\" diameter",
      capacity: "12 oz each",
      materials: ["Clay", "Lead-free glaze"],
      care: "Dishwasher and microwave safe"
    },
  ];

const FEATURED_VENDORS_DATA = [
  {
    id: 'vendor1',
    name: "Amina's Kitchen",
    origin: "Syria",
    avatar: "https://randomuser.me/api/portraits/women/40.jpg",
    bannerImage: "https://source.unsplash.com/random/800x300/?syrian-food,kitchen",
    story: "Amina, a passionate chef from Aleppo, shares the rich culinary heritage of Syria. Her kitchen offers authentic, home-style dishes made with love and traditional recipes passed down through generations. Each meal tells a story of resilience and hope.",
    products: ["Handmade Baklava", "Spiced Hummus", "Traditional Kibbeh"],
    category: "Food & Catering",
    joinedDate: "2023-05-15",
    impactStatement: "Supporting Amina helps her rebuild her life and share her culture with the community."
  },
  {
    id: 'vendor2',
    name: "Jamal's Artisan Crafts",
    origin: "Afghanistan",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    bannerImage: "https://source.unsplash.com/random/800x300/?afghan-crafts,woodwork",
    story: "Jamal is a skilled artisan from Kabul, specializing in traditional Afghan woodworking and calligraphy. His intricate designs reflect centuries of artistic tradition. By purchasing his crafts, you support the preservation of cultural heritage.",
    products: ["Carved Wooden Boxes", "Calligraphy Art", "Handmade Rugs (small)"],
    category: "Handicrafts & Art",
    joinedDate: "2022-11-20",
    impactStatement: "Jamal's work provides for his family and keeps ancient craft techniques alive."
  },
  {
    id: 'vendor3',
    name: "Nyala's Bright Threads",
    origin: "Ethiopia",
    avatar: "https://randomuser.me/api/portraits/women/42.jpg",
    bannerImage: "https://source.unsplash.com/random/800x300/?ethiopian-textiles,fabric",
    story: "Nyala creates vibrant textiles and clothing inspired by Ethiopian traditions. Her work combines traditional patterns with contemporary designs, resulting in unique and beautiful pieces. She empowers other women in her community by teaching them her skills.",
    products: ["Handwoven Scarves", "Embroidered Dresses", "Colorful Table Linens"],
    category: "Clothing & Textiles",
    joinedDate: "2024-01-10",
    impactStatement: "Purchases from Nyala support women's empowerment and sustainable livelihoods."
  }
];
  
  // Combine all products into a single array
  const products = [...handicraftProducts, ...digitalProducts.filter(item => item.category === "Digital Products"), ...bakeryProducts];
  
  // Services data
  const services = [
    ...digitalProducts.filter(item => item.category === "Services"),
    {
      id: 301,
      title: "Catering Services",
      provider: "Global Flavors",
      sellerOrigin: "Various Countries",
      price: 150,
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.8,
      reviews: 35,
      category: "Food",
      description: "Authentic multicultural catering for events. Offering cuisines from Syria, Afghanistan, Ethiopia, and more. Our chefs prepare traditional dishes with authentic ingredients and techniques.",
      tags: ["Culinary", "Events", "Cultural", "Food"],
      sellerAvatar: "https://randomuser.me/api/portraits/women/56.jpg",
      sellerStory: "A collective of refugee chefs sharing their cultural heritage through food.",
      featured: true,
      hourlyRate: false,
      deliveryTime: "Requires 72 hours notice",
      servingSize: "Starting price for 10 people",
      dietaryOptions: ["Vegetarian", "Vegan", "Halal", "Gluten-free options available"]
    },
    {
      id: 302,
      title: "Tailoring & Clothing Repair",
      seller: "Stitch in Time",
      sellerOrigin: "Myanmar",
      price: 20,
      image: "https://images.unsplash.com/photo-1556905200-bd982f883637?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.7,
      reviews: 19,
      category: "Services",
      description: "Professional tailoring, alterations, and clothing repair services. Our skilled tailors can handle everything from simple repairs to complex alterations and custom garment creation.",
      tags: ["Fashion", "Repair", "Skill-based", "Professional"],
      sellerAvatar: "https://randomuser.me/api/portraits/women/62.jpg",
      sellerStory: "Skilled tailors from Myanmar continuing their craft and building a new business.",
      featured: false,
      hourlyRate: false,
      deliveryTime: "3-7 days depending on complexity",
      services: ["Alterations", "Repairs", "Custom clothing", "Traditional garments"]
    },
    {
      id: 303,
      title: "Cultural Cooking Classes",
      seller: "Flavors Without Borders",
      sellerOrigin: "Multiple Countries",
      price: 45,
      image: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      rating: 4.9,
      reviews: 48,
      category: "Services",
      description: "Learn to cook authentic dishes from around the world with refugee chefs. Classes include ingredient kits, cultural context, and hands-on instruction in small groups.",
      tags: ["Culinary", "Education", "Cultural", "Experience"],
      sellerAvatar: "https://randomuser.me/api/portraits/men/29.jpg",
      sellerStory: "A collective of refugee chefs sharing their culinary traditions and building community through food education.",
      featured: true,
      hourlyRate: false,
      deliveryTime: "2-hour classes, scheduled weekly",
      classSize: "Maximum 8 participants",
      includes: ["Ingredient kit", "Recipe booklet", "Cultural history handout"]
    },
  ];

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
    setCartItems(cartItems + 1);
    // Show cart after adding item
    setShowCart(true);
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
    setCartItems(cartItems - 1);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleTagSelection = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSupportClick = () => {
    navigate('/support-entrepreneurs');
    // For demo purposes, we'll just show an alert
    alert('Support options: Mentoring, Investment, Skill-sharing, and Purchasing. Contact us to learn more!');
  };

  const handleEnrollClick = () => {
    navigate('/courses/digital-marketing');
    // For demo purposes, we'll just show an alert
    alert('Thank you for your interest in our Digital Marketing course! You have been enrolled successfully.');
  };

  // Filter items based on search query, active tab, category, price range, and tags
  const getFilteredItems = () => {
    // First filter by tab
    let items = tabValue === 0 
      ? [...products, ...services]
      : tabValue === 1
        ? products
        : services;
    
    // Then filter by search query
    items = items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by price range if filters are shown
    if (showFilters) {
      items = items.filter(item => 
        item.price >= priceRange[0] && item.price <= priceRange[1]
      );
      
      // Filter by selected tags if any
      if (selectedTags.length > 0) {
        items = items.filter(item => 
          item.tags && item.tags.some(tag => selectedTags.includes(tag))
        );
      }
    }
    
    // Then filter by category if not 'all'
    if (activeCategory !== 'all') {
      switch(activeCategory) {
        case 'handicrafts':
          return items.filter(item => 
            item.category === 'Crafts' || 
            (item.tags && item.tags.some(tag => ['Handmade', 'Jewelry', 'Accessories'].includes(tag))));
        case 'art':
          return items.filter(item => 
            item.category === 'Art' || 
            (item.tags && item.tags.some(tag => ['Cultural', 'Art'].includes(tag))));
        case 'clothing':
          return items.filter(item => 
            item.category === 'Clothing' || 
            (item.tags && item.tags.some(tag => ['Fashion', 'Clothing'].includes(tag))));
        case 'handmade':
          return items.filter(item => 
            (item.tags && item.tags.includes('Handmade')));
        case 'freelance':
          return items.filter(item => 
            item.category === 'Services' || 
            (item.tags && item.tags.some(tag => ['Professional', 'Service'].includes(tag))));
        case 'downloads':
          return items.filter(item => 
            (item.tags && item.tags.some(tag => ['Digital', 'eBook', 'Cookbook'].includes(tag))));
        case 'apps':
          return items.filter(item => 
            (item.tags && item.tags.some(tag => ['Technology', 'App'].includes(tag))));
        case 'digital':
          return items.filter(item => 
            (item.tags && item.tags.some(tag => ['Digital', 'Technology'].includes(tag))));
        case 'bakery':
          return items.filter(item => 
            item.category === 'Food' || 
            (item.tags && item.tags.some(tag => ['Culinary', 'Dessert', 'Cookies', 'Food'].includes(tag))));
        default:
          return items;
      }
    }
    
    return items;
  };
  
  const filteredItems = getFilteredItems();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs */}
      {activeCategory !== 'all' && (
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 3 }}
        >
          <MuiLink 
            component={Link} 
            to="/"
            sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', textDecoration: 'none' }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </MuiLink>
          <MuiLink 
            component={Link} 
            to="/marketplace"
            sx={{ color: 'text.secondary', textDecoration: 'none' }}
          >
            Marketplace
          </MuiLink>
          <Typography color="text.primary">{categoryTitle}</Typography>
        </Breadcrumbs>
      )}
      
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 700, mb: 1 }}>
        {categoryTitle}
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
        {categoryDescription}
      </Typography>

      {/* Featured Banner */}
      <Paper 
        elevation={3}
        sx={{ 
          borderRadius: 4, 
          overflow: 'hidden', 
          mb: 6,
          position: 'relative',
        }}
      >
        <Grid container>
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                backgroundImage: 'linear-gradient(to right, rgba(42, 125, 111, 0.9), rgba(42, 125, 111, 0.7)), url(https://images.unsplash.com/photo-1547731269-e68ccc0a472c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100%',
                p: { xs: 3, md: 6 },
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
                🌍 Refugee Marketplace
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 3, maxWidth: 600 }}>
                Discover unique handcrafted products, digital services, and delicious food items created by refugee entrepreneurs. Every purchase directly supports refugee livelihoods.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  sx={{ 
                    fontWeight: 600,
                    boxShadow: '0 4px 14px rgba(211, 97, 53, 0.4)',
                  }}
                >
                  Browse Products
                </Button>
                <Button 
                  variant="outlined" 
                  sx={{ 
                    color: 'white', 
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                  startIcon={<LocalShipping />}
                >
                  Shipping Info
                </Button>
                <Button 
                  variant="outlined" 
                  sx={{ 
                    color: 'white', 
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                  startIcon={<Category />}
                >
                  Categories
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              image="https://images.unsplash.com/photo-1604805888183-289a8d25f0b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Handcrafted crochet items"
              sx={{ height: '100%', minHeight: 300, objectFit: 'cover' }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search products and services..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              startIcon={<FilterList />}
              onClick={toggleFilters}
            >
              Filters
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button 
              variant="outlined" 
              color="secondary" 
              fullWidth
              onClick={toggleCart}
              startIcon={
                <Badge badgeContent={cartItems} color="error" sx={{ '& .MuiBadge-badge': { top: -5, right: -5 } }}>
                  <ShoppingCart />
                </Badge>
              }
            >
              Cart
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Filters Panel */}
      {showFilters && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Filter Options</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography id="price-range-slider" gutterBottom>Price Range: ${priceRange[0]} - ${priceRange[1]}</Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={200}
                  aria-labelledby="price-range-slider"
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Product Tags</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['Handmade', 'Cultural', 'Digital', 'Fair Trade', 'Traditional', 'Professional', 'Food', 'Art', 'Technology'].map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => handleTagSelection(tag)}
                    color={selectedTags.includes(tag) ? 'primary' : 'default'}
                    variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                    clickable
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Shopping Cart Panel */}
      {showCart && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Your Shopping Cart</Typography>
          {cart.length === 0 ? (
            <Typography variant="body1" color="text.secondary">Your cart is empty</Typography>
          ) : (
            <>
              {cart.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Box component="img" src={item.image} alt={item.title} sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1, mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.seller}</Typography>
                  </Box>
                  <Typography variant="subtitle1" color="primary" sx={{ mx: 2 }}>${item.price}</Typography>
                  <IconButton onClick={() => removeFromCart(item.id)} color="error" size="small">
                    <DeleteOutline />
                  </IconButton>
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Typography variant="h6">Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</Typography>
                <Button variant="contained" color="primary" onClick={() => navigate('/checkout')}>Checkout</Button>
              </Box>
            </>
          )}
        </Paper>
      )}

      {/* Category Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab icon={<Storefront />} label="All Items" />
          <Tab icon={<LocalOffer />} label="Products" />
          <Tab icon={<HandshakeOutlined />} label="Services" />
          <Tab icon={<People />} label="Featured Vendors" />
          <Tab icon={<AddBusiness />} label="Become a Vendor" />
        </Tabs>
      </Box>
      
      {/* Category Cards */}
      {location.pathname === '/marketplace' && (
        <Box sx={{ mb: 6 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  display: 'flex',
                  flexDirection: 'column',
                  height: '220px',
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Handmade & Artisan Products
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip 
                    label="Handicrafts" 
                    component={Link} 
                    to="/marketplace/handicrafts" 
                    clickable 
                    sx={{ bgcolor: 'primary.light', color: 'white' }}
                  />
                  <Chip 
                    label="Art" 
                    component={Link} 
                    to="/marketplace/art" 
                    clickable 
                    sx={{ bgcolor: 'primary.light', color: 'white' }}
                  />
                  <Chip 
                    label="Clothing" 
                    component={Link} 
                    to="/marketplace/clothing" 
                    clickable 
                    sx={{ bgcolor: 'primary.light', color: 'white' }}
                  />
                </Box>
                <Button 
                  component={Link} 
                  to="/marketplace/handmade"
                  variant="outlined" 
                  color="primary"
                  sx={{ mt: 'auto' }}
                >
                  View All Handmade
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  display: 'flex',
                  flexDirection: 'column',
                  height: '220px',
                  borderLeft: '4px solid',
                  borderColor: 'secondary.main',
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Digital Products & Services
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip 
                    label="Freelancer Services" 
                    component={Link} 
                    to="/marketplace/freelance" 
                    clickable 
                    sx={{ bgcolor: 'secondary.light', color: 'white' }}
                  />
                  <Chip 
                    label="Downloads" 
                    component={Link} 
                    to="/marketplace/downloads" 
                    clickable 
                    sx={{ bgcolor: 'secondary.light', color: 'white' }}
                  />
                  <Chip 
                    label="Apps & Tools" 
                    component={Link} 
                    to="/marketplace/apps" 
                    clickable 
                    sx={{ bgcolor: 'secondary.light', color: 'white' }}
                  />
                </Box>
                <Button 
                  component={Link} 
                  to="/marketplace/digital"
                  variant="outlined" 
                  color="secondary"
                  sx={{ mt: 'auto' }}
                >
                  View All Digital
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  display: 'flex',
                  flexDirection: 'column',
                  height: '220px',
                  borderLeft: '4px solid',
                  borderColor: 'success.main',
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Bakery & Snacks
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip 
                    label="Cakes" 
                    component={Link} 
                    to="/marketplace/bakery/cakes" 
                    clickable 
                    sx={{ bgcolor: '#79854E', color: 'white' }}
                  />
                  <Chip 
                    label="Desserts & Cookies" 
                    component={Link} 
                    to="/marketplace/bakery/desserts" 
                    clickable 
                    sx={{ bgcolor: '#79854E', color: 'white' }}
                  />
                  <Chip 
                    label="Dry Snacks" 
                    component={Link} 
                    to="/marketplace/bakery/snacks" 
                    clickable 
                    sx={{ bgcolor: '#79854E', color: 'white' }}
                  />
                </Box>
                <Button 
                  component={Link} 
                  to="/marketplace/bakery"
                  variant="outlined" 
                  sx={{ mt: 'auto', borderColor: '#79854E', color: '#79854E' }}
                >
                  View All Bakery Items
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* No Results Message */}
      {filteredItems.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No items found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search or browse our other categories
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 3 }}
            onClick={() => {
              setSearchQuery('');
              navigate('/marketplace');
            }}
          >
            View All Products
          </Button>
        </Box>
      )}
      
      {/* Products & Services Grid */}
      <Box sx={{ px: 2 }}>
        <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={6} key={item.id} sx={{
              mb: 4,
              display: 'flex'
            }}>
              <Card sx={{ 
                width: '100%',
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                },
                overflow: 'hidden',
                position: 'relative',
                height: 'auto',
                maxHeight: '450px'
              }}>
                {item.featured && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 20, 
                      right: -30, 
                      transform: 'rotate(45deg)',
                      bgcolor: 'secondary.main',
                      color: 'white',
                      py: 0.5,
                      width: 150,
                      textAlign: 'center',
                      zIndex: 2,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    <Typography variant="caption" fontWeight={600}>
                      FEATURED
                    </Typography>
                  </Box>
                )}
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={item.image}
                    alt={item.title}
                    sx={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                  />
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 12, 
                    left: 12, 
                    bgcolor: 'rgba(255,255,255,0.9)',
                    borderRadius: 4,
                    py: 0.5,
                    px: 1.5,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}>
                    <Typography variant="caption" fontWeight={600} color="primary">
                      {item.category}
                    </Typography>
                  </Box>
                  <IconButton 
                    sx={{ 
                      position: 'absolute', 
                      top: 12, 
                      right: 12, 
                      bgcolor: 'rgba(255,255,255,0.9)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      padding: '4px',
                    }}
                    size="small"
                  >
                    <FavoriteBorder fontSize="small" color="secondary" />
                  </IconButton>
                  
                  {/* Origin flag */}
                  {(item.sellerOrigin || item.providerOrigin) && (
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: 12, 
                      left: 12, 
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      borderRadius: 4,
                      py: 0.5,
                      px: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}>
                      <LocationOn sx={{ fontSize: '0.8rem' }} />
                      <Typography variant="caption" fontWeight={500}>
                        {item.sellerOrigin || item.providerOrigin}
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                <CardContent sx={{ p: 2, pt: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                    <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="subtitle1" color="secondary" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      ${item.price}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={item.sellerAvatar} 
                        alt={item.seller}
                        sx={{ width: 20, height: 20, mr: 0.5 }}
                      />
                      <Typography variant="caption" paragraph sx={{ color: 'text.secondary', mb: 1, display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>
                        {item.description.substring(0, 120)}...
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating 
                        value={item.rating} 
                        precision={0.1} 
                        size="small" 
                        readOnly 
                        sx={{ mr: 0.5, '& .MuiRating-icon': { fontSize: '0.8rem' } }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        ({item.reviews})
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Shopping Info */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                    {item.stock && (
                      <Typography variant="caption" sx={{ 
                        color: item.stock < 5 ? 'error.main' : 'success.main',
                        fontWeight: 500,
                        display: 'block',
                        mb: 0.5
                      }}>
                        {item.stock < 5 ? (
                          <>Only {item.stock} in stock</>
                        ) : (
                          <>{item.stock} in stock</>
                        )}
                      </Typography>
                    )}
                    
                    {item.dimensions && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        <strong>Size:</strong> {item.dimensions}
                      </Typography>
                    )}
                    
                    {item.materials && item.materials.length > 0 && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        <strong>Materials:</strong> {item.materials.slice(0, 2).join(', ')}{item.materials.length > 2 ? '...' : ''}
                      </Typography>
                    )}
                  </Box>
                  
                  {/* Tags */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {item.tags && item.tags.slice(0, 2).map((tag, index) => (
                      <Chip 
                        key={index} 
                        label={tag} 
                        size="small" 
                        sx={{ 
                          height: 20,
                          '& .MuiChip-label': { fontSize: '0.65rem', px: 1 },
                          bgcolor: index % 3 === 0 ? 'rgba(42, 125, 111, 0.1)' : 'rgba(211, 97, 53, 0.1)', 
                          color: index % 3 === 0 ? '#2A7D6F' : '#D36135',
                        }} 
                      />
                    ))}
                  </Box>
                  
                  <Box sx={{ mt: 'auto' }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      fullWidth
                      startIcon={<ShoppingCart />}
                      onClick={addToCart}
                      sx={{ 
                        py: 1.2,
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(42, 125, 111, 0.2)',
                        '&:hover': {
                          boxShadow: '0 6px 16px rgba(42, 125, 111, 0.3)',
                        }
                      }}
                    >
                      {item.category === 'Services' ? 'Book Service' : 'Add to Cart'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Support Entrepreneurs Section */}
      <Paper sx={{ p: 4, mt: 6, borderRadius: 3, bgcolor: '#F9F4EF' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Support Refugee Entrepreneurs
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ 
                bgcolor: theme.palette.primary.main, 
                width: 64, 
                height: 64, 
                mx: 'auto', 
                mb: 2,
                boxShadow: '0 4px 14px rgba(42, 125, 111, 0.2)',
              }}>
                <MonetizationOn sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                Purchase Products
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Buy directly from refugee artisans and entrepreneurs to support their businesses.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ 
                bgcolor: theme.palette.secondary.main, 
                width: 64, 
                height: 64, 
                mx: 'auto', 
                mb: 2,
                boxShadow: '0 4px 14px rgba(211, 97, 53, 0.2)',
              }}>
                <VolunteerActivism sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                Donate
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Contribute to startup funds for refugee entrepreneurs to launch or expand their businesses.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ 
                bgcolor: '#79854E', 
                width: 64, 
                height: 64, 
                mx: 'auto', 
                mb: 2,
                boxShadow: '0 4px 14px rgba(121, 133, 78, 0.2)',
              }}>
                <EmojiObjectsOutlined sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                Mentor
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Share your business expertise to help refugee entrepreneurs grow their ventures.
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            sx={{ px: 4 }}
            onClick={handleSupportClick}
          >
            Learn How to Support
          </Button>
        </Box>
      </Paper>

      {/* Skill Development Card */}
      <Card sx={{ mt: 6, borderRadius: 3, overflow: 'hidden' }}>
        <Grid container>
          <Grid item xs={12} md={8}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                💡 Design your future—start with a 2-week course in Digital Marketing in your language!
              </Typography>
              <Typography variant="body1" paragraph>
                Learn valuable skills to help promote your products and services online. Our Digital Marketing course is available in multiple languages and designed specifically for refugee entrepreneurs.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                sx={{ mt: 2 }}
                onClick={handleEnrollClick}
              >
                Enroll Now
              </Button>
            </CardContent>
          </Grid>
          <Grid item md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box 
              sx={{ 
                bgcolor: theme.palette.primary.main,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
              }}
            >
              <Box component="img" src="https://images.unsplash.com/photo-1557804506-669a67965ba0" alt="Digital Marketing" sx={{ width: '100%', height: 'auto', borderRadius: 2 }} />
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Featured Vendors Tab Content */}
      {tabValue === 3 && (
        <Container sx={{ py: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 1, color: theme.palette.primary.main, fontWeight: 'bold' }}>
            Meet Our Talented Vendors
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, color: 'text.secondary' }}>
            Discover the stories and skills behind the products and services in our marketplace.
          </Typography>
          <Grid container spacing={4}>
            {(FEATURED_VENDORS_DATA || []).map((vendor) => (
              <Grid item xs={12} md={6} key={vendor.id}>
                <Card elevation={3} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, borderRadius: 2, overflow: 'hidden', height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)'} }}>
                  <CardMedia
                    component="img"
                    sx={{ width: { xs: '100%', sm: 200 }, height: { xs: 200, sm: 'auto' }, objectFit: 'cover' }}
                    image={vendor.bannerImage || 'https://source.unsplash.com/random/400x300/?community'}
                    alt={vendor.name}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Avatar src={vendor.avatar} alt={vendor.name} sx={{ width: 56, height: 56, mr: 2, border: `2px solid ${theme.palette.primary.main}` }} />
                        <Box>
                          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                            {vendor.name}
                          </Typography>
                          <Chip label={vendor.category} size="small" color="secondary" sx={{ mr: 1, mb: 0.5 }} />
                          <Typography variant="caption" color="text.secondary">
                            From {vendor.origin}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" paragraph sx={{ maxHeight: 100, overflow: 'auto', whiteSpace: 'pre-line', mb: 1.5 }}>
                        {vendor.story}
                      </Typography>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium' }}>
                        Example Offerings:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                        {(vendor.products || []).slice(0, 3).map(prod => <Chip key={prod} label={prod} size="small" variant="outlined" />)}
                      </Box>
                      <Typography variant="caption" display="block" color="primary.dark" sx={{ fontStyle: 'italic', fontWeight: 'medium' }}>
                        {vendor.impactStatement}
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button variant="contained" size="small" onClick={() => navigate(`/marketplace?vendor=${vendor.id}`)} startIcon={<Storefront />}>
                        View Shop
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* Become a Vendor Tab Content */}
      {tabValue === 4 && (
        <Container sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, maxWidth: '800px', margin: 'auto' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <AddBusiness sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 1 }} />
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Join Our Marketplace
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Are you a refugee entrepreneur or artisan? We invite you to showcase your products and services to a wider audience and grow with our community.
              </Typography>
            </Box>

            <Box sx={{ backgroundColor: 'primary.lighter', p:2, borderRadius: 1, mb:3}}>
              <Typography variant="h6" gutterBottom sx={{color: 'primary.dark', fontWeight:'medium'}}>Why Join RNC Marketplace?</Typography>
              <Grid container spacing={1}>
                {[{
                    icon: <Storefront sx={{color: 'primary.main'}}/>,
                    text: 'Reach new customers and expand your business.'
                  },{
                    icon: <People sx={{color: 'primary.main'}}/>,
                    text: 'Become part of a supportive network of entrepreneurs.'
                  }, {
                    icon: <SupportAgent sx={{color: 'primary.main'}}/>,
                    text: 'Access resources and support from the RNC team.'
                  }, {
                    icon: <PriceCheck sx={{color: 'primary.main'}}/>,
                    text: 'No listing fees. Fair and transparent commission structure (details upon approval).'
                  }
                ].map(item => (
                  <Grid item xs={12} sm={6} key={item.text}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                      {item.icon}
                      <Typography variant="body2">{item.text}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
            
            <Divider sx={{ my: 3 }}><Chip label="Application Form" /></Divider>
            
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              const formData = new FormData(e.target);
              const name = formData.get('fullName');
              if (!name || !formData.get('email') || !formData.get('productCategory') || !formData.get('businessDescription') || !formData.get('agreement')) {
                // Using alert for now, ideally replace with Snackbar or other MUI notification
                alert('Please fill in all required fields.');
                return;
              }
              // Simulate submission
              setSnackbarOpen(true);
              setSnackbarMessage(`Application submitted! Thank you, ${name}. We will review and contact you soon.`);
              setSnackbarSeverity('success');
              e.target.reset();
            }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth required label="Full Name" name="fullName" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Business Name (if any)" name="businessName" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth required type="email" label="Email Address" name="email" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Phone Number (Optional)" name="phone" variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    required
                    label="Primary Category of Products/Services"
                    name="productCategory"
                    defaultValue=""
                    variant="outlined"
                    helperText="Please select the main category that best fits your offerings."
                  >
                    <MenuItem value="handicrafts">Handicrafts & Art</MenuItem>
                    <MenuItem value="clothing">Clothing & Textiles</MenuItem>
                    <MenuItem value="food">Food & Bakery</MenuItem>
                    <MenuItem value="services">Services (e.g., Translation, Design)</MenuItem>
                    <MenuItem value="digital">Digital Products</MenuItem>
                    <MenuItem value="other">Other (Please specify in description)</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={4}
                    label="Brief Description of Your Business and Products/Services"
                    name="businessDescription"
                    variant="outlined"
                    helperText="Tell us about what you create or offer. Include details about your unique skills or cultural significance if applicable."
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Link to Existing Shop/Website (Optional)" name="websiteLink" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Link to Social Media (Optional)" name="socialMediaLink" variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox required name="agreement" color="primary" />}
                    label="I have read and agree to the RNC Marketplace Vendor Terms and Conditions."
                  />
                  <Typography variant="caption" display="block" color="text.secondary">
                    (Vendor Terms and Conditions will be provided during the onboarding process if your application is approved.)
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
                  <Button type="submit" variant="contained" size="large" startIcon={<Send />} sx={{ px: 4, py: 1.5 }}>
                    Submit Application
                  </Button>
                </Grid>
              </Grid>
            </form>
            <Alert severity="info" sx={{ mt: 3, backgroundColor: 'info.lighter' }}>
              Our team will review your application and aim to contact you within 5-7 business days. Thank you for your interest in joining the RNC Marketplace!
            </Alert>
          </Paper>
        </Container>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: '24px' }} // Force position to the top
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Marketplace;
