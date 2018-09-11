﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;

namespace Exam.Utils
{
    public class ValidateTextAndImage : ValidationAttribute, IClientValidatable
    {
        private readonly string[] _fields;
        public ValidateTextAndImage(string[] fields)
        {
            _fields = fields;
        }
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            foreach (string field in _fields)
            {
                PropertyInfo property = validationContext.ObjectType.GetProperty(field);
                if (property == null)
                    return new ValidationResult(string.Format("Property '{0}' is undefined.", field));

                var fieldValue = property.GetValue(validationContext.ObjectInstance, null);

                if (fieldValue == null || String.IsNullOrEmpty(fieldValue.ToString()))
                    return new ValidationResult(this.FormatErrorMessage(validationContext.DisplayName));
            }

            return null;
        }

        public IEnumerable<ModelClientValidationRule> GetClientValidationRules(ModelMetadata metadata, ControllerContext context)
        {
            var rule = new ModelClientValidationRule();
            rule.ValidationParameters.Add("required", true);
            rule.ValidationType = "required";
            ErrorMessage = this.ErrorMessage;
            yield return rule;
        }
    }
}