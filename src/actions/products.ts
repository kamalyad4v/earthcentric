"use server";

import db from "@/lib/db";

export interface ProductFilter {
  category?: string;
  minSustainabilityScore?: number;
  verifiedOnly?: boolean;
  minRating?: number;
  priceRange?: [number, number];
  search?: string;
  sortBy?: "newest" | "popular" | "rating" | "price-asc" | "price-desc";
  sellerId?: string;
}

export interface SellerInfo {
  id: string;
  companyName: string;
  badges: string[];
  logoUrl?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  sustainabilityScore: number;
  sustainabilityDetail: string;
  images: string[];
  category: string;
  categoryId: string;
  isApproved: boolean;
  sellerId: string;
  seller: SellerInfo;
  certifications: string[];
  rating: number;
  reviewsCount: number;
}

// Global mock items for fallback mode
const MOCK_PRODUCTS: ProductItem[] = [
  {
    id: "p1",
    name: "Organic Cotton Classic Tee",
    slug: "organic-cotton-classic-tee",
    description: "Crafted from 100% GOTS-certified organic cotton, this t-shirt is dyed with non-toxic, eco-friendly pigments. Spun ethically in small batches by verified weavers. Zero microplastics, breathable, and designed for circular recycling.",
    price: 1899,
    stock: 45,
    sustainabilityScore: 95,
    sustainabilityDetail: "Saves 2,000 liters of water compared to conventional cotton. GOTS certified organic, fair-trade manufacturing, colored using natural vegetable dyes.",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Organic Apparel",
    categoryId: "c1",
    isApproved: true,
    sellerId: "seller-1",
    seller: {
      id: "seller-1",
      companyName: "EcoThreads Apparel",
      badges: ["Verified Business", "Verified Sustainable Manufacturer"],
      logoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100&auto=format&fit=crop&q=80"
    },
    certifications: ["GOTS Organic", "FairTrade Certified"],
    rating: 4.8,
    reviewsCount: 34
  },
  {
    id: "p2",
    name: "Zero-Waste Bamboo Cutlery Set",
    slug: "zero-waste-bamboo-cutlery",
    description: "An elegant, reusable cutlery kit for dining on the go. Made of premium sustainably harvested Moso bamboo. Includes a fork, knife, spoon, bamboo straw, and cleaning brush, nested inside a washable organic canvas wrap.",
    price: 699,
    stock: 120,
    sustainabilityScore: 90,
    sustainabilityDetail: "100% biodegradable bamboo. Pesticide-free farming. Eliminates single-use plastic waste from food takeout.",
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Zero-Waste Living",
    categoryId: "c2",
    isApproved: true,
    sellerId: "seller-1",
    seller: {
      id: "seller-1",
      companyName: "EcoThreads Apparel",
      badges: ["Verified Business", "Verified Sustainable Manufacturer"],
      logoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100&auto=format&fit=crop&q=80"
    },
    certifications: ["FSC Certified", "USDA Biobased"],
    rating: 4.6,
    reviewsCount: 18
  },
  {
    id: "p3",
    name: "Solar Powered Portable Charger",
    slug: "solar-portable-charger",
    description: "High-efficiency monocrystalline solar panels capture ambient sunlight to charge your smart devices on-the-go. Built with an outer chassis made from recycled sea plastic and shockproof upcycled rubber.",
    price: 3499,
    stock: 30,
    sustainabilityScore: 85,
    sustainabilityDetail: "Encourages renewable energy usage. Frame is crafted entirely from Ocean Bound Plastic. Certified RoHS compliant battery cells.",
    images: [
      "https://images.unsplash.com/photo-1620286127226-a36113702e51?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Renewable Energy",
    categoryId: "c3",
    isApproved: true,
    sellerId: "seller-2",
    seller: {
      id: "seller-2",
      companyName: "SolTerra Systems",
      badges: ["Verified Business", "Premium Verified Seller"],
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"
    },
    certifications: ["B-Corp Certified", "RoHS Compliant"],
    rating: 4.4,
    reviewsCount: 22
  },
  {
    id: "p4",
    name: "Minimalist Hemp Backpack",
    slug: "minimalist-hemp-backpack",
    description: "Super-durable daily pack constructed from pure natural hemp fibers and organic cotton canvas backing. Features an interior sleeve for a 15-inch laptop and multi-functional organization pockets. Natural water-resistant qualities.",
    price: 4999,
    stock: 15,
    sustainabilityScore: 92,
    sustainabilityDetail: "Hemp cultivation regenerates soil health through bioremediation and requires 50% less land than cotton. Biodegradable construction.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Organic Apparel",
    categoryId: "c1",
    isApproved: true,
    sellerId: "seller-1",
    seller: {
      id: "seller-1",
      companyName: "EcoThreads Apparel",
      badges: ["Verified Business", "Verified Sustainable Manufacturer"],
    },
    certifications: ["GOTS Certified", "OEKO-TEX Standard"],
    rating: 4.9,
    reviewsCount: 15
  },
  {
    id: "p5",
    name: "Upcycled Glass Water Bottle",
    slug: "upcycled-glass-bottle",
    description: "Stylish, robust drinking vessel molded from 100% post-consumer recycled glass jars. Protected by a premium non-slip sleeve made from cork oak bark. Leak-proof natural wood cap with food-grade silicone seal.",
    price: 1299,
    stock: 50,
    sustainabilityScore: 88,
    sustainabilityDetail: "100% recycled glass composition reduces carbon output of raw manufacturing. Natural oak cork bark sleeve is renewable and biodegradable.",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Zero-Waste Living",
    categoryId: "c2",
    isApproved: true,
    sellerId: "seller-2",
    seller: {
      id: "seller-2",
      companyName: "SolTerra Systems",
      badges: ["Verified Business", "Premium Verified Seller"],
    },
    certifications: ["Forest Stewardship Council (FSC)"],
    rating: 4.5,
    reviewsCount: 9
  },
  {
    id: "p6",
    name: "Solid Oak Recycled Cutting Board",
    slug: "solid-oak-cutting-board",
    description: "Premium kitchen cutting blocks crafted from upcycled oak wood offcuts collected from architectural build sites. Conditioned with high-grade organic cold-pressed flaxseed oil. Extremely knife-friendly, durable, and naturally antibacterial.",
    price: 2799,
    stock: 8,
    sustainabilityScore: 82,
    sustainabilityDetail: "Saves wood waste from landfills. Sanded and treated completely by hand without any chemical stains, binders, or synthetic adhesives.",
    images: [
      "https://images.unsplash.com/photo-1544982503-9f984c14501a?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Eco Home Goods",
    categoryId: "c4",
    isApproved: true,
    sellerId: "seller-1",
    seller: {
      id: "seller-1",
      companyName: "EcoThreads Apparel",
      badges: ["Verified Business", "Verified Sustainable Manufacturer"],
    },
    certifications: ["FSC Upcycled Wood"],
    rating: 4.7,
    reviewsCount: 29
  }
];

// In-memory array to simulate newly added products during the demo session
let dynamicProducts: ProductItem[] = [];

export async function getProducts(filters: ProductFilter = {}): Promise<ProductItem[]> {
  try {
    // Check database connection. If DATABASE_URL is not set or is 'mock', trigger fallback
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("mock")) {
      return getMockProductsFiltered(filters);
    }

    // Prisma DB Query
    const whereClause: any = {
      isApproved: true,
      isArchived: false,
    };

    // Use AND array to compose filters safely (avoids OR clause conflicts)
    const andConditions: any[] = [];

    if (filters.sellerId) {
      andConditions.push({
        OR: [
          { sellerId: filters.sellerId },
          { seller: { userId: filters.sellerId } }
        ]
      });
    }

    if (filters.category) {
      whereClause.category = {
        slug: filters.category,
      };
    }

    if (filters.minSustainabilityScore) {
      whereClause.sustainabilityScore = {
        gte: filters.minSustainabilityScore,
      };
    }

    if (filters.verifiedOnly) {
      whereClause.seller = {
        verificationStatus: "APPROVED",
      };
    }

    if (filters.search) {
      andConditions.push({
        OR: [
          { name: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
        ]
      });
    }

    if (filters.priceRange) {
      whereClause.price = {
        gte: filters.priceRange[0],
        lte: filters.priceRange[1],
      };
    }

    if (andConditions.length > 0) {
      whereClause.AND = andConditions;
    }

    // Sorting options mapping
    let orderBy: any = { createdAt: "desc" };
    if (filters.sortBy === "price-asc") orderBy = { price: "asc" };
    if (filters.sortBy === "price-desc") orderBy = { price: "desc" };
    if (filters.sortBy === "rating") orderBy = { reviews: { _count: "desc" } }; // Simplified sorting

    const dbProducts = await db.product.findMany({
      where: whereClause,
      include: {
        category: true,
        images: true,
        seller: true,
        reviews: true,
      },
      orderBy,
    });

    // Map Prisma models to unified ProductItem output
    return dbProducts.map((p) => {
      const rating =
        p.reviews.length > 0
          ? p.reviews.reduce((acc, curr) => acc + curr.rating, 0) / p.reviews.length
          : 4.5; // fallback default
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        stock: p.stock,
        sustainabilityScore: p.sustainabilityScore,
        sustainabilityDetail: p.sustainabilityDetail || "",
        images: p.images.map((img) => img.url),
        category: p.category.name,
        categoryId: p.categoryId,
        isApproved: p.isApproved,
        sellerId: p.sellerId,
        seller: {
          id: p.seller.id,
          companyName: p.seller.companyName,
          badges: p.seller.badges,
          logoUrl: p.seller.logoUrl || undefined,
        },
        certifications: [], // dynamically loaded
        rating,
        reviewsCount: p.reviews.length,
      };
    });
  } catch (error) {
    console.warn("Database getProducts failed, falling back to mock:", error);
    return getMockProductsFiltered(filters);
  }
}

export async function getProductById(id: string): Promise<ProductItem | null> {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("mock")) {
      return [...MOCK_PRODUCTS, ...dynamicProducts].find((p) => p.id === id) || null;
    }

    const p = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        seller: true,
        reviews: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!p) return null;

    const rating =
      p.reviews.length > 0
        ? p.reviews.reduce((acc, curr) => acc + curr.rating, 0) / p.reviews.length
        : 4.5;

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      stock: p.stock,
      sustainabilityScore: p.sustainabilityScore,
      sustainabilityDetail: p.sustainabilityDetail || "",
      images: p.images.map((img) => img.url),
      category: p.category.name,
      categoryId: p.categoryId,
      isApproved: p.isApproved,
      sellerId: p.sellerId,
      seller: {
        id: p.seller.id,
        companyName: p.seller.companyName,
        badges: p.seller.badges,
        logoUrl: p.seller.logoUrl || undefined,
      },
      certifications: [],
      rating,
      reviewsCount: p.reviews.length,
    };
  } catch (error) {
    console.warn("Database getProductById failed, using mock:", error);
    return [...MOCK_PRODUCTS, ...dynamicProducts].find((p) => p.id === id) || null;
  }
}

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryName: string;
  sustainabilityScore: number;
  sustainabilityDetail: string;
  imageUrls: string[];
  sellerId: string;
  sellerName: string;
}): Promise<ProductItem> {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("mock")) {
      const newProduct: ProductItem = {
        id: `p-${Math.random().toString(36).substring(2, 9)}`,
        name: data.name,
        slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        sustainabilityScore: Number(data.sustainabilityScore),
        sustainabilityDetail: data.sustainabilityDetail,
        images: data.imageUrls.length > 0 ? data.imageUrls : ["https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80"],
        category: data.categoryName,
        categoryId: "c_custom",
        isApproved: true, // Auto-approve mock creations for seller ease
        sellerId: data.sellerId,
        seller: {
          id: data.sellerId,
          companyName: data.sellerName,
          badges: ["Verified Business"],
        },
        certifications: ["EarthCentric Verified"],
        rating: 5.0,
        reviewsCount: 0,
      };

      dynamicProducts.push(newProduct);
      return newProduct;
    }

    // Find seller by either sellerId or userId to prevent FK mismatches
    let seller = await db.seller.findUnique({ where: { id: data.sellerId } });
    if (!seller) {
      seller = await db.seller.findUnique({ where: { userId: data.sellerId } });
    }
    if (!seller) {
      throw new Error(`Seller profile not found for ID or User ID: ${data.sellerId}`);
    }
    const resolvedSellerId = seller.id;

    // Handle Category look-up/creation
    let category = await db.category.findUnique({ where: { name: data.categoryName } });
    if (!category) {
      category = await db.category.create({
        data: {
          name: data.categoryName,
          slug: data.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        },
      });
    }

    const p = await db.product.create({
      data: {
        name: data.name,
        slug: `${data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Math.floor(Math.random() * 1000)}`,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        sustainabilityScore: Number(data.sustainabilityScore),
        sustainabilityDetail: data.sustainabilityDetail,
        categoryId: category.id,
        sellerId: resolvedSellerId,
        isApproved: true, // For demo purposes, auto-approve seller's product creation
        images: {
          create: data.imageUrls.map((url) => ({ url })),
        },
      },
      include: {
        category: true,
        images: true,
        seller: true,
      },
    });

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      stock: p.stock,
      sustainabilityScore: p.sustainabilityScore,
      sustainabilityDetail: p.sustainabilityDetail || "",
      images: p.images.map((img) => img.url),
      category: p.category.name,
      categoryId: p.categoryId,
      isApproved: p.isApproved,
      sellerId: p.sellerId,
      seller: {
        id: p.seller.id,
        companyName: p.seller.companyName,
        badges: p.seller.badges,
      },
      certifications: ["EarthCentric Verified"],
      rating: 5.0,
      reviewsCount: 0,
    };
  } catch (error) {
    console.error("Failed to create product in DB, creating mock:", error);
    // Fall back to memory create
    const newProduct: ProductItem = {
      id: `p-${Math.random().toString(36).substring(2, 9)}`,
      name: data.name,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: data.description,
      price: Number(data.price),
      stock: Number(data.stock),
      sustainabilityScore: Number(data.sustainabilityScore),
      sustainabilityDetail: data.sustainabilityDetail,
      images: data.imageUrls.length > 0 ? data.imageUrls : ["https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80"],
      category: data.categoryName,
      categoryId: "c_custom",
      isApproved: true,
      sellerId: data.sellerId,
      seller: {
        id: data.sellerId,
        companyName: data.sellerName,
        badges: ["Verified Business"],
      },
      certifications: ["EarthCentric Verified"],
      rating: 5.0,
      reviewsCount: 0,
    };
    dynamicProducts.push(newProduct);
    return newProduct;
  }
}

