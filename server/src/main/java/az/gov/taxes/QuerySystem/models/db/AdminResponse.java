package az.gov.taxes.QuerySystem.models.db;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table("admin_responses")
@Data
public class AdminResponse {

    @Id
    private Long id;
    @Column("request_id")
    private Long requestId;
    private String admin;
    @Column("admin_response")
    private String adminResponse;

}
