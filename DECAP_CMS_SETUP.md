# Decap CMS Setup Guide

Decap CMS is now integrated for managing blog posts and learning resources.

## Setup Steps

### 1. Create a GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: VibePHX CMS
   - **Homepage URL**: `https://vibecodephx.com`
   - **Authorization callback URL**: `https://vibecodephx.com/api/auth`
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**

### 2. Configure Environment Variables

Add these to your `.env.local` file:

```bash
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 3. Update CMS Configuration

Edit `/public/admin/config.yml` and replace:

```yaml
backend:
  name: github
  repo: YOUR_GITHUB_USERNAME/vibephx-site  # Replace with your actual repo
  branch: main
```

### 4. Access the CMS

Once configured, you can access the CMS at:

- **Production**: `https://vibecodephx.com/admin`
- **Local**: `http://localhost:3000/admin`

## Features

### Collections

1. **Blog Posts** (`/content/blog`)
   - Title, Date, Description
   - Author, Tags
   - Featured Image
   - Markdown body

2. **Learning Resources** (`/content/resources`)
   - Same fields as blog posts
   - Optimized for tutorials and guides

### Media Management

- Images are uploaded to `/public/images/uploads`
- Automatically referenced as `/images/uploads` in content

## Usage

1. Visit `/admin` in your browser
2. Click "Login with GitHub"
3. Authorize the application
4. Start creating and editing content!

## Content Structure

All content files are stored in:
- `/content/blog/*.mdx` - Blog posts
- `/content/resources/*.mdx` - Learning resources

Files use MDX format with frontmatter:

```mdx
---
title: "Your Title"
date: "2025-01-15"
description: "Brief description"
author: "Vibe Code PHX"
tags: ["tag1", "tag2"]
image: "/images/uploads/featured.jpg"
---

Your content here...
```

## Security Notes

- CMS requires GitHub authentication
- Only users with repository access can edit content
- GitHub acts as the authentication provider
- Content changes are committed directly to the repository

## Troubleshooting

### "Failed to load config.yml"
- Ensure `/public/admin/config.yml` exists
- Check that the file is valid YAML

### "Authentication failed"
- Verify GitHub OAuth credentials in `.env.local`
- Check callback URL matches exactly
- Ensure you're using the correct repository name

### "Cannot save content"
- Verify you have write access to the repository
- Check that the branch name is correct
- Ensure GitHub token has proper permissions
