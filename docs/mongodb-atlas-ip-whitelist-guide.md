# MongoDB Atlas Automatic IP Whitelist Update Guide

This guide explains how to set up automatic IP whitelist updates for MongoDB Atlas to solve connection issues when your IP address changes frequently.

## What We've Implemented

We've added code that:
1. Automatically detects your current public IP address
2. Updates your MongoDB Atlas IP whitelist via the MongoDB Atlas API
3. Does this every time your server starts

## Step 1: Get Your MongoDB Atlas API Keys

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click on your project name to access Project Settings
3. In the left sidebar, select **Access Manager**
4. Select the **API Keys** tab
5. Click the **Create API Key** button
6. Enter a description like "IP Whitelist Automation"
7. Select the appropriate permissions:
   - At minimum, you need "Project IP Access List: Read and Write"
   - For security, don't grant more permissions than needed
8. Click **Next**
9. **IMPORTANT**: Copy both the **Public Key** and **Private Key**
   - The Private Key is shown only once - you won't be able to see it again!

## Step 2: Get Your MongoDB Atlas Project ID

1. In MongoDB Atlas, go to your Project's settings page
2. Your Project ID is displayed at the top of the page
3. Copy this ID - it's typically a string of letters and numbers

## Step 3: Update Your .env File

Add the following lines to your .env file (based on .env.example):

```
# MongoDB Atlas API Access (for automatic IP whitelist updates)
MONGODB_ATLAS_PUBLIC_KEY=your_public_key_here
MONGODB_ATLAS_PRIVATE_KEY=your_private_key_here
MONGODB_ATLAS_PROJECT_ID=your_project_id_here
```

## How It Works

1. When your server starts, it calls the `updateMongoDBAtlasIpWhitelist()` function
2. This function:
   - Gets your current public IP address
   - Formats it correctly with CIDR notation (`x.x.x.x/32`)
   - Sends a request to the MongoDB Atlas API to add this IP to the whitelist
   - Handles any errors and reports the status
3. If successful, your new IP is added to the whitelist and MongoDB connection should succeed
4. If there's an API error, it will still attempt to connect to MongoDB (might work if your IP is already in the whitelist)

## Troubleshooting

If you're still having connection issues:

1. Check your MongoDB Atlas API credentials in your .env file
2. Verify your MongoDB Atlas Project ID is correct
3. Check your server logs for error messages
4. Try manually adding your current IP to the whitelist as a fallback
5. Verify that your MongoDB Atlas username/password are still valid

## Security Considerations

- The API keys have access to modify your MongoDB Atlas IP whitelist
- Keep your .env file secure and never commit it to version control
- Consider restricting the API key permissions further if needed
