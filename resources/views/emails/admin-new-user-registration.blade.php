<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New User Registration - {{ config('app.name') }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .content {
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }
        .user-details {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .detail-row {
            margin: 10px 0;
            padding: 5px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #495057;
        }
        .value {
            color: #212529;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            padding: 20px;
            color: #6c757d;
            font-size: 14px;
        }
        .alert {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>New User Registration</h1>
        <p>{{ config('app.name') }} Admin Notification</p>
    </div>

    <div class="content">
        <div class="alert">
            <strong>New User Alert!</strong> A new user has registered on {{ config('app.name') }}.
        </div>

        <p>A new user has successfully registered on your application. Here are the details:</p>
        
        <div class="user-details">
            <h3>User Information</h3>
            
            <div class="detail-row">
                <span class="label">Name:</span>
                <span class="value">{{ $user->name }}</span>
            </div>
            
            <div class="detail-row">
                <span class="label">Email:</span>
                <span class="value">{{ $user->email }}</span>
            </div>
            
            <div class="detail-row">
                <span class="label">Registration Date:</span>
                <span class="value">{{ $user->created_at->format('F j, Y \a\t g:i A') }}</span>
            </div>
            
            <div class="detail-row">
                <span class="label">User ID:</span>
                <span class="value">#{{ $user->id }}</span>
            </div>
            
            @if($user->subscription_status)
            <div class="detail-row">
                <span class="label">Subscription Status:</span>
                <span class="value">{{ ucfirst($user->subscription_status) }}</span>
            </div>
            @endif
        </div>
        
        <p>This user has been automatically added to your user database and can now access the application.</p>
        
        <p>You may want to:</p>
        <ul>
            <li>Review the user's account details</li>
            <li>Monitor their activity</li>
            <li>Send them additional onboarding information if needed</li>
        </ul>
    </div>

    <div class="footer">
        <p>This is an automated notification from {{ config('app.name') }}.</p>
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
    </div>
</body>
</html>