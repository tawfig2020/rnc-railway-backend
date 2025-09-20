// Mock data for the Refugee Network Centre platform
export const mockCourses = [
  {
    id: 1,
    title: "Digital Literacy Fundamentals",
    category: "Digital Skills",
    level: "Beginner",
    language: "English",
    instructor: "Ahmed Hassan",
    duration: "4 weeks",
    image: "https://source.unsplash.com/random/300x200/?computer",
    rating: 4.7,
    enrolled: 234,
    description: "Master the basics of using computers, smartphones, and internet browsing safely.",
    progress: 75,
    tags: ["digital", "beginner", "essential"],
    modules: [
      { id: 1, title: "Computer Basics", completed: true, progress: 100 },
      { id: 2, title: "Internet Navigation", completed: true, progress: 100 },
      { id: 3, title: "Email Communication", completed: true, progress: 100 },
      { id: 4, title: "Digital Safety", completed: false, progress: 60 },
      { id: 5, title: "Mobile Applications", completed: false, progress: 0 }
    ]
  },
  {
    id: 2,
    title: "Entrepreneurship 101",
    category: "Business",
    level: "Intermediate",
    language: "Arabic",
    instructor: "Layla Al-Farsi",
    duration: "8 weeks",
    image: "https://source.unsplash.com/random/300x200/?business",
    rating: 4.9,
    enrolled: 178,
    description: "Learn the fundamentals of building your own business with limited resources.",
    progress: 30,
    tags: ["business", "entrepreneurship", "startup"],
    modules: [
      { id: 1, title: "Business Ideation", completed: true, progress: 100 },
      { id: 2, title: "Market Research", completed: true, progress: 100 },
      { id: 3, title: "Building a Business Plan", completed: false, progress: 45 },
      { id: 4, title: "Financial Planning", completed: false, progress: 0 },
      { id: 5, title: "Marketing Strategies", completed: false, progress: 0 }
    ]
  },
  {
    id: 3,
    title: "Community Health Worker Training",
    category: "Healthcare",
    level: "Intermediate",
    language: "French",
    instructor: "Dr. Marie Dupont",
    duration: "12 weeks",
    image: "https://source.unsplash.com/random/300x200/?healthcare",
    rating: 4.8,
    enrolled: 156,
    description: "Prepare to become a community health advocate and provide basic healthcare support.",
    progress: 10,
    tags: ["health", "community", "career"],
    modules: [
      { id: 1, title: "Basic Health Concepts", completed: true, progress: 100 },
      { id: 2, title: "Preventive Care", completed: false, progress: 20 },
      { id: 3, title: "Women & Children's Health", completed: false, progress: 0 },
      { id: 4, title: "Mental Health Support", completed: false, progress: 0 },
      { id: 5, title: "Community Outreach", completed: false, progress: 0 }
    ]
  },
  {
    id: 4,
    title: "Web Development Foundations",
    category: "Programming",
    level: "Beginner",
    language: "English",
    instructor: "Tariq Johnson",
    duration: "10 weeks",
    image: "https://source.unsplash.com/random/300x200/?coding",
    rating: 4.6,
    enrolled: 298,
    description: "Build your first website using HTML, CSS, and JavaScript.",
    progress: 0,
    tags: ["coding", "web", "tech"],
    modules: [
      { id: 1, title: "HTML Basics", completed: false, progress: 0 },
      { id: 2, title: "CSS Styling", completed: false, progress: 0 },
      { id: 3, title: "JavaScript Interactivity", completed: false, progress: 0 },
      { id: 4, title: "Responsive Design", completed: false, progress: 0 },
      { id: 5, title: "Building a Portfolio", completed: false, progress: 0 }
    ]
  },
  {
    id: 5,
    title: "English for Job Seekers",
    category: "Language",
    level: "Intermediate",
    language: "English/Arabic",
    instructor: "Sarah Williams",
    duration: "6 weeks",
    image: "https://source.unsplash.com/random/300x200/?language",
    rating: 4.5,
    enrolled: 321,
    description: "English language skills focused on job applications, interviews, and workplace communication.",
    progress: 50,
    tags: ["language", "career", "english"],
    modules: [
      { id: 1, title: "Resume Writing", completed: true, progress: 100 },
      { id: 2, title: "Interview Skills", completed: true, progress: 100 },
      { id: 3, title: "Workplace Communication", completed: false, progress: 30 },
      { id: 4, title: "Email & Formal Writing", completed: false, progress: 0 },
      { id: 5, title: "Presentations", completed: false, progress: 0 }
    ]
  }
];

