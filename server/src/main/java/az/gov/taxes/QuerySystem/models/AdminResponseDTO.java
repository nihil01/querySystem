package az.gov.taxes.QuerySystem.models;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AdminResponseDTO {

    @NotBlank
    @Min(1)
    private Long requestId;
    @NotBlank
    private String admin;
    @NotBlank
    private String adminResponse;

}
