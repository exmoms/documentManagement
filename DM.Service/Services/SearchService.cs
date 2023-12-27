using DM.Domain.Enums;
using DM.Domain.Models;
using DM.Repository.Contexts;
using DM.Service.Interfaces;
using DM.Service.ServiceModels;
using DM.Service.ServiceModels.SerachModels;
using DM.Service.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text.Json;

namespace DM.Service.Services
{
    public class SearchService : ISearchService
    {
        private DocumentDBContext _context;
        private readonly IStringLocalizer<SearchService> _localizer;

        public SearchService(DocumentDBContext context, IStringLocalizer<SearchService>  localizer )
        {
            _context = context;
            _localizer = localizer;
        }


        public List<SearchResult> SearchForDocumentsByValues(ValuesSearchFilter filter)
        {
            if (filter == null || filter.Values == null || filter.Values.Count == 0)
                return new List<SearchResult>();

            List<SearchResult> result = null;

            ExpressionBuilder<DocumentSet_Document> setIdExpressionBuilder = null;
            ExpressionBuilder<DocumentSet_Document> setIdExcludeExprBuilder = null;

            if (filter.SetId != null)
            {
                setIdExpressionBuilder = new ExpressionBuilder<DocumentSet_Document>();
                setIdExpressionBuilder.AddOperation("DocumentSetId", PropertyOperation.Equal, filter.SetId);
            }

            if (filter.SetIdExclude != null)
            {
                setIdExcludeExprBuilder = new ExpressionBuilder<DocumentSet_Document>();
                setIdExcludeExprBuilder.AddOperation("DocumentSetId", PropertyOperation.Equal, filter.SetIdExclude);
            }

            foreach (var value in filter.Values)
            {
                List<Tuple<string, PropertyOperation, object>> generalFilters = new List<Tuple<string, PropertyOperation, object>>
                {
                    new Tuple<string, PropertyOperation, object>("MetaDataAttributeId", PropertyOperation.Equal, value.AttributeId),
                    new Tuple<string, PropertyOperation, object>("MaxDocumentVersionId", PropertyOperation.Equal, null)
                };

                switch (value.TypeId)
                {
                    case (int)DATA_TYPES.BOOL:
                        ExpressionBuilder<BoolValue> boolExpBuilder = new ExpressionBuilder<BoolValue>();
                        boolExpBuilder.AddOperations(generalFilters);

                        if (value.MinValue != null)
                            boolExpBuilder.AddOperation("Value", PropertyOperation.Equal, value.MinValue);

                        if (setIdExpressionBuilder != null)
                            boolExpBuilder.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.Any, setIdExpressionBuilder);

                        if (setIdExcludeExprBuilder != null)
                            boolExpBuilder.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.NotAny, setIdExcludeExprBuilder);

                        result = IntersectSearchResultList(result, SearchForDocumentsByBoolValue(boolExpBuilder.GenerateExpression()));
                        break;

                    case (int)DATA_TYPES.DATE:
                        ExpressionBuilder<DateValue> DateExpBuilder = new ExpressionBuilder<DateValue>();
                        DateExpBuilder.AddOperations(generalFilters);

                        if (value.MinValue != null)
                            DateExpBuilder.AddOperation("Value", PropertyOperation.GreaterThanOrEqual, value.MinValue);

                        if (value.MaxValue != null)
                            DateExpBuilder.AddOperation("Value", PropertyOperation.LessThanOrEqual, value.MaxValue);

                        if (setIdExpressionBuilder != null)
                            DateExpBuilder.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.Any, setIdExpressionBuilder);

                        if (setIdExcludeExprBuilder != null)
                            DateExpBuilder.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.NotAny, setIdExcludeExprBuilder);

                        result = IntersectSearchResultList(result, SearchForDocumentsByDateValue(DateExpBuilder.GenerateExpression()));
                        break;

