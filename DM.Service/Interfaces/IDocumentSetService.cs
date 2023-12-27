using System.Collections.Generic;

using DM.Service.ServiceModels.DocumentSetDTO;

namespace DM.Service.Interfaces
{
    public interface IDocumentSetService
    {
        /// <summary>
        ///     Get all the document sets.
        /// </summary>
        /// <returns>collection of Document sets</returns>
        IEnumerable<DocumentSetGetDTO> GetAllDocumentSets();

        /// <summary>
        ///     Get document set for a certain ID.
        /// </summary>
        /// <param name="document_set_id">The id of the document set</param>
        /// <returns>The desired document set if exist</returns>
        /// <exception>Thrown if the document set is not exist.</exception>
        DocumentSetGetDTO GetDocumentSetByID(int document_set_id);

        /// <summary>
        ///     Add a new document set object if the object loads valid members.
        /// </summary>
        /// <param name="document_set_dto">The document set object</param>
        /// <exception>Thrown if the new document set is invalid.</exception>
        void AddDocumentSet(DocumentSetPostDTO document_set_dto);

        /// <summary>
        ///     Update the name of a certain document set if the new name is valid, otherwise throw an exception.
        /// </summary>
        /// <param name="document_set_dto">The document set object loads the new name to rename the document set name</param>
        /// <exception>Thrown if the new name is invalid.</exception>
        void UpdateDocumentSetName(DocumentSetPostDTO document_set_dto);

        /// <summary>
        ///     Delete a document set and detached all the attached documents and all the attached document sets,
        /// </summary>
        /// <param name="document_set_id">Id of the document set</param>
        /// <exception>Thrown if the object is not existed before.</exception>
        void DeleteDocumentSet(int document_set_id);

        /// <summary>
        ///     Attach a document(s) to a certain document set,
        /// </summary>
        /// </summary>
        /// <param name="documents_Ids"> List of document(s) id's</param>
        /// <param name="document_set_Id">The id of the document set</param>
        /// <exception>Thrown if the join is existed before.</exception>
        void AddDocumentsToDocumentSet(List<int> documents_Ids, int document_set_Id);

        /// <summary>
        ///     Detach a document from a certain document set.
        /// </summary>
        /// <param name="document_Id">The document number which will be detached from a document set</param>
        /// <param name="document_set_Id">The id of the document set</param>
        /// <exception>Thrown if the join is not existed before.</exception>
        void RemoveDocumentFromDocumentSet(int document_Id, int document_set_Id);

        /// <summary>
        ///     Attach a document set to a certain document set,
        /// </summary>
        /// </summary>
        /// <param name="Parent_documentSet_Id">The id of the container document set</param>
        /// <param name="child_documentSet_Id">The document set number which will be a part of another document set</param>
        /// <exception>Thrown if the join is existed before.</exception>
        void AddRecursiveDocumentSet(int Parent_documentSet_Id, int child_documentSet_Id);

        /// <summary>
        ///     Detach a document set from a certain document set.
        /// </summary>
        /// <param name="Parent_documentSet_Id">The id of the container document set</param>
        /// <param name="child_documentSet_Id">The document set number which will be detached from a document set</param>
        /// <exception>Thrown if the join is existed before.</exception>
        void RemoveDocumentSetFromDocumentSet(int Parent_documentSet_Id, int child_documentSet_Id);
        IEnumerable<DocumentSetGetDTO> GetRootSets();
        DocumentSetGetDTO GetDocumentSetByName(string name);
        IEnumerable<DocumentSetGetDTO> GetAllSetsExcludingSetsOfParent(int Parent_documentSet_Id);
    }
}

