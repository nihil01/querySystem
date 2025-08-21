package az.gov.taxes.QuerySystem.models.db;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table("requests")
@Data
public class Request {

    @Id
    private Long id;

    private String issuer;
    private String title;
    private String subcategory;
    private String priority;
    private String category;
    private String description;
    private String dc;
    private Boolean resolved;

    //extra fields
    @Column("vlan_id")
    private String vlanId;
    private String vrf;
    private String subnet;

    //auto-generated
    private Instant created_at;
}
