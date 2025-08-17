package az.gov.taxes.QuerySystem.models;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDto {

    @NotEmpty
    private String principal;
    @NotEmpty
    private String password;
    @NotEmpty
    private String role;

}
