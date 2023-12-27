
using DM.Domain;
using DM.Repository.Contexts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using Xunit;

namespace DM.UnitTest.RepositoryUT
{
#if false
    public class RepositoryTestClass
    {
        [Fact]
        public void TestExistsFunction()
        {
            // Arrange
            var optionsBuilder = new DbContextOptionsBuilder<DocumentDBContext>();
            optionsBuilder.UseInMemoryDatabase(databaseName: "TestExistsFunction");
            var option = optionsBuilder.Options;
            var dbContext = new DocumentDBContext(option);

            dbContext.Add(new DocumentClass { DocumentClassName = "classA" });
            int wr = dbContext.SaveChanges();
            Assert.Equal(1, wr);

            var repo = new Repository<DocumentClass>(dbContext);

            //Act
            bool result1 = repo.Exists(x => x.DocumentClassName == "classA");
            bool result2 = repo.Exists(x => x.DocumentClassName == "classB");

            //Assert
            Assert.True(result1);
            Assert.False(result2);
        }

        [Fact]
        public void TestGetFunction()
        {
            // Arrange
            var optionsBuilder = new DbContextOptionsBuilder<DocumentDBContext>();
            optionsBuilder.UseInMemoryDatabase(databaseName: "TestGetFunction");
            var option = optionsBuilder.Options;
            var dbContext = new DocumentDBContext(option);

            DateTime date = DateTime.Now;
            dbContext.Add(new DocumentClass { DocumentClassName = "classA", AddedDate = date });
            int wr = dbContext.SaveChanges();
            Assert.Equal(1, wr);

            var repo = new Repository<DocumentClass>(dbContext);

            //Act
            var result1 = repo.Get(x => x.DocumentClassName == "classA");

            //Assert
            Assert.Equal(1, result1.ID);
            Assert.Equal("classA", result1.DocumentClassName);
            Assert.Equal(date, result1.AddedDate);
            Assert.Null(result1.DeletedDate);
            Assert.Equal(default(DateTime), result1.ModifiedDate);

            // ToDo: test two cases -> no element and more than one element.
        }

        [Fact]
        public void TestGetAllFunction()
        {
            // Arrange
            var optionsBuilder = new DbContextOptionsBuilder<DocumentDBContext>();
            optionsBuilder.UseInMemoryDatabase(databaseName: "TestGetAllFunction");
            var option = optionsBuilder.Options;
            var dbContext = new DocumentDBContext(option);

            DateTime date = DateTime.Now;
            dbContext.Add(new DocumentClass { DocumentClassName = "classA", AddedDate = date });
            dbContext.Add(new DocumentClass { DocumentClassName = "classB", AddedDate = date });
            dbContext.Add(new DocumentClass { DocumentClassName = "classC", AddedDate = date });
            int wr = dbContext.SaveChanges();
            Assert.Equal(3, wr);

            var repo = new Repository<DocumentClass>(dbContext);

            //Act
            var result1 = repo.GetAll(x => x.AddedDate == date); // retrieve many elements
            var result2 = repo.GetAll(); // retrieve all elements
            var result3 = repo.GetAll(x => x.DocumentClassName == "classA"); // retrieve one element
            var result4 = repo.GetAll(x => x.DocumentClassName == "classD"); // retrieve no elements

            //Assert

            //check result1
            Assert.Equal(3, result1.Count());

            var enity1 = result1.Where(x => x.DocumentClassName == "classA").ToList().ElementAt(0);
            Assert.Equal(1, enity1.ID);
            Assert.Equal("classA", enity1.DocumentClassName);
            Assert.Equal(date, enity1.AddedDate);
            Assert.Null(enity1.DeletedDate);
            Assert.Equal(default(DateTime), enity1.ModifiedDate);

            var enity2 = result1.Where(x => x.DocumentClassName == "classB").ToList().ElementAt(0);
            Assert.Equal(2, enity2.ID);
            Assert.Equal("classB", enity2.DocumentClassName);
            Assert.Equal(date, enity2.AddedDate);
            Assert.Null(enity1.DeletedDate);
            Assert.Equal(default(DateTime), enity2.ModifiedDate);

            var enity3 = result1.Where(x => x.DocumentClassName == "classC").ToList().ElementAt(0);
            Assert.Equal(3, enity3.ID);
            Assert.Equal("classC", enity3.DocumentClassName);
            Assert.Equal(date, enity3.AddedDate);
            Assert.Null(enity3.DeletedDate);
            Assert.Equal(default(DateTime), enity3.ModifiedDate);

            //check result2
            Assert.Equal(3, result2.Count());

            enity1 = result2.ToList().ElementAt(0);
            Assert.Equal(1, enity1.ID);
            Assert.Equal("classA", enity1.DocumentClassName);
            Assert.Equal(date, enity1.AddedDate);
            Assert.Null(enity1.DeletedDate);
            Assert.Equal(default(DateTime), enity1.ModifiedDate);

            enity2 = result2.ToList().ElementAt(1);
            Assert.Equal(2, enity2.ID);
            Assert.Equal("classB", enity2.DocumentClassName);
            Assert.Equal(date, enity2.AddedDate);
            Assert.Null(enity1.DeletedDate);
            Assert.Equal(default(DateTime), enity2.ModifiedDate);

            enity3 = result2.ToList().ElementAt(2);
            Assert.Equal(3, enity3.ID);
            Assert.Equal("classC", enity3.DocumentClassName);
            Assert.Equal(date, enity3.AddedDate);
            Assert.Null(enity3.DeletedDate);
            Assert.Equal(default(DateTime), enity3.ModifiedDate);

            //check result3
            Assert.Equal(1, result3.Count());

            var enity = result2.ToList().ElementAt(0);
            Assert.Equal(1, enity.ID);
            Assert.Equal("classA", enity.DocumentClassName);
            Assert.Equal(date, enity.AddedDate);
            Assert.Null(enity.DeletedDate);
            Assert.Equal(default(DateTime), enity.ModifiedDate);

            //check result4
            Assert.Equal(0, result4.Count());
        }