export const mockMarketplaceItems = [
  {
    id: 1,
    title: "Hand-Woven Textile Art",
    category: "Crafts",
    seller: "Fatima Karam",
    location: "Jordan",
    price: 45,
    image: "https://source.unsplash.com/random/300x300/?textile",
    description: "Traditional hand-woven textile art using techniques passed down through generations.",
    rating: 4.9,
    sold: 23,
    featured: true
  },
  {
    id: 2,
    title: "Digital Marketing Services",
    category: "Services",
    seller: "Hassan Al-Bakri",
    location: "Lebanon",
    price: 30,
    image: "https://source.unsplash.com/random/300x300/?marketing",
    description: "Social media management and digital marketing strategies for small businesses.",
    rating: 4.7,
    sold: 45,
    featured: false
  },
  {
    id: 3,
    title: "Arabic Calligraphy Art",
    category: "Art",
    seller: "Omar Nouri",
    location: "Syria",
    price: 60,
    image: "https://source.unsplash.com/random/300x300/?calligraphy",
    description: "Modern calligraphy pieces that blend traditional forms with contemporary designs.",
    rating: 5.0,
    sold: 17,
    featured: true
  },
  {
    id: 4,
    title: "Homemade Pastries",
    category: "Food",
    seller: "Amira Khoury",
    location: "Iraq",
    price: 25,
    image: "https://source.unsplash.com/random/300x300/?pastry",
    description: "Traditional sweet and savory pastries made with authentic family recipes.",
    rating: 4.8,
    sold: 56,
    featured: false
  },
  {
    id: 5,
    title: "Language Translation",
    category: "Services",
    seller: "Malik Farooq",
    location: "Pakistan",
    price: 20,
    image: "https://source.unsplash.com/random/300x300/?translation",
    description: "Professional translation services for documents, websites, and business communications.",
    rating: 4.6,
    sold: 38,
    featured: false
  },
  {
    id: 6,
    title: "Beaded Jewelry",
    category: "Fashion",
    seller: "Grace Mulumba",
    location: "DRC",
    price: 35,
    image: "https://source.unsplash.com/random/300x300/?jewelry",
    description: "Colorful, handcrafted beaded jewelry inspired by African traditions.",
    rating: 4.9,
    sold: 29,
    featured: true
  }
];

