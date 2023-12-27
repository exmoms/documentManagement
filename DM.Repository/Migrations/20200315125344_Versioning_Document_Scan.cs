using Microsoft.EntityFrameworkCore.Migrations;

namespace DM.Repository.Migrations
{
    public partial class Versioning_Document_Scan : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DocumentScan_DocumentVersion_DocumentVersionId",
                table: "DocumentScan");

            migrationBuilder.DropIndex(
                name: "IX_DocumentScan_DocumentVersionId",
                table: "DocumentScan");

            migrationBuilder.DropColumn(
                name: "DocumentVersionId",
                table: "DocumentScan");

            migrationBuilder.AddColumn<int>(
                name: "MaxDocumentVersionId",
                table: "DocumentScan",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinDocumentVersionId",
                table: "DocumentScan",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<bool>(
                name: "IsArchived",
                table: "Document",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<string>(
                name: "ContentType",
                table: "Attachment",
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

            migrationBuilder.CreateIndex(
                name: "IX_DocumentScan_MinDocumentVersionId",
                table: "DocumentScan",
                column: "MinDocumentVersionId");

            migrationBuilder.AddForeignKey(
                name: "FK_DocumentScan_DocumentVersion_MinDocumentVersionId",
                table: "DocumentScan",
                column: "MinDocumentVersionId",
                principalTable: "DocumentVersion",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DocumentScan_DocumentVersion_MinDocumentVersionId",
                table: "DocumentScan");

            migrationBuilder.DropIndex(
                name: "IX_DocumentScan_MinDocumentVersionId",
                table: "DocumentScan");

            migrationBuilder.DropColumn(
                name: "MaxDocumentVersionId",
                table: "DocumentScan");

            migrationBuilder.DropColumn(
                name: "MinDocumentVersionId",
                table: "DocumentScan");

            migrationBuilder.DropColumn(
                name: "ContentType",
                table: "Attachment");

            migrationBuilder.AddColumn<int>(
                name: "DocumentVersionId",
                table: "DocumentScan",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<bool>(
                name: "IsArchived",
                table: "Document",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldDefaultValue: false);

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "ConcurrencyStamp",
                value: "2a8df0bb-a449-4bb8-920c-9380588e55bd");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: 2,
                column: "ConcurrencyStamp",
                value: "126a91e8-11f4-46b5-aadc-91ada811d1db");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "baec31b7-ba4f-4de6-97a3-220f772d235f", "AQAAAAEAACcQAAAAEKsrT9TWy/b8VDTc9O4/+lewPxJYBAcK2OtgyYi9caRPUSkuL+z9z1QKJWVflBAPAQ==" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "2ec3457c-a4cc-4c2a-9093-a3f5f3f1297b", "AQAAAAEAACcQAAAAEN52S7zdeJBkk6XNfpUySSJLs8pL5VBzZzKuPc2FzcGjBGXZXw6JCCAbSNviSd6sdg==" });

            migrationBuilder.CreateIndex(
                name: "IX_DocumentScan_DocumentVersionId",
                table: "DocumentScan",
                column: "DocumentVersionId");

            migrationBuilder.AddForeignKey(
                name: "FK_DocumentScan_DocumentVersion_DocumentVersionId",
                table: "DocumentScan",
                column: "DocumentVersionId",
                principalTable: "DocumentVersion",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
