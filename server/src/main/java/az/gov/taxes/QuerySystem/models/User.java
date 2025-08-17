package az.gov.taxes.QuerySystem.models;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class User {

    private String fullName;
    private String principalName;
    private String position;
    private String department;
    private String phone;
    private String role;
    private String token;
}
