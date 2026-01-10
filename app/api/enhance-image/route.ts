import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});

export async function POST(request: NextRequest) {
	try {
		const { image } = await request.json();

		if (!image) {
			return NextResponse.json(
				{ error: 'No image provided' },
				{ status: 400 }
			);
		}

		// Upload image to Cloudinary
		const uploadResult = await cloudinary.uploader.upload(image, {
			folder: 'enhanced-images',
			resource_type: 'image',
		});

		// Generate enhanced image URL with Cloudinary transformations
		const enhancedUrl = cloudinary.url(uploadResult.public_id, {
			fetch_format: 'auto',
			quality: 'auto:best',
			// AI-based enhancement
			effect: 'improve',
			// Upscale using generative fill
			width: uploadResult.width * 2,
			height: uploadResult.height * 2,
			crop: 'fill',
			// Additional enhancements
			sharpen: 100,
			contrast: 10,
			saturation: 10,
		});

		// Don't delete the image - keep it for access
		// Note: You may want to implement a cleanup job later to remove old images

		return NextResponse.json({
			success: true,
			enhancedUrl,
			publicId: uploadResult.public_id,
		});
	} catch (error) {
		console.error('Cloudinary enhancement error:', error);
		return NextResponse.json(
			{ error: 'Failed to enhance image', details: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		);
	}
}

