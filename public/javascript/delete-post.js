// A function to delete a post
async function deleteFormHandler(event) {
    event.preventDefault();

    // get the post id from the url
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
        ];
    // delete the post with an async function
    const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE'
      });
    // if the delete action is successful, redirect to the dashboard page, otherwise display the error
    if (response.ok) {
        document.location.replace('/dashboard');
        // otherwise, display the error
      } else {
        alert(response.statusText);
      }
  }
  
  document.querySelector('.delete-post-btn').addEventListener('click', deleteFormHandler);