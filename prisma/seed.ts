import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");
  
  // Create default categories
  const cat1 = await prisma.category.upsert({
    where: { slug: "organic-apparel" },
    update: {},
    create: {
      name: "Organic Apparel",
      slug: "organic-apparel",
      description: "Ethical spun organic fiber garments.",
    },
  });

  const cat2 = await prisma.category.upsert({
    where: { slug: "zero-waste-living" },
    update: {},
    create: {
      name: "Zero-Waste Living",
      slug: "zero-waste-living",
      description: "Zero single-use plastics lifestyle essentials.",
    },
  });

  const cat3 = await prisma.category.upsert({
    where: { slug: "renewable-energy" },
    update: {},
    create: {
      name: "Renewable Energy",
      slug: "renewable-energy",
      description: "Solar powered portable electronics and devices.",
    },
  });

  const cat4 = await prisma.category.upsert({
    where: { slug: "eco-home-goods" },
    update: {},
    create: {
      name: "Eco Home Goods",
      slug: "eco-home-goods",
      description: "Timber and wood upcycled house accessories.",
    },
  });

  // Create default Admin, Seller and Buyer users
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@earthcentric.com" },
    update: {},
    create: {
      name: "EarthCentric Admin",
      email: "admin@earthcentric.com",
      role: "ADMIN",
    },
  });

  const sellerUser = await prisma.user.upsert({
    where: { email: "contact@ecothreads.com" },
    update: {},
    create: {
      name: "EcoThreads Inc",
      email: "contact@ecothreads.com",
      role: "SELLER",
    },
  });

  const sellerProfile = await prisma.seller.upsert({
    where: { userId: sellerUser.id },
    update: {},
    create: {
      userId: sellerUser.id,
      companyName: "EcoThreads Apparel",
      businessType: "Manufacturer",
      description: "Ethical manufacturers of organic hemp and bamboo clothing sheets.",
      website: "https://ecothreads.com",
      verificationStatus: "APPROVED",
      badges: ["Verified Business", "Verified Sustainable Manufacturer"],
    },
  });

  // Add default products
  await prisma.product.upsert({
    where: { slug: "organic-cotton-classic-tee" },
    update: {},
    create: {
      name: "Organic Cotton Classic Tee",
      slug: "organic-cotton-classic-tee",
      description:
        "Crafted from 100% GOTS-certified organic cotton, this t-shirt is dyed with non-toxic, eco-friendly pigments. Spun ethically in small batches by verified weavers. Zero microplastics, breathable, and designed for circular recycling.",
      price: 1899,
      stock: 45,
      sustainabilityScore: 95,
      sustainabilityDetail:
        "Saves 2,000 liters of water compared to conventional cotton. GOTS certified organic, fair-trade manufacturing, colored using natural vegetable dyes.",
      categoryId: cat1.id,
      sellerId: sellerProfile.id,
      isApproved: true,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
            sortOrder: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
            sortOrder: 1,
          },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "zero-waste-bamboo-cutlery" },
    update: {},
    create: {
      name: "Zero-Waste Bamboo Cutlery Set",
      slug: "zero-waste-bamboo-cutlery",
      description:
        "An elegant, reusable cutlery kit for dining on the go. Made of premium sustainably harvested Moso bamboo. Includes a fork, knife, spoon, bamboo straw, and cleaning brush, nested inside a washable organic canvas wrap.",
      price: 699,
      stock: 120,
      sustainabilityScore: 90,
      sustainabilityDetail:
        "100% biodegradable bamboo. Pesticide-free farming. Eliminates single-use plastic waste from food takeout.",
      categoryId: cat2.id,
      sellerId: sellerProfile.id,
      isApproved: true,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80",
            sortOrder: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop&q=80",
            sortOrder: 1,
          },
        ],
      },
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
