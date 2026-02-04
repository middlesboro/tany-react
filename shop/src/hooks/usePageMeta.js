import { useEffect } from 'react';

const usePageMeta = (title, description) => {
  useEffect(() => {
    // Set document title
    const suffix = ' - Tany.sk';
    let newTitle = 'Tany.sk';

    if (title) {
      newTitle = `${title}${suffix}`;
    }
    document.title = newTitle;

    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }

    if (description) {
        metaDescription.content = description;
    } else {
        metaDescription.content = "Prírodná kozmetika a henna na vlasy - Tany.sk";
    }

  }, [title, description]);
};

export default usePageMeta;
