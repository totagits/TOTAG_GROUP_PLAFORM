// Content Management System Seed Data
import { db } from "./db";
import { carouselSlides, websiteContent, products } from "@shared/schema";

async function seedCMSData() {
  console.log("Seeding CMS data...");

  // Seed initial carousel slides
  const carouselData = [
    {
      title: "Premium Rice",
      subtitle: "High quality imported rice - 25kg bags",
      imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=400&fit=crop&crop=center",
      order: 1,
      isActive: true
    },
    {
      title: "Construction Steel Bars",
      subtitle: "Durable steel reinforcement bars for construction",
      imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop&crop=center",
      order: 2,
      isActive: true
    },
    {
      title: "Office Paper",
      subtitle: "A4 office paper - Premium quality",
      imageUrl: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=800&h=400&fit=crop&crop=center",
      order: 3,
      isActive: true
    },
    {
      title: "Cooking Oil",
      subtitle: "Pure vegetable cooking oil - Various sizes",
      imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=400&fit=crop&crop=center",
      order: 4,
      isActive: true
    },
    {
      title: "Portland Cement",
      subtitle: "High-grade Portland cement for construction",
      imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=400&fit=crop&crop=center",
      order: 5,
      isActive: true
    }
  ];

  // Clear existing carousel slides
  await db.delete(carouselSlides);

  // Insert new carousel slides
  for (const slide of carouselData) {
    await db.insert(carouselSlides).values(slide);
    console.log(`Created carousel slide: ${slide.title}`);
  }

  // Seed initial website content
  const contentData = [
    {
      section: "company",
      key: "name",
      value: "TOTAG General Merchandise",
      type: "text"
    },
    {
      section: "company",
      key: "tagline",
      value: "Your Trusted Partner in Quality Merchandise",
      type: "text"
    },
    {
      section: "hero",
      key: "title",
      value: "Welcome to TGM Digital Platform",
      type: "text"
    },
    {
      section: "hero",
      key: "description",
      value: "Discover our comprehensive range of quality products from food items to construction materials, all available through our advanced e-commerce platform.",
      type: "text"
    },
    {
      section: "contact",
      key: "email",
      value: "info@tgm.totag.com",
      type: "text"
    },
    {
      section: "contact",
      key: "phone",
      value: "+231 77 123 4567",
      type: "text"
    },
    {
      section: "contact",
      key: "address",
      value: "Monrovia, Liberia",
      type: "text"
    }
  ];

  // Clear existing website content
  await db.delete(websiteContent);

  // Insert new website content
  for (const content of contentData) {
    await db.insert(websiteContent).values(content);
    console.log(`Created website content: ${content.section}.${content.key}`);
  }

  // Seed sample products if none exist
  const existingProducts = await db.select().from(products).limit(1);
  
  if (existingProducts.length === 0) {
    const sampleProducts = [
      {
        sku: "RICE-001",
        name: "Premium Rice 25kg",
        description: "High quality imported rice in 25kg bags. Perfect for both wholesale and retail.",
        category: "Food & Beverages",
        price: "3500.00",
        stockQuantity: 150,
        minStockLevel: 20,
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&crop=center",
        specifications: "25kg bags, imported quality rice",
        status: "active",
        isWholesale: false,
        wholeSalePrice: null,
        supplierInfo: null
      },
      {
        sku: "STEEL-001",
        name: "Steel Reinforcement Bars 12mm",
        description: "High-grade steel reinforcement bars for construction projects.",
        category: "Construction",
        price: "450.00",
        stockQuantity: 500,
        minStockLevel: 50,
        imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&crop=center",
        specifications: "12mm diameter, 6m length",
        status: "active",
        isWholesale: true,
        wholeSalePrice: "420.00",
        supplierInfo: null
      },
      {
        sku: "PAPER-001",
        name: "A4 Office Paper",
        description: "Premium quality A4 office paper for printing and documentation.",
        category: "Office Supplies",
        price: "25.00",
        stockQuantity: 800,
        minStockLevel: 100,
        imageUrl: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=400&h=300&fit=crop&crop=center",
        specifications: "A4 size, 80gsm, 500 sheets per ream",
        status: "active",
        isWholesale: false,
        wholeSalePrice: null,
        supplierInfo: null
      },
      {
        sku: "OIL-001",
        name: "Cooking Oil 5L",
        description: "Pure vegetable cooking oil in 5-liter containers.",
        category: "Food & Beverages",
        price: "800.00",
        stockQuantity: 200,
        minStockLevel: 30,
        imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop&crop=center",
        specifications: "5L container, pure vegetable oil",
        status: "active",
        isWholesale: false,
        wholeSalePrice: null,
        supplierInfo: null
      },
      {
        sku: "CEMENT-001",
        name: "Portland Cement 50kg",
        description: "High-grade Portland cement suitable for all construction needs.",
        category: "Construction",
        price: "850.00",
        stockQuantity: 300,
        minStockLevel: 25,
        imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop&crop=center",
        specifications: "50kg bags, Portland cement Type I",
        status: "active",
        isWholesale: true,
        wholeSalePrice: "800.00",
        supplierInfo: null
      }
    ];

    for (const product of sampleProducts) {
      await db.insert(products).values(product);
      console.log(`Created sample product: ${product.name}`);
    }
  }

  console.log("CMS data seeding completed!");
}

// Run the seed function
seedCMSData().catch(console.error);