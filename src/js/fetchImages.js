export async function fetchImages(q, page) {
    return await fetch(`https://pixabay.com/api/?key=24634494-a9c983226c04769a6e409a37a&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`).then(
    (response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    }
    );
}