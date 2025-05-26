<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ArvowWebhookRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * Authorization is handled by the X-SECRET header validation in the controller,
     * so we return true here for server-to-server webhook communication.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'content_markdown' => 'nullable|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:100',
            'thumbnail' => 'nullable|url|max:500',
            'thumbnail_alt_text' => 'nullable|string|max:255',
            'metadescription' => 'nullable|string|max:500',
            'keyword_seed' => 'nullable|string|max:255',
            'language_code' => 'nullable|string|max:5',
        ];
    }
}
