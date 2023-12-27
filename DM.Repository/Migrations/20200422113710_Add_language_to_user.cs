using Microsoft.EntityFrameworkCore.Migrations;

namespace DM.Repository.Migrations
{
    public partial class Add_language_to_user : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Language",
                table: "AspNetUsers",
                nullable: true,
                defaultValue: "en");

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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Language",
                table: "AspNetUsers");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "ac32c310-7200-45db-b173-904ca57c65d3");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "8740d8e1-55ff-48ca-b43d-274dde644551");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 3,
                column: "ConcurrencyStamp",
                value: "738c8b15-04ae-43ce-b56a-640263f87908");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "02a819fa-7b99-48f9-98e3-0de6dafb8359", "AQAAAAEAACcQAAAAEJNwJWqKcXvhZH3+j8lxVlMIYTDArShrzIR848oWTLhmLPyzR5h8Sbn7CRdRiEj1AA==" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "99d7d046-e7ec-437f-84cd-1c31cb13b050", "AQAAAAEAACcQAAAAEAqfywRxavoKAc2ZSZMPQikXWjTZmfMbmrSt6B88F7w6b96KqX0yDz7GQ3QzSKFcgg==" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "f3ddca03-3043-48ce-b9ce-4926b94ba32c", "AQAAAAEAACcQAAAAEJYjmmWixCjpZkmlU8soMuYWSftzXTIr7EHmNjwzC2UM2q3BILHNuzFTu+tt2xkr1Q==" });
        }
    }
}