                    case (int)DATA_TYPES.DECIMAL:
                        ExpressionBuilder<DecimalValue> DecimalExpBuilder = new ExpressionBuilder<DecimalValue>();
                        DecimalExpBuilder.AddOperations(generalFilters);

                        if (value.MinValue != null)
                            DecimalExpBuilder.AddOperation("Value", PropertyOperation.GreaterThanOrEqual, value.MinValue);

                        if (value.MaxValue != null)
                            DecimalExpBuilder.AddOperation("Value", PropertyOperation.LessThanOrEqual, value.MaxValue);

                        if (setIdExpressionBuilder != null)
                            DecimalExpBuilder.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.Any, setIdExpressionBuilder);

                        if (setIdExcludeExprBuilder != null)
                            DecimalExpBuilder.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.NotAny, setIdExcludeExprBuilder);

                        result = IntersectSearchResultList(result, SearchForDocumentsByDecimalValue(DecimalExpBuilder.GenerateExpression()));
                        break;

                    case (int)DATA_TYPES.DOUBLE:
                        ExpressionBuilder<DoubleValue> DoubleExpBuilder = new ExpressionBuilder<DoubleValue>();
                        DoubleExpBuilder.AddOperations(generalFilters);

                        if (value.MinValue != null)
                            DoubleExpBuilder.AddOperation("Value", PropertyOperation.GreaterThanOrEqual, value.MinValue);

                        if (value.MaxValue != null)
                            DoubleExpBuilder.AddOperation("Value", PropertyOperation.LessThanOrEqual, value.MaxValue);

                        if (setIdExpressionBuilder != null)
                            DoubleExpBuilder.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.Any, setIdExpressionBuilder);

                        if (setIdExcludeExprBuilder != null)
                            DoubleExpBuilder.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.NotAny, setIdExcludeExprBuilder);

                        result = IntersectSearchResultList(result, SearchForDocumentsByDoubleValue(DoubleExpBuilder.GenerateExpression()));
                        break;

                    case (int)DATA_TYPES.INTEGER:
                        ExpressionBuilder<IntValue> IntExpBuilder = new ExpressionBuilder<IntValue>();
                        IntExpBuilder.AddOperations(generalFilters);

                        if (value.MinValue != null)
                            IntExpBuilder.AddOperation("Value", PropertyOperation.GreaterThanOrEqual, value.MinValue);

                        if (value.MaxValue != null)
                            IntExpBuilder.AddOperation("Value", PropertyOperation.LessThanOrEqual, value.MaxValue);

                        if (setIdExpressionBuilder != null)
                            IntExpBuilder.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.Any, setIdExpressionBuilder);

                        if (setIdExcludeExprBuilder != null)
                            IntExpBuilder.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.NotAny, setIdExcludeExprBuilder);

                        result = IntersectSearchResultList(result, SearchForDocumentsByIntValue(IntExpBuilder.GenerateExpression()));
                        break;

                    case (int)DATA_TYPES.STRING:
                        ExpressionBuilder<StringValue> stringExpBuilder = new ExpressionBuilder<StringValue>();
                        stringExpBuilder.AddOperations(generalFilters);

                        if (value.MinValue != null)
                            stringExpBuilder.AddOperation("NormalizedValue", PropertyOperation.Contains, ArabicNormalizer.Normalize((string)value.MinValue));

                        if (setIdExpressionBuilder != null)
                            stringExpBuilder.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.Any, setIdExpressionBuilder);

                        if (setIdExcludeExprBuilder != null)
                            stringExpBuilder.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.NotAny, setIdExcludeExprBuilder);

                        result = IntersectSearchResultList(result, SearchForDocumentsByStringValue(stringExpBuilder.GenerateExpression()));
                        break;
                    default:
                        ValidatorException validatorException = new ValidatorException();
                        validatorException.AttributeMessages.Add(_localizer["Invalid data type."]);
                        throw validatorException;
                }


            }

            if (result == null)
            {
                return new List<SearchResult>();
            }

            return result;

        }

        public List<SearchResult> SearchForDocumentsByFreeText(FreeTxtSearchFilter filter)
        {
            if (filter == null || filter.Text == null || filter.Text.Length == 0)
                return new List<SearchResult>();

            filter.Text = ArabicNormalizer.Normalize(filter.Text);

            // init general filters 

            ExpressionBuilder<StringValue> stringValueExpBuilder = new ExpressionBuilder<StringValue>();
            ExpressionBuilder<DateValue> dateValueExpBulider = new ExpressionBuilder<DateValue>();
            ExpressionBuilder<DecimalValue> decimalValueExpBuilder = new ExpressionBuilder<DecimalValue>();
            ExpressionBuilder<DoubleValue> doubleValueExpBuilder = new ExpressionBuilder<DoubleValue>();
            ExpressionBuilder<IntValue> intValueExpBuilder = new ExpressionBuilder<IntValue>();

    
            // lateset version search only
            stringValueExpBuilder.AddOperation("MaxDocumentVersionId", PropertyOperation.Equal, null);
            dateValueExpBulider.AddOperation("MaxDocumentVersionId", PropertyOperation.Equal, null);
            decimalValueExpBuilder.AddOperation("MaxDocumentVersionId", PropertyOperation.Equal, null);
            doubleValueExpBuilder.AddOperation("MaxDocumentVersionId", PropertyOperation.Equal, null);
            intValueExpBuilder.AddOperation("MaxDocumentVersionId", PropertyOperation.Equal, null);

            if (filter.SetId != null)
            {
                ExpressionBuilder<DocumentSet_Document> setIdExpressionBuilder = new ExpressionBuilder<DocumentSet_Document>();
                setIdExpressionBuilder.AddOperation("DocumentSetId", PropertyOperation.Equal, filter.SetId);

                stringValueExpBuilder.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.Any, setIdExpressionBuilder);
                dateValueExpBulider.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.Any, setIdExpressionBuilder);
                decimalValueExpBuilder.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.Any, setIdExpressionBuilder);
                doubleValueExpBuilder.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.Any, setIdExpressionBuilder);
                intValueExpBuilder.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.Any, setIdExpressionBuilder);
            }

            if (filter.SetIdExclude != null)
            {
                ExpressionBuilder<DocumentSet_Document> setIdExcludeExprBuilder = new ExpressionBuilder<DocumentSet_Document>();
                setIdExcludeExprBuilder.AddOperation("DocumentSetId", PropertyOperation.Equal, filter.SetIdExclude);

                stringValueExpBuilder.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.NotAny, setIdExcludeExprBuilder);
                dateValueExpBulider.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.NotAny, setIdExcludeExprBuilder);
                decimalValueExpBuilder.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.NotAny, setIdExcludeExprBuilder);
                doubleValueExpBuilder.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.NotAny, setIdExcludeExprBuilder);
                intValueExpBuilder.AddInnerExpression("DocumentVersion.Document.Set_Documents", InnerExpressionOperation.NotAny, setIdExcludeExprBuilder);
            }

            if (filter.ModelId != null)
            {
                stringValueExpBuilder.AddOperation("DocumentVersion.Document.MetaDataModelId", PropertyOperation.Equal, filter.ModelId);
                dateValueExpBulider.AddOperation("DocumentVersion.Document.MetaDataModelId", PropertyOperation.Equal, filter.ModelId);
                decimalValueExpBuilder.AddOperation("DocumentVersion.Document.MetaDataModelId", PropertyOperation.Equal, filter.ModelId);
                doubleValueExpBuilder.AddOperation("DocumentVersion.Document.MetaDataModelId", PropertyOperation.Equal, filter.ModelId);
                intValueExpBuilder.AddOperation("DocumentVersion.Document.MetaDataModelId", PropertyOperation.Equal, filter.ModelId);
            }

            if (filter.ClassId != null)
            {
                stringValueExpBuilder.AddOperation("DocumentVersion.Document.MetaDataModel.DocumentClassId", PropertyOperation.Equal, filter.ClassId);
                dateValueExpBulider.AddOperation("DocumentVersion.Document.MetaDataModel.DocumentClassId", PropertyOperation.Equal, filter.ClassId);
                decimalValueExpBuilder.AddOperation("DocumentVersion.Document.MetaDataModel.DocumentClassId", PropertyOperation.Equal, filter.ClassId);
                doubleValueExpBuilder.AddOperation("DocumentVersion.Document.MetaDataModel.DocumentClassId", PropertyOperation.Equal, filter.ClassId);
                intValueExpBuilder.AddOperation("DocumentVersion.Document.MetaDataModel.DocumentClassId", PropertyOperation.Equal, filter.ClassId);
            }


            List<SearchResult> result = null;


            var words = filter.Text.Split(' ');

            foreach (var word in words)
            {
                List<SearchResult> tmpResult = new List<SearchResult>();

                DateTime? dateVal = DateTime.TryParse(word, out var tdt) ? (DateTime?)tdt : null;
                decimal? decimalVal = decimal.TryParse(word, out var tdc) ? (decimal?)tdc : null;
                double? doubleVal = double.TryParse(word, out var tdb) ? (double?)tdb : null;
                int? intVal = int.TryParse(word, out var ti) ? (int?)ti : null;

                // search for txt as string value
                {

                    var opr = stringValueExpBuilder.AddOperation("NormalizedValue", PropertyOperation.Contains, word);
                    tmpResult = UnionSearchResultList(tmpResult, SearchForDocumentsByStringValue(stringValueExpBuilder.GenerateExpression()));

                    stringValueExpBuilder.RemoveOperation(opr);
                }

                if (dateVal != null)
                {
                    var opr = dateValueExpBulider.AddOperation("Value", PropertyOperation.Equal, dateVal);
                    tmpResult = UnionSearchResultList(tmpResult, SearchForDocumentsByDateValue(dateValueExpBulider.GenerateExpression()));

                    dateValueExpBulider.RemoveOperation(opr);
                }

                if (decimalVal != null)
                {
                    var opr = decimalValueExpBuilder.AddOperation("Value", PropertyOperation.Equal, decimalVal);
                    tmpResult = UnionSearchResultList(tmpResult, SearchForDocumentsByDecimalValue(decimalValueExpBuilder.GenerateExpression()));

                    decimalValueExpBuilder.RemoveOperation(opr);
                }

                if (doubleVal != null)
                {
                    var opr = doubleValueExpBuilder.AddOperation("Value", PropertyOperation.Equal, doubleVal);
                    tmpResult = UnionSearchResultList(tmpResult, SearchForDocumentsByDoubleValue(doubleValueExpBuilder.GenerateExpression()));

                    doubleValueExpBuilder.RemoveOperation(opr);
                }

                if (intVal != null)
                {
                    var opr = intValueExpBuilder.AddOperation("Value", PropertyOperation.Equal, intVal);
                    tmpResult = UnionSearchResultList(tmpResult, SearchForDocumentsByIntValue(intValueExpBuilder.GenerateExpression()));

                    intValueExpBuilder.RemoveOperation(opr);
                }

                result = IntersectSearchResultList(result, tmpResult);
            }

            if (result != null)
            {
                foreach (var item in result)
                    RemoveDuplicatedValuesFromSearchResult(item);
            }

            return result;


        }

        private List<SearchResult> SearchForDocumentsByBoolValue(Expression<Func<BoolValue, bool>> expr)
        {
            return _context.BoolValue.Where(expr)
                                    .Include(v => v.MetaDataAttribute).Include(v => v.DocumentVersion).ThenInclude(d => d.Document)
                                    .Select(v => new SearchResult
                                    {
                                        DocumentId = v.DocumentVersion.DocumentId,
                                        DocumentName = v.DocumentVersion.Document.Name,
                                        LatestVersion = (int)v.DocumentVersion.Document.LatestVersionId,
                                        Values = new List<dynamic> { new { v.MetaDataAttribute.MetaDataAttributeName, v.Value } }
                                    }).ToList();
        }


        private List<SearchResult> SearchForDocumentsByDateValue(Expression<Func<DateValue, bool>> expr)
        {
            return _context.DateValue.Where(expr)
                                    .Include(v => v.MetaDataAttribute).Include(v => v.DocumentVersion).ThenInclude(d => d.Document)
                                    .Select(v => new SearchResult
                                    {
                                        DocumentId = v.DocumentVersion.DocumentId,
                                        DocumentName = v.DocumentVersion.Document.Name,
                                        LatestVersion = (int)v.DocumentVersion.Document.LatestVersionId,
                                        Values = new List<dynamic> { new { v.MetaDataAttribute.MetaDataAttributeName, v.Value } }
                                    }).ToList();
        }

        private List<SearchResult> SearchForDocumentsByDecimalValue(Expression<Func<DecimalValue, bool>> expr)
        {
            return _context.DecimalValue.Where(expr)
                                    .Include(v => v.MetaDataAttribute).Include(v => v.DocumentVersion).ThenInclude(d => d.Document)
                                    .Select(v => new SearchResult
                                    {
                                        DocumentId = v.DocumentVersion.DocumentId,
                                        DocumentName = v.DocumentVersion.Document.Name,
                                        LatestVersion = (int)v.DocumentVersion.Document.LatestVersionId,
                                        Values = new List<dynamic> { new { v.MetaDataAttribute.MetaDataAttributeName, v.Value } }
                                    }).ToList();
        }

        private List<SearchResult> SearchForDocumentsByDoubleValue(Expression<Func<DoubleValue, bool>> expr)
        {
            return _context.DoubleValue.Where(expr)
                                    .Include(v => v.MetaDataAttribute).Include(v => v.DocumentVersion).ThenInclude(d => d.Document)
                                    .Select(v => new SearchResult
                                    {
                                        DocumentId = v.DocumentVersion.DocumentId,
                                        DocumentName = v.DocumentVersion.Document.Name,
                                        LatestVersion = (int)v.DocumentVersion.Document.LatestVersionId,
                                        Values = new List<dynamic> { new { v.MetaDataAttribute.MetaDataAttributeName, v.Value } }
                                    }).ToList();
        }

        private List<SearchResult> SearchForDocumentsByIntValue(Expression<Func<IntValue, bool>> expr)
        {
            return _context.IntValue.Where(expr)
                                    .Include(v => v.MetaDataAttribute).Include(v => v.DocumentVersion).ThenInclude(d => d.Document)
                                    .Select(v => new SearchResult
                                    {
                                        DocumentId = v.DocumentVersion.DocumentId,
                                        DocumentName = v.DocumentVersion.Document.Name,
                                        LatestVersion = (int)v.DocumentVersion.Document.LatestVersionId,
                                        Values = new List<dynamic> { new { v.MetaDataAttribute.MetaDataAttributeName, v.Value } }
                                    }).ToList();
        }

        private List<SearchResult> SearchForDocumentsByStringValue(Expression<Func<StringValue, bool>> expr)
        {
            return _context.StringValue.Where(expr)
                                     .Include(v => v.MetaDataAttribute).Include(v => v.DocumentVersion).ThenInclude(d => d.Document)
                                    .Select(v => new SearchResult
                                    {
                                        DocumentId = v.DocumentVersion.DocumentId,
                                        DocumentName = v.DocumentVersion.Document.Name,
                                        LatestVersion = (int)v.DocumentVersion.Document.LatestVersionId,
                                        Values = new List<dynamic> { new { v.MetaDataAttribute.MetaDataAttributeName, v.Value } }
                                    }).ToList();
        }

        public void ConvertJsonElementsToValueSearch(List<ValueSearch> values)
        {
            if (values == null)
                return;
            foreach (var value in values)
            {
                value.TypeId = _context.MetaDataAttribute.Where(a => a.ID == value.AttributeId).Select(a => a.DataTypeID).Single();
                JsonElement? minVal = (JsonElement?)value.MinValue;
                JsonElement? maxVal = (JsonElement?)value.MaxValue;
                switch (value.TypeId)
                {
                    case (int)DATA_TYPES.BOOL:
                        value.MinValue = minVal?.GetBoolean();
                        break;
                    case (int)DATA_TYPES.DATE:
                        value.MinValue = minVal?.GetDateTime();
                        value.MaxValue = maxVal?.GetDateTime();
                        break;
                    case (int)DATA_TYPES.DECIMAL:
                        value.MinValue = minVal?.GetDecimal();
                        value.MaxValue = maxVal?.GetDecimal();
                        break;
                    case (int)DATA_TYPES.DOUBLE:
                        value.MinValue = minVal?.GetDouble();
                        value.MaxValue = maxVal?.GetDouble();
                        break;
                    case (int)DATA_TYPES.INTEGER:
                        value.MinValue = minVal?.GetInt32();
                        value.MaxValue = maxVal?.GetInt32();
                        break;
                    case (int)DATA_TYPES.STRING:
                        value.MinValue = minVal?.GetString();
                        break;
                    default:
                        value.MinValue = null;
                        value.MaxValue = null;
                        break;
                }

            }

        }

        public static List<SearchResult> IntersectSearchResultList(List<SearchResult> aList, List<SearchResult> bList)
        {
            List<SearchResult> result = new List<SearchResult>();
            if (aList == null && bList != null)
                return bList;

            if (bList == null)
                return new List<SearchResult>();

            foreach (var item in aList)
            {
                SearchResult bItem = bList.FirstOrDefault(s => s.DocumentId == item.DocumentId);
                if (bItem != null)
                {
                    SearchResult tmpResult = item;
                    if (tmpResult.Values == null)
                        tmpResult.Values = new List<dynamic>();

                    if (bItem.Values != null)
                        tmpResult.Values.AddRange(bItem.Values);

                    result.Add(tmpResult);
                }
            }

            return result;

        }

        public static List<SearchResult> UnionSearchResultList(List<SearchResult> aList, List<SearchResult> bList)
        {
            if (aList == null && bList != null)
                return bList;

            if (aList != null && bList == null)
                return aList;

            if (aList == null && bList == null)
                return new List<SearchResult>();

            List<SearchResult> result = aList;

            foreach (var item in bList)
            {
                SearchResult tmp = result.FirstOrDefault(r => r.DocumentId == item.DocumentId);
                if (tmp != null)
                {
                    if (tmp.Values == null)
                    {
                        tmp.Values = new List<dynamic>();
                    }

                    if (item.Values != null)
                    {
                        tmp.Values.AddRange(item.Values);
                    }
                }
                else
                {
                    result.Add(item);
                }
            }


            return result;

        }

        public static void RemoveDuplicatedValuesFromSearchResult(SearchResult res)
        {
            if (res != null && res.Values != null)
            {
                List<int> indicesToRemove = new List<int>();
                for (int i = 0; i < res.Values.Count(); i++)
                {
                    if (indicesToRemove.Contains(i))
                        continue;

                    for (int j = i + 1; j < res.Values.Count(); j++)
                    {
                        if (res.Values[i].MetaDataAttributeName == res.Values[j].MetaDataAttributeName
                            && res.Values[i].Value == res.Values[j].Value)
                        {
                            indicesToRemove.Add(j);
                        }
                    }
                }

                for (int i = res.Values.Count() - 1; i >= 0; i--)
                {
                    if (indicesToRemove.Contains(i))
                        res.Values.RemoveAt(i);
                }
            }
        }

    }
}
