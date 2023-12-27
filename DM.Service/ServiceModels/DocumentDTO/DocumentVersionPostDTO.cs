using DM.Domain.Enums;
using DM.Domain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;

namespace DM.Service.ServiceModels.DocumentDTO
{
    [ModelBinder(BinderType = typeof(FormDataJsonModelBinder))]
    public class DocumentVersionPostDTO
    {
        public int DocumentId { get; set; }
        public string VersionMessage { get; set; }
        public List<ValueDTO> Values { get; set; }
        public List<AggregateDocumentDTO> ChildrenDocuments { get; set; }
        public List<DocumentScanDTO> DocumentScans { get; set; }

        public void AddScans(IFormFileCollection files)
        {
            if (files != null)
            {
                DocumentScans = new List<DocumentScanDTO>();
                foreach (var file in files)
                {
                    if (file.Length > 0)
                    {
                        using (var ms = new MemoryStream())
                        {
                            file.CopyTo(ms);
                            DocumentScanDTO scan = new DocumentScanDTO();
                            scan.Name = file.FileName;
                            scan.ContentType = file.ContentType;
                            scan.ScanImage = ms.ToArray();
                            DocumentScans.Add(scan);
                        }
                    }
                }
            }
        }

        public DocumentVersion GetEntity()
        {
            DocumentVersion version = new DocumentVersion
            {
                StringValues = new List<StringValue>(),
                IntValues = new List<IntValue>(),
                DateValues = new List<DateValue>(),
                DoubleValues = new List<DoubleValue>(),
                DecimalValues = new List<DecimalValue>(),
                BoolValues = new List<BoolValue>(),
                ChildDocumentVersions = new List<AggregateDocument>(),

                DocumentId = DocumentId,
                VersionMessage = VersionMessage
            };

            if (Values != null)
            {
                foreach (var v in Values)
                {
                    switch (v.TypeId)
                    {
                        case (int)DATA_TYPES.BOOL:
                            version.BoolValues.Add(v.GetBool());
                            break;
                        case (int)DATA_TYPES.DATE:
                            version.DateValues.Add(v.GetDate());
                            break;
                        case (int)DATA_TYPES.DECIMAL:
                            version.DecimalValues.Add(v.GetDecimal());
                            break;
                        case (int)DATA_TYPES.DOUBLE:
                            version.DoubleValues.Add(v.GetDouble());
                            break;
                        case (int)DATA_TYPES.INTEGER:
                            version.IntValues.Add(v.GetInt());
                            break;
                        case (int)DATA_TYPES.STRING:
                            version.StringValues.Add(v.GetString());
                            break;
                    }
                }
            }

            if (ChildrenDocuments != null)
            {
                foreach (var agg in ChildrenDocuments)
                {
                    AggregateDocument agg_doc = agg.GetEntity();
                    version.ChildDocumentVersions.Add(agg_doc);
                }
            }

            if(DocumentScans != null)
            {
                version.DocumnetScans = new List<DocumentScan>();
                foreach (var scan in DocumentScans)
                {
                    DocumentScan s = new DocumentScan
                    {
                        DocumnetScan = scan.ScanImage,
                        ContentType = scan.ContentType,
                        Name = scan.Name
                    };
                    version.DocumnetScans.Add(s);
                }
            }

            return version;
        }
    }
}
