#!/usr/bin/env node

// Get the preview URL from environment variable
const previewUrl = process.env.PREVIEW_URL;

if (!previewUrl) {
  console.error('PREVIEW_URL environment variable is not set');
  process.exit(1);
}

// Remove any trailing slashes and output the URL
console.log(previewUrl.replace(/\/+$/, '')); 