export async function updateProduct(
  id: string,
  data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryName: string;
    sustainabilityScore: number;
    sustainabilityDetail: string;
  }
): Promise<boolean> {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("mock")) {
      dynamicProducts = dynamicProducts.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            name: data.name,
            slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            description: data.description,
            price: Number(data.price),
            stock: Number(data.stock),
            category: data.categoryName,
            sustainabilityScore: Number(data.sustainabilityScore),
            sustainabilityDetail: data.sustainabilityDetail,
          };
        }
        return p;
      });
      const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id);
      if (idx !== -1) {
        MOCK_PRODUCTS[idx] = {
          ...MOCK_PRODUCTS[idx],
          name: data.name,
          slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: data.description,
          price: Number(data.price),
          stock: Number(data.stock),
          category: data.categoryName,
          sustainabilityScore: Number(data.sustainabilityScore),
          sustainabilityDetail: data.sustainabilityDetail,
        };
      }
      return true;
    }

    // Database Update
    let category = await db.category.findUnique({ where: { name: data.categoryName } });
    if (!category) {
      category = await db.category.create({
        data: {
          name: data.categoryName,
          slug: data.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        },
      });
    }

    await db.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: `${data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Math.floor(Math.random() * 1000)}`,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        sustainabilityScore: Number(data.sustainabilityScore),
        sustainabilityDetail: data.sustainabilityDetail,
        categoryId: category.id,
      },
    });

    return true;
  } catch (error) {
    console.error("Failed to update product in DB, updating mock:", error);
    // Fall back to memory update
    dynamicProducts = dynamicProducts.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          name: data.name,
          slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: data.description,
          price: Number(data.price),
          stock: Number(data.stock),
          category: data.categoryName,
          sustainabilityScore: Number(data.sustainabilityScore),
          sustainabilityDetail: data.sustainabilityDetail,
        };
      }
      return p;
    });
    const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (idx !== -1) {
      MOCK_PRODUCTS[idx] = {
        ...MOCK_PRODUCTS[idx],
        name: data.name,
        slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        category: data.categoryName,
        sustainabilityScore: Number(data.sustainabilityScore),
        sustainabilityDetail: data.sustainabilityDetail,
      };
    }
    return true;
  }
}

