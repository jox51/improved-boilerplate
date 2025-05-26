<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            // Arvow integration fields
            $table->string('arvow_id')->nullable()->unique()->after('id');
            $table->text('content_markdown')->nullable()->after('content');
            $table->json('tags')->nullable()->after('content_markdown');
            $table->string('thumbnail_url')->nullable()->after('featured_image_path');
            $table->string('thumbnail_alt_text')->nullable()->after('thumbnail_url');
            $table->text('meta_description')->nullable()->after('thumbnail_alt_text');
            $table->string('keyword_seed')->nullable()->after('meta_description');
            $table->char('language_code', 5)->nullable()->default('en')->after('keyword_seed');
            
            // Add index for arvow_id for efficient lookups
            $table->index('arvow_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropIndex(['arvow_id']);
            $table->dropColumn([
                'arvow_id',
                'content_markdown',
                'tags',
                'thumbnail_url',
                'thumbnail_alt_text',
                'meta_description',
                'keyword_seed',
                'language_code'
            ]);
        });
    }
};
