using DM.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace DM.Service.ServiceModels.DocumentDTO
{
    public class DocumentScanDTO
    {
        public byte[] ScanImage { get; set; }
        public string Name { get; set; }
        public string ContentType { get; set; }

        public DocumentScan GetEntity()
        {
            DocumentScan scan = new DocumentScan
            {
                Name = Name,
                ContentType = ContentType,
                DocumnetScan = ScanImage
            };

            return scan;
        }

        public static DocumentScanDTO GetDTO(DocumentScan scan)
        {
            DocumentScanDTO dto = new DocumentScanDTO()
            {
                ContentType = scan.ContentType,
                Name = scan.Name,
                ScanImage = scan.DocumnetScan
            };
            return dto;
        }
    }
}
