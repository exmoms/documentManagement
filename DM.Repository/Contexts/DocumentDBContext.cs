using DM.Domain.Constraints;
using DM.Domain.Enums;
using DM.Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DM.Repository.Contexts
{
    public class DocumentDBContext : IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
    {
        public DocumentDBContext(DbContextOptions options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            new AggregateDocumentConstraint(modelBuilder.Entity<AggregateDocument>());
            new AggregateMetaDataModelConstraint(modelBuilder.Entity<AggregateMetaDataModel>());
            new AttachmentConstraints(modelBuilder.Entity<Attachment>());
            new BoolValueConstraints(modelBuilder.Entity<BoolValue>());
            new CompoundModelConstraint(modelBuilder.Entity<CompoundModel>());
            new DataTypeConstraints(modelBuilder.Entity<DataType>());
            new DateValueConstraints(modelBuilder.Entity<DateValue>());
            new DecimalValueConstraints(modelBuilder.Entity<DecimalValue>());
            new DocumentClassConstraint(modelBuilder.Entity<DocumentClass>());
            new DocumentConstraints(modelBuilder.Entity<Document>());
            new DocumentSet_DocumentConstraints(modelBuilder.Entity<DocumentSet_Document>());
            new DocumentSetConstraints(modelBuilder.Entity<DocumentSet>());
            new DocumentVersionsConstraints(modelBuilder.Entity<DocumentVersion>());
            new DoubleValueConstraints(modelBuilder.Entity<DoubleValue>());
            new IntValueConstraints(modelBuilder.Entity<IntValue>());
            new MetaDataAttributeConstraint(modelBuilder.Entity<MetaDataAttribute>());
            new MetaDataModelConstraint(modelBuilder.Entity<MetaDataModel>());
            new RecursiveDocumentSetConstraints(modelBuilder.Entity<RecursiveDocumentSet>());
            new RecursiveDocumentSetConstraints(modelBuilder.Entity<RecursiveDocumentSet>());
            new StringValueConstraints(modelBuilder.Entity<StringValue>());
            new ApplicationUserConstraints(modelBuilder.Entity<ApplicationUser>());
            new DocumentScanConstaints(modelBuilder.Entity<DocumentScan>());

            modelBuilder.Entity<DataType>().HasData(new { ID = (int)DATA_TYPES.BOOL, DataTypeName = "bool" },
                                                    new { ID = (int)DATA_TYPES.DATE, DataTypeName = "date" },
                                                    new { ID = (int)DATA_TYPES.DECIMAL, DataTypeName = "decimal" },
                                                    new { ID = (int)DATA_TYPES.DOUBLE, DataTypeName = "double" },
                                                    new { ID = (int)DATA_TYPES.INTEGER, DataTypeName = "int" },
                                                    new { ID = (int)DATA_TYPES.STRING, DataTypeName = "string" });

            PasswordHasher<ApplicationUser> passwordHasher = new PasswordHasher<ApplicationUser>();
            ApplicationUser admin = new ApplicationUser
            {
                Id = 1,
                UserName = "super_admin",
                NormalizedUserName = "SUPER_ADMIN",
                Email = "superadmin@lit-co.net",
                NormalizedEmail = "SUPERADMIN@LIT-CO.NET",
                PasswordHash = passwordHasher.HashPassword(null, "SAdmin1234!"),
                SecurityStamp = string.Empty,
                Language = "en"
            };
            ApplicationUser superAdmin = new ApplicationUser
            {
                Id = 2,
                UserName = "admin",
                NormalizedUserName = "ADMIN",
                Email = "admin@lit-co.net",
                NormalizedEmail = "ADMIN@LIT-CO.NET",
                PasswordHash = passwordHasher.HashPassword(null, "Admin1234!"),
                SecurityStamp = string.Empty,
                Language = "en"
            };
            ApplicationUser user = new ApplicationUser
            {
                Id = 3,
                UserName = "user",
                NormalizedUserName = "USER",
                Email = "user@lit-co.net",
                NormalizedEmail = "USER@LIT-CO.NET",
                PasswordHash = passwordHasher.HashPassword(null, "User1234!"),
                SecurityStamp = string.Empty,
                Language = "en"
                
            };

            modelBuilder.Entity<ApplicationUser>().HasData(superAdmin, admin, user);

            modelBuilder.Entity<IdentityRole<int>>().HasData(new IdentityRole<int> { Id = 1, Name = "SuperAdmin", NormalizedName = "SUPERADMIN" }, 
                                                             new IdentityRole<int> { Id = 2, Name = "Admin", NormalizedName = "ADMIN" },
                                                             new IdentityRole<int> { Id = 3, Name = "User", NormalizedName = "USER" });

            modelBuilder.Entity<IdentityUserRole<int>>().HasData(new IdentityUserRole<int> { RoleId = 1, UserId = 1 }, 
                                                                 new IdentityUserRole<int> { RoleId = 2, UserId = 2 },
                                                                 new IdentityUserRole<int> { RoleId = 3, UserId = 3 });
        }

        public DbSet<AggregateDocument> AggregateDocument { get; set; }
        public DbSet<AggregateMetaDataModel> AggregateMetaDataModel { get; set; }
        public DbSet<Attachment> Attachment { get; set; }
        public DbSet<BoolValue> BoolValue { get; set; }
        public DbSet<CompoundModel> CompoundModel { get; set; }
        public DbSet<DataType> DataType { get; set; }
        public DbSet<DateValue> DateValue { get; set; }
        public DbSet<DecimalValue> DecimalValue { get; set; }
        public DbSet<Document> Document { get; set; }
        public DbSet<DocumentClass> DocumentClass { get; set; }
        public DbSet<DocumentSet> DocumentSet { get; set; }
        public DbSet<DocumentScan> DocumentScan { get; set; }
        public DbSet<DocumentSet_Document> DocumentSet_Document { get; set; }
        public DbSet<DocumentVersion> DocumentVersion { get; set; }
        public DbSet<DoubleValue> DoubleValue { get; set; }
        public DbSet<IntValue> IntValue { get; set; }
        public DbSet<MetaDataAttribute> MetaDataAttribute { get; set; }
        public DbSet<MetaDataModel> MetaDataModel { get; set; }
        public DbSet<RecursiveDocumentSet> RecursiveDocumentSet { get; set; }
        public DbSet<StringValue> StringValue { get; set; }
    }
}
