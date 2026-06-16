const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding 5 pending seller verification requests into Neon DB...");

  const mockSellersData = [
    {
      email: "contact@bioknit.in",
      name: "Aarav Mehta",
      companyName: "BioKnit Textiles",
      businessType: "Manufacturer",
      description: "Pioneering zero-carbon organic cotton knitwear. Hand-spun and vegetable-dyed in small batches.",
      website: "https://bioknit.in",
      gstNumber: "29AAACB1234A1Z1",
      panNumber: "AAACB1234A",
      documents: [
        {
          type: "GST",
          fileName: "gst_certificate.jpg",
          fileUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=800"
        },
        {
          type: "PAN",
          fileName: "pan_card.jpg",
          fileUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800"
        },
        {
          type: "SUSTAINABILITY_CERTIFICATE",
          fileName: "gots_organic_cert.jpg",
          fileUrl: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800"
        }
      ]
    },
    {
      email: "info@forestcraft.org",
      name: "Elena Rostov",
      companyName: "Forest Craft Co.",
      businessType: "Artisanal Supplier",
      description: "Sourcing certified reclaimed wood furniture and bamboo decor from local tribal co-ops.",
      website: "https://forestcraft.org",
      gstNumber: "06AABCF9876D2Y0",
      panNumber: "AABCF9876D",
      documents: [
        {
          type: "GST",
          fileName: "registration_doc.jpg",
          fileUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800"
        },
        {
          type: "PAN",
          fileName: "pan_identity.jpg",
          fileUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800"
        },
        {
          type: "BUSINESS_REGISTRATION",
          fileName: "fsc_reclaimed_wood.jpg",
          fileUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800"
        }
      ]
    },
    {
      email: "sales@solarispack.com",
      name: "Maya Lin",
      companyName: "Solaris Pack Solutions",
      businessType: "Eco Packaging Brand",
      description: "100% biodegradable and home-compostable packaging mailers and water-soluble seaweed sheets.",
      website: "https://solarispack.com",
      gstNumber: "27AACCS3344E3Z8",
      panNumber: "AACCS3344E",
      documents: [
        {
          type: "GST",
          fileName: "gst_authority_cert.jpg",
          fileUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800"
        },
        {
          type: "SUSTAINABILITY_CERTIFICATE",
          fileName: "iso_biodegradable_report.jpg",
          fileUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800"
        }
      ]
    },
    {
      email: "contact@ecoclay.com",
      name: "Rahul Sharma",
      companyName: "EcoClay Pottery",
      businessType: "Artisanal Supplier",
      description: "Traditional terracotta cookware and organic clay tableware, lead-free and handmade.",
      website: "https://ecoclay.com",
      gstNumber: "19AADDG4455F1Z2",
      panNumber: "AADDG4455F",
      documents: [
        {
          type: "GST",
          fileName: "gst_registration.jpg",
          fileUrl: "https://images.unsplash.com/photo-1576016770956-debb63d90029?w=800"
        },
        {
          type: "PAN",
          fileName: "pan_card.jpg",
          fileUrl: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=800"
        }
      ]
    },
    {
      email: "verify@purehemp.co",
      name: "Sarah Jenkins",
      companyName: "PureHemp Textiles",
      businessType: "Manufacturer",
      description: "Industrial hemp fiber spinning and organic linen fabrics for retail brands.",
      website: "https://purehemp.co",
      gstNumber: "33AAHPT5566G1Z3",
      panNumber: "AAHPT5566G",
      documents: [
        {
          type: "GST",
          fileName: "gst_cert_purehemp.jpg",
          fileUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800"
        },
        {
          type: "PAN",
          fileName: "pan_card_purehemp.jpg",
          fileUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800"
        },
        {
          type: "SUSTAINABILITY_CERTIFICATE",
          fileName: "hemp_origin_verification.jpg",
          fileUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800"
        }
      ]
    }
  ];

  for (const sellerData of mockSellersData) {
    // 1. Create or upsert the User
    const user = await prisma.user.upsert({
      where: { email: sellerData.email },
      update: { role: "SELLER" },
      create: {
        name: sellerData.name,
        email: sellerData.email,
        role: "SELLER"
      }
    });

    // 2. Delete any existing Seller to avoid duplicate constraint errors
    const existingSeller = await prisma.seller.findUnique({
      where: { userId: user.id }
    });
    if (existingSeller) {
      await prisma.seller.delete({ where: { id: existingSeller.id } });
    }

    // 3. Create Seller
    await prisma.seller.create({
      data: {
        userId: user.id,
        companyName: sellerData.companyName,
        businessType: sellerData.businessType,
        description: sellerData.description,
        website: sellerData.website,
        gstNumber: sellerData.gstNumber,
        panNumber: sellerData.panNumber,
        verificationStatus: "PENDING",
        documents: {
          create: sellerData.documents.map(d => ({
            type: d.type,
            fileName: d.fileName,
            fileUrl: d.fileUrl
          }))
        }
      }
    });

    console.log(`Created pending seller account: ${sellerData.companyName} (${sellerData.email})`);
  }

  console.log("Neon DB seeding successfully completed!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
