let UserCreds = JSON.parse(sessionStorage.getItem("user-creds"));
let UserInfo = JSON.parse(sessionStorage.getItem("user-info"));

let logoutButton = document.getElementById("logoutBtn");

let SignOut = () => {
    sessionStorage.removeItem("user-creds");
    sessionStorage.removeItem("user-info");
    window.location.href = 'LoginPage.html';
}

let CheckCred = () => {
    if (!sessionStorage.getItem("user-creds"))
        window.location.href = 'LoginPage.html';
}

window.addEventListener('load', () => {
    CheckCred();
    displayPublishedBlogs(); 
});

logoutButton.addEventListener('click', SignOut);

document.getElementById('blogForm').addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('blogTitle').value;
    const body = document.getElementById('blogBody').value;

    saveBlogToStorage(title, body);

    appendBlogToList(title, body);

    document.getElementById('blogForm').reset();
});

function saveBlogToStorage(title, body) {
    let publishedBlogs = JSON.parse(localStorage.getItem('publishedBlogs')) || [];
    publishedBlogs.push({ title, body });
    localStorage.setItem('publishedBlogs', JSON.stringify(publishedBlogs));
}

function displayPublishedBlogs() {
    let publishedBlogs = JSON.parse(localStorage.getItem('publishedBlogs')) || [];
    publishedBlogs.forEach(blog => {
        appendBlogToList(blog.title, blog.body);
    });
}

function appendBlogToList(title, body) {
    const blogDiv = document.createElement('div');
    blogDiv.className = 'blog';
    blogDiv.innerHTML = `
        <div class="blog-content">
            <div class="blog-title">${title}</div>
            <div class="blog-body">${body}</div>
        </div>
        <p class="blog-publish-date">Publish Date: ${new Date().toLocaleString()}</p>
        <button class="blog-update-btn" onclick="updateBlog(this)">Update</button>
        <button class="blog-delete-btn" onclick="deleteBlog(this)">Delete</button>
    `;
    document.getElementById('blogList').appendChild(blogDiv);
}

function deleteBlog(button) {
    const confirmDelete = confirm('Are you sure you want to delete this blog?');
    if (confirmDelete) {
        const blogDiv = button.parentElement;
        blogDiv.remove();
        updateStorageAfterDelete(blogDiv.querySelector('.blog-title').textContent);
    }
}

function updateStorageAfterDelete(title) {
    let publishedBlogs = JSON.parse(localStorage.getItem('publishedBlogs')) || [];
    publishedBlogs = publishedBlogs.filter(blog => blog.title !== title);
    localStorage.setItem('publishedBlogs', JSON.stringify(publishedBlogs));
}

function updateBlog(button) {
    const blogDiv = button.parentElement;
    const title = blogDiv.querySelector('.blog-title').textContent;
    const body = blogDiv.querySelector('.blog-body').textContent;

    blogDiv.innerHTML = `
        <input type="text" class="updated-title" value="${title}">
        <textarea class="updated-body">${body}</textarea>
        <button class="save-update-btn" onclick="saveUpdate(this)">Save</button>
    `;
}

function saveUpdate(button) {
    const blogDiv = button.parentElement;
    const updatedTitle = blogDiv.querySelector('.updated-title').value;
    const updatedBody = blogDiv.querySelector('.updated-body').value;

    blogDiv.innerHTML = `
        <div class="blog-content">
            <div class="blog-title">${updatedTitle}</div>
            <div class="blog-body">${updatedBody}</div>
        </div>
        <p class="blog-publish-date">Publish Date: ${new Date().toLocaleString()}</p>
        <button class="blog-update-btn" onclick="updateBlog(this)">Update</button>
        <button class="blog-delete-btn" onclick="deleteBlog(this)">Delete</button>
    `;
}