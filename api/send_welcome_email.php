<?php
declare(strict_types=1);

$autoloadPath = __DIR__ . '/../vendor/autoload.php';
if (file_exists($autoloadPath)) {
    try {
        require_once $autoloadPath;
    } catch (\Throwable $e) {
        // PHPMailer not available, continue without it
    }
}

function createMailer(string $businessName)
{
    try {
        if (!class_exists('PHPMailer\\PHPMailer\\PHPMailer')) {
            return null;
        }

        $configPath = __DIR__ . '/mail_config.php';
        if (!file_exists($configPath)) {
            error_log('Mail config missing. Copy api/mail_config.example.php to api/mail_config.php.');
            return null;
        }

        $config = require $configPath;
        $host = $config['host'] ?? '';
        $username = $config['username'] ?? '';
        $password = $config['password'] ?? '';
        $port = (int) ($config['port'] ?? 587);

        if ($host === '' || $username === '' || $password === '') {
            error_log('Mail config is incomplete.');
            return null;
        }

        $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $host;
        $mail->SMTPAuth = true;
        $mail->Username = $username;
        $mail->Password = $password;

        $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $port;
        $mail->SMTPOptions = [
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true,
            ],
        ];

        $mail->setFrom($mail->Username, $businessName);
        return $mail;
    } catch (\Throwable $e) {
        return null;
    }
}

function sendVerificationEmail(string $customerName, string $emailAddress, string $verificationToken): bool
{
    $businessName = 'YAS Milktea House';
    $siteUrl = 'https://dress-quartered-showcase.ngrok-free.dev/UPDATED%20PRACTICE';
    $verificationLink = $siteUrl . '/verify_email.php?token=' . urlencode($verificationToken);

    try {
        $mail = createMailer($businessName);
        if (!$mail) {
            // PHPMailer not available, skip email sending
            return false;
        }

        $mail->addAddress($emailAddress, $customerName);

        $safeName = htmlspecialchars($customerName, ENT_QUOTES, 'UTF-8');
        $safeEmail = htmlspecialchars($emailAddress, ENT_QUOTES, 'UTF-8');
        $safeBusinessName = htmlspecialchars($businessName, ENT_QUOTES, 'UTF-8');

        $mail->isHTML(true);
        $mail->Subject = "Confirm your email for {$businessName}";
        $mail->Body = "
            <p>Hi {$safeName},</p>

            <p>Thanks for signing up at {$safeBusinessName}.</p>

            <p>Please confirm your email address by clicking the button below:</p>

            <p><a href=\"{$verificationLink}\" style=\"display:inline-block;padding:12px 24px;color:#ffffff;background-color:#333333;text-decoration:none;border-radius:4px;\">Confirm Email</a></p>

            <p>If the button does not work, copy and paste this link into your browser:</p>
            <p><a href=\"{$verificationLink}\">{$verificationLink}</a></p>

            <p>If you did not create this account, you can ignore this email.</p>

            <p>Best regards,<br>{$safeBusinessName} Team</p>
        ";
        $mail->AltBody = "Hi {$customerName},\n\n"
            . "Thanks for signing up at {$businessName}.\n\n"
            . "Please confirm your email address by visiting the following link:\n\n"
            . "{$verificationLink}\n\n"
            . "If you did not create this account, you can ignore this email.\n\n"
            . "Best regards,\n{$businessName} Team";

        $mail->send();
        return true;
    } catch (\Throwable $exception) {
        error_log('Verification email failed: ' . $exception->getMessage());
        return false;
    }
}

function sendAdminRoleEmail(string $customerName, string $emailAddress): bool
{
    $businessName = 'YAS Milktea House';

    try {
        $mail = createMailer($businessName);
        if (!$mail) {
            throw new \Exception('PHPMailer is not available.');
        }
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
    } catch (\Throwable $exception) {
        error_log('Admin role email failed: ' . $exception->getMessage());
        return false;
    }
}
