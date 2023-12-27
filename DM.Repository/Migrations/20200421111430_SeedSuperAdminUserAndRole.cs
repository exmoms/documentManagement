using Microsoft.EntityFrameworkCore.Migrations;

namespace DM.Repository.Migrations
{
    public partial class SeedSuperAdminUserAndRole : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "ac32c310-7200-45db-b173-904ca57c65d3", "SuperAdmin", "SUPERADMIN" });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "8740d8e1-55ff-48ca-b43d-274dde644551", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { 3, "738c8b15-04ae-43ce-b56a-640263f87908", "User", "USER" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "Email", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "UserName" },
                values: new object[] { "02a819fa-7b99-48f9-98e3-0de6dafb8359", "superadmin@lit-co.net", "SUPERADMIN@LIT-CO.NET", "SUPER ADMIN", "AQAAAAEAACcQAAAAEJNwJWqKcXvhZH3+j8lxVlMIYTDArShrzIR848oWTLhmLPyzR5h8Sbn7CRdRiEj1AA==", "super admin" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "Email", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "UserName" },
                values: new object[] { "99d7d046-e7ec-437f-84cd-1c31cb13b050", "admin@lit-co.net", "ADMIN@LIT-CO.NET", "ADMIN", "AQAAAAEAACcQAAAAEAqfywRxavoKAc2ZSZMPQikXWjTZmfMbmrSt6B88F7w6b96KqX0yDz7GQ3QzSKFcgg==", "admin" });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { 3, 0, "f3ddca03-3043-48ce-b9ce-4926b94ba32c", "user@lit-co.net", false, false, null, "USER@LIT-CO.NET", "USER", "AQAAAAEAACcQAAAAEJYjmmWixCjpZkmlU8soMuYWSftzXTIr7EHmNjwzC2UM2q3BILHNuzFTu+tt2xkr1Q==", null, false, "", false, "user" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "UserId", "RoleId" },
                values: new object[] { 3, 3 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "UserId", "RoleId" },
                keyValues: new object[] { 3, 3 });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "63ab202f-150d-4ab5-bda8-16b794335dba", "Admin", "ADMIN" });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "cdcd7fcc-944a-4007-8283-bf1b653d85d5", "User", "USER" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "Email", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "UserName" },
                values: new object[] { "26be29b3-e737-478f-b5a3-e30136202b2f", "admin@lit-co.net", "ADMIN@LIT-CO.NET", "ADMIN", "AQAAAAEAACcQAAAAEAC3ffZJZxvQbChqr1/cEzRHdbQzariyMUcArFTQC4VTV0A6xl4vVJ9AXHKGhehsBQ==", "admin" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "Email", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "UserName" },
                values: new object[] { "e6211337-b4f0-40bf-ae07-5c0f5ff023ed", "user@lit-co.net", "USER@LIT-CO.NET", "USER", "AQAAAAEAACcQAAAAEExFlRINSWJP++Mart9KFqnhnu/E8LndUhRwnObM6jiP7SXdnwzi5M3J+Xjnvj6J2w==", "user" });
        }
    }
}