        [Fact]
        public void TestInsertFunction()
        {
            // Arrange
            var optionsBuilder = new DbContextOptionsBuilder<DocumentDBContext>();
            optionsBuilder.UseInMemoryDatabase(databaseName: "TestInsertFunction");
            var option = optionsBuilder.Options;
            var dbContext = new DocumentDBContext(option);

            var repo = new Repository<DocumentClass>(dbContext);
            Assert.Equal(0, repo.GetAll().Count());

            DateTime date = DateTime.Now;

            //Act
            repo.Insert(new DocumentClass { DocumentClassName = "classA", AddedDate = date });
            repo.SaveChanges();

            //Assert
            Assert.True(repo.Exists(x => x.DocumentClassName == "classA"));
            Assert.Equal(1, repo.GetAll().Count());

            // ToDo: test case -> can't insert.
        }

        [Fact]
        public void TestUpdateFunction()
        {
            // Arrange
            var optionsBuilder = new DbContextOptionsBuilder<DocumentDBContext>();
            optionsBuilder.UseInMemoryDatabase(databaseName: "TestUpdateFunction");
            var option = optionsBuilder.Options;
            var dbContext = new DocumentDBContext(option);
            
            dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA" });
            int wr = dbContext.SaveChanges();
            Assert.Equal(1, wr);

            var repo = new Repository<DocumentClass>(dbContext);

            //Act
            var entity = repo.Get(b => b.ID == 1);
            entity.DocumentClassName = "classB";
            repo.Update(entity);
            repo.SaveChanges();

            //Assert
            Assert.False(repo.Exists(x => x.DocumentClassName == "classA"));
            Assert.True(repo.Exists(x => x.DocumentClassName == "classB"));

            Assert.Equal("classB", repo.Get(x => x.ID == 1).DocumentClassName);
        }

        [Fact]
        public void TestDeleteFunction()
        {
            // Arrange
            var optionsBuilder = new DbContextOptionsBuilder<DocumentDBContext>();
            optionsBuilder.UseInMemoryDatabase(databaseName: "TestDeleteFunction");
            var option = optionsBuilder.Options;
            var dbContext = new DocumentDBContext(option);

            dbContext.Add(new DocumentClass { ID = 1, DocumentClassName = "classA" });
            int wr = dbContext.SaveChanges();
            Assert.Equal(1, wr);

            var repo = new Repository<DocumentClass>(dbContext);

            //Act
            var entity = repo.Get(b => b.ID == 1);
            repo.Delete(entity);
            repo.SaveChanges();

            //Assert
            Assert.False(repo.Exists(x => x.DocumentClassName == "classA"));
        }

        [Fact]
        public void TestRemoveAllFunction()
        {
            // Arrange
            var optionsBuilder = new DbContextOptionsBuilder<DocumentDBContext>();
            optionsBuilder.UseInMemoryDatabase(databaseName: "TestRemoveAllFunction");
            var option = optionsBuilder.Options;
            var dbContext = new DocumentDBContext(option);

            DateTime date = DateTime.Now;
            dbContext.Add(new DocumentClass { DocumentClassName = "classA", AddedDate= date });
            dbContext.Add(new DocumentClass { DocumentClassName = "classB", AddedDate = date });
            dbContext.Add(new DocumentClass { DocumentClassName = "classC", AddedDate = date });
            DateTime otherDate = DateTime.Now;
            dbContext.Add(new DocumentClass { DocumentClassName = "classD", AddedDate = otherDate });
            int wr = dbContext.SaveChanges();
            Assert.Equal(4, wr);

            var repo = new Repository<DocumentClass>(dbContext);

            //Act
            repo.RemoveAll(b => b.AddedDate == date);
            repo.SaveChanges();

            //Assert
            Assert.False(repo.Exists(x => x.AddedDate == date));
            Assert.True(repo.Exists(x => x.AddedDate == otherDate));
        }


    }
#endif
}
