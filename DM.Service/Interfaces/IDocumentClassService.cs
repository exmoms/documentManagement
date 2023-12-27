using System.Collections.Generic;
using DM.Service.ServiceModels.DocumentClassDTO;

namespace DM.Service.Interfaces
{
    public interface IDocumentClassService
    {
        /// <summary>
        /// Gets all available Document Classes.
        /// </summary>
        /// <returns>a list of document classes.</returns>
        IEnumerable<DocumentClassDTO> GetDocumentClasses();
        /// <summary>
        /// Gets a document class by its id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>a document class object.</returns>
        /// <exception cref="NOT_FOUND_ERROR">Thrown when the required document class is not found.</exception>
        DocumentClassDTO GetDocumentClass(int id);
        /// <summary>
        /// Adds a document class.
        /// </summary>
        /// <param name="document_class">tThe document class to be added.</param>
        /// <exception cref="INVALD_ENTRY_ERROR">Thrown when the document class name is null or empty.</exception>
        /// <exception cref="EXISTED_BEFORE_ERROR">Thrown when the document class already added.</exception>
        void AddDocumentClass(DocumentClassDTO document_class);

        /// <summary>
        /// Remove Document Class
        /// </summary>
        /// <param name="classId"></param>
        /// <exception cref="NOT_FOUND_ERROR">Thrown when the document class id is not exist</exception>
        /// <exception cref="Attached_by_Metadata_Model_ERROR">Thrown when the document class contains undeleted metadata model.</exception>
        void DeleteDocumentClass(int classId);
    }
}
