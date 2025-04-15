# Product Requirements Document: C4 Knives Website
## Project Name
C4 Knives – E-commerce and Social Media Site

## Overview
C4 Knives is a knife crafting company specializing in hand-forged, military-inspired blades. They demonstrate their process on YouTube and want to combine social content with an e-commerce storefront in a modern, single-page web application. The website should be dark-themed and designed to appeal to a military and tactical gear audience.

## Goals
- Create a modern, responsive single-page React web application
- Use the MERN stack (MongoDB, Express, React, Node.js)
- Enable product showcasing and social content integration
- Allow users to request products quickly
- Include an admin panel for content management (products, spotlight, and media)

## Tech Stack
- **Frontend**: React.js, Tailwind CSS (for modern styling)
- **Backend**: Node.js with Express.js
- **Database**: MongoDB (hosted on MongoDB Atlas or local)
- **Authentication**: JWT-based for admin area
- **API communication**: RESTful
- **Deployment**: Docker (optional), Vercel/Netlify for frontend, Heroku/Render for backend

## Site Structure and Pages
1. About Us
    - Brief history and mission statement
    - Embedded image/video background or hero banner
    - Text content describing the hand-crafting process and tactical roots

2. Spotlight
    - Highlight one featured knife or story at a time
    - Include image/video, name, description
    - Admin should be able to update this section regularly

3. Products
    - Display all products in a grid
    - Each product should show:
        - Image
        - Name
        - Description
        - Price
        - “Request Now” button
            - “Request Now” opens a short form (name, email, message)

4. Socials
    - Embedded YouTube videos (latest 3)
    - Link icons to:
        - YouTube
        - Instagram
        - Facebook
        - TikTok
    - Use social media preview cards or thumbnail-style layout

5. Contact Form
    - Fields: name, email, message
    - On submit, send message to backend (store in DB and optionally send to admin email)

## Admin Dashboard
Accessible at /admin with login

**Features**   
- Admin login with JWT auth    
- Dashboard:
    - Add/edit/delete products (with image upload)
    - Update spotlight content
    - View contact form messages    
- Product fields:
    - Name
    - Description 
    - Price
    - Image (upload and preview)
    - Tags (optional)

## Frontend Features
- Dark theme with military aesthetic
- Mobile-first responsive design
- Navigation bar with smooth scroll
- Transitions and animations (Framer Motion or CSS-based)
- Image lightbox or modal on product click

## Backend API Endpoints
**Products**
- GET /api/products — public
- POST /api/products — admin only
- PUT /api/products/:id — admin only
- DELETE /api/products/:id — admin only

**Spotlight**
- GET /api/spotlight — public
- PUT /api/spotlight — admin only

**Contact**
- POST /api/contact — public
- GET /api/messages — admin only

**Auth**
- POST /api/admin/login — returns JWT
- GET /api/admin/me — verify session

## Database Schema
Product
```js
Copy
Edit
{
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
  tags: [String],
  createdAt: Date
}
```
Spotlight
```js
Copy
Edit
{
  title: String,
  description: String,
  imageUrl: String,
  videoUrl: String,
  updatedAt: Date
}
```
ContactMessage
```js
Copy
Edit
{
  name: String,
  email: String,
  message: String,
  createdAt: Date
}
```
Admin
```js
Copy
Edit
{
  username: String,
  passwordHash: String
}
```

## Design Notes
- Use a color palette with matte blacks, gunmetal gray, and muted army green
- Fonts: Use military-style serif or stencil fonts for headings, readable sans-serif for body
- Consider background textures or overlays (carbon fiber, camo pattern subtleties)
- Clear call-to-action buttons styled like military buttons (sharp corners, embossed)
- Use hover effects and transitions on product cards and buttons

## Security
- Passwords stored hashed with bcrypt
- Admin area protected with JWT
- Rate limit form submissions to prevent spam

## Stretch Features
- Product filter by category or tag
- Wishlist functionality
- Newsletter signup (Mailchimp or similar)
- Image carousel for product gallery
- Light/dark theme toggle (default to dark)

## Deployment
- Use environment variables for database credentials and JWT secret
- Upload images to a service like Cloudinary or local /uploads folder (with static serving)
- Enable CORS as necessary
- Deploy frontend and backend separately if needed