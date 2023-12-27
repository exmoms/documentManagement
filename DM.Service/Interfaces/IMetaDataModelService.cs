using DM.Service.ServiceModels.MetaDataModelDTO;
using System.Collections.Generic;

namespace DM.Service.Interfaces
{
    public interface IMetaDataModelService
    {
        /// <summary>
        /// Gets all available metadata models.
        /// </summary>
        /// <returns>a list of metadata models</returns>
        IEnumerable<MetaDataModelDTO> GetMetaDataModels();

        /// <summary>
        /// Gets the metadata model which id is provided.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>a metadata model object.</returns>
        /// <exception cref="NOT_FOUND_ERROR">Thrown when no metadata model with this id is available.</exception>
        MetaDataModelDTO GetMetaDataModelById(int metadata_model_id);

        /// <summary>
        /// Gets the metadata model accord to class id
        /// </summary>
        /// <param name="classId"></param>
        /// <returns>The id's and names of metadata models according to the passed class id</returns>
        List<dynamic> GetMetaDataModelsByClassId(int classId);

        /// <summary>
        /// Adds a metadata model.
        /// </summary>
        /// <param name="metaData_model_dto">The model to be added.</param>
        /// <exception cref="EXISTED_BEFORE_ERROR">Thrown when the metadata model name or the aggregate name are already added.</exception>
        /// <exception cref="INVALD_ENTRY_ERROR">Thrown when the metadata model name is null or empty.</exception>
        /// <exception cref="NOT_FOUND_ERROR">Thrown when the desired document class doesn't exist.</exception>
        void AddMetaDataModel(MetaDataModelDTO metaData_model_dto);

        /// <summary>
        /// Soft deleted for meta-data model to prevent adding new document of this kind.
        /// </summary>
        /// <param name="metaData_model_dto"></param>
        /// <exception cref="NOT_FOUND_ERROR">Thrown when the metadata model id doesn't exist.</exception>
        /// <exception cref="DELETED_BEFORE_ERROR">Thrown when the metadata model already deleted.</exception>
        void DeleteMetaDataModel(int metaData_model_id);

        /// <summary>
        /// Gets the number of required attachments for a given metadata model.
        /// </summary>
        /// <param name="metaData_model_id"></param>
        /// <returns>a number of required attachments.</returns>
        /// <exception cref="NOT_FOUND_ERROR">Thrown when no metadata with this id is found.</exception>
        int GetNumberOfCompoundAttachmentsByMetaDataModelId(int metaData_model_id);
      }
}