export const mockBlogs = [
  {
    id: 1,
    title: "My Journey from Survival to Start-up: How I Turned My Art Into Income",
    author: "Fatima Al-Hariri",
    origin: "Yemen",
    date: "May 15, 2025",
    image: "https://source.unsplash.com/random/800x500/?portrait",
    excerpt: "Five years ago, I fled with nothing but a small bag of belongings. Today, I run my own art business and employ four other refugee women in my community.",
    content: "My journey began in 2020 when I fled my home with just a small bag of belongings and my children. The early days in the camp were the hardest—I'd lost everything including my identity as an art teacher. But creativity never leaves you. I started creating small paintings using materials I could find, and other refugees began asking me to create pieces for them to send to family abroad. With support from the RNC marketplace program, I turned this into a business that now supports not just my family but provides income for four other women in my community. My art now ships internationally, and each piece tells a story of resilience.",
    category: "Success Stories",
    tags: ["art", "entrepreneurship", "resilience"],
    featured: true,
    likes: 145
  },
  {
    id: 2,
    title: "5 Digital Skills That Changed My Life After Displacement",
    author: "Ahmad Rashid",
    origin: "Syria",
    date: "May 10, 2025",
    image: "https://source.unsplash.com/random/800x500/?laptop",
    excerpt: "Learning these essential digital skills gave me economic independence and opened doors I never knew existed.",
    content: "When I arrived as a refugee, I had a background in physical engineering but no way to practice it. The digital skills courses at the Refugee Network Centre gave me a completely new path. Learning web development, particularly the basics of HTML, CSS, and JavaScript, allowed me to work remotely for companies across Europe. Database management, digital marketing, and project management tools became the foundation of my new career. The most surprising skill that proved valuable was basic video editing—I now help other refugees tell their stories online and build their personal brands. These skills didn't require expensive education, just consistent practice and mentorship.",
    category: "Education",
    tags: ["digital skills", "career change", "technology"],
    featured: false,
    likes: 98
  },
  {
    id: 3,
    title: "Finding My Voice: How I Became an Advocate for Refugee Rights",
    author: "Nala Gedi",
    origin: "Somalia",
    date: "April 28, 2025",
    image: "https://source.unsplash.com/random/800x500/?microphone",
    excerpt: "From being unable to speak the local language to addressing the United Nations—this is my story of finding my voice.",
    content: "For the first two years after fleeing Somalia, I felt invisible. I couldn't speak the local language, and my confidence was shattered by trauma. The turning point came when I joined a women's discussion group at the Refugee Network Centre. At first, I just listened, but gradually, I started sharing my experiences. The group leader encouraged me to write my story, which was eventually published in a local newspaper. That led to speaking opportunities, and with each speech, my confidence grew. Last month, I addressed a UN forum on refugee women's rights—something I could never have imagined five years ago. Finding my voice wasn't just about learning a language but about reclaiming my sense of worth and purpose.",
    category: "Advocacy",
    tags: ["women's rights", "public speaking", "empowerment"],
    featured: true,
    likes: 213
  }
];

export const mockForumQuestions = [
  {
    id: 1,
    title: "How do I access free health services in Jordan as a refugee?",
    author: "Ibrahim K.",
    date: "May 21, 2025",
    category: "Health",
    description: "I recently moved to Amman with my family and need to find healthcare for my daughter who has asthma. What services are available and how can I access them?",
    answers: [
      {
        id: 101,
        author: "Dr. Layla",
        date: "May 21, 2025",
        content: "You can access free health services through UNHCR by first registering for a services card at their office in Khalda. For asthma specifically, Doctors Without Borders runs a specialized clinic on Tuesdays and Thursdays in East Amman. I'd recommend calling this number for an appointment: +962-XX-XXXXXXX.",
        votes: 12,
        accepted: true
      },
      {
        id: 102,
        author: "Mohammed S.",
        date: "May 22, 2025",
        content: "I have a daughter with asthma too. Besides the official services, there's a community support group that meets weekly and sometimes provides free inhalers. I can connect you via PM if you're interested.",
        votes: 8,
        accepted: false
      }
    ],
    tags: ["healthcare", "jordan", "children"],
    views: 156,
    votes: 18
  },
  {
    id: 2,
    title: "What documentation do I need for school enrollment in Germany?",
    author: "Amina L.",
    date: "May 19, 2025",
    category: "Education",
    description: "We've recently received asylum status in Berlin and need to enroll our children (ages 8 and 13) in school. What documents are required and is there any special support for refugee children who don't speak German yet?",
    answers: [
      {
        id: 201,
        author: "Stefan B.",
        date: "May 19, 2025",
        content: "For Berlin specifically, you'll need: 1) Your asylum approval documents, 2) Residence registration (Anmeldung), 3) Any previous school records if available (though not strictly required), 4) Vaccination records. Your children will likely be placed in a 'welcome class' (Willkommensklasse) first to learn German before transitioning to regular classes. The school will arrange an assessment meeting. I volunteer as an education mentor and can help if you need assistance during the process.",
        votes: 15,
        accepted: true
      }
    ],
    tags: ["education", "germany", "children", "language"],
    views: 203,
    votes: 22
  },
  {
    id: 3,
    title: "Tips for preparing for job interviews in a new country?",
    author: "Youssef T.",
    date: "May 17, 2025",
    category: "Career",
    description: "I have my first job interview next week for an entry-level position at a retail store. I'm nervous about cultural differences and language barriers. Any advice on how to prepare?",
    answers: [
      {
        id: 301,
        author: "Career Coach Sarah",
        date: "May 17, 2025",
        content: "Congratulations on getting an interview! Here are my top tips: 1) Research the company and understand their culture, 2) Practice common interview questions in the local language, 3) Prepare specific examples of relevant experience, even if it's from your home country, 4) Dress professionally according to local standards, 5) Arrive 10-15 minutes early, 6) Be honest about language skills but emphasize your willingness to learn. Remember that soft skills like reliability, problem-solving, and teamwork are highly valued. Good luck!",
        votes: 24,
        accepted: true
      },
      {
        id: 302,
        author: "Ahmed R.",
        date: "May 18, 2025",
        content: "I went through this last year! One thing that helped me was asking a local friend to do a mock interview with me. Also, in my retail interview, they appreciated that I mentioned my experience serving diverse customers in my home country. Don't be afraid to show your unique perspective as someone with international experience.",
        votes: 19,
        accepted: false
      }
    ],
    tags: ["employment", "interviews", "career advice"],
    views: 287,
    votes: 31
  }
];

