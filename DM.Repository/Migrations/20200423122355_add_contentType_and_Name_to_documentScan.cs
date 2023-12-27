using Microsoft.EntityFrameworkCore.Migrations;

namespace DM.Repository.Migrations
{
    public partial class add_contentType_and_Name_to_documentScan : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContentType",
                table: "DocumentScan",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "DocumentScan",
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
                columns: new[] { "ConcurrencyStamp", "Language", "PasswordHash" },
                values: new object[] { "9088d9a3-b20e-41df-bf60-622547d01645", "en", "AQAAAAEAACcQAAAAEAGrlW/LL0McreGseSIsmdIfKFAnd+eQn+QlYelKD8Glczl+wOV8X2LbrrjIWh98ww==" });

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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContentType",
                table: "DocumentScan");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "DocumentScan");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "05fe358a-552b-4eba-8f23-b3ea8ed33064");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "bf791ff5-7af3-4704-80a6-2e598b95d904");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 3,
                column: "ConcurrencyStamp",
                value: "a7eb4b4b-92c7-47aa-9392-9184416334f7");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "Language", "PasswordHash" },
                values: new object[] { "3194909d-4228-4dc7-8543-98166842d4af", "en", "AQAAAAEAACcQAAAAEHoZScaTgzgA7udeUTc6cZcyeySYXkLnxGweO2uZNeEtoVuwsYNYcgOPWZhHxTwZUw==" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "Language", "PasswordHash" },
                values: new object[] { "35a0d733-36c7-4682-a49c-e69859413e01", "en", "AQAAAAEAACcQAAAAEH8gWqKvHg7SfRnSTzNhbu4bM4cKFbmeU7TH4QLH8jBfObyEaI5IWYTno6e5gaINjA==" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "ConcurrencyStamp", "Language", "PasswordHash" },
                values: new object[] { "1bae49fe-8d31-48b4-a8ac-c882884f36cd", "en", "AQAAAAEAACcQAAAAEFwcAOdX/zfyeA9wy7SzobSjRJAAW9wgaSGp0RCmzMnsnBrSjW7DxQT8DagUBk7IiQ==" });
        }
    }
}
