using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Text.Json;
using System.Threading.Tasks;

namespace DM.Service.ServiceModels
{
    public class FormDataJsonModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext == null) throw new ArgumentNullException(nameof(bindingContext));

            // Fetch the value of the argument by name and set it to the model state
            string fieldName = bindingContext.FieldName;
            var valueProviderResult = bindingContext.ValueProvider.GetValue(fieldName);
            if (valueProviderResult == ValueProviderResult.None) return Task.CompletedTask;
            else bindingContext.ModelState.SetModelValue(fieldName, valueProviderResult);

            // Do nothing if the value is null or empty
            string value = valueProviderResult.FirstValue;
            if (string.IsNullOrEmpty(value)) return Task.CompletedTask;

            try
            {
                // De-serialize the provided value and set the binding result
                object result = JsonSerializer.Deserialize(value, bindingContext.ModelType, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                bindingContext.Result = ModelBindingResult.Success(result);
            }
            catch (JsonException e)
            {
                bindingContext.Result = ModelBindingResult.Failed();
                bindingContext.ModelState.TryAddModelError(bindingContext.ModelName, e.Message);
            }

            return Task.CompletedTask;
        }
    }

}
