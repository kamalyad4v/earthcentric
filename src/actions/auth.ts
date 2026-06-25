"use server";

import db from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/email";
import { uploadImage, deleteImage, getPublicIdFromDb } from "@/lib/cloudinary";

export async function syncUserInDb(userData: {
  id: string;
  name: string;
  email: string;
  role: string;
}) {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("mock")) {
      // Send welcome email even in mock mode
      await sendWelcomeEmail(userData.email, userData.name).catch((err) =>
        console.error("Failed to send welcome email:", err)
      );
      return null;
    }

    // Check if user already exists (to know if this is a new signup)
    const existingUser = await db.user.findUnique({
      where: { email: userData.email.toLowerCase() },
    });

    // Upsert the User record in database
    const user = await db.user.upsert({
      where: { email: userData.email.toLowerCase() },
      update: {
        name: userData.name,
        role: userData.role as any,
      },
      create: {
        id: userData.id,
        name: userData.name,
        email: userData.email.toLowerCase(),
        role: userData.role as any,
      },
      include: {
        seller: true,
      },
    });

    // Send welcome email only for new users
    if (!existingUser) {
      await sendWelcomeEmail(user.email, user.name || userData.name).catch((err) =>
        console.error("Failed to send welcome email:", err)
      );
    }

    return {
      id: user.id,
      name: user.name || "",
      email: user.email,
      role: user.role as any,
      sellerStatus: user.seller?.verificationStatus as any,
      sellerId: user.seller?.id,
      badges: user.seller?.badges || [],
    };
  } catch (error) {
    console.error("Failed to sync user in database:", error);
    return null;
  }
}

export async function updateUserProfilePicture(userId: string, base64Image: string): Promise<string> {
  const resultJson = await uploadImage(base64Image, "buyer-profile");
  
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("mock")) {
    return resultJson;
  }
  
  try {
    const existingUser = await db.user.findUnique({
      where: { id: userId },
      select: { image: true }
    });
    
    if (existingUser && existingUser.image) {
      const oldPublicId = getPublicIdFromDb(existingUser.image);
      if (oldPublicId) {
        await deleteImage(oldPublicId);
      }
    }
    
    await db.user.update({
      where: { id: userId },
      data: { image: resultJson }
    });
  } catch (error) {
    console.error("Failed to update user profile image in DB:", error);
  }
  
  return resultJson;
}
