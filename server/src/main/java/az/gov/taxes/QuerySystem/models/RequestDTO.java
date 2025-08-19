package az.gov.taxes.QuerySystem.models;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RequestDTO {

    @NotBlank
    private String issuer;
    @NotBlank
    private String title;
    @NotBlank
    private String subcategory;
    @NotBlank
    private String priority;
    @NotBlank
    private String category;
    @NotBlank
    private String dc;

}