export const mockCommunityProjects = [
  {
    id: 1,
    title: "Refugee Tech Hub",
    category: "Social Enterprise",
    location: "Virtual & Amman, Jordan",
    organizer: "Tariq Al-Fahim",
    description: "A community space where refugees can learn coding, digital marketing, and other tech skills with mentorship from industry professionals.",
    image: "https://source.unsplash.com/random/400x300/?technology",
    participants: 48,
    openings: 15,
    skills: ["Web Development", "Graphic Design", "Digital Marketing"],
    impact: "Helped 30+ refugees secure remote tech positions in the past year.",
    featured: true,
    startDate: "January 15, 2025"
  },
  {
    id: 2,
    title: "Community Garden Initiative",
    category: "Local Support",
    location: "Berlin, Germany",
    organizer: "Fatima Nowak",
    description: "Transforming unused urban spaces into community gardens where refugee families can grow food, connect with neighbors, and heal through nature.",
    image: "https://source.unsplash.com/random/400x300/?garden",
    participants: 27,
    openings: 8,
    skills: ["Gardening", "Community Building", "Sustainable Agriculture"],
    impact: "Established 3 community gardens producing fresh food for 50+ families.",
    featured: false,
    startDate: "March 5, 2025"
  },
  {
    id: 3,
    title: "Artisan Collective",
    category: "Social Enterprise",
    location: "Nairobi, Kenya",
    organizer: "Grace Mwangi",
    description: "A cooperative of refugee artisans creating and selling traditional crafts with modern designs, supporting each other through shared resources and knowledge.",
    image: "https://source.unsplash.com/random/400x300/?crafts",
    participants: 35,
    openings: 10,
    skills: ["Traditional Crafts", "Business Management", "Marketing"],
    impact: "Generated sustainable income for 35 families and preserved cultural heritage.",
    featured: true,
    startDate: "February 10, 2025"
  },
  {
    id: 4,
    title: "Youth Mentorship Program",
    category: "Education",
    location: "Toronto, Canada",
    organizer: "Hassan Ahmadi",
    description: "Connecting refugee youth with established professionals in their fields of interest for guidance, support, and career development opportunities.",
    image: "https://source.unsplash.com/random/400x300/?mentorship",
    participants: 42,
    openings: 20,
    skills: ["Mentoring", "Career Counseling", "Youth Development"],
    impact: "Supported 100+ young refugees in educational and career advancement.",
    featured: false,
    startDate: "April 1, 2025"
  }
];

