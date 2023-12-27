using System;
using System.Collections.Generic;
using System.Text.Json;

namespace DM.Service.ServiceModels
{
    public class ValidatorException : Exception
    {
        public List<string> AttributeMessages { get; set; }

        public ValidatorException()
        {
            AttributeMessages = new List<string>();
        }
        public string GetMessages()
        {
            return JsonSerializer.Serialize(AttributeMessages);
        }

        public bool checkNames(string name)
        {
            // common constraints between all names.
            if (name == null || name == "" || name.Length < 1)
            {
                return false;
            }
            return true;
        }
    }
}
