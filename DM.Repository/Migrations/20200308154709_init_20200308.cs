using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DM.Repository.Migrations
{
    public partial class init_20200308 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<string>(nullable: true),
                    SecurityStamp = table.Column<string>(nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DataType",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DataTypeName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DataType", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<int>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false),
                    RoleId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DocumentClass",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DocumentClassName = table.Column<string>(nullable: false),
                    UserId = table.Column<int>(nullable: false),
                    AddedDate = table.Column<DateTime>(nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    ModifiedDate = table.Column<DateTime>(nullable: false),
                    DeletedDate = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentClass", x => x.ID);
                    table.ForeignKey(
                        name: "FK_DocumentClass_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DocumentSet",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: false),
                    UserId = table.Column<int>(nullable: false),
                    AddedDate = table.Column<DateTime>(nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    ModifiedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentSet", x => x.ID);
                    table.ForeignKey(
                        name: "FK_DocumentSet_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "MetaDataModel",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MetaDataModelName = table.Column<string>(nullable: false),
                    DocumentClassId = table.Column<int>(nullable: false),
                    UserId = table.Column<int>(nullable: false),
                    AddedDate = table.Column<DateTime>(nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    ModifiedDate = table.Column<DateTime>(nullable: false),
                    DeletedDate = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MetaDataModel", x => x.ID);
                    table.ForeignKey(
                        name: "FK_MetaDataModel_DocumentClass_DocumentClassId",
                        column: x => x.DocumentClassId,
                        principalTable: "DocumentClass",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MetaDataModel_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "RecursiveDocumentSet",
                columns: table => new
                {
                    ParentDocumentSetId = table.Column<int>(nullable: false),
                    ChildDocumentSetId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecursiveDocumentSet", x => new { x.ParentDocumentSetId, x.ChildDocumentSetId });
                    table.ForeignKey(
                        name: "FK_RecursiveDocumentSet_DocumentSet_ChildDocumentSetId",
                        column: x => x.ChildDocumentSetId,
                        principalTable: "DocumentSet",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_RecursiveDocumentSet_DocumentSet_ParentDocumentSetId",
                        column: x => x.ParentDocumentSetId,
                        principalTable: "DocumentSet",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AggregateMetaDataModel",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ParentMetadataModelId = table.Column<int>(nullable: false),
                    ChildMetadataModelId = table.Column<int>(nullable: false),
                    AggregateName = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AggregateMetaDataModel", x => x.ID);
                    table.ForeignKey(
                        name: "FK_AggregateMetaDataModel_MetaDataModel_ChildMetadataModelId",
                        column: x => x.ChildMetadataModelId,
                        principalTable: "MetaDataModel",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_AggregateMetaDataModel_MetaDataModel_ParentMetadataModelId",
                        column: x => x.ParentMetadataModelId,
                        principalTable: "MetaDataModel",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CompoundModel",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MetaDataModelID = table.Column<int>(nullable: false),
                    IsRequired = table.Column<bool>(nullable: false),
                    Caption = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompoundModel", x => x.ID);
                    table.ForeignKey(
                        name: "FK_CompoundModel_MetaDataModel_MetaDataModelID",
                        column: x => x.MetaDataModelID,
                        principalTable: "MetaDataModel",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MetaDataAttribute",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MetaDataAttributeName = table.Column<string>(nullable: false),
                    IsRequired = table.Column<bool>(nullable: false),
                    DataTypeID = table.Column<int>(nullable: false),
                    MetaDataModelID = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MetaDataAttribute", x => x.ID);
                    table.ForeignKey(
                        name: "FK_MetaDataAttribute_DataType_DataTypeID",
                        column: x => x.DataTypeID,
                        principalTable: "DataType",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MetaDataAttribute_MetaDataModel_MetaDataModelID",
                        column: x => x.MetaDataModelID,
                        principalTable: "MetaDataModel",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AggregateDocument",
                columns: table => new
                {
                    MinParentDocumentVersionId = table.Column<int>(nullable: false),
                    ChildDocumentVersionId = table.Column<int>(nullable: false),
                    MaxParentDocumentVersionId = table.Column<int>(nullable: true),
                    AggregateMetaDataModelID = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AggregateDocument", x => new { x.MinParentDocumentVersionId, x.ChildDocumentVersionId });
                    table.ForeignKey(
                        name: "FK_AggregateDocument_AggregateMetaDataModel_AggregateMetaDataModelID",
                        column: x => x.AggregateMetaDataModelID,
                        principalTable: "AggregateMetaDataModel",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "DocumentVersion",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VersionMessage = table.Column<string>(nullable: false),
                    Author = table.Column<string>(nullable: true),
                    DocumentId = table.Column<int>(nullable: false),
                    UserId = table.Column<int>(nullable: false),
                    AddedDate = table.Column<DateTime>(nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    DeletedDate = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentVersion", x => x.ID);
                    table.ForeignKey(
                        name: "FK_DocumentVersion_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "BoolValue",
                columns: table => new
                {
                    MetaDataAttributeId = table.Column<int>(nullable: false),
                    MinDocumentVersionId = table.Column<int>(nullable: false),
                    MaxDocumentVersionId = table.Column<int>(nullable: true),
                    Value = table.Column<bool>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BoolValue", x => new { x.MinDocumentVersionId, x.MetaDataAttributeId });
                    table.ForeignKey(
                        name: "FK_BoolValue_MetaDataAttribute_MetaDataAttributeId",
                        column: x => x.MetaDataAttributeId,
                        principalTable: "MetaDataAttribute",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_BoolValue_DocumentVersion_MinDocumentVersionId",
                        column: x => x.MinDocumentVersionId,
                        principalTable: "DocumentVersion",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DateValue",
                columns: table => new
                {
                    MetaDataAttributeId = table.Column<int>(nullable: false),
                    MinDocumentVersionId = table.Column<int>(nullable: false),
                    MaxDocumentVersionId = table.Column<int>(nullable: true),
                    Value = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DateValue", x => new { x.MinDocumentVersionId, x.MetaDataAttributeId });
                    table.ForeignKey(
                        name: "FK_DateValue_MetaDataAttribute_MetaDataAttributeId",
                        column: x => x.MetaDataAttributeId,
                        principalTable: "MetaDataAttribute",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_DateValue_DocumentVersion_MinDocumentVersionId",
                        column: x => x.MinDocumentVersionId,
                        principalTable: "DocumentVersion",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DecimalValue",
                columns: table => new
                {
                    MetaDataAttributeId = table.Column<int>(nullable: false),
                    MinDocumentVersionId = table.Column<int>(nullable: false),
                    MaxDocumentVersionId = table.Column<int>(nullable: true),
                    Value = table.Column<decimal>(type: "decimal(18,5)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DecimalValue", x => new { x.MinDocumentVersionId, x.MetaDataAttributeId });
                    table.ForeignKey(
                        name: "FK_DecimalValue_MetaDataAttribute_MetaDataAttributeId",
                        column: x => x.MetaDataAttributeId,
                        principalTable: "MetaDataAttribute",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_DecimalValue_DocumentVersion_MinDocumentVersionId",
                        column: x => x.MinDocumentVersionId,
                        principalTable: "DocumentVersion",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Document",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: false),
                    MetaDataModelId = table.Column<int>(nullable: false),
                    LatestVersionId = table.Column<int>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    ModifiedDate = table.Column<DateTime>(nullable: false),
                    DeletedDate = table.Column<DateTime>(nullable: true),
                    IsArchived = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Document", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Document_DocumentVersion_LatestVersionId",
                        column: x => x.LatestVersionId,
                        principalTable: "DocumentVersion",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Document_MetaDataModel_MetaDataModelId",
                        column: x => x.MetaDataModelId,
                        principalTable: "MetaDataModel",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DocumentScan",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DocumnetScan = table.Column<byte[]>(nullable: true),
                    DocumentVersionId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentScan", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DocumentScan_DocumentVersion_DocumentVersionId",
                        column: x => x.DocumentVersionId,
                        principalTable: "DocumentVersion",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DoubleValue",
                columns: table => new
                {
                    MetaDataAttributeId = table.Column<int>(nullable: false),
                    MinDocumentVersionId = table.Column<int>(nullable: false),
                    MaxDocumentVersionId = table.Column<int>(nullable: true),
                    Value = table.Column<double>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoubleValue", x => new { x.MinDocumentVersionId, x.MetaDataAttributeId });
                    table.ForeignKey(
                        name: "FK_DoubleValue_MetaDataAttribute_MetaDataAttributeId",
                        column: x => x.MetaDataAttributeId,
                        principalTable: "MetaDataAttribute",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_DoubleValue_DocumentVersion_MinDocumentVersionId",
                        column: x => x.MinDocumentVersionId,
                        principalTable: "DocumentVersion",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "IntValue",
                columns: table => new
                {
                    MetaDataAttributeId = table.Column<int>(nullable: false),
                    MinDocumentVersionId = table.Column<int>(nullable: false),
                    MaxDocumentVersionId = table.Column<int>(nullable: true),
                    Value = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IntValue", x => new { x.MinDocumentVersionId, x.MetaDataAttributeId });
                    table.ForeignKey(
                        name: "FK_IntValue_MetaDataAttribute_MetaDataAttributeId",
                        column: x => x.MetaDataAttributeId,
                        principalTable: "MetaDataAttribute",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_IntValue_DocumentVersion_MinDocumentVersionId",
                        column: x => x.MinDocumentVersionId,
                        principalTable: "DocumentVersion",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StringValue",
                columns: table => new
                {
                    MetaDataAttributeId = table.Column<int>(nullable: false),
                    MinDocumentVersionId = table.Column<int>(nullable: false),
                    MaxDocumentVersionId = table.Column<int>(nullable: true),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StringValue", x => new { x.MinDocumentVersionId, x.MetaDataAttributeId });
                    table.ForeignKey(
                        name: "FK_StringValue_MetaDataAttribute_MetaDataAttributeId",
                        column: x => x.MetaDataAttributeId,
                        principalTable: "MetaDataAttribute",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_StringValue_DocumentVersion_MinDocumentVersionId",
                        column: x => x.MinDocumentVersionId,
                        principalTable: "DocumentVersion",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Attachment",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: false),
                    AttachmentImg = table.Column<byte[]>(nullable: true),
                    DocumentId = table.Column<int>(nullable: false),
                    CompoundModelID = table.Column<int>(nullable: true),
                    AddedDate = table.Column<DateTime>(nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    ModifiedDate = table.Column<DateTime>(nullable: false),
                    DeletedDate = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attachment", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Attachment_CompoundModel_CompoundModelID",
                        column: x => x.CompoundModelID,
                        principalTable: "CompoundModel",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Attachment_Document_DocumentId",
                        column: x => x.DocumentId,
                        principalTable: "Document",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DocumentSet_Document",
                columns: table => new
                {
                    DocumentSetId = table.Column<int>(nullable: false),
                    DocumentId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentSet_Document", x => new { x.DocumentSetId, x.DocumentId });
                    table.ForeignKey(
                        name: "FK_DocumentSet_Document_Document_DocumentId",
                        column: x => x.DocumentId,
                        principalTable: "Document",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DocumentSet_Document_DocumentSet_DocumentSetId",
                        column: x => x.DocumentSetId,
                        principalTable: "DocumentSet",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { 1, "2a8df0bb-a449-4bb8-920c-9380588e55bd", "Admin", "ADMIN" },
                    { 2, "126a91e8-11f4-46b5-aadc-91ada811d1db", "User", "USER" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[,]
                {
                    { 1, 0, "baec31b7-ba4f-4de6-97a3-220f772d235f", "admin@lit-co.net", false, false, null, "ADMIN@LIT-CO.NET", "ADMIN", "AQAAAAEAACcQAAAAEKsrT9TWy/b8VDTc9O4/+lewPxJYBAcK2OtgyYi9caRPUSkuL+z9z1QKJWVflBAPAQ==", null, false, "", false, "admin" },
                    { 2, 0, "2ec3457c-a4cc-4c2a-9093-a3f5f3f1297b", "user@lit-co.net", false, false, null, "USER@LIT-CO.NET", "USER", "AQAAAAEAACcQAAAAEN52S7zdeJBkk6XNfpUySSJLs8pL5VBzZzKuPc2FzcGjBGXZXw6JCCAbSNviSd6sdg==", null, false, "", false, "user" }
                });

            migrationBuilder.InsertData(
                table: "DataType",
                columns: new[] { "ID", "DataTypeName" },
                values: new object[,]
                {
                    { 1, "bool" },
                    { 2, "date" },
                    { 3, "decimal" },
                    { 4, "double" },
                    { 5, "int" },
                    { 6, "string" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AggregateDocument_AggregateMetaDataModelID",
                table: "AggregateDocument",
                column: "AggregateMetaDataModelID");

            migrationBuilder.CreateIndex(
                name: "IX_AggregateDocument_ChildDocumentVersionId",
                table: "AggregateDocument",
                column: "ChildDocumentVersionId");

            migrationBuilder.CreateIndex(
                name: "IX_AggregateMetaDataModel_ChildMetadataModelId",
                table: "AggregateMetaDataModel",
                column: "ChildMetadataModelId");

            migrationBuilder.CreateIndex(
                name: "IX_AggregateMetaDataModel_ParentMetadataModelId_ChildMetadataModelId_AggregateName",
                table: "AggregateMetaDataModel",
                columns: new[] { "ParentMetadataModelId", "ChildMetadataModelId", "AggregateName" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Attachment_CompoundModelID",
                table: "Attachment",
                column: "CompoundModelID");

            migrationBuilder.CreateIndex(
                name: "IX_Attachment_DocumentId",
                table: "Attachment",
                column: "DocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_BoolValue_MetaDataAttributeId",
                table: "BoolValue",
                column: "MetaDataAttributeId");

            migrationBuilder.CreateIndex(
                name: "IX_CompoundModel_MetaDataModelID",
                table: "CompoundModel",
                column: "MetaDataModelID");

            migrationBuilder.CreateIndex(
                name: "IX_DataType_DataTypeName",
                table: "DataType",
                column: "DataTypeName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DateValue_MetaDataAttributeId",
                table: "DateValue",
                column: "MetaDataAttributeId");

            migrationBuilder.CreateIndex(
                name: "IX_DecimalValue_MetaDataAttributeId",
                table: "DecimalValue",
                column: "MetaDataAttributeId");

            migrationBuilder.CreateIndex(
                name: "IX_Document_LatestVersionId",
                table: "Document",
                column: "LatestVersionId",
                unique: true,
                filter: "[LatestVersionId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Document_MetaDataModelId",
                table: "Document",
                column: "MetaDataModelId");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentClass_DocumentClassName",
                table: "DocumentClass",
                column: "DocumentClassName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DocumentClass_UserId",
                table: "DocumentClass",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentScan_DocumentVersionId",
                table: "DocumentScan",
                column: "DocumentVersionId");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentSet_UserId",
                table: "DocumentSet",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentSet_Document_DocumentId",
                table: "DocumentSet_Document",
                column: "DocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentVersion_DocumentId",
                table: "DocumentVersion",
                column: "DocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentVersion_UserId",
                table: "DocumentVersion",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_DoubleValue_MetaDataAttributeId",
                table: "DoubleValue",
                column: "MetaDataAttributeId");

            migrationBuilder.CreateIndex(
                name: "IX_IntValue_MetaDataAttributeId",
                table: "IntValue",
                column: "MetaDataAttributeId");

            migrationBuilder.CreateIndex(
                name: "IX_MetaDataAttribute_DataTypeID",
                table: "MetaDataAttribute",
                column: "DataTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_MetaDataAttribute_MetaDataModelID",
                table: "MetaDataAttribute",
                column: "MetaDataModelID");

            migrationBuilder.CreateIndex(
                name: "IX_MetaDataModel_DocumentClassId",
                table: "MetaDataModel",
                column: "DocumentClassId");

            migrationBuilder.CreateIndex(
                name: "IX_MetaDataModel_MetaDataModelName",
                table: "MetaDataModel",
                column: "MetaDataModelName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MetaDataModel_UserId",
                table: "MetaDataModel",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_RecursiveDocumentSet_ChildDocumentSetId",
                table: "RecursiveDocumentSet",
                column: "ChildDocumentSetId");

            migrationBuilder.CreateIndex(
                name: "IX_StringValue_MetaDataAttributeId",
                table: "StringValue",
                column: "MetaDataAttributeId");

            migrationBuilder.AddForeignKey(
                name: "FK_AggregateDocument_DocumentVersion_ChildDocumentVersionId",
                table: "AggregateDocument",
                column: "ChildDocumentVersionId",
                principalTable: "DocumentVersion",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_AggregateDocument_DocumentVersion_MinParentDocumentVersionId",
                table: "AggregateDocument",
                column: "MinParentDocumentVersionId",
                principalTable: "DocumentVersion",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DocumentVersion_Document_DocumentId",
                table: "DocumentVersion",
                column: "DocumentId",
                principalTable: "Document",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Document_DocumentVersion_LatestVersionId",
                table: "Document");

            migrationBuilder.DropTable(
                name: "AggregateDocument");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "Attachment");

            migrationBuilder.DropTable(
                name: "BoolValue");

            migrationBuilder.DropTable(
                name: "DateValue");

            migrationBuilder.DropTable(
                name: "DecimalValue");

            migrationBuilder.DropTable(
                name: "DocumentScan");

            migrationBuilder.DropTable(
                name: "DocumentSet_Document");

            migrationBuilder.DropTable(
                name: "DoubleValue");

            migrationBuilder.DropTable(
                name: "IntValue");

            migrationBuilder.DropTable(
                name: "RecursiveDocumentSet");

            migrationBuilder.DropTable(
                name: "StringValue");

            migrationBuilder.DropTable(
                name: "AggregateMetaDataModel");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "CompoundModel");

            migrationBuilder.DropTable(
                name: "DocumentSet");

            migrationBuilder.DropTable(
                name: "MetaDataAttribute");

            migrationBuilder.DropTable(
                name: "DataType");

            migrationBuilder.DropTable(
                name: "DocumentVersion");

            migrationBuilder.DropTable(
                name: "Document");

            migrationBuilder.DropTable(
                name: "MetaDataModel");

            migrationBuilder.DropTable(
                name: "DocumentClass");

            migrationBuilder.DropTable(
                name: "AspNetUsers");
        }
    }
}
