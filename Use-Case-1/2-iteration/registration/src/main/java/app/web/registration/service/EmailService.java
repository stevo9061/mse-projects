package app.web.registration.service;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String verificationUrl) {

        Dotenv dotenv = Dotenv.configure()
                .directory(System.getProperty("user.dir")) // use only for local development
                .filename("mail-settings.env")
                .load();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Email Verification");
        message.setText("Please click the following link to verify your email: " + verificationUrl);
        message.setFrom(dotenv.get("MAIL_ADDRESS"));
        mailSender.send(message);
    }

}
