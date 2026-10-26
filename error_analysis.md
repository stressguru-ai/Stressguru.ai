# Error Analysis - AI Blog Generation

## Error Message
Failed to generate blog: Failed query: insert into `blogs` (`id`, `slug`, `title`, `excerpt`, `content`, `image`, `category`, `guruId`, `authorName`, `authorRole`, `authorImage`, `seoKeywords`, `metaTitle`, `metaDescription`, `canonicalUrl`, `ogImage`, `readTime`, `status`, `createdBy`, `publishedAt`, `createdAt`, `updatedAt`) values (default, ?, ?, ?, ?, default, ?, ?, ?, ?, ?, ?, ?, ?, default, default, ?, ?, ?, default, default, default)

## Issue
The error shows raw HTML content being displayed in the preview panel on the right side.

## Root Cause Analysis
1. The blog generation IS working - it generates the content successfully
2. The issue is that the preview panel is showing raw data/HTML instead of formatted content
3. The database insert is failing for some reason (possibly slug conflict or data format issue)

## What User Sees
- Raw HTML tags like `<h2>`, `<p>`, `<br>` visible in the preview
- The preview panel shows unformatted content
- After generation, it should redirect to Edit Blog page with content in WYSIWYG editor

## Solution Needed
1. Fix the database insert error (check slug uniqueness or data format)
2. After successful generation, redirect to Edit Blog page where content is properly rendered
3. Remove or hide the preview panel during generation since it shows raw data
