<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        
        <!-- Font Awesome -->
        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' integrity='sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==' crossorigin='anonymous' referrerpolicy='no-referrer' />

        <!-- Blog Theme CSS Variables -->
        @php
            $currentThemePaletteId = \App\Models\BlogSetting::get('blog_theme_palette_id', 'palette_1');
            $allThemesConfig = config('blog_themes');
            $activeThemeColors = $allThemesConfig[$currentThemePaletteId]['colors'] ?? $allThemesConfig['palette_1']['colors'];
        @endphp
        @if(!empty($activeThemeColors))
        <style id="blog-theme-styles">
            .blog-theme-active { /* This class will be added to the body or a main wrapper for blog pages */
                --blog-color-primary: {{ $activeThemeColors['primary'] }};
                --blog-color-secondary: {{ $activeThemeColors['secondary'] }};
                --blog-color-accent: {{ $activeThemeColors['accent'] }};
                --blog-color-neutral: {{ $activeThemeColors['neutral'] }};
                --blog-color-base: {{ $activeThemeColors['base'] }};
                /* Add any other theme-specific variables here if needed */
            }
        </style>
        @endif

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
