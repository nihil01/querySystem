package az.gov.taxes.QuerySystem.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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

    @NotBlank(message = "Priority is required")
    @Size(max = 100, message = "Priority must be at most 100 characters")
    private String priority;

    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category must be at most 100 characters")
    private String category;

    @NotBlank(message = "Description is required")
    private String description;



    @NotEmpty(message = "DC is required")
    private List<
            @Pattern(regexp = "dc1|dc2|UNDEFINED", message = "DC must be either 'dc1', 'dc2' or 'UNDEFINED'")
                    String
            > dc;

    @NotEmpty(message = "Subcategory is required")
    @Size(max = 100, message = "Each subcategory must be at most 100 characters")
    private List<String> subcategory;

}
