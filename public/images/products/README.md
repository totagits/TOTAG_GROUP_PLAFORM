# TOTAG General Merchandise Product Images

## Required Product Images

Please place the following real product images in this directory:

1. **premium-rice.jpg** - High-quality photo of Premium Jasmine Rice 50kg bags
2. **steel-bars.jpg** - Construction/reinforcement steel bars (Grade 60, 12mm diameter)
3. **office-paper.jpg** - Premium A4 office paper packages (80gsm, 500 sheets/pack)
4. **cooking-oil.jpg** - Pure vegetable cooking oil 5L bottles
5. **cement-bags.jpg** - Portland cement bags (50kg, Type I)
6. **carib-beer.jpg** - Carib beer 24-pack cases (330ml bottles)
7. **office-supplies.jpg** - Complete office supplies kit (pens, staplers, folders)

## Image Requirements
- **Resolution**: Minimum 1200x600px (2:1 aspect ratio recommended)
- **Format**: JPG or PNG
- **Quality**: High-resolution, professional product photography
- **Background**: Any background is fine as the carousel adds a dark overlay for text readability

## Current Status
🔄 Currently using temporary placeholder images from Unsplash to demonstrate the layout
📋 To use your actual product photos, replace the image URLs in the carouselProducts array with local file paths like "/images/products/premium-rice.jpg"

## How to Replace with Your Images
1. Save your product photos in this folder with the exact filenames listed above
2. Update the carousel data in `client/src/pages/general-merchandise.tsx` to use local paths:
   ```javascript
   image: "/images/products/premium-rice.jpg" // instead of Unsplash URL
   ```