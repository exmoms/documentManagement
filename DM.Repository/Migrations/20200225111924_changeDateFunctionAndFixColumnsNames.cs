using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DM.Repository.Migrations
{
    public partial class changeDateFunctionAndFixColumnsNames : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AttachmentName",
                table: "CompoundModel");

            migrationBuilder.DropColumn(
                name: "IsRequiered",
                table: "CompoundModel");

            migrationBuilder.AlterColumn<DateTime>(
                name: "AddedDate",
                table: "MetaDataModel",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSDATETIME()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "AddedDate",
                table: "DocumentSet",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSDATETIME()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "AddedDate",
                table: "DocumentClass",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSDATETIME()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "AddedDate",
                table: "Document",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSDATETIME()");

            migrationBuilder.AddColumn<string>(
                name: "Caption",
                table: "CompoundModel",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsRequired",
                table: "CompoundModel",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<DateTime>(
                name: "AddedDate",
                table: "Attachment",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSDATETIME()");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "6386e1d9-3a44-4792-82cf-9eb4fdb66180", "AQAAAAEAACcQAAAAEOsFFtd3yDYmGNaiBi9O0hkFHJT3s4djW5z6EAUP44DTR/HfmtizYZPgiWbayIFtwA==" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "4a298c21-0fc4-456b-a78c-831b19537f6d", "AQAAAAEAACcQAAAAENd6T2TSLWdBjah/0v3DTe6Ga09c0eifwk0YLQ6GaL9SDGyleHxctRZPlJVisi8bLg==" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Caption",
                table: "CompoundModel");

            migrationBuilder.DropColumn(
                name: "IsRequired",
                table: "CompoundModel");

            migrationBuilder.AlterColumn<DateTime>(
                name: "AddedDate",
                table: "MetaDataModel",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSDATETIME()",
                oldClrType: typeof(DateTime),
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AlterColumn<DateTime>(
                name: "AddedDate",
                table: "DocumentSet",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSDATETIME()",
                oldClrType: typeof(DateTime),
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AlterColumn<DateTime>(
                name: "AddedDate",
                table: "DocumentClass",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSDATETIME()",
                oldClrType: typeof(DateTime),
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AlterColumn<DateTime>(
                name: "AddedDate",
                table: "Document",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSDATETIME()",
                oldClrType: typeof(DateTime),
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AddColumn<string>(
                name: "AttachmentName",
                table: "CompoundModel",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsRequiered",
                table: "CompoundModel",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<DateTime>(
                name: "AddedDate",
                table: "Attachment",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSDATETIME()",
                oldClrType: typeof(DateTime),
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "b4283f5e-bef0-4571-8532-107e7078603f", "AQAAAAEAACcQAAAAEEyQjP3f/jbM/CaB0or2Ql55nvji9ibXpfDWFKHQfI5Gb8Ya0KRWk6eKoowSziM/AQ==" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "609fa8ba-4b6a-457d-ad92-868a9142b868", "AQAAAAEAACcQAAAAEIVhKQBwqjWcpnjaCrCbCOqYc+sIhAmKs8/Nv+nSQrVfOyuwawplb/0Q/xTZh+yi4Q==" });
        }
    }
}
