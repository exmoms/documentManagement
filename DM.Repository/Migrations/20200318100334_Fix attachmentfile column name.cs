using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DM.Repository.Migrations
{
    public partial class Fixattachmentfilecolumnname : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AttachmentImg",
                table: "Attachment");

            migrationBuilder.AddColumn<byte[]>(
                name: "AttachmentFile",
                table: "Attachment",
                nullable: true);

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
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AttachmentFile",
                table: "Attachment");

            migrationBuilder.AddColumn<byte[]>(
                name: "AttachmentImg",
                table: "Attachment",
                type: "varbinary(max)",
                nullable: true);

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
    }
}
