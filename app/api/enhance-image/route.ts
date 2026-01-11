import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

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

		const uploadResult = await cloudinary.uploader.upload(image, {
			folder: 'enhanced-images',
			resource_type: 'image',
		});

		const enhancedUrl = cloudinary.url(uploadResult.public_id, {
			fetch_format: 'auto',
			quality: 'auto:best',
			effect: 'improve',
			width: uploadResult.width * 2,
			height: uploadResult.height * 2,
			crop: 'fill',
			sharpen: 100,
			contrast: 10,
			saturation: 10,
		});

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