export async function archiveProduct(id: string): Promise<boolean> {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("mock")) {
      dynamicProducts = dynamicProducts.filter((p) => p.id !== id);
      return true;
    }
    await db.product.update({
      where: { id },
      data: { isArchived: true },
    });
    return true;
  } catch (e) {
    console.error("Archive product failed, removing mock:", e);
    dynamicProducts = dynamicProducts.filter((p) => p.id !== id);
    return true;
  }
}

export async function updateProductStock(id: string, newStock: number): Promise<boolean> {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("mock")) {
      dynamicProducts = dynamicProducts.map((p) => {
        if (p.id === id) return { ...p, stock: newStock };
        return p;
      });
      const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id);
      if (idx !== -1) {
        MOCK_PRODUCTS[idx].stock = newStock;
      }
      return true;
    }

    await db.product.update({
      where: { id },
      data: { stock: newStock },
    });
    return true;
  } catch (e) {
    console.error("updateProductStock failed, fallback to mock:", e);
    dynamicProducts = dynamicProducts.map((p) => {
      if (p.id === id) return { ...p, stock: newStock };
      return p;
    });
    const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (idx !== -1) {
      MOCK_PRODUCTS[idx].stock = newStock;
    }
    return true;
  }
}

function getMockProductsFiltered(filters: ProductFilter): ProductItem[] {
  let list = [...MOCK_PRODUCTS, ...dynamicProducts];

  if (filters.sellerId) {
    list = list.filter((p) => p.sellerId === filters.sellerId || p.seller.id === filters.sellerId);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  if (filters.category && filters.category !== "all") {
    const catSlug = filters.category.toLowerCase();
    list = list.filter((p) => p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === catSlug);
  }

  if (filters.minSustainabilityScore) {
    list = list.filter((p) => p.sustainabilityScore >= (filters.minSustainabilityScore || 0));
  }

  if (filters.verifiedOnly) {
    list = list.filter((p) => p.seller.badges.includes("Verified Business") || p.seller.badges.includes("Verified Sustainable Manufacturer"));
  }

  if (filters.priceRange) {
    list = list.filter((p) => p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1]);
  }

  if (filters.sortBy) {
    if (filters.sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === "popular") {
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }
  }

  return list;
}
