using DM.Domain.Models;
using System;
using System.Collections.Generic;

namespace DM.Service.ServiceModels.DocumentDTO
{
    public class DocumentVersionGetDTO
    {
        public int Id { get; private set; }
        public string VersionMessage { get; private set; }
        public string UserName { get; private set; }
        public List<string> DocumenetScans { get; private set; }
        public DateTime AddedDate { get; private set; }
        public List<ValueDTO> Values { get; private set; }
        public List<AggregateDocumentDTO> ChildrenDocuments { get; private set; }

        public DocumentVersionGetDTO()
        {
            Values = new List<ValueDTO>();
            ChildrenDocuments = new List<AggregateDocumentDTO>();
            DocumenetScans = new List<string>();
        }

        public static DocumentVersionGetDTO GetDTO(DocumentVersion version)
        {
            DocumentVersionGetDTO dto = new DocumentVersionGetDTO
            {
                Id = version.ID,
                VersionMessage = version.VersionMessage,
                AddedDate = version.AddedDate,
                UserName = version.User?.UserName
            };

            if (version.StringValues != null)
                foreach (var v in version.StringValues)
                {
                    dto.Values.Add(ValueDTO.GetDTO(v));
                }
            if (version.DoubleValues != null)
                foreach (var v in version.DoubleValues)
                {
                    dto.Values.Add(ValueDTO.GetDTO(v));
                }
            if (version.DateValues != null)
                foreach (var v in version.DateValues)
                {
                    dto.Values.Add(ValueDTO.GetDTO(v));
                }
            if (version.BoolValues != null)
                foreach (var v in version.BoolValues)
                {
                    dto.Values.Add(ValueDTO.GetDTO(v));
                }
            if (version.IntValues != null)
                foreach (var v in version.IntValues)
                {
                    dto.Values.Add(ValueDTO.GetDTO(v));
                }
            if (version.DecimalValues != null)
                foreach (var v in version.DecimalValues)
                {
                    dto.Values.Add(ValueDTO.GetDTO(v));
                }

            if (version.ChildDocumentVersions != null)
                foreach (var c in version.ChildDocumentVersions)
                {
                    dto.ChildrenDocuments.Add(AggregateDocumentDTO.GetDTO(c));
                }

            if (version.DocumnetScans != null)
            {
                foreach (var item in version.DocumnetScans)
                {
                    string img = String.Format("/api/document/GetDocumentScan?imageId={0}", item.Id);
                    dto.DocumenetScans.Add(img);
                }
            }

            return dto;
        }

    }
}
