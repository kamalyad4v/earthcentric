const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding metrics, products, and fulfillment orders for EcoThreads Inc (contact@ecothreads.com) into Neon DB...");

  // 1. Clean up existing records to ensure perfect seed state without key conflicts
  try {
    // Find the user and seller by email contact@ecothreads.com
    const oldUser = await prisma.user.findUnique({
      where: { email: "contact@ecothreads.com" },
      include: { seller: true }
    });

    if (oldUser) {
      const sellerId = oldUser.seller?.id || "seller-1-profile";
      const sellerUserId = oldUser.id || "seller-1";

      // Find all products of this seller
      const products = await prisma.product.findMany({
        where: {
          OR: [
            { sellerId: sellerId },
            { sellerId: "seller-1-profile" }
          ]
        },
        select: { id: true }
      });
      const productIds = products.map(p => p.id);

      // Find all order items referencing these products
      const orderItems = await prisma.orderItem.findMany({
        where: { productId: { in: productIds } },
        select: { orderId: true }
      });
      const orderIds = [...new Set(orderItems.map(oi => oi.orderId))];

      // Delete order items
      await prisma.orderItem.deleteMany({
        where: { orderId: { in: orderIds } }
      });

      // Delete payments and timelines for these orders
      await prisma.payment.deleteMany({
        where: { orderId: { in: orderIds } }
      });
      await prisma.orderTimeline.deleteMany({
        where: { orderId: { in: orderIds } }
      });

      // Delete orders
      await prisma.order.deleteMany({
        where: { id: { in: orderIds } }
      });

      // Delete product images
      await prisma.productImage.deleteMany({
        where: { productId: { in: productIds } }
      });

      // Delete products
      await prisma.product.deleteMany({
        where: { id: { in: productIds } }
      });

      // Delete seller profile
      await prisma.seller.deleteMany({
        where: {
          OR: [
            { id: sellerId },
            { id: "seller-1-profile" },
            { userId: sellerUserId },
            { userId: "seller-1" }
          ]
        }
      });

      // Delete user account
      await prisma.user.delete({
        where: { id: sellerUserId }
      });
    }

    // Double-check if there's any remaining user/seller with target IDs
    await prisma.seller.deleteMany({
      where: {
        OR: [
          { id: "seller-1-profile" },
          { userId: "seller-1" }
        ]
      }
    });
    await prisma.user.deleteMany({
      where: {
        OR: [
          { id: "seller-1" },
          { email: "contact@ecothreads.com" }
        ]
      }
    });

    console.log("Cleanup succeeded.");
  } catch (err) {
    console.log("Cleanup notes:", err.message);
  }

  // 2. Create the Seller User with explicit ID "seller-1"
  const sellerUser = await prisma.user.create({
    data: {
      id: "seller-1",
      name: "EcoThreads Inc",
      email: "contact@ecothreads.com",
      role: "SELLER"
    }
  });

  // 3. Create the Seller Profile with explicit ID "seller-1-profile"
  const seller = await prisma.seller.create({
    data: {
      id: "seller-1-profile",
      userId: "seller-1",
      companyName: "EcoThreads Inc",
      businessType: "Manufacturer",
      description: "Ethical manufacturers of organic hemp and bamboo clothing sheets.",
      website: "https://ecothreads.com",
      verificationStatus: "APPROVED",
      badges: ["Verified Business", "Verified Sustainable Manufacturer"]
    }
  });

  // 3. Ensure Categories exist
  const catApparel = await prisma.category.upsert({
    where: { slug: "organic-apparel" },
    update: {},
    create: { name: "Organic Apparel", slug: "organic-apparel", description: "Ethical spun organic fiber garments." }
  });

  const catZeroWaste = await prisma.category.upsert({
    where: { slug: "zero-waste-living" },
    update: {},
    create: { name: "Zero-Waste Living", slug: "zero-waste-living", description: "Zero single-use plastics lifestyle essentials." }
  });

  const catHome = await prisma.category.upsert({
    where: { slug: "eco-home-goods" },
    update: {},
    create: { name: "Eco Home Goods", slug: "eco-home-goods", description: "Timber and wood upcycled house accessories." }
  });

  // 4. Create 6 products for EcoThreads Inc (delete existing first to avoid duplicate slugs)
  const productSlugs = [
    "organic-hemp-tee",
    "bamboo-cooling-sheets",
    "linen-lounge-pants",
    "tencel-duvet-cover",
    "zero-waste-cotton-tote",
    "hemp-bath-towels"
  ];

  await prisma.product.deleteMany({
    where: { slug: { in: productSlugs } }
  });

  const productsData = [
    {
      name: "Organic Hemp Tee",
      slug: "organic-hemp-tee",
      description: "Breathable and highly durable t-shirt crafted from 100% organic industrial hemp fibers.",
      price: 1899,
      stock: 45,
      sustainabilityScore: 98,
      sustainabilityDetail: "Saves 3,000 liters of water compared to cotton. Biodegradable dyes.",
      categoryId: catApparel.id,
      imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800"
    },
    {
      name: "Bamboo Cooling Sheets",
      slug: "bamboo-cooling-sheets",
      description: "Silky-smooth sheets woven from organically harvested Moso bamboo fibers. Temperature regulating.",
      price: 3499,
      stock: 30,
      sustainabilityScore: 94,
      sustainabilityDetail: "Pesticide-free bamboo. Highly breathable, naturally antibacterial.",
      categoryId: catHome.id,
      imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"
    },
    {
      name: "Linen Lounge Pants",
      slug: "linen-lounge-pants",
      description: "Relaxed-fit lounge pants made from flax linen. Lightweight and colored with botanical pigments.",
      price: 2499,
      stock: 25,
      sustainabilityScore: 92,
      sustainabilityDetail: "Flax crop requires zero artificial irrigation. Vegan certified.",
      categoryId: catApparel.id,
      imageUrl: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=800"
    },
    {
      name: "Tencel Duvet Cover",
      slug: "tencel-duvet-cover",
      description: "Luxury duvet cover made from eucalyptus wood pulp. Eco-friendly closed-loop production process.",
      price: 4999,
      stock: 15,
      sustainabilityScore: 96,
      sustainabilityDetail: "Closed-loop solvent process recycles 99% of chemicals and water.",
      categoryId: catHome.id,
      imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"
    },
    {
      name: "Zero-Waste Cotton Tote",
      slug: "zero-waste-cotton-tote",
      description: "Extra large heavy-duty shopping tote bag, made from upcycled factory cutting floor scraps.",
      price: 499,
      stock: 150,
      sustainabilityScore: 99,
      sustainabilityDetail: "diverts 1.5kg of cutting waste from landfills. zero virgin materials.",
      categoryId: catZeroWaste.id,
      imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800"
    },
    {
      name: "Hemp Bath Towels",
      slug: "hemp-bath-towels",
      description: "Highly absorbent, naturally mildew-resistant organic hemp and cotton blended bath towels.",
      price: 1299,
      stock: 60,
      sustainabilityScore: 90,
      sustainabilityDetail: "55% organic hemp, 45% organic cotton blend. Chemical-free whitening.",
      categoryId: catHome.id,
      imageUrl: "https://images.unsplash.com/photo-1616627547471-2ab7fe68f3ea?w=800"
    }
  ];

  const dbProducts = [];
  for (const p of productsData) {
    const newProd = await prisma.product.create({
      data: {
        sellerId: seller.id,
        categoryId: p.categoryId,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        stock: p.stock,
        sustainabilityScore: p.sustainabilityScore,
        sustainabilityDetail: p.sustainabilityDetail,
        isApproved: true,
        images: {
          create: [
            { url: p.imageUrl, sortOrder: 0 }
          ]
        }
      }
    });
    dbProducts.push(newProd);
    console.log(`Created product: ${p.name}`);
  }

  // 5. Create Mock Buyers and Addresses
  const buyerEmails = ["buyer1@gmail.com", "buyer2@gmail.com", "buyer3@gmail.com"];
  const buyers = [];

  for (const email of buyerEmails) {
    const buyer = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { name: email.split("@")[0].toUpperCase(), email, role: "BUYER" }
    });
    buyers.push(buyer);
  }

  const addressesData = [
    { street: "12 Baker St", city: "London", state: "Greater London", postalCode: "NW1 6XE", country: "UK" },
    { street: "44 MG Road", city: "Bangalore", state: "Karnataka", postalCode: "560001", country: "India" },
    { street: "500 California St", city: "San Francisco", state: "California", postalCode: "94104", country: "US" }
  ];

  const dbAddresses = [];
  for (let i = 0; i < buyers.length; i++) {
    const addr = await prisma.address.create({
      data: {
        userId: buyers[i].id,
        street: addressesData[i].street,
        city: addressesData[i].city,
        state: addressesData[i].state,
        postalCode: addressesData[i].postalCode,
        country: addressesData[i].country
      }
    });
    dbAddresses.push(addr);
  }

  // 6. Create 18 mock orders distributed across various statuses
  const orderStages = [
    { status: "DELIVERED", count: 5, desc: "Package received by buyer. Carbon offset verified." },
    { status: "SHIPPED", count: 4, desc: "Dispatched via carbon-offset logistical partners." },
    { status: "PACKED", count: 3, desc: "Wrapped in recyclable plastic-free cardboard and tape." },
    { status: "CONFIRMED", count: 3, desc: "Seller confirmed stock availability. Moving to packing bay." },
    { status: "PLACED", count: 3, desc: "Order placed. Awaiting seller confirmation." }
  ];

  let orderCount = 0;
  let totalGrossRevenue = 0;

  for (const stage of orderStages) {
    for (let k = 0; k < stage.count; k++) {
      const orderId = `ord-threads-${Math.random().toString(36).substring(2, 8)}`;
      const buyerIndex = orderCount % buyers.length;
      const buyer = buyers[buyerIndex];
      const address = dbAddresses[buyerIndex];

      // Pick 1 or 2 products
      const p1 = dbProducts[orderCount % dbProducts.length];
      const p2 = dbProducts[(orderCount + 1) % dbProducts.length];
      const orderItems = [
        { productId: p1.id, quantity: 1, price: p1.price },
        { productId: p2.id, quantity: 1, price: p2.price }
      ];

      const totalAmount = orderItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

      // Create Order
      const order = await prisma.order.create({
        data: {
          id: orderId,
          userId: buyer.id,
          addressId: address.id,
          totalAmount: totalAmount,
          status: stage.status,
          items: {
            create: orderItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          },
          payment: {
            create: {
              razorpayOrderId: `pay-${orderId}`,
              amount: totalAmount,
              status: "COMPLETED" // All these orders are PAID/COMPLETED
            }
          },
          timeline: {
            create: {
              status: stage.status,
              description: stage.desc
            }
          }
        }
      });

      totalGrossRevenue += totalAmount;
      orderCount++;
      console.log(`Created order #${orderCount}: ${orderId} (${stage.status}) - total ₹${totalAmount}`);
    }
  }

  console.log("-----------------------------------------");
  console.log(`Total Orders Created: ${orderCount}`);
  console.log(`Estimated Gross Revenue: ₹${totalGrossRevenue}`);
  console.log("Neon DB Seeding for EcoThreads complete!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