export const mockAIProjects = [
  {
    id: 1,
    title: "Multilingual Chatbot Assistant",
    difficulty: "Beginner",
    duration: "2-4 weeks",
    description: "Build a simple chatbot that can help refugees find resources in their native language.",
    skills: ["Basic JavaScript", "API Integration", "Simple NLP"],
    image: "https://source.unsplash.com/random/400x300/?chatbot",
    featured: true,
    resources: [
      { title: "Chatbot Fundamentals Course", type: "course" },
      { title: "Dialogflow Tutorial", type: "tutorial" },
      { title: "Sample Chatbot Code", type: "code" }
    ]
  },
  {
    id: 2,
    title: "Language Learning App",
    difficulty: "Intermediate",
    duration: "4-8 weeks",
    description: "Create an app that helps refugees learn the language of their host country through interactive exercises.",
    skills: ["React/React Native", "Database Design", "User Authentication"],
    image: "https://source.unsplash.com/random/400x300/?language",
    featured: true,
    resources: [
      { title: "App Development Bootcamp", type: "course" },
      { title: "Building Language Learning Features", type: "tutorial" },
      { title: "Language App GitHub Repo", type: "code" }
    ]
  },
  {
    id: 3,
    title: "Document Translation Tool",
    difficulty: "Intermediate",
    duration: "3-6 weeks",
    description: "Develop a tool that uses AI to help translate important documents like medical records or legal papers.",
    skills: ["Python", "Machine Learning Basics", "OCR Technology"],
    image: "https://source.unsplash.com/random/400x300/?document",
    featured: false,
    resources: [
      { title: "ML for Translation Course", type: "course" },
      { title: "Working with OCR Libraries", type: "tutorial" },
      { title: "Translation API Documentation", type: "code" }
    ]
  },
  {
    id: 4,
    title: "Community Resource Mapper",
    difficulty: "Advanced",
    duration: "6-10 weeks",
    description: "Build an interactive map application that helps refugees find services and resources in their local area.",
    skills: ["Full-stack Development", "GIS/Mapping APIs", "Data Visualization"],
    image: "https://source.unsplash.com/random/400x300/?map",
    featured: false,
    resources: [
      { title: "Mapping Applications Masterclass", type: "course" },
      { title: "Working with Geolocation Data", type: "tutorial" },
      { title: "Open Source Mapping Tools", type: "code" }
    ]
  }
];

export const mockTestimonials = [
  {
    id: 1,
    name: "Amina K.",
    origin: "Syria",
    quote: "The digital skills course changed my life. I now work remotely as a web developer, supporting my family and building a new future.",
    image: "https://source.unsplash.com/random/100x100/?portrait",
    course: "Web Development Foundations"
  },
  {
    id: 2,
    name: "Khalid M.",
    origin: "Afghanistan",
    quote: "Through the marketplace, I've been able to sell my traditional artwork globally. What started as a hobby has become a thriving business.",
    image: "https://source.unsplash.com/random/100x100/?man",
    course: "Entrepreneurship 101"
  },
  {
    id: 3,
    name: "Grace T.",
    origin: "DRC",
    quote: "The community projects connected me with others who understand my experience. Together, we're building something meaningful in our new home.",
    image: "https://source.unsplash.com/random/100x100/?woman",
    course: "Community Leadership Program"
  },
  {
    id: 4,
    name: "Mohammed A.",
    origin: "Somalia",
    quote: "Learning English through RNC's courses helped me navigate my new environment and ultimately secure a job in healthcare.",
    image: "https://source.unsplash.com/random/100x100/?portrait",
    course: "English for Job Seekers"
  }
];

export const languages = [
  { code: "en", name: "English" },
  { code: "ar", name: "العربية (Arabic)" },
  { code: "fr", name: "Français (French)" },
  { code: "es", name: "Español (Spanish)" },
  { code: "fa", name: "فارسی (Persian)" },
  { code: "sw", name: "Kiswahili (Swahili)" }
];
