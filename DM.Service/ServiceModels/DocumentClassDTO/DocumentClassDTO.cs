using DM.Domain.Models;
using System;

namespace DM.Service.ServiceModels.DocumentClassDTO
{
    public class DocumentClassDTO
    {
        public int Id { get; set; }
        public string DocumentClassName { get; set; }
        public string UserName { get; set; }
        public DateTime AddedDate { get; set; }


        public static DocumentClassDTO GetDTO(DocumentClass dc)
        {
            DocumentClassDTO dto = new DocumentClassDTO
            {
                Id = dc.ID,
                DocumentClassName = dc.DocumentClassName,
                UserName = dc.User?.UserName,
                AddedDate = dc.AddedDate
            };

            return dto;
        }

        public DocumentClass GetEntity()
        {
            DocumentClass dc = new DocumentClass
            {
                DocumentClassName = DocumentClassName
            };

            return dc;
        }
    }
}
