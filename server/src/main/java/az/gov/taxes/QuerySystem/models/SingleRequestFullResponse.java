package az.gov.taxes.QuerySystem.models;


import az.gov.taxes.QuerySystem.models.db.AdminResponse;
import az.gov.taxes.QuerySystem.models.db.Request;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class SingleRequestFullResponse {

    private AdminResponse adminResponse;
    private Request userRequest;

}
