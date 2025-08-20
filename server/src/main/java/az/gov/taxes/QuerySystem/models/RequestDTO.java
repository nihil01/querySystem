package az.gov.taxes.QuerySystem.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RequestDTO {

    @NotBlank(message = "Issuer is required")
    @Size(max = 50, message = "Issuer must be at most 50 characters")
    private String issuer;

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must be at most 100 characters")
    private String title;

    @NotBlank(message = "Subcategory is required")
    @Size(max = 100, message = "Subcategory must be at most 100 characters")
    private String subcategory;

    @NotBlank(message = "Priority is required")
    @Size(max = 100, message = "Priority must be at most 100 characters")
    private String priority;

    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category must be at most 100 characters")
    private String category;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "DC is required")
    @Pattern(regexp = "dc1|dc2|UNDEFINED", message = "DC must be either 'dc1' or 'dc2'")
    private String dc;

    @Size(max = 50, message = "VLAN ID must be at most 50 characters")
    private String vlanId;

    @Size(max = 50, message = "VRF must be at most 50 characters")
    private String vrf;

    @Size(max = 50, message = "Subnet must be at most 50 characters")
    private String subnet;
}
