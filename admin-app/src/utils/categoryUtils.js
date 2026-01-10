
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
