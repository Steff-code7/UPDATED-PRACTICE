<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require_once __DIR__ . '/../vendor/autoload.php';

function createMailer(string $businessName): PHPMailer
{
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;

    // Replace these with your real Gmail/business email and app password.
    $mail->Username = 'sbaltazar.1012@umak.edu.ph';
    $mail->Password = 'cedrqxjhnusvdswe';

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->SMTPOptions = [
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true,
        ],
    ];

    $mail->setFrom($mail->Username, $businessName);
    return $mail;
}

function sendWelcomeEmail(string $customerName, string $emailAddress): bool
{
    $businessName = 'YAS Milktea House';
    $loginLink = 'http://localhost/UPDATED%20PRACTICE/loginSignUp.html';

    try {
        $mail = createMailer($businessName);
        $mail->addAddress($emailAddress, $customerName);

        $safeName = htmlspecialchars($customerName, ENT_QUOTES, 'UTF-8');
        $safeEmail = htmlspecialchars($emailAddress, ENT_QUOTES, 'UTF-8');
        $safeBusinessName = htmlspecialchars($businessName, ENT_QUOTES, 'UTF-8');

        $mail->isHTML(true);
        $mail->Subject = "Welcome to {$businessName}!";
        $mail->Body = "
            <p>Hi {$safeName},</p>

            <p>Welcome to {$safeBusinessName}!</p>

            <p>Your account has been successfully created using this email address: <strong>{$safeEmail}</strong>.</p>

            <p>You can now log in and start exploring our products, place orders, and enjoy exclusive offers.</p>

            <p><a href=\"{$loginLink}\">Log in here</a></p>

            <p>If you have any questions or need assistance, feel free to reply to this email. We're happy to help.</p>

            <p>Thanks for joining us!</p>

            <p>Best regards,<br>{$safeBusinessName} Team</p>
        ";
        $mail->AltBody = "Hi {$customerName},\n\n"
            . "Welcome to {$businessName}!\n\n"
            . "Your account has been successfully created using this email address: {$emailAddress}.\n\n"
            . "Log in here: {$loginLink}\n\n"
            . "Thanks for joining us!\n\n"
            . "Best regards,\n{$businessName} Team";

        $mail->send();
        return true;
    } catch (Exception $exception) {
        error_log('Welcome email failed: ' . $exception->getMessage());
        return false;
    }
}

function sendAdminRoleEmail(string $customerName, string $emailAddress): bool
{
    $businessName = 'YAS Milktea House';

    try {
        $mail = createMailer($businessName);
        $mail->addAddress($emailAddress, $customerName);

        $safeName = htmlspecialchars($customerName, ENT_QUOTES, 'UTF-8');
        $safeBusinessName = htmlspecialchars($businessName, ENT_QUOTES, 'UTF-8');

        $mail->isHTML(true);
        $mail->Subject = 'Important: Your account role has been updated to Admin';
        $mail->Body = "
            <p>Hi {$safeName},</p>

            <p>We are reaching out to let you know that your account role at {$safeBusinessName} has been officially changed from Customer to Admin.</p>

            <p>You now have access to the administrative dashboard, where you can manage products, view orders, and handle site settings.</p>

            <p>Best regards,<br>{$safeBusinessName} Team</p>
        ";
        $mail->AltBody = "Hi {$customerName},\n\n"
            . "We are reaching out to let you know that your account role at {$businessName} has been officially changed from Customer to Admin.\n\n"
            . "You now have access to the administrative dashboard, where you can manage products, view orders, and handle site settings.\n\n"
            . "Best regards,\n{$businessName} Team";

        $mail->send();
        return true;
    } catch (Exception $exception) {
        error_log('Admin role email failed: ' . $exception->getMessage());
        return false;
    }
}
