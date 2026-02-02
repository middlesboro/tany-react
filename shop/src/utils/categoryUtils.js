
export const findCategoryBySlug = (categories, slug) => {
  for (const category of categories) {
    if (category.slug === slug) {
      return category;
    }
    if (category.children && category.children.length > 0) {
      const found = findCategoryBySlug(category.children, slug);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

export const findCategoryPath = (categories, slug, path = []) => {
  for (const category of categories) {
    if (category.slug === slug) {
      return [...path, category];
    }
    if (category.children && category.children.length > 0) {
      const foundPath = findCategoryPath(category.children, slug, [...path, category]);
      if (foundPath) {
        return foundPath;
      }
    }
  }
  return null;
};

export const findCategoryById = (categories, id) => {
  for (const category of categories) {
    if (category.id === id) {
      return category;
    }
    if (category.children && category.children.length > 0) {
      const found = findCategoryById(category.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
};
