using Microsoft.EntityFrameworkCore.Migrations;

namespace DM.Repository.Migrations
{
    public partial class unique_Attachments_For_Document : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Attachment_DocumentId",
                table: "Attachment");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "f6176c61-0b3a-46c0-bc3b-e58fc058ae77");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "816ebc44-0d48-49ad-884c-bd9f33b67aa4");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "bc4b4ad0-047e-4007-a504-53bb0504d419", "AQAAAAEAACcQAAAAEOOWdHLYJ1HOXGdnMEHBrpVudeP+U29TY93FpS59aPr4/hYOdw8/caTV6sNPpdtVXw==" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "b5d9b8a2-f0eb-465f-bd92-0c6576af9a8c", "AQAAAAEAACcQAAAAEPSdEudkUOPRIFqGYKCGTAEtv3YIr1YP0pD+olEkHXGIXyTI9v6PyTVzIVOSNP8bbQ==" });

            migrationBuilder.CreateIndex(
                name: "IX_Attachment_DocumentId_CompoundModelID",
                table: "Attachment",
                columns: new[] { "DocumentId", "CompoundModelID" },
                unique: true,
                filter: "[CompoundModelID] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Attachment_DocumentId_CompoundModelID",
                table: "Attachment");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "7fa30506-6375-4ab9-9ca1-0c237b4fe478");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "dba95f99-63c0-4166-9645-9239cada8532");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "73c3b985-697d-46c3-9bee-878879c6d3d0", "AQAAAAEAACcQAAAAENcYF0SUlLAd8iiLEPHu5fsaV+ri1b2x4cktRwxfo0CC7VoFZDqGWg2/3bJBrUWaDQ==" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "80822195-e7a6-49d2-92d6-a1b0e8bab4a1", "AQAAAAEAACcQAAAAELs4pqRzkFXH9Z4O9Ci9MNxw5UGofZD728e3VTFXr1U+jbvw/yZ61iWwjjtKsu+3xg==" });

            migrationBuilder.CreateIndex(
                name: "IX_Attachment_DocumentId",
                table: "Attachment",
                column: "DocumentId");
        }
    }
}
