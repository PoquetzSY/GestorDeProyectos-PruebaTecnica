export const useFormValidation = (formData, errors, fieldValidations) => {
  const validateField = (field, config) => {
    const value = formData.value[field]

    if (!value) {
      errors.value[field] = config.message
      return
    }

    if (config.regex && !config.regex.test(value)) {
      errors.value[field] = `El ${field} no es válido`
      return
    }

    if (config.customValidation) {
      const customError = config.customValidation(value)
      if (customError !== true) {
        errors.value[field] = customError
        return
      }
    }

    errors.value[field] = ''
  }

  const validateForm = () => {
    Object.entries(fieldValidations).forEach(([field, config]) => validateField(field, config))
    return Object.values(errors.value).every((error) => !error)
  }

  return { validateField, validateForm }
}
