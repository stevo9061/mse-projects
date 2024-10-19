package app.web.registration;

import lombok.Builder;
import lombok.Value;


@Value
@Builder
public class UserRegistrationRequest {

    private String fullname;
    private String username;
    private String password;
    private String email;


}
