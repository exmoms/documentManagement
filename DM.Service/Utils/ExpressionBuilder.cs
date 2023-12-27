using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace DM.Service.Utils
{

    public enum PropertyOperation
    {
        LessThanOrEqual = 1,
        GreaterThanOrEqual,
        Equal ,
        Contains 
    }

    public enum InnerExpressionOperation
    {
        Any = 1,
        NotAny
    }
    public class ExpressionBuilder<T>
    {

        private List<Tuple<string, PropertyOperation, object>> Operations;
        private List<Expression> innerExpressions;
        private ParameterExpression parameterExpression;

        public ExpressionBuilder()
        {
            Operations = new List<Tuple<string, PropertyOperation, object>>();
            parameterExpression = Expression.Parameter(typeof(T));
            innerExpressions = new List<Expression>();
        }


        public Tuple<string, PropertyOperation, object> AddOperation(string propertyName, PropertyOperation opr, object value)
        {
            var opreation = new Tuple<string, PropertyOperation, object>(propertyName, opr, value);
            Operations.Add(opreation);

            return opreation;
        }

        public void RemoveOperation(Tuple<string, PropertyOperation, object> operation)
        {
            Operations.Remove(operation);
        }

        public void AddOperations(List<Tuple<string, PropertyOperation, object>> Operations)
        {
            foreach (var item in Operations)
                this.Operations.Add(item);
        }

        public Expression<Func<T,bool>> GenerateExpression()
        {
            Expression expr = Expression.Constant(true);

            foreach(var opr in Operations)
            {
                var property = GetPropertyFromString(opr.Item1);
                if (opr.Item2 == PropertyOperation.LessThanOrEqual)
                {
                    expr = Expression.AndAlso(expr, GetLessThanOrEqualExpression(opr.Item3, property));
                }
                else if (opr.Item2 == PropertyOperation.GreaterThanOrEqual)
                {
                    expr = Expression.AndAlso(expr, GetGreaterThanOrEqualExpression(opr.Item3, property));
                }
                else if (opr.Item2 == PropertyOperation.Equal)
                {
                    expr = Expression.AndAlso(expr, GetEqualExpression(opr.Item3, property));
                }
                else if (opr.Item2 == PropertyOperation.Contains)
                {
                    expr = Expression.AndAlso(expr, GetStringContainsExpression((string)opr.Item3, property));
                }
            }

            foreach(var innerExp in innerExpressions)
            {
                expr = Expression.AndAlso(expr, innerExp);
            }

            return Expression.Lambda<Func<T,bool>>(expr,parameterExpression);
        }

        public static Expression GetEqualExpression(object value, MemberExpression property)
        {   
            return Expression.Equal(property, Expression.Convert(Expression.Constant(value), property.Type));
        }

        public static Expression GetGreaterThanOrEqualExpression(object value, MemberExpression property)
        {
            if (value == null)
                return null;

            return Expression.GreaterThanOrEqual(property, Expression.Convert(Expression.Constant(value), property.Type));
        }

        public static Expression GetLessThanOrEqualExpression(object value, MemberExpression property)
        {
            if (value == null)
                return null;

            return Expression.LessThanOrEqual(property, Expression.Convert(Expression.Constant(value), property.Type));
        }


        public static Expression GetStringContainsExpression(string query, MemberExpression property)
        {
            if (query == null)
                return null;

            Expression res = null;
            Expression LowerCaseProperty = Expression.Call(property, typeof(string).GetMethod("ToLower", Type.EmptyTypes));
            List<string> words = query.ToLower().Split(' ').ToList();

            foreach (var word in words)
            {
                var tmpExp = Expression.Call(
                LowerCaseProperty,
                typeof(string).GetMethod(nameof(string.Contains), new[] { typeof(string) }),
                Expression.Constant(word));
                if (res == null)
                {
                    res = tmpExp;
                }
                else
                {
                    res = Expression.AndAlso(res, tmpExp);
                }
            }

            return res;

        }

        public void AddInnerExpression<TSource>(string propertyNm,InnerExpressionOperation opr,ExpressionBuilder<TSource> expBuilder)
        {
            MemberExpression property = GetPropertyFromString(propertyNm);

            Expression exp = null;
            if (opr == InnerExpressionOperation.Any)
            {
                exp = Expression.Call(typeof(Enumerable), "Any", new Type[] { typeof(TSource) }, property, expBuilder.GenerateExpression());
            }
            else if(opr == InnerExpressionOperation.NotAny)
            {
                exp = Expression.Not(Expression.Call(typeof(Enumerable), "Any", new Type[] { typeof(TSource) }, property, expBuilder.GenerateExpression()));
            }

            if(exp != null)
            {
                innerExpressions.Add(exp);
            }
        }

        private MemberExpression GetPropertyFromString(string propName)
        {
            Expression body = parameterExpression;
            foreach (var member in propName.Split('.'))
            {
                body = Expression.PropertyOrField(body, member);
            }

            return (MemberExpression)body;
        }

    }
}
