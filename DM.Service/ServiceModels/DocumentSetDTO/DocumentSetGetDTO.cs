using DM.Domain.Models;
using DM.Service.ServiceModels.DocumentDTO;

using System;
using System.Collections.Generic;

namespace DM.Service.ServiceModels.DocumentSetDTO
{
    public class DocumentSetGetDTO
    {
        public int Id { get; private set; }
        public DateTime AddedDate { get; private set; }
        public DateTime ModifiedDate { get; private set; }
        public string Name { get; private set; }
        public string UserName { get; private set; }

        public List<DocumentGetDTO> AttachedDocuments { get; private set; }
        public List<DocumentSetGetDTO> ChildrenDocumentSets { get; private set; }
        public static DocumentSetGetDTO GetDTO(DocumentSet ds)
        {
            DocumentSetGetDTO dto = new DocumentSetGetDTO
            {
                Id = ds.ID,
                AddedDate = ds.AddedDate,
                ModifiedDate = ds.ModifiedDate,
                Name = ds.Name,
                UserName = ds.User?.UserName
            };

            if (ds.ChildDocumentsSets != null)
            {
                dto.ChildrenDocumentSets = new List<DocumentSetGetDTO>();
                foreach(var docSet in ds.ChildDocumentsSets)
                {
                    if(docSet.ChildDocumentSet != null)
                        dto.ChildrenDocumentSets.Add(DocumentSetGetDTO.GetDTO(docSet.ChildDocumentSet));
                }
            }

            if(ds.Set_Documents != null)
            {
                dto.AttachedDocuments = new List<DocumentGetDTO>();
                foreach (var doc in ds.Set_Documents)
                {
                    if (doc.Document != null)
                        dto.AttachedDocuments.Add(DocumentGetDTO.GetDTO(doc.Document));
                }
            }

            return dto;
        }
    }
}
