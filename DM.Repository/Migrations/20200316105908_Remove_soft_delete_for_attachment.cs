using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DM.Repository.Migrations
{
    public partial class Remove_soft_delete_for_attachment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeletedDate",
                table: "Attachment");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "4d95c1b7-59ab-4605-ad71-323343f4b48b");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "f5726a14-1708-4409-9a00-1cc6ba15d1cb");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "9e31771f-a960-4f63-82c4-e3dfbdaff394", "AQAAAAEAACcQAAAAEFUBxCHGe6gS2qVvOEJWZ4Brn4rc2c5aWUK+/Rlc4hU3S6QTQrmb0MZHRFZnRMY79A==" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "9d8f4481-c92f-43b3-8073-96f25c355f24", "AQAAAAEAACcQAAAAELQzV4YUbF0C65dsVkXcJ11NwS2ZFjCbYZZ40Yu5vWJ09S+7CrzXX7sUbZjXV/yM1Q==" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedDate",
                table: "Attachment",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "29c8c531-82fe-421e-b02d-091979d500a1");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "0e5988a0-cec7-4c32-ab27-24073302bfdb");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "0ac45aeb-8a1c-4929-bf19-0b6936018c49", "AQAAAAEAACcQAAAAEIwMxigv+qsS+sGpPUpBOnN5tGhTOXi93StmY+2pmYuKSvXfChSCZWtstoc4QeYPaA==" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "29fc6b71-bcb5-4f2d-8b23-0b4609883d96", "AQAAAAEAACcQAAAAEKfbUAcP2xZb5k+j8h58iUFA3oxhUOLg/yYLsnNIvt6GTslswKYnOhWBsnOPSdatGQ==" });
        }
    }
}
