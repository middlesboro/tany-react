import { useEffect } from 'react';

const usePageMeta = (title, description) => {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) {
        document.title = `${title} | Tany.sk`;
    }

    let metaDescription = document.querySelector('meta[name="description"]');
    let previousDescription = null;
    let descriptionCreated = false;

    if (metaDescription) {
      previousDescription = metaDescription.getAttribute('content');
      if (description) {
        metaDescription.setAttribute('content', description);
      }
    } else if (description) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      metaDescription.content = description;
      document.head.appendChild(metaDescription);
      descriptionCreated = true;
    }

    return () => {
      document.title = previousTitle;
      if (descriptionCreated) {
        if (document.head.contains(metaDescription)) {
          document.head.removeChild(metaDescription);
        }
      } else if (previousDescription !== null && metaDescription) {
        metaDescription.setAttribute('content', previousDescription);
      }
    };
  }, [title, description]);
};

export default usePageMeta;
