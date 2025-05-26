<?php

namespace App\Http\Controllers;

use App\Models\BlogSetting;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class BlogSettingsController extends Controller
{
    /**
     * Display the blog settings page.
     */
    public function index(): Response
    {
        $bannerImagePath = BlogSetting::get('banner_image_path');
        $bannerImageUrl = $bannerImagePath ? asset('storage/' . $bannerImagePath) : null;

        return Inertia::render('Admin/Blog/Settings', [
            'bannerImageUrl' => $bannerImageUrl,
        ]);
    }

    /**
     * Upload and set the banner image.
     */
    public function uploadBanner(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'banner_image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator->errors());
        }

        try {
            // Get current banner image path to delete later
            $currentBannerPath = BlogSetting::get('banner_image_path');

            // Store the new banner image
            $bannerImage = $request->file('banner_image');
            $path = $bannerImage->store('blog/banner', 'public');

            // Update the setting
            BlogSetting::set('banner_image_path', $path);

            // Delete old banner image if it exists
            if ($currentBannerPath && Storage::disk('public')->exists($currentBannerPath)) {
                Storage::disk('public')->delete($currentBannerPath);
            }

            return redirect()->back()->with([
                'success' => true,
                'message' => 'Banner image uploaded successfully',
                'bannerImageUrl' => asset('storage/' . $path),
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'banner_image' => 'Failed to upload banner image: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Remove the banner image.
     */
    public function removeBanner(): RedirectResponse
    {
        try {
            $currentBannerPath = BlogSetting::get('banner_image_path');

            // Delete the image file if it exists
            if ($currentBannerPath && Storage::disk('public')->exists($currentBannerPath)) {
                Storage::disk('public')->delete($currentBannerPath);
            }

            // Remove the setting
            BlogSetting::remove('banner_image_path');

            return redirect()->back()->with([
                'success' => true,
                'message' => 'Banner image removed successfully',
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'banner_image' => 'Failed to remove banner image: ' . $e->getMessage(),
            ]);
        }
    }
}