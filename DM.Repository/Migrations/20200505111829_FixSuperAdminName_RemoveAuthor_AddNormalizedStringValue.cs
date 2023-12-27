using Microsoft.EntityFrameworkCore.Migrations;

namespace DM.Repository.Migrations
{
    public partial class FixSuperAdminName_RemoveAuthor_AddNormalizedStringValue : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Author",
                table: "DocumentVersion");

            migrationBuilder.AddColumn<string>(
                name: "NormalizedValue",
                table: "StringValue",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "3cf622c2-1205-4c47-b0ec-c2f5e3ef3cf0");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "9a1c35c1-8850-47aa-ac6f-0a1bf715a44d");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 3,
                column: "ConcurrencyStamp",
                value: "fa85dee0-71a8-43e8-a68a-f6680bfbac84");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "Language", "NormalizedUserName", "PasswordHash", "UserName" },
                values: new object[] { "5bde2999-7b55-48af-b0fd-83c47d06e453", "en", "SUPER_ADMIN", "AQAAAAEAACcQAAAAEIgacxR6TeO89gZW/0GVGmmHVla7Jv8fqRf1Y6pe/oFczto4ymsQebVkkGbiEeXy5Q==", "super_admin" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "Language", "PasswordHash" },
                values: new object[] { "fb3fd05a-3c8d-4981-8e93-99f651655331", "en", "AQAAAAEAACcQAAAAEJrqzW/3Q2d9+2EozdLcWacbMFJYGgYQ1AEj4ULTX6igQSyjs/Yt2Fiia3qbKp9gGg==" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "ConcurrencyStamp", "Language", "PasswordHash" },
                values: new object[] { "b7343ae7-36ac-4751-b73d-558e08da1d1a", "en", "AQAAAAEAACcQAAAAEPjr6MhlAb5ZVm04AoZ6UZkHocSrvMa3WyWCpcQRax3rBOV/LcCdthYKSmqAv/Ksog==" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NormalizedValue",
                table: "StringValue");

            migrationBuilder.AddColumn<string>(
                name: "Author",
                table: "DocumentVersion",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "63bc39b3-aa54-4c9d-b7a0-d71fe16aed72");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "160e4bc8-8c5e-446d-b61d-b8478cb191ed");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 3,
                column: "ConcurrencyStamp",
                value: "fbcd0648-c70c-490c-a46a-9b021fd00a06");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "Language", "NormalizedUserName", "PasswordHash", "UserName" },
                values: new object[] { "9088d9a3-b20e-41df-bf60-622547d01645", "en", "SUPER ADMIN", "AQAAAAEAACcQAAAAEAGrlW/LL0McreGseSIsmdIfKFAnd+eQn+QlYelKD8Glczl+wOV8X2LbrrjIWh98ww==", "super admin" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "Language", "PasswordHash" },
                values: new object[] { "7ac14555-ca7d-4e74-a7d7-ca107adbdb44", "en", "AQAAAAEAACcQAAAAEAlvtQWzKhDRBj1OLdV8GJaawoCY5pOVnT8M+650gGANrPjvIIiKF5c1ymaSOFkDyA==" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "ConcurrencyStamp", "Language", "PasswordHash" },
                values: new object[] { "48d6da84-3dd0-4220-9a6a-fd0a142bc6e3", "en", "AQAAAAEAACcQAAAAEI9QI0NAt9XY7nZMJDSelv4WyNiMLMEGNdKblJAC+NT7ninn5Gl45JYQsarXt+3GbQ==" });
        }
    }
}
