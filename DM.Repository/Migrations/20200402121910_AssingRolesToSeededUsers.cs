using Microsoft.EntityFrameworkCore.Migrations;

namespace DM.Repository.Migrations
{
    public partial class AssingRolesToSeededUsers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "63ab202f-150d-4ab5-bda8-16b794335dba");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "cdcd7fcc-944a-4007-8283-bf1b653d85d5");

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "UserId", "RoleId" },
                values: new object[,]
                {
                    { 1, 1 },
                    { 2, 2 }
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "26be29b3-e737-478f-b5a3-e30136202b2f", "AQAAAAEAACcQAAAAEAC3ffZJZxvQbChqr1/cEzRHdbQzariyMUcArFTQC4VTV0A6xl4vVJ9AXHKGhehsBQ==" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "e6211337-b4f0-40bf-ae07-5c0f5ff023ed", "AQAAAAEAACcQAAAAEExFlRINSWJP++Mart9KFqnhnu/E8LndUhRwnObM6jiP7SXdnwzi5M3J+Xjnvj6J2w==" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "UserId", "RoleId" },
                keyValues: new object[] { 1, 1 });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "UserId", "RoleId" },
                keyValues: new object[] { 2, 2 });

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
        }
    }
}
