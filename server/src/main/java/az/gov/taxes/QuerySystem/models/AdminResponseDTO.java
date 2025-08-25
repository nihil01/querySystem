package az.gov.taxes.QuerySystem.models;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
    private String adminResponse;

    @NotBlank
    @Pattern(regexp = "CLOSED|REJECTED", message = "Invalid state type ...")
    private String state;

    private String subnet;

    private String vlanId;

    private String vrf;

}