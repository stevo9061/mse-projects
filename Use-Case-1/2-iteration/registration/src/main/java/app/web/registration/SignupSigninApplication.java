package app.web.registration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SignupSigninApplication {

	public static void main(String[] args) {
		SpringApplication.run(SignupSigninApplication.class, args);
	}

}
