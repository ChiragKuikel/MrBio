import blogImage from '../../../src/assets/images/blog_picture.jpg';
import harmfulChemical from '../../../src/assets/images/harmful_chemical.jpg';
import organicLivingImg from '../../../src/assets/images/nutritional-support.jpg';
import organicLivingImg_2 from '../../../src/assets/images/organic.png';
import organicBees from '../../../src/assets/images/organic_bees.png';


export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string | any;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Ultimate Guide to Organic Living: Why It Matterssss",
    excerpt: "Discover the benefits of organic living and how it impacts your health, the environment, and future generations.",
    content: `Organic living is more than just a trend—it's a conscious choice that benefits your health, the environment, and future generations. When you choose organic products, you're supporting farming practices that work in harmony with nature rather than against it.

Organic farming eliminates the use of synthetic pesticides, herbicides, and fertilizers that can harm soil health and water quality. Instead, organic farmers rely on natural methods like crop rotation, composting, and beneficial insects to maintain healthy soil and control pests.

The benefits of organic living extend far beyond your personal health. Organic farming practices help preserve biodiversity, reduce water pollution, and combat climate change by sequestering carbon in healthy soils. By choosing organic, you're voting with your wallet for a more sustainable future.

Start your organic journey by focusing on the "Dirty Dozen" - the fruits and vegetables that typically have the highest pesticide residues when grown conventionally. These include strawberries, spinach, kale, nectarines, apples, grapes, and bell peppers.`,
    author: "Dr. Sarah Johnson",
    date: "2024-01-15",
    category: "Organic Living",
    readTime: "5 min read",
    image: organicLivingImg,  // Use the imported image
    tags: ["organic", "health", "sustainability", "wellness"]
  },
  {
    id: 2,
    title: "10 Superfood Smoothie Recipes for a Healthy Morning",
    excerpt: "Start your day right with these nutrient-packed smoothie recipes that will boost your energy and immunity.",
    content: `A healthy morning routine starts with the right fuel for your body. These superfood smoothie recipes are packed with essential nutrients, antioxidants, and natural energy boosters that will keep you feeling great throughout the day.

**Green Power Smoothie**
- 2 cups spinach
- 1 frozen banana
- 1 cup almond milk
- 1 tbsp chia seeds
- 1 tbsp almond butter
- 1 tsp honey

**Berry Antioxidant Blast**
- 1 cup mixed berries (strawberries, blueberries, raspberries)
- 1 cup coconut water
- 1 tbsp flaxseeds
- 1 scoop vanilla protein powder
- 1 tsp cinnamon

**Tropical Immunity Booster**
- 1 cup pineapple
- 1 orange
- 1 cup coconut milk
- 1 tbsp ginger
- 1 tbsp turmeric
- 1 tsp honey

These smoothies are not only delicious but also provide essential vitamins, minerals, and antioxidants that support your immune system, improve digestion, and give you sustained energy without the crash that comes from processed foods.`,
    author: "Chef Maria Rodriguez",
    date: "2024-01-10",
    category: "Healthy Recipes",
    readTime: "4 min read",
    image: organicLivingImg_2,
    tags: ["smoothies", "superfoods", "breakfast", "nutrition"]
  },
  {
    id: 3,
    title: "Sustainable Shopping: How to Make Eco-Friendly Choices",
    excerpt: "Learn practical tips for making environmentally conscious shopping decisions that benefit both you and the planet.",
    content: `Sustainable shopping isn't just about buying organic products—it's about making conscious choices that consider the entire lifecycle of what you purchase. From production to packaging to disposal, every product has an environmental impact.

**Start with a Plan**
Before heading to the store, make a list of what you actually need. This simple step can prevent impulse purchases and reduce food waste. Plan your meals for the week and buy only what you'll use.

**Choose Local and Seasonal**
Local produce doesn't just taste better—it also has a smaller carbon footprint since it doesn't need to travel long distances. Seasonal produce is often more affordable and nutrient-dense.

**Bring Your Own Bags and Containers**
Invest in reusable shopping bags, produce bags, and containers. Many stores now offer bulk sections where you can fill your own containers, reducing packaging waste.

**Read Labels Carefully**
Look beyond organic certifications. Consider factors like fair trade certification, which ensures workers are paid fairly, and look for products with minimal, recyclable packaging.

**Support Sustainable Brands**
Research the companies you buy from. Look for brands that are transparent about their supply chain, use renewable energy in production, and have clear sustainability goals.`,
    author: "Emma Thompson",
    date: "2024-01-08",
    category: "Sustainability",
    readTime: "6 min read",
    image: harmfulChemical,
    tags: ["sustainability", "shopping", "eco-friendly", "conscious-living"]
  },
  {
    id: 4,
    title: "The Science Behind Natural Skincare: What Really Works",
    excerpt: "Discover the truth about natural skincare ingredients and learn which ones actually deliver results for your skin.",
    content: `The beauty industry is flooded with products claiming to be "natural" and "organic," but not all natural ingredients are created equal. Understanding the science behind natural skincare can help you make informed decisions about what you put on your skin.

**Hyaluronic Acid: Nature's Moisturizer**
Despite its chemical-sounding name, hyaluronic acid is a naturally occurring substance in your body. It's incredibly effective at retaining moisture and can hold up to 1000 times its weight in water. Look for products with hyaluronic acid for intense hydration.

**Vitamin C: The Antioxidant Powerhouse**
Natural sources of vitamin C, like citrus fruits and rosehip oil, provide powerful antioxidant protection against free radicals that cause premature aging. Vitamin C also helps brighten skin and even out skin tone.

**Retinol Alternatives**
While retinol is effective, it can be irritating. Natural alternatives like bakuchiol, derived from the babchi plant, provide similar anti-aging benefits without the side effects.

**The Truth About Essential Oils**
Essential oils can be beneficial but should be used with caution. Always dilute them properly and patch test before use. Some oils, like tea tree oil, have proven antibacterial properties, while others may cause irritation.

Remember, natural doesn't always mean better. The key is finding ingredients that work for your specific skin type and concerns.`,
    author: "Dr. Lisa Chen",
    date: "2024-01-05",
    category: "Wellness",
    readTime: "7 min read",
    image: organicBees,
    tags: ["skincare", "natural", "beauty", "wellness"]
  },
  {
    id: 5,
    title: "Mindful Eating: Transform Your Relationship with Food",
    excerpt: "Learn how mindful eating practices can improve your digestion, reduce stress, and help you make healthier food choices.",
    content: `Mindful eating is about bringing awareness to the entire experience of eating—from the moment you choose your food to the last bite. This practice can transform not just your relationship with food, but your overall health and well-being.

**Start with Gratitude**
Before each meal, take a moment to express gratitude for your food. Consider the journey it took to reach your plate—the farmers, the soil, the sun, and the rain that made it possible.

**Engage All Your Senses**
Take time to notice the colors, textures, and aromas of your food. Chew slowly and pay attention to the flavors and how they change as you eat. This simple practice can help you feel more satisfied with smaller portions.

**Listen to Your Body**
Learn to distinguish between physical hunger and emotional eating. Check in with yourself before, during, and after meals. Are you eating because you're truly hungry, or because you're stressed, bored, or sad?

**Create a Peaceful Environment**
Turn off the TV, put away your phone, and create a calm eating environment. This helps you focus on your meal and prevents overeating due to distraction.

**Practice Portion Awareness**
Use smaller plates, serve yourself reasonable portions, and wait 20 minutes before considering seconds. It takes time for your brain to register that you're full.

Mindful eating isn't about restriction—it's about creating a more conscious, enjoyable relationship with food that supports your health and well-being.`,
    author: "Dr. Michael Brown",
    date: "2024-01-03",
    category: "Mindfulness",
    readTime: "5 min read",
    image:blogImage,
    tags: ["mindfulness", "eating", "health", "wellness"]
  }
];

export const categories = [
  "All",
  "Organic Living",
  "Healthy Recipes", 
  "Sustainability",
  "Wellness",
  "Mindfulness"
]; 