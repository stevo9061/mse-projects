package app.web.registration;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserLoginRequest {

    private String username;
    private String password;
}
