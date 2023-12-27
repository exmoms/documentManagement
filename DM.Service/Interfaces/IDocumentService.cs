using DM.Service.ServiceModels.DocumentDTO;
using DM.Service.ServiceModels.MailModels;
using System.Collections.Generic;

namespace DM.Service.Interface
{
    public interface IDocumentService
    {
        /// <summary>
        /// gets all documents in the database.
        /// </summary>
        /// <returns>a list of documents</returns>
        public IEnumerable<DocumentGetDTO> GetDocuments();
        /// <summary>
        /// Gets a document based on a given version id.
        /// </summary>
        /// <param name="VersionId"></param>
        /// <returns>a document object</returns>
        /// <exception cref="NOT_FOUND_ERROR">Thrown when a version is not found.</exception>
        public DocumentGetDTO GetDocumentByVersionId(int VersionId);
        /// <summary>
        /// gets a document version based on its id 
        /// </summary>
        /// <param name="id">the id of the document version to be fetched</param>
        /// <returns>document version object</returns>
        /// <exception cref="NOT_FOUND_ERROR">Thrown when there is no document version has the desired id.</exception>
        public DocumentVersionGetDTO GetDocumentVersionById(int id);
        /// <summary>
        /// Adds a document
        /// </summary>
        /// <param name="documentDTO">The document to be added of type DocumentDTO</param>
        /// <exception cref="INVALD_ENTRY_ERROR">Thrown when the document name is null or empty.</exception>
        /// <exception cref="EMPTY_VALUE_ERROR">Thrown when a required field is empty.</exception>
        public void AddDocument(DocumentPostDTO documentDTO);
        /// <summary>
        /// deletes a document.
        /// </summary>
        /// <param name="id">The document id to be deleted.</param>
        /// <exception cref="DELETED_BEFORE_ERROR">Thrown when the document is already deleted.</exception>
        public void SoftDeleteDocument(int id);
        /// <summary>
        /// Gets all documents that have this metaDataModel
        /// </summary>
        /// <param name="metaDataModel"> to fetch all documents that have this model. </param>
        /// <returns>a list of documents</returns>
        /// <exception cref="NOT_FOUND_ERROR">Thrown when there is no document linked with the meta data model.</exception>
        public IEnumerable<DocumentGetDTO> GetDocumentsByMetaDataModel(int metaDataModelId);
        /// <summary>
        /// Updates a document version.
        /// </summary>
        /// <param name="documentVersionDTO">The version to be updated.</param>
        public int UpdateVersion(DocumentVersionPostDTO documentVersionDTO, bool updateParentsRecursive= true);
        /// <summary>
        /// Gets all available attachments in a given document id.
        /// </summary>
        /// <returns>a list of attachments .</returns>
        /// <exception cref="NOT_FOUND_ERROR">Thrown when the desired document is not found.</exception>
        public IEnumerable<AttachmentGetDTO> GetAttachmentsByDocumentId(int id);
        /// <summary>
        /// Adds an attachment.
        /// </summary>
        /// <param name="attachmentDTO">The attachment to be added.</param>
        /// <exception cref="INVALD_ENTRY_ERROR">Thrown when the attachment name is null or empty.</exception>
        /// <exception cref="EXISTED_BEFORE_ERROR">Thrown when the attachment is already added to the document.</exception>
        public void AddAttachment(AttachmentPostDTO attachmentDTO);

        public void UpdateAttachment(AttachmentPostDTO attachmentDTO);

        /// <summary>
        /// Gets the attachment which id is the provided one.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>an attachment object.</returns>
        /// <exception cref="NOT_FOUND_ERROR">Thrown when there is no attachment with this id</exception>
        public AttachmentGetDTO GetAttachmentById(int id);

        /// <summary>
        /// Deletes an attachment from document.
        /// </summary>
        /// <param name="attachmentId">The id of attachment to be deleted.</param>
        /// <exception cref="NOT_FOUND_ERROR">Thrown when the document is not found.</exception>
        /// <exception cref="NOT_FOUND_ERROR">Thrown when the attachment is not found.</exception>
        /// <exception cref="NOT_FOUND_ERROR">Thrown when the document doesn't have this attachment.</exception>
        public void DeleteAttachment(int attachmentId);
        public void ConvertJsonElementsToValue(List<ValueDTO> values);
        /// <summary>
        /// Archives a document.
        /// </summary>
        /// <param name="document">The document to be archived.</param>
        /// <exception cref="EXISTED_BEFORE_ERROR">Thrown when the document is already archived.</exception>
        public void ArchiveDocument(int docId);
        public void UnArchiveDocument(int docId);

        public DocumentScanDTO GetDocumentScanById(int id);

        public byte[] GetAttachmentImgById(int id,out string contentType);

        /// <summary>
        ///   Get default values of the last document by user and metadata
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="metaDataModelId"></param>
        /// <returns>The last document</returns>
        /// <exception cref="NOT_FOUND_ERROR">Thrown when the metaDataModelId doesn't exist.</exception>
        public DocumentGetDTO GetLastDocumnetByUserAndMetadataModel(int userId, int metaDataModelId);
        public IEnumerable<DocumentGetDTO> GetOrphanDocuments();
        public List<dynamic> GetDocumentHistory(int docId);
        public void SendDocumentScansEmail(DocumentScanEmail mail);
        public List<dynamic> GetDocumentsScanByVersionIds(List<int> versionIds);
    }
}
